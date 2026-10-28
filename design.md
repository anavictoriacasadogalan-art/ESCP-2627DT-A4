# Guillermo — Design System

> Status: Documentation draft for group review. No interface or Storybook has been built. Repository publication authorized by the group; implementation remains subject to review.
> Basis: the supplied `product (3).md`, the supplied evidence PDF, and the group's confirmed workflow.

## 1. Design purpose

Guillermo helps construction teams keep defect reports, responsibility, deadlines, and repair updates together. The interface should make reporting straightforward on site and make follow-up clear in the office.

There are two experiences:

- **Manager:** site manager, quality inspector, or supervisor reviewing reports, assigning work, setting deadlines, and verifying repairs.
- **Worker / contractor:** a reporting worker, subcontractor, or foreman who reports defects and acts on assigned work.

An assignee uses the worker/contractor experience; there is no third interface. Both experiences support phones and computers. As confirmed by the group, both managers and contractors can report defects; only managers assign responsibility and deadlines.

## 2. Principles and research connection

| Principle | Interface response | Basis |
|---|---|---|
| Keep information together | One detail page contains the report, photos, assignment, deadline, updates, and history | Product requirements; architect feedback about WhatsApp, photos, and inconsistent Excel records |
| Make the issue understandable | Prominent photo, title, description, and readable location | Product reporting requirements; theme in supplied evidence |
| Keep reporting simple | Short labelled sections and explicit “Unknown” options for cause/how/why | Product requirements |
| Make responsibility visible | Show assignee and target date beside status | Product requirements |
| Separate completion from verification | “Resolved — awaiting manager review” differs from “Closed — verified by manager” | Product status and verification requirements |
| Reduce adoption friction | Browser-based demo with a role selector and no app installation | Proposed prototype response; adoption statements in supplied evidence require provenance confirmation |

The supplied interview accounts suggest useful design questions, but their real/simulated provenance is unresolved. They do not establish measured time savings, adoption, or willingness to pay.

## 3. Proposed visual system

The proposed appearance is practical and uncluttered: white surfaces, a light grey background, dark navy text, and teal primary actions. This visual direction is a proposal, not a group-approved decision.

| Element | Proposed specification |
|---|---|
| App name | Guillermo |
| Typeface | System sans-serif, available locally |
| Body text | 16px minimum starting size, with comfortable line spacing |
| Headings | Clear hierarchy: page title, section title, field label |
| Main text | `#172033` |
| Supporting text | `#475569` |
| Background / surface | `#F4F6F8` / `#FFFFFF` |
| Primary action | `#0F766E` with white text |
| Error emphasis | `#B91C1C` with explanatory text |
| Focus indicator | Visible blue outline, `#1D4ED8` |
| Spacing | 4, 8, 12, 16, 24, and 32px |
| Corners | 8px controls, 12px cards |
| Touch targets | Aim for at least 44 × 44px |

Actual color combinations must be checked for contrast during implementation. Do not use color alone to communicate state or priority. Avoid remote fonts and decorative imagery that add runtime dependencies.

## 4. Status language

Use the product document's five statuses consistently.

| Status | User-facing explanation | Suggested cue |
|---|---|---|
| New | Report received; awaiting assignment | Neutral label |
| Assigned | Responsible person and deadline selected | Blue label |
| In progress | Corrective work has started | Blue label with progress icon |
| Resolved | Repair submitted; awaiting manager review | Amber label |
| Closed | Manager has verified the repair | Green label |

“Overdue” is an additional flag, not a status. Display it for an unclosed defect whose deadline has passed, including a Resolved defect still awaiting review. Show the exact deadline alongside the flag.

When the manager requests more work, return the defect to **In progress** and add a **Reopened** event with the reason in the history. Do not add a sixth status. “Closed” indicates an internal workflow decision, not formal legal acceptance of construction work.

## 5. Screens and layout

