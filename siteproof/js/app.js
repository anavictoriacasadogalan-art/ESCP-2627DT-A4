/*
 * SiteProof — user interface.
 * Screens: Login → Worker (dashboard, report issue, task detail) and
 *          Manager (dashboard, issue detail with assignment + follow-up).
 */
(function () {
  'use strict';
  const SP = window.SP;
  const H = SP.store;

  let storage = null;
  try { const k = '__sp_test'; window.localStorage.setItem(k, '1'); window.localStorage.removeItem(k); storage = window.localStorage; }
  catch (e) { storage = null; }

  const store = H.createStore(SP.seed, storage);
  const appEl = document.getElementById('app');
  const toastEl = document.getElementById('toast');
  const sheetRoot = document.getElementById('sheet-root');

  let view = { name: 'login' };
  let loginRole = 'worker';
  let draftPhoto = null;   // photo on the report form
  let donePhoto = null;    // photo on the "mark as done" sheet
  let mgrFilter = 'open';
  let mgrSearch = '';

  /* ---------- icons ---------- */
  const P = {
    camera: '<path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13.5" r="3.8"/>',
    back: '<path d="M15 18l-6-6 6-6"/>',
    chev: '<path d="M9 18l6-6-6-6"/>',
    pin: '<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0C18.5 15.4 12 21 12 21z"/><circle cx="12" cy="10" r="2.3"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    alert: '<path d="M12 3.5L2.8 19.5h18.4L12 3.5z"/><path d="M12 10v4.2M12 17.2v.1"/>',
    users: '<circle cx="9" cy="8.5" r="3.3"/><path d="M3 19.5c.6-3.3 3-5 6-5s5.4 1.7 6 5"/><path d="M16 5.6a3.2 3.2 0 0 1 0 6M17.5 14.6c1.8.6 3 2.2 3.5 4.9"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
    note: '<path d="M5 4h10l4 4v12H5z"/><path d="M15 4v4h4M8.5 12.5h7M8.5 16h5"/>',
    logout: '<path d="M14 4h5v16h-5M10 8l-4 4 4 4M6 12h10"/>',
    reset: '<path d="M4 12a8 8 0 1 0 2.4-5.7L4 8.5"/><path d="M4 4v4.5h4.5"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    image: '<rect x="3.5" y="4.5" width="17" height="15" rx="2"/><circle cx="9" cy="10" r="1.8"/><path d="M20.5 16l-5-5-8 8.5"/>',
    send: '<path d="M4 12l16-8-6 17-3-7-7-2z"/>',
    helmet: '<path d="M3 17h18M5 17v-2a7 7 0 0 1 14 0v2"/><path d="M10 8.2V5.5h4v2.7"/>',
    board: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 9h8M8 13h8M8 17h5"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',
    inbox: '<path d="M3.5 13.5l2.8-8h11.4l2.8 8v5a1 1 0 0 1-1 1H4.5a1 1 0 0 1-1-1z"/><path d="M3.5 13.5h5l1.2 2.2h4.6l1.2-2.2h5"/>',
    play: '<path d="M7 5l12 7-12 7z"/>',
    shield: '<path d="M12 3l7.5 3v5.5c0 4.5-3.3 8-7.5 9.5-4.2-1.5-7.5-5-7.5-9.5V6z"/>'
  };
  const icon = (n, cls = '') => `<svg class="icon ${cls}" viewBox="0 0 24 24" aria-hidden="true">${P[n] || ''}</svg>`;

  /* ---------- helpers ---------- */
  const esc = (v) => String(v == null ? '' : v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const S = () => store.get();
  const me = () => userById(S().session.userId);
  const userById = (id) => S().users.find((u) => u.id === id);
  const issueById = (id) => S().issues.find((i) => i.id === id);
  const today = () => store.today();
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const pad = (n) => String(n).padStart(2, '0');
  const fmtDT = (iso) => { const d = new Date(iso); return `${d.getDate()} ${MONTHS[d.getMonth()]}, ${pad(d.getHours())}:${pad(d.getMinutes())}`; };
  function ago(iso) {
    const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins} min ago`;
    const h = Math.round(mins / 60);
    if (h < 24) return `${h} h ago`;
    const d = Math.round(h / 24);
    return d === 1 ? 'yesterday' : `${d} days ago`;
  }
  const initials = (u) => u ? u.name.split(' ').map((p) => p[0]).slice(0, 2).join('') : '?';
  const avatar = (u, size = '') => `<span class="avatar ${size}" style="background:${esc(u ? u.color : '#777')}" aria-hidden="true">${esc(initials(u))}</span>`;
  const first = (u) => (u ? u.name.split(' ')[0] : '—');
  const locText = (l) => [`Bldg ${l.building}`, l.floor, l.room].filter(Boolean).join(' · ');
  const locLine = (l) => esc(locText(l));
  const photoSrc = (p) => !p ? null : p.type === 'scene' ? SP.scene(p.scene) : p.src;
  const badge = (status) => `<span class="badge st-${status}">${esc(H.STATUS[status].label)}</span>`;
  const isLate = (i) => H.isOverdue(i, today());
  const pending = (i) => H.pendingRequests(i);
  const isWorkerIssue = (i, uid) => i.assigneeId === uid || (i.helperIds || []).includes(uid);
  const greeting = () => { const h = new Date().getHours(); return h < 11 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'; };
  const longDate = () => new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
  const nowLocalInput = () => { const d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 16); };

  function dueInfo(i) {
    if (!i.dueDate || i.status === 'closed') return null;
    const n = H.daysBetween(today(), i.dueDate);
    if (i.status === 'review') return { text: `Due ${H.fmtDay(i.dueDate)}`, cls: '' };
    if (n < 0) return { text: `${-n} day${n === -1 ? '' : 's'} overdue`, cls: 'late' };
    if (n === 0) return { text: 'Due today', cls: 'today' };
    if (n === 1) return { text: 'Due tomorrow', cls: '' };
    return { text: `Due ${H.fmtDay(i.dueDate)}`, cls: '' };
  }
  const dueTag = (i) => { const d = dueInfo(i); return d ? `<span class="due ${d.cls}">${icon('clock')}${esc(d.text)}</span>` : ''; };
  const prioTag = (p) => p ? `<span class="prio prio-${p}">${esc(H.PRIORITY[p])} priority</span>` : '';

  /* ---------- toast / sheet ---------- */
  function toast(msg, kind = '') {
    const t = document.createElement('div');
    t.className = `toast ${kind}`;
    t.innerHTML = `${icon(kind === 'warn' ? 'alert' : 'check')}<span>${esc(msg)}</span>`;
    toastEl.appendChild(t);
    setTimeout(() => t.remove(), 3200);
  }
  function openSheet(title, body) {
    sheetRoot.innerHTML = `<div class="overlay" data-action="close-sheet-bg"><div class="sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-title">
      <div class="sheet-head"><h2 id="sheet-title">${esc(title)}</h2><button class="icon-btn" data-action="close-sheet" aria-label="Close">${icon('x')}</button></div>
      ${body}</div></div>`;
    const f = sheetRoot.querySelector('input:not([type=hidden]):not([type=file]), textarea, select');
    if (f) setTimeout(() => f.focus(), 50);
  }
  function closeSheet() { sheetRoot.innerHTML = ''; donePhoto = null; }

  /** Run a store action; returns an error message or null. */
  function act(fn, okMsg) {
    try {
      const r = fn();
      if (r && r.persisted === false) toast('Saved for this visit only. This browser is not keeping data.', 'warn');
      else if (okMsg) toast(okMsg);
      return null;
    } catch (err) { return err.message || 'Something went wrong.'; }
  }
  function showError(form, msg) {
    const el = form.querySelector('.form-error');
    if (el) { el.textContent = msg; el.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
    else toast(msg, 'warn');
  }

  /* ---------- navigation ---------- */
  function go(name, params = {}) {
    view = Object.assign({ name }, params);
    closeSheet();
    render();
    window.scrollTo(0, 0);
  }
  function home() {
    const u = me();
    if (!u) return go('login');
    go(u.role === 'manager' ? 'm-home' : 'w-home');
  }

  /* ---------- shared header ---------- */
  function header(width) {
    const u = me(); const p = S().project;
    return `<header class="band"><div class="wrap ${width} band-in">
      <button class="brand" data-action="home" style="background:none;border:0;color:inherit;padding:0;text-align:left">
        <span class="brand-mark">${icon('check')}</span>
        <span class="brand-text"><span class="brand-name">SiteProof</span><span class="brand-sub">${esc(p.name)} · ${esc(p.code)}</span></span>
      </button>
      <div class="band-right">
        <span class="demo-tag">Demo</span>
        <button class="userbtn" data-action="menu" aria-label="Account menu">
          <span class="who"><b>${esc(u.name)}</b><span>${esc(u.title)}</span></span>${avatar(u)}
        </button>
      </div></div><div class="stripe"></div></header>`;
  }

  /* =====================================================================
     LOGIN
     ===================================================================== */
  function viewLogin() {
    const users = S().users.filter((u) => u.role === loginRole);
    const p = S().project;
    return `<div class="login">
      <section class="login-brand">
        <div>
          <div class="brand" style="margin-bottom:34px"><span class="brand-mark">${icon('check')}</span><span class="brand-name">SiteProof</span></div>
          <div class="site-plate"><b>${esc(p.name)}</b><span>Project ${esc(p.code)} · Buildings ${p.buildings.join(', ')}</span><span>${esc(p.address)}</span></div>
          <h1>Spot it.<br>Assign it.<br><em>Close it.</em></h1>
          <p class="lead">Site problems go straight from the people who find them to the manager who decides, and back to the person who fixes them.</p>
        </div>
        <ol class="flow bottom">
          <li><span class="n">01</span>Worker takes a photo and reports the issue</li>
          <li><span class="n">02</span>Manager assigns a worker and a deadline</li>
          <li><span class="n">03</span>Worker updates progress or asks for help</li>
          <li><span class="n">04</span>Manager checks the work and closes it</li>
        </ol>
      </section>
      <main class="login-main"><form class="login-card" data-form="login" novalidate>
        <div><h2>Sign in</h2><p class="muted">Choose how you work on site.</p></div>
        <div class="role-switch" role="group" aria-label="Sign in as">
          <button type="button" class="role-btn" data-action="login-role" data-role="worker" aria-pressed="${loginRole === 'worker'}">
            ${icon('helmet')}<b>Worker</b><span>Report issues, see my tasks</span></button>
          <button type="button" class="role-btn" data-action="login-role" data-role="manager" aria-pressed="${loginRole === 'manager'}">
            ${icon('board')}<b>Manager</b><span>Assign, follow up, close</span></button>
        </div>
        <div class="field"><label for="lg-user">Username</label>
          <input type="text" id="lg-user" name="username" autocomplete="username" placeholder="${loginRole === 'worker' ? 'e.g. l.becker' : 'e.g. k.vogel'}" autocapitalize="none" spellcheck="false"></div>
        <div class="field"><label for="lg-pass">Password</label>
          <input type="password" id="lg-pass" name="password" autocomplete="current-password" placeholder="Any password works in the demo"></div>
        <div class="form-error" role="alert"></div>
        <button class="btn primary block" type="submit">Sign in as ${loginRole === 'worker' ? 'worker' : 'manager'}</button>
        <div class="demo-accounts"><span class="label">Demo accounts · tap to fill in</span>
          <div class="acct-list">${users.map((u) => `<button type="button" class="acct" data-action="pick-acct" data-user="${u.username}">${avatar(u, 'sm')}<span class="t"><b>${esc(u.name)}</b><span>${esc(u.title)}</span></span></button>`).join('')}</div>
        </div>
        <p class="demo-note">Demo mode. All people, issues and photos are fictional. There is no real sign-in, and data is saved only in this browser.</p>
      </form></main></div>`;
  }

  /* =====================================================================
     WORKER
     ===================================================================== */
  function taskCard(i, uid) {
    const late = isLate(i);
    const reqs = pending(i);
    const isNew = i.status === 'assigned' && i.assignedAt && (Date.now() - new Date(i.assignedAt)) < 36 * 3600000;
    const helper = i.assigneeId !== uid;
    const lead = userById(i.assigneeId);
    const others = (i.helperIds || []).filter((h) => h !== uid).map(userById);
    return `<button class="task s-${i.status} ${late ? 'is-late' : ''} ${i.hazard ? 'is-hazard' : ''}" data-action="open-task" data-id="${i.id}">
      <span class="task-top"><span class="mono faint">${i.id}${isNew ? ' <span class="new-dot">New</span>' : ''}</span>${late ? '<span class="badge overdue">Overdue</span>' : badge(i.status)}</span>
      <span class="task-title">${esc(i.title)}</span>
      <span class="loc">${icon('pin')}${locLine(i.location)}</span>
      <span class="task-foot">${dueTag(i)}${prioTag(i.priority)}
        ${i.hazard ? '<span class="badge hazard">Safety</span>' : ''}
        ${helper ? `<span class="chip">${icon('users')}Helping ${esc(first(lead))}</span>` : ''}
        ${!helper && others.length ? `<span class="chip">${icon('users')}With ${others.map((o) => esc(first(o))).join(', ')}</span>` : ''}
        ${reqs.map((r) => `<span class="chip req">${icon('clock')}${r.type === 'time' ? 'More time asked' : 'Help asked'}</span>`).join('')}
      </span></button>`;
  }

  function viewWorkerHome() {
    const u = me(); const t = today();
    const mine = S().issues.filter((i) => isWorkerIssue(i, u.id));
    const active = mine.filter((i) => H.ACTIVE.includes(i.status));
    const rank = (i) => (isLate(i) ? 0 : 1) * 10 + (['urgent', 'high', 'normal', 'low'].indexOf(i.priority || 'normal'));
    const now = active.filter((i) => i.status !== 'assigned' || (i.dueDate && i.dueDate <= t))
      .sort((a, b) => rank(a) - rank(b) || (a.dueDate || '').localeCompare(b.dueDate || ''));
    const later = active.filter((i) => !now.includes(i)).sort((a, b) => (a.dueDate || '').localeCompare(b.dueDate || ''));
    const waiting = mine.filter((i) => i.status === 'review');
    const done = mine.filter((i) => i.status === 'closed').sort((a, b) => (b.closedAt || '').localeCompare(a.closedAt || '')).slice(0, 3);
    const reports = S().issues.filter((i) => i.reporterId === u.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    const dueToday = active.filter((i) => i.dueDate === t).length;
    const late = active.filter(isLate).length;

    const reportStatus = (i) => {
      if (i.status === 'reported') return 'Waiting for the manager';
      if (i.status === 'closed') return 'Fixed and closed';
      return `${H.STATUS[i.status].label} · ${esc(first(userById(i.assigneeId)))} is on it`;
    };

    return `${header('narrow')}<main class="wrap narrow page">
      <div class="hello"><h1>${greeting()}, ${esc(first(u))}</h1><p>${esc(longDate())} · ${esc(u.title)}</p></div>
      <button class="report-cta" data-action="go-report"><span class="cam">${icon('camera')}</span>
        <span><b>Report an issue</b><span>Take a photo and tell the manager what you found</span></span>${icon('chev', 'chev')}</button>
      <div class="stats">
        <div class="stat"><b>${dueToday}</b><span>Due today</span></div>
        <div class="stat ${late ? 'alert' : ''}"><b>${late}</b><span>Overdue</span></div>
        <div class="stat"><b>${active.length}</b><span>Open tasks</span></div>
      </div>
      <section class="section"><div class="section-head"><h2>Today’s tasks</h2><span class="count">${now.length}</span></div>
        ${now.length ? `<div class="task-list">${now.map((i) => taskCard(i, u.id)).join('')}</div>` : '<div class="empty">Nothing due today. New tasks from the manager will show up here.</div>'}</section>
      <section class="section"><div class="section-head"><h2>Coming up</h2><span class="count">${later.length}</span></div>
        ${later.length ? `<div class="task-list">${later.map((i) => taskCard(i, u.id)).join('')}</div>` : '<div class="empty">No other tasks scheduled.</div>'}</section>
      ${waiting.length ? `<section class="section"><div class="section-head"><h2>Waiting for manager check</h2><span class="count">${waiting.length}</span></div>
        <div class="task-list">${waiting.map((i) => taskCard(i, u.id)).join('')}</div></section>` : ''}
      <section class="section"><div class="section-head"><h2>Issues I reported</h2><span class="count">${reports.length}</span></div>
        ${reports.length ? `<div class="panel">${reports.map((i) => `<div class="report-row">
          ${photoSrc(i.photo) ? `<img class="thumb" src="${photoSrc(i.photo)}" alt="">` : `<span class="thumb" style="display:grid;place-items:center;color:var(--ink-3)">${icon('image')}</span>`}
          <div class="body"><b>${esc(i.title)}</b><span><span class="mono">${i.id}</span> · ${reportStatus(i)}</span></div></div>`).join('')}</div>`
          : '<div class="empty">You haven’t reported anything yet.</div>'}</section>
      ${done.length ? `<section class="section"><div class="section-head"><h2>Recently closed</h2></div>
        <div class="task-list">${done.map((i) => taskCard(i, u.id)).join('')}</div></section>` : ''}
    </main>`;
  }

  function photoFieldHtml(name, src, label = 'Take or upload a photo') {
    if (src) {
      return `<div class="photo-preview"><img src="${src}" alt="Selected photo">
        <div class="btn-row"><label class="btn sm" for="${name}">${icon('camera')}Retake</label>
        <button type="button" class="btn sm ghost" data-action="remove-photo" data-target="${name}">${icon('x')}Remove</button></div></div>`;
    }
    return `<label class="photo-pick" for="${name}"><span class="cam">${icon('camera')}</span>
      <b>${esc(label)}</b><span>Opens the camera on your phone. JPG or PNG.</span></label>`;
  }

  function viewReport() {
    const p = S().project;
    return `${header('narrow')}<main class="wrap narrow page">
      <button class="back" data-action="home">${icon('back')}Back</button>
      <div class="hello"><h1>Report an issue</h1><p>Describe what you see. The site manager gets it right away.</p></div>
      <form class="form" data-form="report" novalidate>
        <div class="field"><span class="label">Photo <span class="opt">(recommended)</span></span>
          <div class="photo-field" data-photo-box="rp-photo">${photoFieldHtml('rp-photo', draftPhoto)}</div>
          <input type="file" id="rp-photo" accept="image/*" capture="environment" data-photo="draft" class="sr-only">
          <span class="photo-err form-error" data-err="rp-photo"></span></div>
        <div class="field"><label for="rp-title">What’s the problem?</label>
          <input type="text" id="rp-title" name="title" maxlength="80" placeholder="e.g. Window does not close" required></div>
        <div class="field"><label for="rp-cat">Type</label>
          <select id="rp-cat" name="category">${['Workmanship', 'Installation', 'Damage', 'Safety', 'Electrical', 'Plumbing', 'Other'].map((c) => `<option>${c}</option>`).join('')}</select></div>
        <div class="field"><span class="label">Where is it?</span>
          <div class="row">
            <select id="rp-bldg" name="building" aria-label="Building">${p.buildings.map((b) => `<option value="${b}">Building ${b}</option>`).join('')}</select>
            <select id="rp-floor" name="floor" aria-label="Floor">${p.floors.map((f) => `<option${f === 'Ground floor' ? ' selected' : ''}>${f}</option>`).join('')}</select>
            <input type="text" id="rp-room" name="room" placeholder="Room, e.g. B-204" aria-label="Room">
          </div>
          <input type="text" id="rp-detail" name="detail" placeholder="Exact spot (optional), e.g. left window" aria-label="Exact spot"></div>
        <div class="field"><label for="rp-desc">What happened?</label>
          <textarea id="rp-desc" name="description" placeholder="What you can see. e.g. Gap of about 1 cm at the top of the window, you can feel a draught."></textarea></div>
        <div class="field"><label for="rp-when">When did you first notice it?</label>
          <input type="datetime-local" id="rp-when" name="observedAt" value="${nowLocalInput()}" max="${nowLocalInput()}">
          <label class="check"><input type="checkbox" id="rp-when-unknown" name="observedUnknown" data-toggle="rp-when">Not sure</label></div>
        <div class="field"><label for="rp-cause">Why do you think it happened? <span class="opt">(optional)</span></label>
          <textarea id="rp-cause" name="cause" style="min-height:70px" placeholder="Only if you have an idea. The manager decides what to do."></textarea>
          <label class="check"><input type="checkbox" id="rp-cause-unknown" name="causeUnknown" data-toggle="rp-cause">I don’t know</label></div>
        <label class="check hazard-check"><input type="checkbox" id="rp-hazard" name="hazard">${icon('alert')}This is a safety risk for people on site</label>
        <div class="form-error" role="alert"></div>
        <button type="submit" class="btn primary block" style="min-height:54px;font-size:1.05rem">${icon('send')}Send to site manager</button>
      </form></main>`;
  }

  function viewSent() {
    const i = issueById(view.id);
    const mgr = S().users.find((u) => u.role === 'manager');
    return `${header('narrow')}<main class="wrap narrow page"><div class="panel sent">
      <span class="tick">${icon('check')}</span>
      <h1>Report sent</h1>
      <span class="ticket">${i ? i.id : ''}</span>
      <p class="muted">${esc(mgr ? mgr.name : 'The site manager')} can see it now on the manager dashboard. You can follow its status under “Issues I reported”.</p>
      <div class="btn-row" style="width:100%;margin-top:6px">
        <button class="btn" data-action="go-report">${icon('plus')}Report another</button>
        <button class="btn primary" data-action="home">Back to my tasks</button></div>
    </div></main>`;
  }

  function reqBlock(r, forManager) {
    const by = userById(r.by);
    const title = r.type === 'time' ? `More time · until ${H.fmtDay(r.proposedDate)}` : `${r.count} more ${r.count === 1 ? 'person' : 'people'}${r.trade ? ` · ${esc(r.trade)}` : ''}`;
    const stateLabel = { pending: 'Waiting for answer', approved: 'Approved', declined: 'Declined', withdrawn: 'Closed with issue' }[r.status];
    return `<div class="req ${r.status}">
      <div class="req-head"><b>${icon(r.type === 'time' ? 'calendar' : 'users')} ${title}</b><span class="req-state ${r.status}">${stateLabel}</span></div>
      <p class="quote">${esc(r.reason)}</p>
      <span class="faint" style="font-size:.82rem">${forManager ? `${esc(by ? by.name : '')} · ` : ''}asked ${esc(ago(r.at))}</span>
      ${r.status !== 'pending' && r.response ? `<p style="font-size:.92rem"><b>Manager:</b> ${esc(r.response)}</p>` : ''}
    </div>`;
  }

  function timeline(i) {
    const ev = [...i.events].reverse();
    return `<ol class="timeline">${ev.map((e) => {
      const u = userById(e.by);
      return `<li class="t-${e.type}"><span class="dot"></span><div class="what">${esc(e.text)}</div>
        ${e.note ? `<p class="quote">${esc(e.note)}</p>` : ''}
        <div class="meta">${esc(u ? u.name : '')} · ${esc(fmtDT(e.at))}</div></li>`;
    }).join('')}</ol>`;
  }

  function reportFacts(i) {
    const rep = userById(i.reporterId);
    return `<dl class="facts">
      <dt>Where</dt><dd>${locLine(i.location)}${i.location.detail ? `<br><span class="muted">${esc(i.location.detail)}</span>` : ''}</dd>
      <dt>Noticed</dt><dd>${i.observedAt ? esc(fmtDT(i.observedAt)) : '<span class="muted">Not sure</span>'}</dd>
      <dt>Likely cause</dt><dd>${i.cause ? esc(i.cause) : '<span class="muted">Unknown</span>'}</dd>
      <dt>Type</dt><dd>${esc(i.category)}</dd>
      <dt>Reported by</dt><dd><span class="person">${avatar(rep, 'sm')}${esc(rep ? rep.name : '')}</span> <span class="faint">· ${esc(fmtDT(i.createdAt))}</span></dd>
    </dl>`;
  }

  function viewTask() {
    const u = me();
    const i = issueById(view.id);
    if (!i || !isWorkerIssue(i, u.id)) return `${header('narrow')}<main class="wrap narrow page"><button class="back" data-action="home">${icon('back')}Back</button><div class="empty">This task isn’t assigned to you.</div></main>`;
    const lead = i.assigneeId === u.id;
    const mgr = (i.events.find((e) => e.type === 'assigned') || {}).by;
    const mgrU = userById(mgr) || S().users.find((x) => x.role === 'manager');
    const late = isLate(i);
    const reqs = i.requests || [];
    const hasTime = pending(i).some((r) => r.type === 'time');
    const hasWorkers = pending(i).some((r) => r.type === 'workers');
    const src = photoSrc(i.photo);
    const team = [i.assigneeId, ...(i.helperIds || [])].map(userById);
    const open = H.ACTIVE.includes(i.status);

    let primary = '';
    if (lead && (i.status === 'assigned' || i.status === 'rework')) primary = `<button class="btn primary block" data-action="start" data-id="${i.id}" style="min-height:54px">${icon('play')}${i.status === 'rework' ? 'Start the rework' : 'Start work'}</button>`;
    else if (lead && i.status === 'in_progress') primary = `<button class="btn primary block" data-action="done-sheet" data-id="${i.id}" style="min-height:54px">${icon('check')}Mark as done</button>`;

    return `${header('narrow')}<main class="wrap narrow page" style="padding-bottom:16px">
      <button class="back" data-action="home">${icon('back')}My tasks</button>
      <div class="title-block">
        <div class="badges"><span class="mono faint">${i.id}</span>${badge(i.status)}${late ? '<span class="badge overdue">Overdue</span>' : ''}${i.hazard ? '<span class="badge hazard">Safety risk</span>' : ''}</div>
        <h1>${esc(i.title)}</h1>
        <div class="badges">${dueTag(i)}${prioTag(i.priority)}</div>
      </div>
      ${i.status === 'rework' ? `<div class="callout rework">${icon('alert')}<div><b>Sent back by ${esc(first(mgrU))}</b><p>${esc(i.reworkReason)}</p></div></div>` : ''}
      ${i.status === 'review' ? `<div class="callout review">${icon('clock')}<div><b>Waiting for the manager to check your work.</b><p class="muted">You’ll see here if it’s closed or sent back.</p></div></div>` : ''}
      ${i.status === 'closed' ? `<div class="callout closed">${icon('check')}<div><b>Checked and closed${i.closedAt ? ` on ${esc(fmtDT(i.closedAt))}` : ''}.</b></div></div>` : ''}
      ${late ? `<div class="callout late">${icon('alert')}<div><b>This task is past its deadline.</b><p>If you need more time, ask the manager below.</p></div></div>` : ''}
      <div class="instructions"><span class="from">What to do · from ${esc(mgrU ? mgrU.name : 'manager')}</span><p>${esc(i.instructions)}</p></div>
      <div class="detail-photo">${src ? `<img src="${src}" alt="Photo of the issue">` : `<div class="no-photo">${icon('image')}No photo</div>`}</div>
      <section class="section"><h2 class="subhead">The report</h2>
        <p class="report-text">${esc(i.description)}</p>${reportFacts(i)}</section>
      <section class="section"><h2 class="subhead">Team</h2><div class="team">${team.map((t, k) => `<span class="person">${avatar(t, 'sm')}<b>${esc(t.name)}</b><span class="faint">· ${k === 0 ? 'Responsible' : 'Helping'}${t.id === u.id ? ' (you)' : ''}</span></span>`).join('')}</div></section>
      ${reqs.length ? `<section class="section"><h2 class="subhead">Requests to the manager</h2>${reqs.slice().reverse().map((r) => reqBlock(r, false)).join('')}</section>` : ''}
      ${i.completion && i.status !== 'rework' ? `<section class="section"><h2 class="subhead">Your completion note</h2><p class="quote">${esc(i.completion.note)}</p>${photoSrc(i.completion.photo) ? `<div class="detail-photo"><img src="${photoSrc(i.completion.photo)}" alt="Photo after the repair"></div>` : ''}</section>` : ''}
      <section class="section"><h2 class="subhead">Activity</h2>${timeline(i)}</section>
    </main>
    ${open ? `<div class="action-bar"><div class="wrap narrow inner">
      ${primary}
      <div class="minor">
        <button class="btn" data-action="note-sheet" data-id="${i.id}">${icon('note')}Add update</button>
        <button class="btn" data-action="time-sheet" data-id="${i.id}" ${hasTime ? 'disabled' : ''}>${icon('calendar')}${hasTime ? 'Time asked' : 'Need more time'}</button>
        <button class="btn" data-action="workers-sheet" data-id="${i.id}" ${hasWorkers ? 'disabled' : ''}>${icon('users')}${hasWorkers ? 'Help asked' : 'Need more workers'}</button>
      </div></div></div>` : ''}`;
  }

  /* =====================================================================
     MANAGER
     ===================================================================== */
  function managerCounts() {
    const is = S().issues;
    return {
      new: is.filter((i) => i.status === 'reported').length,
      active: is.filter((i) => H.ACTIVE.includes(i.status)).length,
      review: is.filter((i) => i.status === 'review').length,
      late: is.filter(isLate).length,
      req: is.reduce((n, i) => n + pending(i).length, 0)
    };
  }
  const FILTERS = [
    ['open', 'All open', (i) => i.status !== 'closed'],
    ['new', 'New', (i) => i.status === 'reported'],
    ['active', 'In progress', (i) => H.ACTIVE.includes(i.status)],
    ['review', 'To check', (i) => i.status === 'review'],
    ['late', 'Overdue', (i) => isLate(i)],
    ['req', 'Requests', (i) => pending(i).length > 0],
    ['closed', 'Closed', (i) => i.status === 'closed'],
    ['all', 'All', () => true]
  ];

  function todoItems() {
    const items = [];
    S().issues.forEach((i) => {
      pending(i).forEach((r) => {
        const by = userById(r.by);
        items.push({ w: 1, at: r.at, id: i.id, cls: 'i-req', ic: r.type === 'time' ? 'calendar' : 'users',
          t: r.type === 'time' ? `${by.name} needs more time` : `${by.name} needs ${r.count} more ${r.count === 1 ? 'person' : 'people'}`,
          s: `${i.id} · ${i.title}` });
      });
      if (i.status === 'reported') items.push({ w: i.hazard ? 0 : 2, at: i.createdAt, id: i.id, cls: 'i-new', ic: i.hazard ? 'alert' : 'inbox',
        t: `${i.hazard ? 'Safety risk: ' : 'New: '}${i.title}`, s: `${i.id} · ${locText(i.location)} · from ${userById(i.reporterId).name}` });
      if (i.status === 'review') items.push({ w: 3, at: i.completion ? i.completion.at : i.createdAt, id: i.id, cls: 'i-review', ic: 'check',
        t: `Check work: ${i.title}`, s: `${i.id} · ${userById(i.assigneeId).name} marked it as done` });
      if (isLate(i) && !pending(i).some((r) => r.type === 'time')) items.push({ w: 4, at: i.dueDate, id: i.id, cls: 'i-late', ic: 'clock',
        t: `Overdue: ${i.title}`, s: `${i.id} · ${userById(i.assigneeId).name} · ${dueInfo(i).text}` });
    });
    return items.sort((a, b) => a.w - b.w || String(b.at).localeCompare(String(a.at)));
  }

  function viewManagerHome() {
    const c = managerCounts();
    const todo = todoItems();
    const workers = S().users.filter((u) => u.role === 'worker');
    const f = FILTERS.find((x) => x[0] === mgrFilter) || FILTERS[0];
    const q = mgrSearch.trim().toLowerCase();
    const list = S().issues.filter(f[2]).filter((i) => !q || [i.id, i.title, i.location.room, i.location.building, (userById(i.assigneeId) || {}).name].join(' ').toLowerCase().includes(q))
      .sort((a, b) => (H.STATUS[a.status].order - H.STATUS[b.status].order) || (isLate(b) - isLate(a)) || b.createdAt.localeCompare(a.createdAt));
    const kpi = (key, cls, n, label) => `<button class="kpi ${cls}" data-action="filter" data-f="${key}" aria-pressed="${mgrFilter === key}"><b>${n}</b><span>${label}</span></button>`;

    return `${header('wide')}<main class="wrap wide page">
      <div class="mgr-head"><div><h1>Site overview</h1><p>${esc(longDate())} · ${esc(S().project.name)}</p></div></div>
      <div class="kpis">
        ${kpi('new', 'k-new', c.new, 'New reports')}
        ${kpi('active', 'k-active', c.active, 'In progress')}
        ${kpi('review', 'k-review', c.review, 'Ready to check')}
        ${kpi('late', 'k-late', c.late, 'Overdue')}
        ${kpi('req', 'k-req', c.req, 'Open requests')}
      </div>
      <div class="mgr-grid">
        <section class="section"><div class="section-head"><h2>Needs your decision</h2><span class="count">${todo.length}</span></div>
          ${todo.length ? `<div class="panel todo">${todo.map((t) => `<button class="todo-item" data-action="open-issue" data-id="${t.id}">
            <span class="todo-ico ${t.cls}">${icon(t.ic)}</span><span class="txt"><b>${esc(t.t)}</b><span>${esc(t.s)}</span></span>
            <span class="when">${t.cls === 'i-late' ? '' : esc(ago(t.at))}</span></button>`).join('')}</div>`
            : '<div class="empty">All caught up. New reports and requests from the site will appear here.</div>'}
        </section>
        <section class="section"><div class="section-head"><h2>Crew today</h2><span class="count">${workers.length}</span></div>
          <div class="panel crew">${workers.map((w) => {
            const ts = S().issues.filter((i) => isWorkerIssue(i, w.id) && H.ACTIVE.includes(i.status));
            const lt = ts.filter(isLate).length;
            return `<div class="crew-row">${avatar(w, 'sm')}<span class="nm"><b>${esc(w.name)}</b><span>${esc(w.title)}</span></span>
              <span class="load">${ts.length} open${lt ? ` · <span class="late">${lt} late</span>` : ''}</span></div>`;
          }).join('')}</div></section>
      </div>
      <section class="section" id="all-issues">
        <div class="section-head"><h2>All issues</h2></div>
        <div class="toolbar">
          <div class="tabs" role="group" aria-label="Filter issues">${FILTERS.map(([k, l, fn]) => `<button class="tab" data-action="filter" data-f="${k}" aria-pressed="${mgrFilter === k}">${l}<span class="n">${S().issues.filter(fn).length}</span></button>`).join('')}</div>
          <label class="search">${icon('search')}<span class="sr-only">Search issues</span><input type="text" id="mgr-search" placeholder="Search ID, title, room, worker" value="${esc(mgrSearch)}" data-search></label>
        </div>
        <div class="panel table" id="issue-table">${issueTable(list)}</div>
      </section>
    </main>`;
  }

  function issueTable(list) {
    if (!list.length) return '<div class="empty" style="border:0">No issues match this filter.</div>';
    return `<div class="trow head"><span>ID</span><span></span><span>Issue</span><span>Reported</span><span>Assigned to</span><span>Deadline</span><span>Status</span></div>
      ${list.map((i) => {
        const a = userById(i.assigneeId); const r = userById(i.reporterId); const src = photoSrc(i.photo); const reqs = pending(i).length;
        const st = `${isLate(i) ? '<span class="badge overdue">Overdue</span>' : badge(i.status)}`;
        return `<button class="trow" data-action="open-issue" data-id="${i.id}">
          <span class="cell mono c-id">${i.id}</span>
          <span class="c-img">${src ? `<img class="thumb" src="${src}" alt="">` : `<span class="thumb" style="display:grid;place-items:center;color:var(--ink-3)">${icon('image')}</span>`}</span>
          <span class="ttl"><b>${i.hazard ? `${icon('alert')} ` : ''}${esc(i.title)}</b><span>${locLine(i.location)}</span></span>
          <span class="cell small c-rep">${esc(r ? r.name : '')}<br>${esc(ago(i.createdAt))}</span>
          <span class="cell c-asg">${a ? `<span class="person">${avatar(a, 'sm')}${esc(a.name)}</span>` : '<span class="faint">Not assigned</span>'}</span>
          <span class="cell c-due">${i.dueDate ? `${dueTag(i) || esc(H.fmtDay(i.dueDate))}` : '<span class="faint">—</span>'}</span>
          <span class="cell c-st">${st}${reqs ? `<span class="chip req">${reqs} request${reqs > 1 ? 's' : ''}</span>` : ''}</span>
          <span class="c-mob" style="display:none"><span class="mono faint">${i.id}</span>${st}${a ? `<span class="faint">${esc(first(a))}</span>` : ''}${dueTag(i)}${reqs ? `<span class="chip req">${reqs} request</span>` : ''}</span>
        </button>`;
      }).join('')}`;
  }

  function workerOptions(selected, excludeIds = []) {
    const t = today();
    return S().users.filter((u) => u.role === 'worker' && !excludeIds.includes(u.id)).map((w) => {
      const n = S().issues.filter((i) => isWorkerIssue(i, w.id) && H.ACTIVE.includes(i.status)).length;
      return `<option value="${w.id}"${w.id === selected ? ' selected' : ''}>${esc(w.name)} · ${esc(w.title)} (${n} open)</option>`;
    }).join('');
  }

  function viewManagerIssue() {
    const i = issueById(view.id);
    if (!i) return `${header('wide')}<main class="wrap wide page"><button class="back" data-action="home">${icon('back')}Dashboard</button><div class="empty">Issue not found.</div></main>`;
    const src = photoSrc(i.photo);
    const late = isLate(i);
    return `${header('wide')}<main class="wrap wide page">
      <button class="back" data-action="home">${icon('back')}Dashboard</button>
      <div class="title-block">
        <div class="badges"><span class="mono faint">${i.id}</span>${badge(i.status)}${late ? '<span class="badge overdue">Overdue</span>' : ''}${i.hazard ? '<span class="badge hazard">Safety risk</span>' : ''}</div>
        <h1>${esc(i.title)}</h1>
        <div class="badges"><span class="loc">${icon('pin')}${locLine(i.location)}</span>${dueTag(i)}${prioTag(i.priority)}</div>
      </div>
      <div class="detail-grid">
        <div class="stack">
          <div class="detail-photo">${src ? `<img src="${src}" alt="Photo of the issue">` : `<div class="no-photo">${icon('image')}No photo attached</div>`}</div>
          <section class="panel panel-pad stack"><h2 class="subhead">Original report</h2>
            <p class="report-text">${esc(i.description)}</p>${reportFacts(i)}</section>
          ${i.completion ? `<section class="panel panel-pad stack"><h2 class="subhead">${i.status === 'rework' ? 'Previous completion note' : 'Completion note from the worker'}</h2>
            <p class="quote">${esc(i.completion.note)}</p>
            <span class="faint" style="font-size:.85rem">${esc(userById(i.completion.by).name)} · ${esc(fmtDT(i.completion.at))}</span>
            ${photoSrc(i.completion.photo) ? `<div class="detail-photo"><img src="${photoSrc(i.completion.photo)}" alt="Photo after the repair"></div>` : ''}</section>` : ''}
          <section class="panel panel-pad stack"><h2 class="subhead">Activity</h2>${timeline(i)}</section>
        </div>
        <aside class="stack side">${i.status === 'reported' ? assignPanel(i) : followUpPanel(i)}</aside>
      </div>
    </main>`;
  }

  function assignPanel(i) {
    const t = today();
    const def = i.hazard ? t : H.addDays(t, 2);
    return `<form class="form-card" data-form="assign" data-id="${i.id}" novalidate>
      <div><h2>Assign the repair</h2><p class="muted" style="font-size:.92rem">The worker sees the task on their dashboard as soon as you save.</p></div>
      <div class="field"><label for="as-worker">Who fixes it?</label>
        <select id="as-worker" name="assigneeId"><option value="">Choose a worker</option>${workerOptions(null)}</select></div>
      <div class="field"><span class="label">Priority</span>
        <div class="seg">${['low', 'normal', 'high', 'urgent'].map((p) => `<label><input type="radio" name="priority" value="${p}"${p === (i.hazard ? 'urgent' : 'normal') ? ' checked' : ''}>${H.PRIORITY[p]}</label>`).join('')}</div></div>
      <div class="field"><label for="as-due">Deadline</label>
        <input type="date" id="as-due" name="dueDate" min="${t}" value="${def}"></div>
      <div class="field"><label for="as-ins">Instructions for the worker</label>
        <textarea id="as-ins" name="instructions" placeholder="e.g. Check the hinges and adjust the window fitting. Replace the hinge if it is bent."></textarea></div>
      <div class="form-error" role="alert"></div>
      <button class="btn primary block" type="submit">${icon('send')}Assign and send to worker</button>
    </form>`;
  }

  function followUpPanel(i) {
    const t = today();
    const a = userById(i.assigneeId);
    const helpers = (i.helperIds || []).map(userById);
    const reqs = i.requests || [];
    const pend = reqs.filter((r) => r.status === 'pending');
    const done = reqs.filter((r) => r.status !== 'pending');
    const open = H.ACTIVE.includes(i.status);

    const statusLine = {
      assigned: `${a.name} hasn’t started yet.`,
      in_progress: `${a.name} is working on it.`,
      rework: `Sent back to ${a.name} for rework.`,
      review: `${a.name} says the work is done. Check it and decide.`,
      closed: `Closed on ${i.closedAt ? fmtDT(i.closedAt) : ''}.`
    }[i.status];

    const reqForms = pend.map((r) => {
      const by = userById(r.by);
      if (r.type === 'time') {
        return `<form class="form-card" data-form="resolve" data-id="${i.id}" data-req="${r.id}" data-type="time" novalidate style="border-color:color-mix(in srgb,var(--accent) 70%,var(--line))">
          <div class="req-head"><h2>${icon('calendar')} ${esc(first(by))} needs more time</h2><span class="faint" style="font-size:.82rem">${esc(ago(r.at))}</span></div>
          <p class="quote">${esc(r.reason)}</p>
          <div class="split"><div class="kv"><span class="subhead">Current deadline</span><b>${esc(H.fmtDay(i.dueDate))}</b></div>
            <div class="kv"><span class="subhead">Asked for</span><b>${esc(H.fmtDay(r.proposedDate))}</b></div></div>
          <div class="field"><label for="rq-date-${r.id}">New deadline</label><input type="date" id="rq-date-${r.id}" name="newDate" min="${t}" value="${r.proposedDate}"></div>
          <div class="field"><label for="rq-msg-${r.id}">Message to ${esc(first(by))} <span class="opt">(optional)</span></label><input type="text" id="rq-msg-${r.id}" name="response" placeholder="e.g. OK, but keep the water shut off."></div>
          <div class="form-error" role="alert"></div>
          <div class="btn-row"><button class="btn primary" type="submit" name="decision" value="approve">${icon('check')}Approve new deadline</button>
            <button class="btn" type="submit" name="decision" value="decline">Decline</button></div></form>`;
      }
      const team = [i.assigneeId, ...(i.helperIds || [])];
      const cands = S().users.filter((u) => u.role === 'worker' && !team.includes(u.id));
      return `<form class="form-card" data-form="resolve" data-id="${i.id}" data-req="${r.id}" data-type="workers" novalidate style="border-color:color-mix(in srgb,var(--accent) 70%,var(--line))">
        <div class="req-head"><h2>${icon('users')} ${esc(first(by))} needs ${r.count} more ${r.count === 1 ? 'person' : 'people'}</h2><span class="faint" style="font-size:.82rem">${esc(ago(r.at))}</span></div>
        <p class="quote">${esc(r.reason)}</p>
        ${r.trade ? `<p style="font-size:.92rem"><b>Trade needed:</b> ${esc(r.trade)}</p>` : ''}
        <div class="field"><span class="label">Add to the task</span><div class="worker-opt">
          ${cands.map((c) => {
            const n = S().issues.filter((x) => isWorkerIssue(x, c.id) && H.ACTIVE.includes(x.status)).length;
            return `<label class="check"><input type="checkbox" name="helperIds" value="${c.id}">${avatar(c, 'sm')}<span>${esc(c.name)} <span class="faint">· ${esc(c.title)} · ${n} open</span></span></label>`;
          }).join('')}</div></div>
        <div class="field"><label for="rq-msg-${r.id}">Message to ${esc(first(by))} <span class="opt">(optional)</span></label><input type="text" id="rq-msg-${r.id}" name="response" placeholder="e.g. Ayşe joins you after lunch."></div>
        <div class="form-error" role="alert"></div>
        <div class="btn-row"><button class="btn primary" type="submit" name="decision" value="approve">${icon('users')}Add to task</button>
          <button class="btn" type="submit" name="decision" value="decline">Decline</button></div></form>`;
    }).join('');

    const review = i.status === 'review' ? `<form class="form-card" data-form="review" data-id="${i.id}" novalidate style="border-color:var(--st-review)">
      <div><h2>Check the work</h2><p class="muted" style="font-size:.92rem">Read ${esc(first(a))}’s note on the left, check on site, then decide.</p></div>
      <div class="field"><label for="rv-note">Comment <span class="opt">(required if you send it back)</span></label>
        <textarea id="rv-note" name="note" style="min-height:76px" placeholder="e.g. The gap at the top is still there."></textarea></div>
      <div class="form-error" role="alert"></div>
      <div class="btn-row"><button class="btn primary" type="submit" name="decision" value="close">${icon('check')}Approve and close</button>
        <button class="btn danger" type="submit" name="decision" value="return">Send back for rework</button></div></form>` : '';

    const adjust = open ? `<details class="panel panel-pad adjust"><summary>${icon('chev')}Change worker, deadline or instructions</summary>
      <form class="form" data-form="adjust" data-id="${i.id}" novalidate style="margin-top:14px">
        <div class="field"><label for="ad-worker">Responsible worker</label><select id="ad-worker" name="assigneeId">${workerOptions(i.assigneeId)}</select></div>
        <div class="field"><label for="ad-due">Deadline</label><input type="date" id="ad-due" name="dueDate" min="${t}" value="${i.dueDate && i.dueDate >= t ? i.dueDate : ''}"></div>
        <div class="field"><label for="ad-ins">Instructions</label><textarea id="ad-ins" name="instructions">${esc(i.instructions)}</textarea></div>
        <div class="form-error" role="alert"></div>
        <button class="btn" type="submit">Save changes</button></form></details>` : '';

    return `<section class="panel panel-pad stack">
        <h2 class="subhead">Follow-up</h2>
        <p style="font-weight:600">${esc(statusLine)}</p>
        <dl class="facts">
          <dt>Responsible</dt><dd><span class="person">${avatar(a, 'sm')}${esc(a.name)}</span></dd>
          ${helpers.length ? `<dt>Helping</dt><dd class="team">${helpers.map((h) => `<span class="person">${avatar(h, 'sm')}${esc(h.name)}</span>`).join('')}</dd>` : ''}
          <dt>Deadline</dt><dd>${esc(H.fmtDay(i.dueDate))} ${dueTag(i)}</dd>
          <dt>Priority</dt><dd>${prioTag(i.priority)}</dd>
        </dl>
        <div class="instructions"><span class="from">Your instructions</span><p>${esc(i.instructions)}</p></div>
        ${i.status === 'rework' && i.reworkReason ? `<div class="callout rework">${icon('alert')}<div><b>Reason sent back</b><p>${esc(i.reworkReason)}</p></div></div>` : ''}
      </section>
      ${reqForms}
      ${review}
      ${adjust}
      ${done.length ? `<section class="stack"><h2 class="subhead">Earlier requests</h2>${done.map((r) => reqBlock(r, true)).join('')}</section>` : ''}`;
  }

  /* =====================================================================
     SHEETS (worker actions)
     ===================================================================== */
  function sheetDone(id) {
    openSheet('Mark as done', `<form class="form" data-form="done" data-id="${id}" novalidate>
      <p class="muted">The manager will check your work and close the issue or send it back.</p>
      <div class="field"><label for="dn-note">What did you do?</label>
        <textarea id="dn-note" name="note" placeholder="e.g. Replaced the top hinge and adjusted the sash. Window closes and seals properly."></textarea></div>
      <div class="field"><span class="label">Photo after the repair <span class="opt">(optional)</span></span>
        <div class="photo-field" data-photo-box="dn-photo">${photoFieldHtml('dn-photo', null, 'Add an after photo')}</div>
        <input type="file" id="dn-photo" accept="image/*" capture="environment" data-photo="done" class="sr-only">
        <span class="photo-err form-error" data-err="dn-photo"></span></div>
      <div class="form-error" role="alert"></div>
      <button class="btn primary block" type="submit">${icon('send')}Send for review</button></form>`);
  }
  function sheetNote(id) {
    openSheet('Add an update', `<form class="form" data-form="note" data-id="${id}" novalidate>
      <div class="field"><label for="nt-text">What’s the latest?</label>
        <textarea id="nt-text" name="text" placeholder="e.g. Waiting for the hinge from the container. Back on it at 2 pm."></textarea></div>
      <div class="form-error" role="alert"></div>
      <button class="btn primary block" type="submit">Post update</button></form>`);
  }
  function sheetTime(id) {
    const i = issueById(id);
    const min = H.addDays(i.dueDate && i.dueDate >= today() ? i.dueDate : today(), 1);
    openSheet('Ask for more time', `<form class="form" data-form="time" data-id="${id}" novalidate>
      <p class="muted">Current deadline: <b>${esc(H.fmtDay(i.dueDate))}</b>. The manager decides if it can move.</p>
      <div class="field"><label for="tm-date">I need until</label><input type="date" id="tm-date" name="proposedDate" min="${min}" value="${min}"></div>
      <div class="field"><label for="tm-reason">Why?</label><textarea id="tm-reason" name="reason" placeholder="e.g. Replacement part arrives on Friday."></textarea></div>
      <div class="form-error" role="alert"></div>
      <button class="btn primary block" type="submit">${icon('send')}Send request to manager</button></form>`);
  }
  function sheetWorkers(id) {
    openSheet('Ask for more workers', `<form class="form" data-form="workers" data-id="${id}" novalidate>
      <p class="muted">Your request goes to the manager, who decides who joins you.</p>
      <div class="row">
        <div class="field"><label for="wk-count">How many people?</label><select id="wk-count" name="count">${[1, 2, 3, 4, 5].map((n) => `<option>${n}</option>`).join('')}</select></div>
        <div class="field"><label for="wk-trade">Which trade? <span class="opt">(optional)</span></label>
          <select id="wk-trade" name="trade"><option value="">Anyone</option>${['Window & door fitter', 'Electrician', 'Plasterer', 'Plumber', 'General site work'].map((t) => `<option>${t}</option>`).join('')}</select></div>
      </div>
      <div class="field"><label for="wk-reason">Why?</label><textarea id="wk-reason" name="reason" placeholder="e.g. The radiator has to be lifted off the wall. I can’t do it alone."></textarea></div>
      <div class="form-error" role="alert"></div>
      <button class="btn primary block" type="submit">${icon('send')}Send request to manager</button></form>`);
  }
  function sheetMenu() {
    const u = me();
    openSheet('Account', `<div class="panel panel-pad" style="display:flex;gap:12px;align-items:center">${avatar(u, 'lg')}<div><b>${esc(u.name)}</b><div class="muted">${esc(u.title)} · ${u.role === 'manager' ? 'Manager' : 'Worker'} view</div><div class="mono faint">${esc(u.username)}</div></div></div>
      <button class="btn block" data-action="logout">${icon('logout')}Switch user</button>
      <div class="panel panel-pad stack"><div><b>Reset demo data</b><p class="muted" style="font-size:.9rem">Puts all issues back to how the demo started. Anything you added is removed.</p></div>
        <button class="btn danger" data-action="reset-confirm">${icon('reset')}Reset demo data</button></div>
      <p class="faint" style="font-size:.84rem">SiteProof course prototype · fictional data · stored only in this browser${store.isPersisted() ? '' : ' (storage is blocked here, so changes last until you close the page)'}.</p>`);
  }

  /* ---------- photo handling ---------- */
  function readPhoto(file) {
    return new Promise((resolve, reject) => {
      if (!file) return reject(new Error('No photo selected.'));
      if (file.type && !file.type.startsWith('image/')) return reject(new Error('That file isn’t a photo. Choose a JPG or PNG.'));
      const fr = new FileReader();
      fr.onerror = () => reject(new Error('Couldn’t read the photo. Try another one.'));
      fr.onload = () => {
        const img = new Image();
        img.onload = () => {
          const max = 1280;
          const sc = Math.min(1, max / Math.max(img.width, img.height));
          const c = document.createElement('canvas');
          c.width = Math.round(img.width * sc); c.height = Math.round(img.height * sc);
          c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
          resolve(c.toDataURL('image/jpeg', 0.72));
        };
        img.onerror = () => reject(new Error('This browser can’t open that photo format. Try a JPG or PNG.'));
        img.src = fr.result;
      };
      fr.readAsDataURL(file);
    });
  }

  /* =====================================================================
     RENDER
     ===================================================================== */
  function render() {
    const u = me();
    if (!u && view.name !== 'login') view = { name: 'login' };
    let html = '';
    switch (view.name) {
      case 'login': html = viewLogin(); break;
      case 'w-home': html = viewWorkerHome(); break;
      case 'w-report': html = viewReport(); break;
      case 'w-sent': html = viewSent(); break;
      case 'w-task': html = viewTask(); break;
      case 'm-home': html = viewManagerHome(); break;
      case 'm-issue': html = viewManagerIssue(); break;
      default: html = viewLogin();
    }
    appEl.innerHTML = html;
    document.title = 'SiteProof';
  }

  /* ---------- events ---------- */
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-action]');
    if (!el) return;
    const a = el.dataset.action;
    const id = el.dataset.id;
    if (a === 'close-sheet-bg' && e.target !== el) return;
    switch (a) {
      case 'home': home(); break;
      case 'login-role': loginRole = el.dataset.role; render(); break;
      case 'pick-acct': {
        document.getElementById('lg-user').value = el.dataset.user;
        document.getElementById('lg-pass').value = 'demo1234';
        document.querySelectorAll('.acct').forEach((x) => x.classList.toggle('sel', x === el));
        break;
      }
      case 'menu': sheetMenu(); break;
      case 'close-sheet': case 'close-sheet-bg': closeSheet(); break;
      case 'logout': store.logout(); loginRole = 'worker'; go('login'); break;
      case 'reset-confirm':
        el.outerHTML = `<div class="btn-row"><button class="btn danger" data-action="reset">Yes, reset everything</button><button class="btn" data-action="close-sheet">Cancel</button></div>`;
        break;
      case 'reset': store.reset(); draftPhoto = null; mgrFilter = 'open'; mgrSearch = ''; closeSheet(); home(); toast('Demo data reset'); break;
      case 'go-report': draftPhoto = null; go('w-report'); break;
      case 'open-task': go('w-task', { id }); break;
      case 'open-issue': go('m-issue', { id }); break;
      case 'filter':
        mgrFilter = el.dataset.f; render();
        if (el.classList.contains('kpi')) document.getElementById('all-issues').scrollIntoView({ behavior: 'smooth' });
        break;
      case 'start': {
        const err = act(() => store.startWork(me().id, id), 'Work started. The manager can see it.');
        if (err) toast(err, 'warn'); else render();
        break;
      }
      case 'done-sheet': sheetDone(id); break;
      case 'note-sheet': sheetNote(id); break;
      case 'time-sheet': sheetTime(id); break;
      case 'workers-sheet': sheetWorkers(id); break;
      case 'remove-photo': {
        const target = el.dataset.target;
        if (target === 'rp-photo') draftPhoto = null; else donePhoto = null;
        const box = document.querySelector(`[data-photo-box="${target}"]`);
        if (box) box.innerHTML = photoFieldHtml(target, null, target === 'rp-photo' ? undefined : 'Add an after photo');
        const inp = document.getElementById(target); if (inp) inp.value = '';
        break;
      }
    }
  });

  document.addEventListener('change', (e) => {
    const t = e.target;
    if (t.matches('[data-toggle]')) {
      const other = document.getElementById(t.dataset.toggle);
      if (other) other.disabled = t.checked;
    }
    if (t.matches('[data-photo]')) {
      const errEl = document.querySelector(`[data-err="${t.id}"]`);
      if (errEl) errEl.textContent = '';
      const file = t.files && t.files[0];
      if (!file) return;
      readPhoto(file).then((src) => {
        if (t.dataset.photo === 'draft') draftPhoto = src; else donePhoto = src;
        const box = document.querySelector(`[data-photo-box="${t.id}"]`);
        if (box) box.innerHTML = photoFieldHtml(t.id, src);
      }).catch((err) => { if (errEl) errEl.textContent = err.message; else toast(err.message, 'warn'); });
    }
  });

  document.addEventListener('input', (e) => {
    if (e.target.matches('[data-search]')) {
      mgrSearch = e.target.value;
      const f = FILTERS.find((x) => x[0] === mgrFilter) || FILTERS[0];
      const q = mgrSearch.trim().toLowerCase();
      const list = S().issues.filter(f[2]).filter((i) => !q || [i.id, i.title, i.location.room, i.location.building, (userById(i.assigneeId) || {}).name].join(' ').toLowerCase().includes(q))
        .sort((a, b) => (H.STATUS[a.status].order - H.STATUS[b.status].order) || b.createdAt.localeCompare(a.createdAt));
      document.getElementById('issue-table').innerHTML = issueTable(list);
    }
  });

  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && sheetRoot.innerHTML) closeSheet(); });

  document.addEventListener('submit', (e) => {
    const f = e.target.closest('form[data-form]');
    if (!f) return;
    e.preventDefault();
    const fd = new FormData(f);
    const v = (k) => (fd.get(k) || '').toString();
    const id = f.dataset.id;
    const decision = e.submitter ? e.submitter.value : '';
    const u = me();
    let err = null;

    switch (f.dataset.form) {
      case 'login': {
        const name = v('username').trim().toLowerCase();
        const acct = S().users.find((x) => x.username === name);
        if (!name) err = 'Enter your username, or tap a demo account below.';
        else if (!acct) err = 'No demo account with that username. Tap one of the accounts below.';
        else if (acct.role !== loginRole) err = `${acct.name} is a ${acct.role}. Switch to “${acct.role === 'manager' ? 'Manager' : 'Worker'}” above.`;
        else if (!v('password')) err = 'Enter a password. Any password works in the demo.';
        if (!err) { store.login(acct.id); home(); return; }
        break;
      }
      case 'report': {
        let created = null;
        err = act(() => {
          const r = store.createIssue(u.id, {
            title: v('title'), category: v('category'), building: v('building'), floor: v('floor'), room: v('room'), detail: v('detail'),
            description: v('description'), observedAt: v('observedAt'), observedUnknown: !!fd.get('observedUnknown'),
            cause: v('cause'), causeUnknown: !!fd.get('causeUnknown'), hazard: !!fd.get('hazard'), photo: draftPhoto
          });
          created = r.issue; return r;
        });
        if (!err) { draftPhoto = null; go('w-sent', { id: created.id }); return; }
        break;
      }
      case 'done':
        err = act(() => store.submitForReview(u.id, id, { note: v('note'), photo: donePhoto }), 'Sent to the manager for review');
        if (!err) { closeSheet(); render(); window.scrollTo(0, 0); return; }
        break;
      case 'note':
        err = act(() => store.addNote(u.id, id, v('text')), 'Update posted');
        if (!err) { closeSheet(); render(); return; }
        break;
      case 'time':
        err = act(() => store.requestTime(u.id, id, { proposedDate: v('proposedDate'), reason: v('reason') }), 'Request sent to the manager');
        if (!err) { closeSheet(); render(); return; }
        break;
      case 'workers':
        err = act(() => store.requestWorkers(u.id, id, { count: v('count'), trade: v('trade'), reason: v('reason') }), 'Request sent to the manager');
        if (!err) { closeSheet(); render(); return; }
        break;
      case 'assign': {
        const w = userById(v('assigneeId'));
        err = act(() => store.assignIssue(u.id, id, { assigneeId: v('assigneeId'), priority: v('priority'), dueDate: v('dueDate'), instructions: v('instructions') }),
          w ? `Assigned to ${w.name}` : '');
        if (!err) { render(); window.scrollTo(0, 0); return; }
        break;
      }
      case 'adjust':
        err = act(() => store.updateAssignment(u.id, id, { assigneeId: v('assigneeId'), dueDate: v('dueDate'), instructions: v('instructions') }), 'Changes saved');
        if (!err) { render(); return; }
        break;
      case 'resolve': {
        if (!decision) { err = 'Choose approve or decline.'; break; }
        const helperIds = fd.getAll('helperIds').map(String);
        err = act(() => store.resolveRequest(u.id, id, f.dataset.req, { decision, newDate: v('newDate'), helperIds, response: v('response') }),
          decision === 'approve' ? (f.dataset.type === 'time' ? 'New deadline set' : 'Added to the task') : 'Request declined');
        if (!err) { render(); return; }
        break;
      }
      case 'review':
        if (decision === 'return') err = act(() => store.returnIssue(u.id, id, v('note')), 'Sent back for rework');
        else if (decision === 'close') err = act(() => store.closeIssue(u.id, id, v('note')), 'Issue closed');
        else err = 'Choose approve or send back.';
        if (!err) { render(); window.scrollTo(0, 0); return; }
        break;
    }
    if (err) showError(f, err);
  });

  // Keep other open tabs of the app in step (same browser)
  window.addEventListener('storage', (e) => {
    if (e.key === H.STORAGE_KEY) location.reload();
  });

  /* ---------- start ---------- */
  if (me()) home(); else render();
})();
