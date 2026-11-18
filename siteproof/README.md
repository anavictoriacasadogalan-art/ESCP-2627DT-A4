# SiteProof

SiteProof is a course prototype for communicating construction-site defects through one traceable workflow:

**Report → assign → progress → review → close**

> **Course prototype** · ESCP Bachelor in Management, Digital Product Design.  
> The app uses fictional people, issues and locations. Authentication is simulated. No external APIs or real project data are used.

## Run the app

From the `siteproof/` folder, install the dependencies and start the Vite development server:

```bash
npm install
npm run dev
```

Open the local URL shown in the terminal, normally:

```text
http://localhost:5173
```

Useful commands:

```bash
npm run build          # Type-check and create the production build in dist/
npm run preview        # Preview the production build locally
npm test               # Run the Vitest test suite
npm run storybook      # Open the component catalogue at localhost:6006
npm run build-storybook # Create the static Storybook build
```

Node.js 18 or newer is required. The committed `package-lock.json` keeps dependency versions reproducible.

## Demo walkthrough

The current prototype opens with fictional defect records so the workflow is immediately visible.

1. Review the **Manager dashboard** and the three demo issues.
2. Use **Switch to worker** to view the worker version.
3. Use **Advance workflow** on an issue to demonstrate the status progression:
   `New → Assigned → In progress → Ready for review → Closed`.
4. Use **Approve and close** when an issue is ready for manager review.
5. Enter a title in **Report a defect** and select **Submit report** to add a new fictional issue.
6. Switch between manager and worker views to demonstrate the two role-based experiences.

The current implementation is intentionally a compact functional prototype. It demonstrates the central interaction model rather than a production construction-management system.

## Screens and components

| Area | Purpose |
|---|---|
| Manager dashboard | View demo issues, statuses, locations and assignees. |
| Worker view | Demonstrate the worker-facing role and workflow actions. |
| Report a defect | Add a new fictional issue with a title. |
| Issue list | Advance an issue through the prototype status flow. |
| Storybook | Review reusable Button and StatusBadge component stories. |

## Project structure

```text
siteproof/
├── index.html
├── package.json
├── package-lock.json
├── vite.config.ts
├── tsconfig.json
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── styles.css
│   └── vite-env.d.ts
├── stories/
│   ├── Button.stories.tsx
│   └── StatusBadge.stories.tsx
└── .storybook/
    ├── main.ts
    └── preview.ts
```

## Technical approach

- **React + ReactDOM:** component-based interface and role switching.
- **TypeScript:** typed status values and component props.
- **Vite:** local development server and production build.
- **Plain CSS:** responsive layout and SiteProof visual tokens without external fonts or CDNs.
- **Storybook:** component catalogue for the reusable interface states.
- **Vitest:** automated test runner configured for the project.

The prototype intentionally has no backend, real authentication, external API, notifications, BIM integration, or cross-device synchronization. It is designed for local demonstration with fictional data.

## Limitations and next steps

- Demo issue state currently lives in React state and resets when the page reloads.
- The current report form is intentionally minimal; richer photo and context fields can be added from `product.md`.
- More Storybook stories can be added for forms, filters, deadlines, history and review panels.
- A public deployment can be added later using the Vite production build.

