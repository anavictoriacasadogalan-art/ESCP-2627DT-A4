# Product.md — Construction Defect Management

> **Product stage:** Concept / MVP definition  
> **Version:** 1.0  
> **Document purpose:** Define what the product does, who it serves, and what the first usable version must deliver.

## 1. Product Overview

A mobile-friendly digital platform that helps construction teams **report, assign, track, and resolve defects on site**.

Workers use a simple reporting interface to document a defect with a photo, an explanation, a possible cause, and information about **how, why, and when** the problem started or was noticed. The report appears on the **site manager's dashboard**, where the manager reviews it, assigns a responsible person, sets a deadline, and monitors its resolution.

**Core value:** One traceable workflow from identifying a construction defect to confirming that it has been addressed.

## 2. Problem and Opportunity

Construction defects may be communicated verbally, on paper, or across disconnected messages. These methods can make it difficult to retain evidence, understand the issue, establish responsibility, and follow up on deadlines.

**The product aims to:**
- Capture clear, consistent defect information at the point of discovery.
- Give site managers one overview of outstanding issues.
- Make responsibility and deadlines explicit.
- Reduce forgotten reports and improve accountability and traceability.

These problems and benefits are **product hypotheses** to validate with construction teams, not yet proven research findings.

## 3. Target Users and Interfaces

| User | Main need | Interface / permissions |
| --- | --- | --- |
| **Construction worker** | Report a problem quickly while on site. | Worker interface: create reports, attach photos, explain defects, view their submitted reports and assigned work where applicable. |
| **Site manager** | See all reported defects and coordinate fixes. | Manager dashboard: review reports, assign responsible people, set deadlines, track status, and verify resolution. |
| **Responsible person (assignee)** | Understand what to fix and by when. | Access assigned defect details and update progress, using an appropriate authorized interface; not a separate third interface in the MVP. |

**Design principle:** Two role-based experiences, with fewer steps for workers and more oversight tools for managers.

## 4. Core User Journey

1. **Discover:** A worker notices a defect at a construction site.
2. **Document:** The worker photographs the defect and records what happened, the suspected cause (if known), and how, why, and when the issue began or was noticed.
3. **Submit:** The report is saved and appears in the site manager's dashboard.
4. **Review:** The manager opens the report and evaluates the information.
5. **Assign:** The manager selects a responsible person and sets a repair deadline.
6. **Resolve:** The assigned person carries out the work and records an update.
7. **Close:** The manager verifies the fix and closes the report, or reopens it if further work is needed.

Steps **1–5** are based directly on the described concept. Steps **6–7** are proposed MVP completion steps so that defects can be tracked through resolution.

## 5. MVP Functional Requirements

| ID | Requirement | Acceptance criteria |
| --- | --- | --- |
| **FR-01** | **Role-based access** | Workers see the reporting experience; site managers see the management dashboard. Users only access authorized site data. |
| **FR-02** | **Create a defect report** | A worker can submit a report containing a photo, short title/description, explanation, and when the issue was noticed. Suspected cause and the explanation of how/why may be marked *unknown* rather than guessed. |
| **FR-03** | **Record site context** | Each report is linked to a construction site/project, reporter, and submission timestamp; a location within the site can be entered where useful. |
| **FR-04** | **Manager defect inbox** | Submitted reports appear on the relevant manager dashboard with their current status and key details. The manager can open the full report and photo. |
| **FR-05** | **Assign responsibility and deadline** | The manager can select an authorized responsible person and set or change a deadline; both are visible on the defect record. |
| **FR-06** | **Track progress** | Each defect has a clear status: `New`, `Assigned`, `In progress`, `Resolved`, or `Closed`. Authorized users can update the status appropriate to their role. |
| **FR-07** | **Resolution and verification** | The assignee can add a completion note; the manager can mark the report `Closed` after review or return it to active work. |
| **FR-08** | **Overview and follow-up** | The manager can filter defects by site, status, assignee, and deadline and identify overdue items. |
| **FR-09** | **Traceable history** | The system preserves who reported, assigned, updated, and closed a defect, with timestamps. |

**Priority:** All requirements above define the proposed MVP. Notification delivery beyond visibility in the dashboard is an enhancement unless agreed otherwise.

