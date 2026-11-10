# SiteProof

SiteProof is a simple web app for **communicating construction-site problems**.
Workers report an issue with a photo, the site manager assigns someone and sets a deadline, the worker updates progress or asks for help, and the manager checks the work and closes it.

> **Course prototype** · ESCP Bachelor in Management, Digital Product Design (Dr. David M. Lehmann).
> No APIs, no server, no real data. Every person, issue and photo is fictional. Login is simulated.

---

## Run it

You only need a web browser. There is nothing to install.

**Option 1: open the file**
Double-click `index.html`, or open `dist/siteproof.html` (everything in one file).

**Option 2: local web server** (recommended, needs [Node.js](https://nodejs.org) 18+)

```bash
npm start          # serves the app at http://localhost:5173
```

**Other commands**

```bash
npm test           # runs the workflow tests (Node's built-in test runner, no dependencies)
npm run build      # bundles everything into dist/siteproof.html
```

---

## Demo walkthrough (about 3 minutes)

Demo accounts are listed on the sign-in screen. Tap one and press **Sign in**. Any password works.

| Role | Username | Who |
|---|---|---|
| Manager | `k.vogel` | Katrin Vogel, site manager |
| Manager | `s.kraemer` | Stefan Krämer, project manager |
| Worker | `l.becker` | Lukas Becker, window & door fitter |
| Worker | `a.demir` | Ayşe Demir, electrician |
| Worker | `t.nowak` | Tomasz Nowak, drywall & plastering |
| Worker | `j.weber` | Jonas Weber, plumber |
| Worker | `m.schulz` | Mira Schulz, quality inspector |
| Worker | `e.yilmaz` | Emre Yılmaz, general site work |

1. **Worker reports an issue.** Sign in as `l.becker`. Tap **Report an issue**, add a photo, location and what happened, then send it.
2. **Manager assigns it.** Open the account menu (top right) → **Switch user**, then sign in as manager `k.vogel`. The new report is at the top of **Needs your decision**. Open it, choose a worker, a deadline and instructions, then press **Assign**.
3. **Worker works on it.** Switch to the worker you chose. The task is in **Today’s tasks** or **Coming up**. Press **Start work**, add an update, or use **Need more time** / **Need more workers**.
4. **Manager follows up.** Switch back to `k.vogel`. Requests appear in **Needs your decision**. Approve a new deadline or add a helper.
5. **Worker finishes.** The worker presses **Mark as done** and writes what they did.
6. **Manager checks.** The manager opens the issue and chooses **Approve and close** or **Send back for rework** (with a reason).

The demo already contains 13 issues in every state (new, assigned, in progress, overdue, ready for review, rework, closed) and two open requests, so every screen has something to show.

**Reset the demo:** account menu → **Reset demo data**.

---

## Screens

| Screen | Who | What it does |
|---|---|---|
| Sign in | Everyone | Choose Worker or Manager, pick a demo account |
| Worker dashboard | Worker | Today’s tasks, deadlines, overdue count, big **Report an issue** button, status of my reports |
| Report an issue | Worker | Photo (camera or upload), title, type, building/floor/room, what happened, when first noticed (or “Not sure”), likely cause (or “I don’t know”), safety risk |
| Task detail | Worker | Manager’s instructions, photo, deadline, team; **Start work**, **Add update**, **Mark as done**, **Need more time**, **Need more workers** |
| Manager dashboard | Manager | Counts, **Needs your decision** list, crew workload, all issues with filters and search |
| Issue detail: assign | Manager | Original report and photo; choose worker, priority, deadline, instructions |
| Issue detail: follow-up | Manager | Status, answer time/help requests, check completed work, close or send back, change worker/deadline |

### Rules built into the app

- Workers only see tasks **assigned to them** (as responsible person or helper) and the status of issues **they reported**. They don’t see other people’s issues.
- Requests for more time or more workers go **to the manager**, never directly to other workers. Only the manager changes a deadline or adds people.
- “Mark as done” sends work **for review**. Only the manager can **close** an issue.
- The original report is never overwritten. Every step is logged in the activity history.

### Statuses

`New` → `Assigned` → `In progress` → `Ready for review` → `Closed`
If the manager sends work back: `Ready for review` → `Rework needed` → `In progress` → …
“Overdue” is shown when the deadline has passed on an open task.

---

## How it’s built

- Plain HTML, CSS and JavaScript. No framework, no build step needed to run.
- All data is kept in the browser’s `localStorage` (key `siteproof.demo.v1`). Refreshing keeps your changes.
- Role switching happens in the same browser. There is **no real authentication** and **no syncing between devices**; a real product would need a backend for that.
- Photos are resized in the browser before saving. Demo photos are drawn illustrations (SVG), not real site photos.
- Fonts load from Google Fonts. Without internet the app falls back to system fonts and still works.

```
index.html               app shell
css/styles.css           design tokens (light + dark) and components
js/store.js              data model, status rules, local storage
js/seed.js               fictional demo people, project and issues
js/scenes.js             illustrated stand-in photos
js/app.js                screens and interactions
tests/workflow.test.js   tests for the full workflow and forbidden steps
scripts/build-single-file.mjs   bundles everything into dist/siteproof.html
```

## Limitations

- Data lives in one browser only. Another phone or computer won’t see it.
- Large photos may not fit in browser storage; the app warns you if it can’t save.
- Some phones save photos as HEIC, which some browsers can’t open. Use JPG or PNG.
- No notifications, offline sync, multiple projects or real user accounts. These are out of scope for the course prototype.
