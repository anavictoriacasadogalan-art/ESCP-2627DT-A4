# Guillermo

**Construction defect communication, from report to verified closure.**

> Documentation draft for group review. The prototype is not built. The group has authorized publishing evidence.md, design.md, and this README; prototype implementation is not yet authorized.

## 1. Product overview

Guillermo is a proposed mobile-friendly web tool for construction teams to report defects, understand the issue, establish responsibility, follow deadlines, and document resolution in one place.

Both managers and workers/contractors can report a defect. The manager reviews reports, selects a responsible person, and sets a deadline. The assignee updates progress and submits the repair. The manager checks the result and closes the record or requests further work.

## 2. Users

| Experience | Users | Main actions |
|---|---|---|
| Manager | Site manager, supervisor, or quality inspector | Report, review, assign, monitor, verify, and close |
| Worker / contractor | Construction worker, subcontractor, or foreman | Report defects, view own reports and assignments, update progress, submit repairs |

The responsible person uses the worker/contractor experience; there is no separate third interface. Both experiences are intended for phones on site and computers in the office.

## 3. Documentation

| Document | Purpose |
|---|---|
| Supplied `product (3).md` | Product scope, reporting fields, requirements FR-01–FR-09, statuses, and acceptance scenario |
| `evidence.md` | Markdown transcription of the supplied evidence PDF, preserving its wording; research provenance needs confirmation |
| `design.md` | Proposed interface, design tokens, screens, component states, and Storybook plan |
| Existing `architecture.md` | Separately added technical document, preserved unchanged; see the consistency note below |
| `README.md` | Overview, project status, demonstration plan, and eventual operating instructions |

These revised documents follow the newly supplied product document rather than the earlier generated product draft. The app name is Guillermo. Any remaining SiteProof references in source material are an older name, not a second product.

Before final submission, the workshop requires a final `product.md` organized around Strategy, Scope, Structure, and Skeleton, and an `evidence.md` containing research and key insights. The supplied product currently uses a different heading structure, and the supplied evidence PDF has now been transcribed into evidence.md. The product heading structure and the evidence provenance/key-insight synthesis still need review. This publication does not rewrite the product or add research findings to the supplied evidence.

## 4. Research status

The group reported one Zoom conversation with an architect, attended by all group members. According to the group's recollection, the architect mainly uses WhatsApp and photos, sometimes Excel, and has difficulty keeping records precise and updated. The date has not been supplied; this is a paraphrase, not a verbatim quotation.

The newly supplied evidence PDF includes four stakeholder accounts that closely match the earlier AI-simulated interview material. It no longer states whether they are simulated. Until the group confirms their provenance, treat them as unverified research material, not four confirmed real interviews. Specific delays, quotes, adoption conditions, and willingness-to-pay statements must not be presented as validated findings on that basis.

## 5. Workshop prototype scope

- One fictional apartment-building project with demo people, locations, defects, and images.
- Two role-based experiences, including reporting by either role.
- Reporting includes photo, description, explanation, when noticed, suspected cause, and how/why details; Unknown is allowed where the product specifies it.
- Manager assignment and deadline changes, progress updates, completion evidence, and manager review.
- Defect history and filters by site, status, assignee, and deadline, including overdue items.
- No external APIs and no real project data, as required by the workshop.

Statuses are **New → Assigned → In progress → Resolved → Closed**. Resolved means submitted for manager review; Closed means reviewed and verified. Requests for further work return the defect to In progress with a recorded reason.

The documentation draft proposed React, TypeScript, Vite, CSS, Storybook, and browser-local IndexedDB storage. These choices await reconciliation with the existing architecture.md, which uses SiteProof naming, a different product handoff, and localStorage. The architecture file is preserved unchanged in this publication; do not treat these documents as a reconciled build specification yet. Real sign-in, production authorization, cross-device sharing, notifications, BIM integration, and full offline synchronization are outside this prototype.

## 6. Planned demonstration

1. Select the fictional worker/contractor identity for the demo project.
2. Report a cracked tile using a demo photo, title, explanation, noticed time, and location; use Unknown where appropriate.
3. Switch to the manager. Confirm the New report appears without re-entering information.
4. Assign the fictional foreman and a deadline.
5. Switch to that foreman, start work, and submit completion evidence and a note. Status becomes Resolved.
6. Switch to the manager, review the original and completion evidence, and close the defect.
7. Demonstrate the alternative: request further work with a reason, resubmit, and close after review.
8. Inspect the history, change a deadline on another active record, and demonstrate filters, refresh persistence, and confirmed reset.

Role switching represents different people using the same browser dataset. It is not a demonstration of live multi-user synchronization. Closure is an internal record, not formal legal construction acceptance.

## 7. Installation, running, and tests

There is no runnable application or dependency manifest supplied with this documentation revision. No installation, app build, Storybook build, or test run has been performed.

During approved prototype building, replace this section with verified instructions covering:

- Required tool versions and the working directory.
- Dependency installation using the saved lockfile.
- Starting the app and opening the local development server.
- Starting and building Storybook.
- Building and serving the production app.
- Running the actual test scripts and manually demonstrating the workflow.
- Resetting fictional data and explaining browser storage limitations.

Do not label the project runnable or submission-ready until those instructions are implemented and checked.

## 8. Review and submission

The workshop submission is through GitHub commits and is due **11 December 2026, end of day**. Required deliverables include evidence.md, product.md, design.md, architecture.md, a README with working instructions, and functional web software created through agentic coding, including the required Storybook catalogue.

Next steps:

1. Review these three revised documents and resolve the evidence provenance question.
2. Confirm the final product/evidence Markdown organization and the proposed prototype choices.
3. The group has authorized publishing the supplied evidence, revised design, and this README. Further document changes require the group's direction.
4. Authorize prototype building and complete the implementation and validation.

The present authorization covers publishing evidence.md, design.md, and README.md. Product and architecture documents remain unchanged. Prototype implementation still awaits the group's instruction.