## 6. Key Product Screens

**Worker experience**
- **My defects:** Reports submitted by the worker and their current status.
- **New defect:** Camera/photo upload, description, cause and context fields, submit action.
- **Defect details:** Submitted evidence, assigned responsibility, deadline, and progress (subject to permissions).

**Site manager experience**
- **Dashboard:** New, active, resolved, and overdue defect overview.
- **Defect detail:** Full report, photo, explanation, history, and status.
- **Assignment controls:** Responsible person, deadline, and status/verification actions.

## 7. Essential Information to Store

| Record | Essential fields |
| --- | --- |
| **User** | User ID, name, role, authorized site(s). |
| **Site / project** | Site ID and name. |
| **Defect** | Unique ID, site, reporter, title, description, photo(s), reported timestamp, time first noticed, suspected cause, how/why explanation, site location (if supplied), status, assignee, deadline. |
| **Progress / history** | Defect ID, change or note, author, timestamp, resolution note, closure decision. |

A suspected cause should be clearly distinguished from a **confirmed cause** so the platform does not present a worker's initial assessment as verified fact.

## 8. End-to-End MVP Acceptance Test

The first version is usable when the following scenario works end-to-end:

1. A worker signs in to the worker interface and submits a photographed defect with the required explanation.
2. The report appears under the correct site on the manager dashboard, without manually re-entering its details.
3. The manager reviews it, chooses an assignee, and sets a deadline.
4. The responsible person can access the assignment, update progress, and record completion.
5. The manager can verify the result, close the defect, and review the recorded history.

## 9. Non-Functional Requirements

- **Usability:** Straightforward mobile-first reporting suitable for workers on active construction sites.
- **Reliability:** Reports and photos must not be silently lost; submission failures must be clear to the user.
- **Security:** Authentication, role-based permissions, secure storage, and appropriate protection of photos and personal data.
- **Accessibility:** Readable text, clear labels, accessible controls, and photo descriptions where needed.
- **Performance:** Reporting and dashboard interactions should feel responsive on typical job-site devices and connections; measurable targets should be established during testing.
- **Privacy:** Collect only necessary information and apply applicable data-protection requirements.

## 10. Success Measures

The product should be evaluated using measurable outcomes, with targets set after a baseline or initial pilot:

| Metric | What it measures |
| --- | --- |
| **Reporting completion rate** | Share of started reports successfully submitted. |
| **Time to submit** | How quickly workers can document a defect. |
| **Time to assignment** | Time between report submission and manager assignment. |
| **On-time resolution rate** | Share of resolved defects completed by the assigned deadline. |
| **Overdue open defects** | Number of unresolved issues past their deadlines. |
| **Traceability/completeness** | Share of defects with essential evidence, ownership, and status recorded. |

## 11. Scope and Boundaries

**Included in the MVP:** Two role-based interfaces, photo-based defect reporting, contextual explanations, manager dashboard, assignment, deadlines, progress tracking, closure, and basic history.

**Not required for the first version:** AI defect detection, automated root-cause diagnosis, advanced analytics, BIM/ERP integrations, cost estimation, or full project scheduling. Offline-first reporting, push/email notifications, and photo annotation are potential later improvements, subject to user testing.

## 12. Assumptions, Risks, and Decisions to Validate

| Topic | Current working assumption / question |
| --- | --- |
| **Assignee access** | An assignee may be an existing worker or another authorized team member; no third interface is needed initially. |
| **Report fields** | Photos and clear issue descriptions are central; workers can indicate that a cause is unknown. |
| **Verification** | Managers confirm completion before final closure; validate whether this matches site practices. |
| **Connectivity** | Construction-site connectivity may be unreliable; test submission and photo-upload behavior early. |
| **Site organization** | Every report belongs to a specific site/project; validate whether detailed location/zone is mandatory. |
| **Notifications** | Dashboard visibility is mandatory; confirm whether direct alerts are essential to launch. |
| **Adoption** | Test whether reporting is fast enough for workers and assignment is clear enough for managers. |

## 13. Product Definition in One Sentence

**A role-based construction defect management tool that lets workers document problems immediately and gives site managers a clear, accountable workflow to assign repairs, set deadlines, and track defects through resolution.**
