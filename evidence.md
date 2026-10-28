# Evidence – SiteProof (ESCP-2627DT-[GROUP])

> **Status:** The four interviews below were **simulated with an AI assistant** to prepare our interview guide and sharpen the hypotheses in `product.md`. They are **not** real stakeholder evidence. Real interviews (one per group member) are documented in the second part of this file and take priority wherever they disagree with the simulations.

## Stakeholders covered

| # | Role | Relation to SiteProof | Hypotheses tested (see product.md §1.8) |
|---|------|----------------------|------------------------------------------|
| S1 | Site manager (Bauleiter) | Primary user | Tracking difficulty, real costs, simplicity |
| S2 | Subcontractor foreman (trade lead) | Secondary user | Willingness to participate |
| S3 | Project manager / quality inspector | Secondary stakeholder | Real costs, verification value |
| S4 | Managing director, small general contractor | Potential buyer | Underserved market, willingness to pay |

---

## S1 – Site manager (AI-simulated)

**Persona:** Site manager, ~45, at a general contractor with ~40 employees. Runs two residential refurbishment projects at once, coordinating 8–12 subcontractors per project.

**1. How do you currently keep track of defects?**
Mostly photos on his phone, WhatsApp groups with each trade, and an Excel list he updates in the evening. Before handover, he walks the site with a printed list.

**2. What happens after you report a defect to a subcontractor?**
He sends a photo and a short message. Often the reply is just "done" or a thumbs-up. He rarely gets a photo of the repair.

**3. How do you know a defect has really been fixed?**
He has to go and look himself. With 100+ open items near handover, he can't check everything, so some get closed on trust.

**4. Can you describe a recent case where this went wrong?**
A balcony door seal was reported "fixed" twice but still leaked at the pre-handover inspection. The trade had already left the site, and getting them back took two weeks and delayed one apartment handover.

**5. How much time do you spend chasing updates?**
He estimates several hours a week on calls and messages just asking "is it done?", more in the last month before handover.

**6. Have you used tools like PlanRadar or Procore?**
His company tested PlanRadar on one large project. It worked, but setup took time and many subcontractors never logged in, so he went back to WhatsApp for small projects.

**7. What would a tool need to do for you to use it?**
Be as fast as sending a WhatsApp photo. Work on site with bad reception. Let him mark items as "verified" only after he checks, separately from "done by the trade."

**8. What would stop you from using it?**
If subcontractors need to install an app and create accounts. "If they don't use it, it's useless to me."

**Key insights**
- Supports the core problem: information is scattered across WhatsApp, photos and Excel.
- The gap between **"done"** and **"verified"** is real and causes rework and delays.
- Subcontractor adoption is the make-or-break factor, not features.
- Speed and offline use matter more than a large feature set.

---

## S2 – Subcontractor foreman (AI-simulated)

**Persona:** Foreman of a 6-person drywall and painting company, ~38, works for 4–5 general contractors at the same time.

**1. How do you receive defect reports today?**
Through WhatsApp, phone calls, emails and sometimes paper lists, and every general contractor does it differently.

**2. What makes a defect report easy or hard to act on?**
Easy: a photo, the exact apartment and room, and what is wrong. Hard: "wall in B2 not okay" with no photo. His team often drives to site and can't find the problem.

**3. How do you show that you have fixed something?**
Usually a message saying it's done. Sometimes a photo if the site manager asks.

**4. Have you ever been blamed for something unfairly?**
Yes. Other trades damaged his finished walls, and he was asked to fix it for free. He wishes he had proof of when his work was finished.

**5. Would you use a shared tool from the general contractor?**
Only if it's free for him, needs no account or app download (e.g. a link), and takes under a minute per defect. He already has three apps from different contractors and uses none of them.

**6. What would make it worth it for you?**
Proof of completion with a date and photo, which protects him in disputes and helps him get paid faster.

**Key insights**
- Supports candidate insight B: unclear descriptions waste trips and time.
- **Participation is the main risk:** "app fatigue" from multiple contractors.
- A strong motivation exists: proof of completion protects subcontractors in disputes and payment.
- Design implication: link-based access with no account for subcontractors.

