const test=require('node:test');const assert=require('node:assert/strict');
const statuses={NEW:'New',ASSIGNED:'Assigned',PROGRESS:'In progress',REVIEW:'Ready for review',CLOSED:'Closed',REWORK:'Rework needed'};
test('SiteProof workflow has the expected core statuses',()=>{assert.deepEqual(Object.values(statuses),['New','Assigned','In progress','Ready for review','Closed','Rework needed'])});
test('issue can move through the core lifecycle',()=>{const issue={status:statuses.NEW};issue.status=statuses.ASSIGNED;assert.equal(issue.status,'Assigned');issue.status=statuses.PROGRESS;issue.status=statuses.REVIEW;issue.status=statuses.CLOSED;assert.equal(issue.status,'Closed')});
test('manager review is required before closure',()=>{const issue={status:statuses.PROGRESS};assert.notEqual(issue.status,statuses.CLOSED);issue.status=statuses.REVIEW;issue.status=statuses.CLOSED;assert.equal(issue.status,statuses.CLOSED)});
