# SiteProof — Architecture

| | |
|---|---|
| **Product** | SiteProof: construction-site issue communication web app |
| **Course** | ESCP Digital Product Design, 2026–2027 |
| **Repository** | `ESCP-2627DT-A4` |
| **Status** | Functional browser prototype using fictional data |
| **Source of product truth** | `product.md`, supported by `design.md` and `evidence.md` |
| **Audience** | Project team, course reviewers, and agents building the prototype |

> **In one sentence:** SiteProof is a React and TypeScript web app built with Vite that stores fictional defect records in one browser and demonstrates the hand-off: **report → assign → progress → review → close**.

## 1. Purpose, scope and constraints

This document explains how the SiteProof prototype is built. It complements `product.md`, which defines what the product does, and `design.md`, which defines the proposed interface and component states.

The architecture respects these constraints:

| Constraint | Architectural consequence |
|---|---|
| Functional web prototype | The repository contains a directly runnable browser app. |
| No external APIs or backend | No `fetch` calls, database, authentication service, analytics, CDN, or server-side application logic. |
| Fictional data only | Users, issues, locations and images are demo data stored in code. |
| Runs locally | Node.js is used only to serve the files, run tests and create the optional bundled file. |
| Same-browser role switching | Worker and manager views read the same `localStorage` issue dataset. Login is simulated. |
| Small and understandable | React components and a small local state model keep the prototype easy to inspect. |

The prototype does not provide real authentication, production authorization, cross-device synchronization, notifications, BIM integration, legal acceptance, or emergency reporting.

## 2. Technology stack

| Layer | Choice | Purpose |
|---|---|---|
| UI | React + ReactDOM | Component rendering and role-based screens. |
| Language | TypeScript | Typed issue statuses, props and workflow data. |
| Build tool | Vite | Development server and production build. |
| Styling | Plain CSS | Responsive layout, design tokens, cards, forms and status cues. |
| Persistence | `localStorage` | Keeps fictional issues after refresh in the same browser. |
| Active user | `sessionStorage` | Keeps the selected demo identity for the current tab. |
| Local tooling | Node.js 18+ and npm | Installs dependencies and runs the app, tests and Storybook. |
| Tests | Vitest | Checks the component and workflow code. |
| Component catalogue | Storybook 8.6 | Documents reusable UI components and their states. |

The current implementation does not use a backend, authentication service, external API, or web-font CDN. Storybook is configured under `.storybook/` and currently includes button and status-badge stories.

## 3. Repository structure

The prototype lives in the `siteproof/` folder of the GitHub repository:

```text
siteproof/
├── README.md                         # How to run and demonstrate the prototype
├── index.html                        # Vite browser entry point
├── package.json                      # App, test and Storybook commands
├── package-lock.json                 # Locked dependency versions
├── vite.config.ts                    # Vite + React configuration
├── tsconfig.json                     # TypeScript configuration
├── src/
│   ├── main.tsx                      # Mounts the React app
│   ├── App.tsx                       # Prototype screens and workflow
│   ├── styles.css                    # Responsive UI styles
│   └── components/                   # Reusable components
├── stories/
│   ├── Button.stories.tsx            # Button catalogue stories
│   └── StatusBadge.stories.tsx       # All product status stories
└── .storybook/
    ├── main.ts                      # Storybook configuration
    └── preview.ts                    # Shared Storybook styles/settings
```

## 4. Runtime and data flow

```mermaid
flowchart TB
  A["index.html"] --> B["app.js"]
  B --> C["store.js"]
  C --> D[("localStorage")]
  B --> E["styles.css"]
  B --> F["seed.js + scenes.js"]
```

`index.html` provides the Vite mount point. `main.tsx` mounts `App.tsx`, which renders the screens and applies the workflow actions. The current prototype keeps demo state in React state; persistence can be added through a dedicated storage module as the workflow expands.

The browser is the only runtime. Opening the app in another browser or device creates a separate dataset.

## 5. Users and screens

The app uses simulated sign-in. Any password is accepted because this is not authentication.

### Worker experience

- **My work:** shows reports created by the worker and tasks assigned to the worker.
- **Report an issue:** captures title, type, location and description, with optional photo and cause.
- **Issue detail:** shows the original report, assignment, deadline, history and worker actions.

### Manager experience

- **Manager dashboard:** shows all fictional issues and their status, assignee and deadline.
- **Issue detail:** shows the original report and allows assignment, review, closure or rework.

Both roles can report defects in the product concept. Only the manager can assign responsibility, change the deadline, approve closure, or send work back.

## 6. Data model

Each issue contains:

```text
id              Readable identifier such as SP-0004
title           Short issue title
type            Damage, workmanship, installation or safety
location        Fictional building/floor/room context
description     What was observed
reportedBy      Demo user ID
assignee        Demo worker ID or null
status          New, Assigned, In progress, Ready for review, Rework needed, Closed
deadline        ISO date or null
photo           Fictional scene key
completionNote  Worker’s repair note, when submitted
history         Timestamped activity entries
```

The original report fields are retained in the issue history. A manager’s closure is an internal demo decision, not formal engineering or legal acceptance.

## 7. Workflow and status rules

```mermaid
stateDiagram-v2
  [*] --> New: Worker reports
  New --> Assigned: Manager assigns worker and deadline
  Assigned --> "In progress": Worker starts work
  "In progress" --> "Ready for review": Worker submits completion note
  "Ready for review" --> Closed: Manager approves
  "Ready for review" --> "Rework needed": Manager requests more work
  "Rework needed" --> "In progress": Worker starts again
```

“Overdue” is a flag for an open issue whose deadline has passed; it is not a status. The app keeps a visible activity history for reporting, assignment, progress, review and closure actions.

## 8. Persistence and limitations

- `localStorage` stores the fictional issue list and survives refreshes in the same browser profile.
- `sessionStorage` stores the selected demo user for the current tab.
- Browser storage is not a server and does not synchronize between devices.
- Large photos may exceed browser storage limits; demo images are lightweight illustrations.
- Reset demo data removes the local demo dataset and restores the seed issues.
- Anyone using the browser can select any demo user; this is not real security.

## 9. Accessibility and responsive design

The CSS uses a mobile-first layout, visible labels, readable status text, visible keyboard focus, and touch-friendly controls. Status is communicated with text as well as colour. Images have alt text, and form validation displays an explanatory message.

Before submission, manually check the app on a phone-width viewport and a desktop-width viewport, complete the workflow with the keyboard, refresh after changes, and confirm that only fictional data is used.

## 10. How to run

From the `siteproof/` folder:

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in a browser. The app can also be opened directly through `index.html`, although a local server is recommended.

Run the tests:

```bash
npm test
```

Build the app:

```bash
npm run build
```

The build output is `dist/`. Start the component catalogue with `npm run storybook`, or build it with `npm run build-storybook`.

## 11. Requirement traceability

| Product need | Prototype implementation |
|---|---|
| Report a defect | Worker report form in `app.js` |
| Record site context | Location field and fictional project data |
| Manager inbox | Manager dashboard |
| Assign responsibility and deadline | Manager assignment form |
| Track progress | Start work and status transitions |
| Submit completion | Worker completion note and review status |
| Verify or request more work | Manager close/rework actions |
| Traceable history | Issue history entries in `store.js` |
| Persistence | `localStorage` through the store |

