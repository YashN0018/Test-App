Module 1 — Pre-Assignment (Client & BU)
________________________________________
1. Purpose
To capture and manage all pre-engagement activities — from lead creation to business understanding and assignment setup.
This module records every client’s foundational details, organizes initial due-diligence data, and unlocks downstream modules once a client becomes active.
It forms the base layer for the client lifecycle, linking prospecting, scoping, and the start of engagement planning.
________________________________________
2. Features
Client (ClientID) — Master Record
Stores core client identity and lifecycle status.
•	Captures key details: Client Name, Legal Name, Registration Number, Incorporation Date, Industry, Region, Revenue Range, Parent Company.
•	Classifies client status (Lead / Active Client / Dormant).
•	Maintains metadata (Created By, Updated By, Confidentiality Level, MDM link status).
•	Auto-generates a hash snapshot when approved or locked.
Behavior: New records default to Lead; conversion to Active Client (after dossier approval) unlocks Modules 2–6. Duplicate detection runs on creation.
________________________________________
Business Understanding Dossier (DossierID) — Client Knowledge
Structured repository capturing pre-assignment intelligence.
•	Includes sections: Company Overview, Industry Understanding, Strategic Initiatives, Key Customers/Vendors, Locations, Key Risks.
•	Maintains versioning (Draft → Submitted → TL Approved → Locked).
•	Supports attachments (org charts, flow files, support docs).
Behavior: Preparers draft and submit; TL approval locks the dossier and pushes a snapshot to the Knowledge Hub. Locked dossiers become read-only reference records.
________________________________________
Assignment (AssignmentID) — Engagement Starter
Defines the initial pitch or engagement linked to the client.
•	Core fields: Title, Description, Assigned TL, Start Date, Estimated Effort, Confidence Level.
•	Tracks status (Proposed / In Discussion / Won / Lost / Cancelled).
Behavior: Created automatically when a client converts to Active; winning the assignment triggers proposal and commercial flows (Module 2).
________________________________________
Contact (ContactID) — Client Directory
Stores contact people and communication details.
•	Captures Name, Designation, Email, Phone, Preferred Channel, Primary Flag.
Behavior: Contacts link to Clients and Assignments for outreach and notifications.
________________________________________
Activity / Audit Trail
Tracks every user action for transparency and compliance.
•	Logs entity, action type (Create, Approve, Lock, Convert), user, timestamp, snapshot hash.
Behavior: Visible timeline for Client and Dossier activities; feeds central audit service.
________________________________________
File Attachment
Manages uploads for dossiers and assignments.
•	Stores file name, uploader, hash, virus-scan status, and storage link.
Behavior: All uploads are scanned and hash-verified; infected files quarantined.
________________________________________
Workflows (Condensed)
1.	Create Lead → System marks Status = Lead; draft Dossier auto-created.
2.	Draft & Submit Dossier → Auto-save enabled; Submit triggers validation and TL notification.
3.	TL Review → Approve/Reject; approval increments version and locks dossier.
4.	Convert Lead → Active Client → Unlock Modules 2–6; Pitch Assignment auto-created.
5.	Assignment Setup → TL adds dates and effort; Status = Won initiates Commercial Module 2.
________________________________________
Validation & Rules
•	Required fields before submit: Client Name, Primary Contact, Industry, Company Overview.
•	Duplicate client check via name / registration match; override requires justification.
•	Locked dossiers editable only via Admin override (with reason).
•	Modules 2–6 remain locked until Client = Active and Dossier = Locked/TL Approved.
•	Virus scans mandatory for all attachments.
________________________________________
3. Input
Source	Data Consumed	Purpose
User Entry	Client and contact details	Create Lead records
MDM	Master Industry, Region, and Taxonomy lists	Standardize client classification
File Uploads	Dossier attachments and organizational documents	Enrich client understanding
Approval Workflow	TL Review actions	Trigger status updates and hash generation
Behavior: When Dossier is Approved and Client converted to Active, system auto-generates an Assignment stub and unlocks next modules.
________________________________________
4. Output
Output	Description	Consumed By
Active Client Record	Finalized client profile with unique ClientID and status Active	All downstream modules
Locked Business Understanding Dossier	Immutable record of client knowledge	Knowledge Hub (Module 6)
Pitch Assignment Record	Engagement starter for scoping and effort estimation	Module 2 (Commercials)
Audit Trail Entries	Activity history for traceability and approvals	Central Audit Store
Notifications / Calendar Events	Alerts for submission and approval actions	Notification Engine
________________________________________
✅ Outcome:
Module 1 establishes the client foundation — transforming raw leads into validated, auditable client records and unlocking the commercial and planning workflow chain.