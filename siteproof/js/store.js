/*
 * SiteProof — domain logic and local state.
 * All data is fictional and lives only in this browser (localStorage).
 * No APIs, no server, no real authentication.
 *
 * Works in the browser (window.SP.store) and in Node (require) for tests.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else { root.SP = root.SP || {}; root.SP.store = api; }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const STORAGE_KEY = 'siteproof.demo.v1';
  const DATA_VERSION = 1;

  const STATUS = {
    reported:    { label: 'New',              order: 0 },
    assigned:    { label: 'Assigned',         order: 1 },
    in_progress: { label: 'In progress',      order: 2 },
    rework:      { label: 'Rework needed',    order: 3 },
    review:      { label: 'Ready for review', order: 4 },
    closed:      { label: 'Closed',           order: 5 }
  };
  const ACTIVE = ['assigned', 'in_progress', 'rework'];
  const PRIORITY = { low: 'Low', normal: 'Normal', high: 'High', urgent: 'Urgent' };
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  /* ---------- date helpers (local calendar dates as YYYY-MM-DD) ---------- */
  const pad = (n) => String(n).padStart(2, '0');
  function localDate(d) { return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }
  function parseDay(s) { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); }
  function addDays(s, n) { const d = parseDay(s); d.setDate(d.getDate() + n); return localDate(d); }
  function daysBetween(a, b) {
    const [y1, m1, d1] = a.split('-').map(Number);
    const [y2, m2, d2] = b.split('-').map(Number);
    return Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 86400000);
  }
  function isValidDay(s) { return typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(parseDay(s)); }
  function fmtDay(s) { if (!s) return '—'; const d = parseDay(s); return `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`; }

  function isOverdue(issue, todayStr) {
    return !!issue.dueDate && ACTIVE.includes(issue.status) && issue.dueDate < todayStr;
  }
  function pendingRequests(issue) { return (issue.requests || []).filter((r) => r.status === 'pending'); }

  /* ---------- store ---------- */
  function createStore(seedFn, storage, nowFn) {
    nowFn = nowFn || (() => new Date());
    const helpers = { localDate, addDays };
    const listeners = new Set();

    function fresh() { return seedFn(nowFn(), helpers); }
    function load() {
      try {
        const raw = storage && storage.getItem(STORAGE_KEY);
        if (raw) {
          const s = JSON.parse(raw);
          if (s && s.version === DATA_VERSION && Array.isArray(s.issues)) return s;
        }
      } catch (e) { /* corrupted or blocked storage: fall back to demo data */ }
      return fresh();
    }

    let state = load();
    let persisted = save();

    function save() {
      if (!storage) return false;
      try { storage.setItem(STORAGE_KEY, JSON.stringify(state)); return true; }
      catch (e) { return false; }
    }
    function commit() {
      persisted = save();
      listeners.forEach((fn) => fn(state));
      return { persisted };
    }

    const today = () => localDate(nowFn());
    const iso = () => nowFn().toISOString();
    const nextId = (p) => p + (state.nextId++);
    const user = (id) => state.users.find((u) => u.id === id);
    const nameOf = (id) => (user(id) ? user(id).name : 'Unknown');

    function issue(id) {
      const i = state.issues.find((x) => x.id === id);
      if (!i) throw new Error('This issue no longer exists.');
      return i;
    }
    function asManager(id) {
      const u = user(id);
      if (!u || u.role !== 'manager') throw new Error('Only a site manager can do this.');
      return u;
    }
    function asWorker(id) {
      const u = user(id);
      if (!u || u.role !== 'worker') throw new Error('Only site staff can do this.');
      return u;
    }
    function asAssignee(uid, i) {
      if (i.assigneeId !== uid) throw new Error('Only the person responsible for this task can do this.');
    }
    function onTeam(uid, i) { return i.assigneeId === uid || (i.helperIds || []).includes(uid); }
    function log(i, by, type, text, note) {
      const e = { id: nextId('e'), at: iso(), by, type, text };
      if (note) e.note = note;
      i.events.push(e);
    }
    const clean = (v) => (typeof v === 'string' ? v.trim() : '');

    /* ---------- session (demo login, not real authentication) ---------- */
    function login(userId) {
      if (!user(userId)) throw new Error('No demo account with that name.');
      state.session = { userId };
      return commit();
    }
    function logout() { state.session = { userId: null }; return commit(); }

    /* ---------- field: report an issue ---------- */
    function createIssue(uid, d) {
      asWorker(uid);
      const title = clean(d.title);
      const description = clean(d.description);
      const building = clean(d.building);
      const floor = clean(d.floor);
      const room = clean(d.room);
      if (title.length < 3) throw new Error('Give the issue a short title (at least 3 characters).');
      if (title.length > 80) throw new Error('Keep the title under 80 characters.');
      if (!building || !floor) throw new Error('Choose the building and floor.');
      if (description.length < 5) throw new Error('Describe what you saw (at least a few words).');
      let observedAt = null;
      if (!d.observedUnknown) {
        const t = new Date(d.observedAt);
        if (!d.observedAt || isNaN(t)) throw new Error('Enter when you first noticed it, or tick “Not sure”.');
        if (t.getTime() > nowFn().getTime() + 5 * 60000) throw new Error('“First noticed” can’t be in the future.');
        observedAt = t.toISOString();
      }
      const i = {
        id: `SP-${state.nextIssueNo++}`,
        title,
        category: clean(d.category) || 'Other',
        location: { building, floor, room, detail: clean(d.detail) },
        description,
        observedAt,
        observedUnknown: !!d.observedUnknown,
        cause: d.causeUnknown ? '' : clean(d.cause),
        causeUnknown: !!d.causeUnknown || !clean(d.cause),
        hazard: !!d.hazard,
        photo: d.photo ? { type: 'data', src: d.photo } : null,
        reporterId: uid,
        createdAt: iso(),
        status: 'reported',
        priority: null,
        assigneeId: null,
        helperIds: [],
        instructions: '',
        dueDate: null,
        assignedAt: null,
        completion: null,
        reworkReason: '',
        closedAt: null,
        requests: [],
        events: []
      };
      log(i, uid, 'reported', 'Reported the issue');
      state.issues.unshift(i);
      return Object.assign(commit(), { issue: i });
    }

    /* ---------- manager: assign ---------- */
    function assignIssue(mid, id, d) {
      asManager(mid);
      const i = issue(id);
      if (i.status !== 'reported') throw new Error('This issue has already been assigned.');
      const worker = user(d.assigneeId);
      if (!worker || worker.role !== 'worker') throw new Error('Choose who will fix this.');
      if (!isValidDay(d.dueDate)) throw new Error('Choose a deadline.');
      if (d.dueDate < today()) throw new Error('The deadline can’t be in the past.');
      const instructions = clean(d.instructions);
      if (instructions.length < 3) throw new Error('Write short instructions for the worker.');
      i.assigneeId = worker.id;
      i.helperIds = [];
      i.priority = PRIORITY[d.priority] ? d.priority : 'normal';
      i.dueDate = d.dueDate;
      i.instructions = instructions;
      i.assignedAt = iso();
      i.status = 'assigned';
      log(i, mid, 'assigned', `Assigned to ${worker.name}, due ${fmtDay(d.dueDate)}`);
      return commit();
    }

    function updateAssignment(mid, id, d) {
      asManager(mid);
      const i = issue(id);
      if (!ACTIVE.includes(i.status)) throw new Error('You can only change open tasks.');
      const changes = [];
      if (d.assigneeId && d.assigneeId !== i.assigneeId) {
        const w = user(d.assigneeId);
        if (!w || w.role !== 'worker') throw new Error('Choose a valid worker.');
        i.assigneeId = w.id;
        i.helperIds = (i.helperIds || []).filter((h) => h !== w.id);
        if (i.status === 'in_progress') i.status = 'assigned';
        changes.push(`reassigned to ${w.name}`);
      }
      if (d.dueDate && d.dueDate !== i.dueDate) {
        if (!isValidDay(d.dueDate) || d.dueDate < today()) throw new Error('The new deadline can’t be in the past.');
        i.dueDate = d.dueDate;
        changes.push(`deadline moved to ${fmtDay(d.dueDate)}`);
      }
      const ins = clean(d.instructions);
      if (ins && ins !== i.instructions) { i.instructions = ins; changes.push('instructions updated'); }
      if (!changes.length) throw new Error('Nothing has changed.');
      const text = changes.join(', ');
      log(i, mid, 'updated', text.charAt(0).toUpperCase() + text.slice(1));
      return commit();
    }

    /* ---------- worker: progress ---------- */
    function startWork(uid, id) {
      const i = issue(id);
      asAssignee(uid, i);
      if (!['assigned', 'rework'].includes(i.status)) throw new Error('This task has already been started.');
      i.status = 'in_progress';
      log(i, uid, 'started', i.reworkReason ? 'Started the rework' : 'Started work');
      return commit();
    }

    function addNote(uid, id, text) {
      const i = issue(id);
      const u = user(uid);
      if (!u || (u.role !== 'manager' && !onTeam(uid, i))) throw new Error('Only people on this task can add updates.');
      const t = clean(text);
      if (t.length < 2) throw new Error('Write a short update first.');
      log(i, uid, 'note', 'Added an update', t);
      return commit();
    }

    function submitForReview(uid, id, d) {
      const i = issue(id);
      asAssignee(uid, i);
      if (i.status !== 'in_progress') throw new Error('Start the work before marking it as done.');
      const note = clean(d.note);
      if (note.length < 3) throw new Error('Say briefly what you did.');
      i.completion = { note, photo: d.photo ? { type: 'data', src: d.photo } : null, at: iso(), by: uid };
      i.status = 'review';
      log(i, uid, 'review', 'Marked the work as done and sent it for review', note);
      return commit();
    }

    function requestTime(uid, id, d) {
      const i = issue(id);
      if (!onTeam(uid, i)) throw new Error('Only people on this task can ask for more time.');
      if (!ACTIVE.includes(i.status)) throw new Error('You can only ask for more time on an open task.');
      if (pendingRequests(i).some((r) => r.type === 'time')) throw new Error('You already asked for more time. Wait for the manager’s answer.');
      if (!isValidDay(d.proposedDate)) throw new Error('Choose the date you need.');
      if (d.proposedDate < today() || (i.dueDate && d.proposedDate <= i.dueDate)) throw new Error('Pick a date after the current deadline.');
      const reason = clean(d.reason);
      if (reason.length < 3) throw new Error('Explain why you need more time.');
      i.requests.push({ id: nextId('r'), type: 'time', by: uid, at: iso(), reason, proposedDate: d.proposedDate, status: 'pending' });
      log(i, uid, 'request', `Asked for more time, until ${fmtDay(d.proposedDate)}`, reason);
      return commit();
    }

    function requestWorkers(uid, id, d) {
      const i = issue(id);
      if (!onTeam(uid, i)) throw new Error('Only people on this task can ask for help.');
      if (!ACTIVE.includes(i.status)) throw new Error('You can only ask for help on an open task.');
      if (pendingRequests(i).some((r) => r.type === 'workers')) throw new Error('You already asked for more workers. Wait for the manager’s answer.');
      const count = Number(d.count);
      if (!Number.isInteger(count) || count < 1 || count > 5) throw new Error('Choose how many people you need (1–5).');
      const reason = clean(d.reason);
      if (reason.length < 3) throw new Error('Explain why you need help.');
      i.requests.push({ id: nextId('r'), type: 'workers', by: uid, at: iso(), reason, count, trade: clean(d.trade), status: 'pending' });
      log(i, uid, 'request', `Asked for ${count} more ${count === 1 ? 'person' : 'people'}${clean(d.trade) ? ` (${clean(d.trade)})` : ''}`, reason);
      return commit();
    }

    /* ---------- manager: follow-up ---------- */
    function resolveRequest(mid, id, reqId, d) {
      asManager(mid);
      const i = issue(id);
      const r = (i.requests || []).find((x) => x.id === reqId);
      if (!r) throw new Error('This request no longer exists.');
      if (r.status !== 'pending') throw new Error('This request has already been answered.');
      const response = clean(d.response);
      if (d.decision === 'approve') {
        if (r.type === 'time') {
          if (!isValidDay(d.newDate) || d.newDate < today()) throw new Error('Choose a new deadline from today onwards.');
          i.dueDate = d.newDate;
          log(i, mid, 'request_approved', `Approved more time. New deadline ${fmtDay(d.newDate)}`, response);
        } else {
          const ids = (d.helperIds || []).filter((h) => user(h) && user(h).role === 'worker' && !onTeam(h, i));
          if (!ids.length) throw new Error('Choose at least one person to add to the task.');
          i.helperIds = (i.helperIds || []).concat(ids);
          log(i, mid, 'request_approved', `Added ${ids.map(nameOf).join(' and ')} to the task`, response);
        }
        r.status = 'approved';
      } else if (d.decision === 'decline') {
        r.status = 'declined';
        log(i, mid, 'request_declined', r.type === 'time' ? 'Declined the request for more time' : 'Declined the request for more workers', response);
      } else {
        throw new Error('Choose approve or decline.');
      }
      r.response = response;
      r.resolvedAt = iso();
      r.resolvedBy = mid;
      return commit();
    }

    function closeIssue(mid, id, note) {
      asManager(mid);
      const i = issue(id);
      if (i.status !== 'review') throw new Error('Only work that is ready for review can be closed.');
      i.status = 'closed';
      i.closedAt = iso();
      i.reworkReason = '';
      (i.requests || []).forEach((r) => { if (r.status === 'pending') { r.status = 'withdrawn'; r.resolvedAt = iso(); } });
      log(i, mid, 'closed', 'Checked the work and closed the issue', clean(note));
      return commit();
    }

    function returnIssue(mid, id, reason) {
      asManager(mid);
      const i = issue(id);
      if (i.status !== 'review') throw new Error('Only work that is ready for review can be sent back.');
      const r = clean(reason);
      if (r.length < 3) throw new Error('Tell the worker what still needs fixing.');
      i.status = 'rework';
      i.reworkReason = r;
      log(i, mid, 'returned', 'Sent back for rework', r);
      return commit();
    }

    function reset() {
      const session = state.session;
      state = fresh();
      state.session = session && user(session.userId) ? session : { userId: null };
      return commit();
    }

    return {
      get: () => state,
      subscribe: (fn) => { listeners.add(fn); return () => listeners.delete(fn); },
      isPersisted: () => persisted,
      today,
      login, logout, reset,
      createIssue, assignIssue, updateAssignment,
      startWork, addNote, submitForReview, requestTime, requestWorkers,
      resolveRequest, closeIssue, returnIssue
    };
  }

  return {
    STORAGE_KEY, STATUS, ACTIVE, PRIORITY,
    createStore, localDate, addDays, daysBetween, fmtDay, isValidDay, isOverdue, pendingRequests
  };
});