| ID | Screen | Main contents | Main actions |
|---|---|---|---|
| S00 | Demo entry | Demo notice, project name, fictional role/person choices | Enter or switch demo role |
| S01 | Worker workspace | My reports and My assigned work, with status and deadline | Report defect; open report or task |
| S02 | Report defect | Photo, title, description, explanation, time noticed, suspected cause, how/why details, site and optional location | Submit; cancel |
| S03 | Defect details | Original report, assignment, deadline, status, repair updates, evidence, chronological history | Role-appropriate progress, assignment, or review actions |
| S04 | Manager dashboard | New, active, resolved-awaiting-review, closed, and overdue summaries; defect list | Report defect; filter; open record |
| S05 | Assignment controls | Responsible person and deadline | Assign; change deadline |
| S06 | Repair submission | Original issue summary, completion demo photo, completion note | Submit repair for review |
| S07 | Manager review | Original report and completion evidence, previous updates | Verify and close; request more work |

Assignment and review can be panels within the detail page rather than separate full pages. Keep the same information hierarchy across devices.

### Reporting form

Group fields into three sections:

1. **What and where:** photo, short title, description, selected site, optional detailed location.
2. **What you know:** explanation, when noticed, suspected cause, how/why details. Allow “Unknown” for cause and how/why; do not force guesses.
3. **Review and submit:** show a concise summary and confirmation after successful saving.

Label a suspected cause as **Suspected cause — not confirmed**. Use helper text to distinguish the brief description from the fuller explanation. The single demo project is preselected; it remains visible so the site association is clear.

### Dashboard and task layouts

On phones, use a single-column list of cards. Each card shows title, status, location when supplied, assignee, and deadline. On computers, use a readable list/table with the same information.

Manager filters cover site, status, assignee, and deadline, including overdue. In a one-project demo the site filter contains one project; do not imply a multi-project workflow has been demonstrated.

Show original and completion photos side by side on wider screens and stacked on phones. Always display a clear back route and preserve entered text after validation errors.

## 6. Components and Storybook

The workshop requires a design system including Storybook. The later implementation must supply a runnable component catalogue using the app's actual reusable components.

| Component | Stories to include |
|---|---|
| Button | Primary, secondary, disabled, focus, saving |
| TextField / TextArea / DateField / Select | Empty, filled, required error, help text |
| UnknownOption | Unknown selected; details supplied |
| StatusBadge | All five product statuses |
| DeadlineLabel | No deadline, future, today, overdue, closed past deadline |
| DefectCard / DefectTable | New, assigned, resolved, long text, missing optional location |
| FilterBar | Active filters, clear filters, no matching reports |
| PhotoField | Demo photo selected, missing required photo, local demo-file preview, invalid file |
| EvidenceComparison | Original only, original plus repair, multiple repair attempts |
| AssignmentPanel | Unassigned, assigned, valid/invalid deadline change |
| HistoryTimeline | Report, assignment, deadline change, progress, repair submission, reopen reason, closure |
| FeedbackBanner | Success, validation error, storage failure, demo notice |
| ConfirmationDialog | Reset confirmation and cancellation |

## 7. Accessibility and feedback

- Visible labels, keyboard access, visible focus, and meaningful control names.
- Photo descriptions and readable status text alongside icons/color.
- Errors linked to the relevant fields; preserve inputs and explain how to correct them.
- Explicit save success only after persistence succeeds.
- Empty states distinguish “No reports yet” from “No reports match your filters.”
- Reopen feedback is visible to the assigned contractor.
- Dialogs manage focus and return it to the initiating control.
- The demo notice states that identities, records, and images are fictional and access control is simulated.

## 8. Design validation planned

During prototype building, complete the report-to-closure journey on phone and desktop layouts, inspect keyboard navigation and contrast, and review all component states in Storybook. These checks have not been run. Full offline operation, real notification delivery, and production authentication are outside the workshop prototype.