---

## S3 – Project manager / quality inspector (AI-simulated)

**Persona:** Project manager at a mid-sized contractor, ~50, oversees 5–6 projects and their site managers.

**1. How do you get an overview of defects across projects?**
He asks site managers for status by phone or in weekly meetings. Excel lists exist, but each site manager keeps them differently.

**2. When do defect problems become visible to you?**
Usually too late, 2–3 weeks before handover, when a site manager says they can't make the date.

**3. What does a late or failed handover cost?**
Client frustration, extra site visits, sometimes holding back part of the final payment, and occasional disputes. He couldn't give exact numbers.

**4. What information would help you most?**
How many defects are open, how many are overdue, and how many were reopened after inspection, per project, without calling anyone.

**5. What's your view on "verified" closure?**
Important, but it must be clear this is internal. Formal acceptance (*Abnahme*) with the client is a separate legal process.

**Key insights**
- Supports the business value: problems surface too late, close to handover.
- The **reopen rate** and **overdue share** are meaningful metrics for managers.
- No numerical baseline available, so cost impact still needs real evidence.
- "Verified" must be clearly separated from legal *Abnahme*.

---

## S4 – Managing director, small general contractor (AI-simulated)

**Persona:** Owner and managing director of a residential general contractor with ~25 employees.

**1. What are your biggest operational headaches?**
Staff shortages, material prices and delays at the end of projects. Defects are part of the last one.

**2. How much do defects and rework cost you?**
He doesn't track it precisely, but late handovers mean delayed final payments, which hurts cash flow.

**3. Have you bought construction software before?**
They pay for accounting and scheduling tools. They looked at PlanRadar and Procore but found them too big and expensive for their project size.

**4. What would convince you to pay for a defect tool?**
His site managers asking for it, subcontractors actually using it, and visible results on one pilot project. No long contracts.

**5. How would you prefer to pay?**
Per active project or a small monthly fee per company. He mentioned he would not spend much time comparing tools; it must be "obviously useful."

**6. Who decides?**
He does, but only if his site managers support it.

**Key insights**
- Supports the niche hypothesis: existing tools feel too big for small contractors.
- Buyer ≠ user: adoption depends on site managers recommending it.
- A **free pilot project** is the likely entry point.
- Willingness to pay is plausible but **not validated**; no price was tested.

---

## Summary of simulated findings

| Hypothesis (product.md §1.8) | Simulated signal | Confidence |
|---|---|---|
| Site managers struggle to track closure across trades | Supported (S1, S3) | Low – simulated |
| Unverified updates cause real costs / delays | Supported, but no numbers (S1, S3, S4) | Low – simulated |
| Subcontractors will participate | **Biggest risk**; only if free, no account, very fast (S1, S2) | Low – simulated |
| Small contractors are underserved | Supported (S1, S4) | Low – simulated |
| Simple closure workflow beats large feature set | Supported (S1, S4) | Low – simulated |
| A company would pay | Plausible via pilot; price untested (S4) | Low – simulated |

**Refined key insight (to validate):**
> A site manager wants to know which defects are really fixed, not just reported as done, because late surprises delay handover, but subcontractors don't use extra apps and only reply "done" without proof.

**Questions the real interviews must answer:**
1. Do subcontractors really refuse apps, and would a no-account link work?
2. How many hours per week do site managers actually spend chasing updates?
3. Can anyone give a concrete example with cost or delay?
4. Would a buyer pay for a pilot, and what price feels acceptable?

---

## Real interviews (one per group member)

### Interview 1: [Role] – conducted by [Name]

- **Date / format:**
- **Who:** [role, company size, context – no full names without consent]

**Questions & answers**
1. …

**Key insights**
- …

**Hypotheses supported / refuted:**

---

### Interview 2: [Role] – conducted by [Name]

- **Date / format:**
- **Who:**

**Questions & answers**
1. …

**Key insights**
- …

**Hypotheses supported / refuted:**

---

<!-- Copy the block above for each group member. -->
