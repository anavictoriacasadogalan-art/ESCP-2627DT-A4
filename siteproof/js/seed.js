/*
 * SiteProof — fictional demo data.
 * Every person, project, issue and photo here is invented for the course prototype.
 * Dates are generated relative to "now" so the demo always looks current.
 */
(function (root, factory) {
  const fn = factory();
  if (typeof module === 'object' && module.exports) module.exports = fn;
  else { root.SP = root.SP || {}; root.SP.seed = fn; }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  return function seed(now, H) {
    const today = H.localDate(now);
    const day = (n) => H.addDays(today, n);
    const ago = (hours) => new Date(now.getTime() - hours * 3600000).toISOString();
    let ev = 0;
    const E = (h, by, type, text, note) => {
      const e = { id: 'e' + (++ev), at: ago(h), by, type, text };
      if (note) e.note = note;
      return e;
    };
    const fmt = (s) => {
      const D = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const M = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const [y, m, d] = s.split('-').map(Number);
      const dt = new Date(y, m - 1, d);
      return `${D[dt.getDay()]} ${d} ${M[m - 1]}`;
    };

    const users = [
      { id: 'm1', role: 'manager', name: 'Katrin Vogel',   title: 'Site manager',              username: 'k.vogel',   color: '#2F6FDB' },
      { id: 'm2', role: 'manager', name: 'Stefan Krämer',  title: 'Project manager',           username: 's.kraemer', color: '#7B4FD6' },
      { id: 'w1', role: 'worker',  name: 'Lukas Becker',   title: 'Window & door fitter',      username: 'l.becker',  color: '#C26A12' },
      { id: 'w2', role: 'worker',  name: 'Ayşe Demir',     title: 'Electrician',               username: 'a.demir',   color: '#178A5A' },
      { id: 'w3', role: 'worker',  name: 'Tomasz Nowak',   title: 'Drywall & plastering',      username: 't.nowak',   color: '#B23B5E' },
      { id: 'w4', role: 'worker',  name: 'Jonas Weber',    title: 'Plumber',                   username: 'j.weber',   color: '#1F7EA8' },
      { id: 'w5', role: 'worker',  name: 'Mira Schulz',    title: 'Quality inspector',         username: 'm.schulz',  color: '#8A6A12' },
      { id: 'w6', role: 'worker',  name: 'Emre Yılmaz',    title: 'General site work',         username: 'e.yilmaz',  color: '#5C6670' }
    ];

    const base = (o) => Object.assign({
      category: 'Workmanship', observedUnknown: false, cause: '', causeUnknown: true, hazard: false,
      priority: null, assigneeId: null, helperIds: [], instructions: '', dueDate: null, assignedAt: null,
      completion: null, reworkReason: '', closedAt: null, requests: [], events: []
    }, o);

    const issues = [
      base({
        id: 'SP-1037', title: 'Socket cover missing, wires visible', category: 'Electrical', hazard: true,
        location: { building: 'C', floor: 'Basement', room: 'C-008', detail: 'Storage room, wall left of the door' },
        description: 'The double socket next to the door has no cover plate. Two wire ends are visible and not taped.',
        observedAt: ago(0.5), photo: { type: 'scene', scene: 'socket' },
        reporterId: 'w5', createdAt: ago(0.3), status: 'reported',
        events: [E(0.3, 'w5', 'reported', 'Reported the issue')]
      }),
      base({
        id: 'SP-1035', title: 'Handrail bracket missing', category: 'Safety', hazard: true,
        location: { building: 'A', floor: 'Floor 2', room: 'Staircase 1', detail: 'Between floor 1 and floor 2' },
        description: 'The upper bracket of the handrail is missing. The rail moves about 3 cm when you lean on it.',
        observedAt: ago(1.5), photo: { type: 'scene', scene: 'railing' },
        reporterId: 'w3', createdAt: ago(1.2), status: 'reported',
        events: [E(1.2, 'w3', 'reported', 'Reported the issue')]
      }),
      base({
        id: 'SP-1036', title: 'Bathroom tiles not aligned', category: 'Workmanship',
        location: { building: 'B', floor: 'Floor 2', room: 'B-207', detail: 'Wall behind the bathtub' },
        description: 'Third row of tiles is offset by about 4 mm. The joints don’t line up with the corner.',
        observedAt: ago(5), cause: 'Spacers were probably not used on that row.', causeUnknown: false,
        photo: { type: 'scene', scene: 'tiles' },
        reporterId: 'w4', createdAt: ago(3.5), status: 'reported',
        events: [E(3.5, 'w4', 'reported', 'Reported the issue')]
      }),
      base({
        id: 'SP-1032', title: 'Exposed cables at junction box', category: 'Electrical', hazard: true,
        location: { building: 'A', floor: 'Floor 3', room: 'Stairwell', detail: 'Junction box above the fire door' },
        description: 'Junction box is open and three cables hang out. The box cover is lying on the floor.',
        observedAt: ago(5.5), photo: { type: 'scene', scene: 'cable' },
        reporterId: 'w6', createdAt: ago(5), status: 'assigned',
        priority: 'urgent', assigneeId: 'w2', dueDate: today, assignedAt: ago(4),
        instructions: 'Make it safe first: switch off the circuit and tape off the area. Then close the box and fit the cover. Call me if the cables are damaged.',
        events: [
          E(5, 'w6', 'reported', 'Reported the issue'),
          E(4, 'm1', 'assigned', `Assigned to Ayşe Demir, due ${fmt(today)}`)
        ]
      }),
      base({
        id: 'SP-1031', title: 'Window does not close', category: 'Installation',
        location: { building: 'B', floor: 'Floor 2', room: 'B-204', detail: 'Living room, left window' },
        description: 'The left window sash does not close fully. There is a gap of about 1 cm at the top corner and you can feel a draught.',
        observedAt: ago(28), cause: 'Possibly hit when the scaffolding was taken down.', causeUnknown: false,
        photo: { type: 'scene', scene: 'window' },
        reporterId: 'w5', createdAt: ago(26), status: 'in_progress',
        priority: 'high', assigneeId: 'w1', dueDate: today, assignedAt: ago(24),
        instructions: 'Check both hinges and adjust the window fitting. Replace the hinge if it is bent. Check the seal afterwards.',
        events: [
          E(26, 'w5', 'reported', 'Reported the issue'),
          E(24, 'm1', 'assigned', `Assigned to Lukas Becker, due ${fmt(today)}`),
          E(3, 'w1', 'started', 'Started work'),
          E(2, 'w1', 'note', 'Added an update', 'Top hinge is bent. Picking up a replacement hinge from the site container.')
        ]
      }),
      base({
        id: 'SP-1038', title: 'Balcony door seal damaged', category: 'Damage',
        location: { building: 'B', floor: 'Floor 2', room: 'B-210', detail: 'Balcony door, bottom edge' },
        description: 'The rubber seal at the bottom of the balcony door is torn over about 20 cm.',
        observedAt: ago(22), photo: { type: 'scene', scene: 'door' },
        reporterId: 'w2', createdAt: ago(20), status: 'assigned',
        priority: 'normal', assigneeId: 'w1', dueDate: day(3), assignedAt: ago(18),
        instructions: 'Replace the bottom seal on the balcony door. The seal profile is in container 2, shelf C.',
        events: [
          E(20, 'w2', 'reported', 'Reported the issue'),
          E(18, 'm1', 'assigned', `Assigned to Lukas Becker, due ${fmt(day(3))}`)
        ]
      }),
      base({
        id: 'SP-1034', title: 'Water leak under kitchen sink', category: 'Plumbing',
        location: { building: 'B', floor: 'Floor 3', room: 'B-301', detail: 'Kitchen, cabinet under the sink' },
        description: 'Water is dripping from the siphon connection. There is a puddle in the cabinet and the base panel is swelling.',
        observedAt: ago(52), photo: { type: 'scene', scene: 'leak' },
        reporterId: 'w5', createdAt: ago(50), status: 'in_progress',
        priority: 'high', assigneeId: 'w4', dueDate: day(-1), assignedAt: ago(48),
        instructions: 'Find the leak and replace the siphon or seal. Dry out the cabinet and tell me if the base panel needs replacing.',
        requests: [
          { id: 'r1', type: 'time', by: 'w4', at: ago(6), status: 'pending', proposedDate: day(2),
            reason: 'The supplier can only deliver the replacement siphon in two days. The water is shut off at the valve until then.' }
        ],
        events: [
          E(50, 'w5', 'reported', 'Reported the issue'),
          E(48, 'm1', 'assigned', `Assigned to Jonas Weber, due ${fmt(day(-1))}`),
          E(30, 'w4', 'started', 'Started work'),
          E(29, 'w4', 'note', 'Added an update', 'Siphon is cracked. Ordered a new one. Water shut off at the angle valve.'),
          E(6, 'w4', 'request', `Asked for more time, until ${fmt(day(2))}`, 'The supplier can only deliver the replacement siphon in two days. The water is shut off at the valve until then.')
        ]
      }),
      base({
        id: 'SP-1040', title: 'Radiator not heating', category: 'Plumbing',
        location: { building: 'C', floor: 'Floor 2', room: 'C-215', detail: 'Bedroom, under the window' },
        description: 'Radiator stays cold even with the valve fully open. The radiators in the other rooms work.',
        observedAt: ago(32), cause: 'Probably air or dirt in the radiator.', causeUnknown: false,
        photo: { type: 'scene', scene: 'radiator' },
        reporterId: 'w1', createdAt: ago(30), status: 'in_progress',
        priority: 'normal', assigneeId: 'w4', dueDate: day(2), assignedAt: ago(27),
        instructions: 'Bleed the radiator and check the valve. If that doesn’t help, take it off and flush it.',
        requests: [
          { id: 'r2', type: 'workers', by: 'w4', at: ago(2), status: 'pending', count: 1, trade: 'Plumber',
            reason: 'Bleeding didn’t help. The radiator has to come off the wall to be flushed. I need a second person to lift and hold it.' }
        ],
        events: [
          E(30, 'w1', 'reported', 'Reported the issue'),
          E(27, 'm1', 'assigned', `Assigned to Jonas Weber, due ${fmt(day(2))}`),
          E(8, 'w4', 'started', 'Started work'),
          E(2, 'w4', 'request', 'Asked for 1 more person (Plumber)', 'Bleeding didn’t help. The radiator has to come off the wall to be flushed. I need a second person to lift and hold it.')
        ]
      }),
      base({
        id: 'SP-1043', title: 'Gap in insulation at window reveal', category: 'Workmanship',
        location: { building: 'C', floor: 'Floor 3', room: 'C-310', detail: 'Right side of the window, inside' },
        description: 'There is a gap of about 2 cm between the window frame and the wall. You can see the outside insulation board.',
        observedAt: ago(46), photo: { type: 'scene', scene: 'insulation' },
        reporterId: 'w5', createdAt: ago(45), status: 'in_progress',
        priority: 'normal', assigneeId: 'w6', helperIds: ['w3'], dueDate: day(1), assignedAt: ago(42),
        instructions: 'Fill the gap with expanding foam, cut it flush and fit the sealing tape. Tomasz will help with the plaster afterwards.',
        requests: [
          { id: 'r3', type: 'workers', by: 'w6', at: ago(28), status: 'approved', count: 1, trade: 'Plasterer',
            reason: 'The reveal needs to be plastered again after the foam. I can’t do the plaster myself.',
            response: 'Tomasz will join you tomorrow morning.', resolvedAt: ago(20), resolvedBy: 'm1' }
        ],
        events: [
          E(45, 'w5', 'reported', 'Reported the issue'),
          E(42, 'm1', 'assigned', `Assigned to Emre Yılmaz, due ${fmt(day(1))}`),
          E(30, 'w6', 'started', 'Started work'),
          E(28, 'w6', 'request', 'Asked for 1 more person (Plasterer)', 'The reveal needs to be plastered again after the foam. I can’t do the plaster myself.'),
          E(20, 'm1', 'request_approved', 'Added Tomasz Nowak to the task', 'Tomasz will join you tomorrow morning.')
        ]
      }),
      base({
        id: 'SP-1033', title: 'Crack in drywall above door', category: 'Workmanship',
        location: { building: 'C', floor: 'Floor 1', room: 'C-112', detail: 'Hallway, above the bathroom door' },
        description: 'Diagonal crack about 30 cm long starting at the top right corner of the door frame.',
        observedAt: ago(76), cause: 'Board joint at the corner of the door opening.', causeUnknown: false,
        photo: { type: 'scene', scene: 'crack' },
        reporterId: 'w1', createdAt: ago(74), status: 'review',
        priority: 'normal', assigneeId: 'w3', dueDate: day(1), assignedAt: ago(70),
        instructions: 'Open up the crack, tape and fill it. Leave it ready for painting.',
        completion: { note: 'Opened the crack, taped it with mesh and filled it twice. Sanded smooth. Ready for paint.', photo: null, at: ago(1.5), by: 'w3' },
        events: [
          E(74, 'w1', 'reported', 'Reported the issue'),
          E(70, 'm1', 'assigned', `Assigned to Tomasz Nowak, due ${fmt(day(1))}`),
          E(30, 'w3', 'started', 'Started work'),
          E(1.5, 'w3', 'review', 'Marked the work as done and sent it for review', 'Opened the crack, taped it with mesh and filled it twice. Sanded smooth. Ready for paint.')
        ]
      }),
      base({
        id: 'SP-1039', title: 'Paint scuffs in corridor', category: 'Damage',
        location: { building: 'A', floor: 'Ground floor', room: 'Corridor A-0', detail: 'Next to the lift door' },
        description: 'Dark scuff marks on the freshly painted wall, probably from a trolley. About 1 m long.',
        observedAt: ago(98), photo: { type: 'scene', scene: 'paint' },
        reporterId: 'w6', createdAt: ago(96), status: 'rework',
        priority: 'low', assigneeId: 'w3', dueDate: day(1), assignedAt: ago(90),
        instructions: 'Clean and touch up the paint. Use the colour from the A-0 bucket in container 1.',
        completion: { note: 'Cleaned the wall and touched up the paint.', photo: null, at: ago(28), by: 'w3' },
        reworkReason: 'The scuff next to the lift door is still visible. Please repaint the whole panel, not just touch it up.',
        events: [
          E(96, 'w6', 'reported', 'Reported the issue'),
          E(90, 'm1', 'assigned', `Assigned to Tomasz Nowak, due ${fmt(day(1))}`),
          E(70, 'w3', 'started', 'Started work'),
          E(28, 'w3', 'review', 'Marked the work as done and sent it for review', 'Cleaned the wall and touched up the paint.'),
          E(4, 'm1', 'returned', 'Sent back for rework', 'The scuff next to the lift door is still visible. Please repaint the whole panel, not just touch it up.')
        ]
      }),
      base({
        id: 'SP-1041', title: 'Ceiling light flickering', category: 'Electrical',
        location: { building: 'A', floor: 'Floor 1', room: 'A-105', detail: 'Kitchen ceiling light' },
        description: 'The ceiling light flickers every few seconds when switched on.',
        observedAt: ago(142), photo: { type: 'scene', scene: 'light' },
        reporterId: 'w5', createdAt: ago(140), status: 'closed',
        priority: 'normal', assigneeId: 'w2', dueDate: day(-3), assignedAt: ago(130),
        instructions: 'Check the connection in the ceiling box and the lamp.',
        completion: { note: 'Loose terminal in the ceiling box. Tightened it and tested for 10 minutes. No more flicker.', photo: null, at: ago(80), by: 'w2' },
        closedAt: ago(60),
        events: [
          E(140, 'w5', 'reported', 'Reported the issue'),
          E(130, 'm1', 'assigned', `Assigned to Ayşe Demir, due ${fmt(day(-3))}`),
          E(100, 'w2', 'started', 'Started work'),
          E(80, 'w2', 'review', 'Marked the work as done and sent it for review', 'Loose terminal in the ceiling box. Tightened it and tested for 10 minutes. No more flicker.'),
          E(60, 'm1', 'closed', 'Checked the work and closed the issue', 'Checked on site, works fine.')
        ]
      }),
      base({
        id: 'SP-1042', title: 'Door frame scratched', category: 'Damage',
        location: { building: 'B', floor: 'Floor 1', room: 'B-102', detail: 'Apartment entrance door' },
        description: 'Deep scratches on the right side of the door frame at handle height.',
        observedAt: ago(172), photo: { type: 'scene', scene: 'door' },
        reporterId: 'w3', createdAt: ago(170), status: 'closed',
        priority: 'low', assigneeId: 'w1', dueDate: day(-4), assignedAt: ago(160),
        instructions: 'Fill and repaint the frame. Replace the frame cladding if the scratches are too deep.',
        completion: { note: 'Filled, sanded and painted the frame. Scratches no longer visible.', photo: null, at: ago(120), by: 'w1' },
        closedAt: ago(100),
        events: [
          E(170, 'w3', 'reported', 'Reported the issue'),
          E(160, 'm1', 'assigned', `Assigned to Lukas Becker, due ${fmt(day(-4))}`),
          E(140, 'w1', 'started', 'Started work'),
          E(120, 'w1', 'review', 'Marked the work as done and sent it for review', 'Filled, sanded and painted the frame. Scratches no longer visible.'),
          E(100, 'm1', 'closed', 'Checked the work and closed the issue')
        ]
      })
    ];

    return {
      version: 1,
      project: {
        name: 'Wohnpark Ruhrblick',
        code: 'WPR-26',
        address: 'Fictional site · Bochum',
        buildings: ['A', 'B', 'C'],
        floors: ['Basement', 'Ground floor', 'Floor 1', 'Floor 2', 'Floor 3', 'Floor 4', 'Roof']
      },
      users,
      issues,
      nextIssueNo: 1044,
      nextId: 100,
      session: { userId: null },
      seededAt: now.toISOString()
    };
  };
});
