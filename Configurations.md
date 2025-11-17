1. Foundational & Core Modules (System-Wide)
These modules form the backbone of the application architecture.
They do not follow the linear audit workflow but instead provide critical infrastructure and shared services that power every functional module (Modules 1–6).
Each foundational component is designed for scalability, security, and consistency across the system.
________________________________________
User Management & Access Control
Purpose:
To manage all user identities, roles, and permissions — ensuring that users access only what they are authorized to view or act upon.
Features & Logic:
•	Role-Based Access Control (RBAC):
Every user is assigned a defined role (e.g., Intern, Associate, Senior, Team Lead, Manager, Partner, Admin).
Each role has specific privileges — such as create, review, approve, or finalize.
For example:
o	A Team Lead (TL) can review and approve dossiers or process flows but cannot alter master data.
o	An Executor can upload working papers but cannot finalize observations.
•	Granular Permission Layer:
Field-level visibility (e.g., “Utilization %” view restricted to TL and above).
Workflow actions (Submit for Review, Approve, Lock, Finalize) are governed by role definitions.
•	Authentication & Security:
Integrates with Single Sign-On (SSO) and supports Multi-Factor Authentication (MFA).
User sessions are token-based with automatic timeouts.
•	User Lifecycle Management:
Admin dashboard to create, deactivate, and reassign users.
When an employee leaves, assignments automatically get reassigned or marked “unallocated.”
Interactions:
•	Connects with every module to authenticate and authorize user actions.
•	Ensures workflow integrity (e.g., only a TL can approve a Business Understanding Dossier in Module 1, only a Partner can sign off on Final Reports in Module 5).
•	Audit Trail integration logs every user action (Create, Edit, Approve, Delete) for traceability.
________________________________________
Master Data Management (MDM)
Purpose:
To maintain and govern the master data repositories that define consistent rules, hierarchies, and taxonomies across the application.
Features:
•	Centralized Master Lists:
Stores and manages all key data entities used by other modules, including:
o	Client Master: Legal details, industries, ownership, and related entities.
o	Employee Master: Employee details, grade, department, role, rate cards, planner availability data.
o	Master Scope List: Hierarchical structure of Process → Sub-Process → SOW items.
o	Master Audit Procedures & Analysis Points: Standardized audit tests and “To-Do” templates for consistent execution.
o	Master Data Requirement (DR) List: Standard evidence or data request items mapped to each process or control.
o	Questionnaires: Both general and specific templates used in Process Understanding (PU).
o	Report & Engagement Letter Templates: Standardized report formats and legal documents.
•	Versioning & Audit:
Each list has version control with change history and approval for new additions or edits.
•	Metadata Classification:
Tags for process, industry, entity, or year to support downstream analytics and reporting.
Interactions:
•	Provides read-only, controlled data feeds to:
o	Module 2 (Commercials): Master Scope List and rate references.
o	Module 3 (Planning): Employee Master and Questionnaire templates.
o	Module 4 (Execution): Master Procedures and Data Requirement (DR) list.
o	Module 5 (Reporting): Report and EL templates.
•	Updates to MDM trigger controlled version notifications to dependent modules (e.g., “New Procedure Set v2.0 available”).
________________________________________
Database & Storage
Purpose:
To securely store and manage all structured (transactional) and unstructured (file-based) data across the application.
Features:
•	Structured Database (SQL):
Houses all relational data — such as client details, engagement metadata, effort estimations, OL fields, and approval workflows.
Supports referential integrity across all modules using primary keys like ClientID, AssignmentID, ObservationID.
•	Unstructured Storage (Blob/File):
Used for large files and uploads (PBC documents, client submissions, flow charts, workpapers, final reports).
Must integrate with virus scanning and hash verification for data integrity.
•	Secure Client Uploads:
Clients upload requested data via secure, tokenized URLs hosted within the application — ensuring isolation and access control.
•	Version & Retention Policy:
Older document versions retained per policy (e.g., 7 years) and tagged for easy retrieval.
Deleted files move to an archive state (not hard-deleted).
Interactions:
•	Serves as the central persistence layer for all other modules.
•	File uploads from Module 4 (Execution) and Module 5 (Reporting) are stored here with metadata links.
•	Knowledge Hub (Module 6) indexes this storage to provide search and retrieval.
•	Performs daily integrity checks to ensure data and hash consistency.
________________________________________
Notification & Escalation Engine
Purpose:
To manage all system-driven alerts, reminders, and hierarchical escalations, ensuring timely completion of reviews, submissions, and approvals.
Features & Logic:
•	Trigger-based Alerts:
Receives triggers from workflow actions (e.g., “Submit for Review,” “Overdue DR,” “Pending OL Approval”).
•	Timed Escalations:
Uses configurable SLAs (e.g., 3 days for TL review, 5 days for Manager approval).
If the deadline lapses, the engine escalates to the next role (TL → Manager → Partner).
•	Notification Channels:
Supports in-app notifications, email alerts, and optional calendar reminders.
Each notification includes contextual links (e.g., “Open Pending OL,” “Review PU Flowchart”).
•	Auto-Mute Conditions:
Escalations stop when evidence of completion (e.g., signed email uploaded) is detected.
•	Digest Mode:
Option for daily summary notifications for power users (Partners, Managers).