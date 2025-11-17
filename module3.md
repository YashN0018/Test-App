Once the Engagement Letter is signed, Module 3 (Assignment Setup & Planning) is automatically unlocked, continuing the operational workflow.
1. Purpose
To replace the manual “Planner” process with a structured and system-driven planning environment for each assignment.
This module allows the creation of sub-projects, allocation of resources, documentation of Process Understanding (PU), and generation of a phase-wise project timeline (Gantt chart).
Once finalized, the plan becomes the operational foundation for Module 4 (Execution) and a data source for Module 6 (Appraisal).
Unlock Condition:
Module 3 activates automatically once a Signed Engagement Letter (EL) from Module 2 is uploaded. The Internal_SOW from Module 2 serves as its key input.
________________________________________
2. Features
Sub-Project Manager
•	Enables creation of sub-projects under a main assignment for tracking deliverables or invoicing milestones.
•	Captures: Title, Owner, Start/End Dates, Effort Estimate, and Invoice Trigger.
•	Helps divide large engagements into manageable and independently monitored units.
________________________________________
Resource Allocator (Planner)
•	Grid-style interface for assigning employees (from MDM) to projects or sub-projects.
•	Supports partial plotting (by month/week) and role-based allocation (Executor, Reviewer, Approver).
•	Displays live utilization and conflict indicators to prevent overbooking.
•	Allows easy adjustment and finalization of allocation schedules.
________________________________________
Process Understanding (PU) Module
•	Hosts client-specific questionnaires and allows uploading of Process Flow (PF) files.
•	Requires “Client Has Signed Off” checkbox (with signed file) before TL approval is enabled.
•	Upon TL approval, the PU record locks and becomes an execution input.
________________________________________
Timeline Generator
•	Generates a color-coded Gantt chart for audit phases (Data Gathering, Analysis, Drafting, Review, Closure).
•	Inputs: Start/End Dates, duration per phase.
•	Automatically recalculates phase durations and dependencies when edited.
________________________________________
Validations & Rules
•	Module remains locked until Signed EL is uploaded.
•	Client sign-off required before PU approval.
•	Resource allocation cannot exceed capacity; system flags conflicts.
•	Every sub-project must have an owner and defined timeline before plan finalization.
•	Timeline edits trigger automatic revalidation of resource mapping.
________________________________________
Integrations
•	MDM: Supplies Employee Master and Questionnaire templates.
•	Module 4 (Execution): Consumes Approved PU and Resource Allocation to generate task lists and Analysis Points.
•	Module 6 (Appraisal): Reads Resource Allocation logs for performance credit scoring.
________________________________________
3. Input
Source	Data Consumed	Purpose
Module 2	Signed Engagement Letter & Internal_SOW	Engagement base and scope reference
MDM	Employee Master & Questionnaires	Populate resource and PU data
User Entry	Sub-projects, allocations, dates, and sign-offs	Define and finalize plan
Client Uploads	Signed Process Flow acknowledgment	Enable PU approval
Behavior:
Once all sub-projects, allocations, and timelines are validated and the PU is approved, TL marks Plan Ready to finalize planning outputs and activate execution workflows.
________________________________________
4. Output
Output	Description	Consumed By
Project_Plan.pdf	Complete overview of sub-projects, timelines, and responsibilities	Module 4 (Execution)
Resource_Allocation_Schedule.csv	Structured resource utilization record	Module 6 (Appraisal)
Approved_PU_Flowchart.pdf	Locked and signed process flow for audit reference	Module 4 (Execution)
Audit Trail Entries	Logged approvals, revalidations, and adjustments	Central Audit Service
Notification Alerts	Triggers to TL/Manager upon completion or conflict	Notification Engine
________________________________________
✅ Outcome:
Module 3 transforms a signed engagement into a detailed, executable plan — defining structure, people, process, and timelines.
Finalization of the plan automatically activates Module 4 (Execution) for on-ground audit procedures