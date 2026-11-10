// Run with: npm test   (uses Node's built-in test runner, no dependencies)
const test = require('node:test');
const assert = require('node:assert/strict');
const H = require('../js/store.js');
const seed = require('../js/seed.js');

function memoryStorage() {
  const m = new Map();
  return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k) };
}
const NOW = new Date(2026, 9, 28, 10, 0, 0);
const make = (storage = memoryStorage()) => ({ store: H.createStore(seed, storage, () => NOW), storage });
const TODAY = H.localDate(NOW);

test('seed data loads with people and issues', () => {
  const { store } = make();
  const s = store.get();
  assert.ok(s.users.some((u) => u.role === 'manager'));
  assert.ok(s.users.filter((u) => u.role === 'worker').length >= 5);
  assert.ok(s.issues.length >= 10);
});

test('full journey: report → assign → work → ask for time → review → return → close', () => {
  const { store } = make();
  const r = store.createIssue('w5', {
    title: 'Window does not close', category: 'Installation', building: 'B', floor: 'Floor 2', room: 'B-204',
    description: 'Gap of 1 cm at the top', observedUnknown: true, causeUnknown: true
  });
  const id = r.issue.id;
  assert.equal(r.issue.status, 'reported');

  store.assignIssue('m1', id, { assigneeId: 'w1', priority: 'high', dueDate: TODAY, instructions: 'Check the hinges' });
  assert.equal(store.get().issues.find((i) => i.id === id).status, 'assigned');

  store.startWork('w1', id);
  store.requestTime('w1', id, { proposedDate: H.addDays(TODAY, 2), reason: 'Waiting for part' });
  const req = store.get().issues.find((i) => i.id === id).requests[0];
  store.resolveRequest('m1', id, req.id, { decision: 'approve', newDate: H.addDays(TODAY, 2) });
  assert.equal(store.get().issues.find((i) => i.id === id).dueDate, H.addDays(TODAY, 2));

  store.requestWorkers('w1', id, { count: 1, reason: 'Heavy sash' });
  const req2 = store.get().issues.find((i) => i.id === id).requests[1];
  store.resolveRequest('m1', id, req2.id, { decision: 'approve', helperIds: ['w6'] });
  assert.deepEqual(store.get().issues.find((i) => i.id === id).helperIds, ['w6']);

  store.submitForReview('w1', id, { note: 'Replaced hinge' });
  store.returnIssue('m1', id, 'Still a small gap');
  assert.equal(store.get().issues.find((i) => i.id === id).status, 'rework');

  store.startWork('w1', id);
  store.submitForReview('w1', id, { note: 'Adjusted again' });
  store.closeIssue('m1', id, 'Good');
  assert.equal(store.get().issues.find((i) => i.id === id).status, 'closed');
});

test('forbidden transitions are rejected', () => {
  const { store } = make();
  // worker cannot assign
  assert.throws(() => store.assignIssue('w1', 'SP-1035', { assigneeId: 'w2', dueDate: TODAY, instructions: 'Fix it' }));
  // manager cannot close work that is not ready for review
  assert.throws(() => store.closeIssue('m1', 'SP-1031'));
  // someone else cannot start another worker's task
  assert.throws(() => store.startWork('w2', 'SP-1038'));
  // cannot mark done before starting
  assert.throws(() => store.submitForReview('w1', 'SP-1038', { note: 'done' }));
  // deadline in the past
  assert.throws(() => store.assignIssue('m1', 'SP-1035', { assigneeId: 'w2', dueDate: H.addDays(TODAY, -1), instructions: 'Fix it' }));
  // duplicate pending time request
  assert.throws(() => store.requestTime('w4', 'SP-1034', { proposedDate: H.addDays(TODAY, 5), reason: 'again' }));
  // manager cannot create field reports in this prototype
  assert.throws(() => store.createIssue('m1', { title: 'x', building: 'A', floor: 'Floor 1', description: 'hello there', observedUnknown: true }));
});

test('state survives a reload from the same storage', () => {
  const { store, storage } = make();
  store.createIssue('w1', { title: 'Test issue', building: 'A', floor: 'Floor 1', description: 'Something here', observedUnknown: true });
  const again = H.createStore(seed, storage, () => NOW);
  assert.equal(again.get().issues[0].title, 'Test issue');
});
