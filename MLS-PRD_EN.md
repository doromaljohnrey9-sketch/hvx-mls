# MLS — Past-Exam Explainer Video Learning System · PRD

> **MLS — Math Learning Studio** · HEMS sub-module

| Item                  | Details                                                                 |
| --------------------- | ----------------------------------------------------------------------- |
| Document No.          | `G-HEMS-MLS-PRD-20260602-001`                                           |
| Author                | CEO                                                                     |
| Date                  | 2026-06-02                                                              |
| Stakeholders          | MLS dev team / Content operations / Branch admins / Teachers / Students |
| 1st MVP launch target | 2026-06-09 15:00                                                        |
| Document type         | PRD (Product Requirements Document)                                     |

---

## 1. Request Analysis

This is a product requirements document for migrating the school-by-school past-exam explainer videos—currently managed as MyBox-style folders—into a learning system (MLS) within HEMS.

The core objectives from the meeting are:

- About 600 past-exam explainer videos are already prepared.
- Today, teachers send video files/links to students individually via KakaoTalk.
- This approach is highly inefficient for repeated delivery, management, and scaling.
- Students must be able to find and study videos themselves by **school name, year, semester, exam type, and problem number**.
- **Approval-based access control** after sign-up is required to block outside access.
- Each branch/teacher must be able to approve students, upload videos, and manage data.
- The 1st MVP must be usable quickly, with a target of "Tuesday 15:00."

Per the attached image, the current data mixes "branch / school / completion status" in the folder names (e.g., `Dongsuwon-Mangpo Branch(Mangpo HS)(Done)`, `Yongin-Gwanggyo Branch(Sanghyeon HS)(Done)`). This is intuitive for humans but requires normalization to become a system.

---

## 2. Approach

Rather than digitizing the folder structure as-is, the key is to **normalize the content metadata structure first**. More than the video file itself, the core data is "which school, which year, which semester, which exam, and which problem number this video answers."

---

## 3. Product Overview

- **Product name**: MLS (Math Learning Studio) — HEMS past-exam explainer system
- **Purpose**: A learning-support system that lets students easily search and watch past-exam explainer videos by school, year, exam, and problem.
- Previously teachers delivered videos individually via KakaoTalk; after adoption, students log in with an approved account and look up and study the videos they need directly.

### Key Users

| Type         | User                     | Primary purpose                                    |
| ------------ | ------------------------ | -------------------------------------------------- |
| Student      | Enrolled academy student | Search and watch needed past-exam explainer videos |
| Teacher      | Branch teacher           | Approve students, guide to videos, upload content  |
| Branch Admin | Branch manager           | Approve own-branch students, manage content        |
| Super Admin  | HEMS operator            | Manage all branches/schools/videos/permissions     |
| Dev team     | MLS developers           | Build, deploy, operate features                    |

---

## 4. Problem Definition

**Current problems**

- Teachers repeatedly send videos via KakaoTalk for each student question.
- With 600+ videos, manual management is difficult.
- Systematic lookup by school/year/semester/exam type/problem number is hard.
- Students struggle to find the videos they want on their own.
- Insufficient access control to prevent external leakage.
- Folder-name-based management scales poorly as 2026/2027 data is added.

**Direction**

- Assign standard metadata to every video.
- Student login and approval-based access.
- Provide search by school name, year, semester, exam type, and problem number.
- Provide upload/management features for teachers/admins.
- Separate permissions per branch.
- Store videos on a server/external storage and stream/link-play from HEMS.

---

## 5. MVP Scope

### Included Features

| Type         | Feature           | Description                                             | Priority |
| ------------ | ----------------- | ------------------------------------------------------- | -------- |
| Account      | Sign-up           | Students create their own ID/PW                         | High     |
| Account      | Login             | Only approved users can access                          | High     |
| Approval     | Student approval  | Teachers/branch admins approve student accounts         | High     |
| Video lookup | School list       | View video list by school name                          | High     |
| Video lookup | Filter search     | Search by year/semester/exam type/school/problem number | High     |
| Playback     | Watch video       | Play the explainer video for the selected problem       | High     |
| Admin        | Register video    | Admins/teachers upload or register a link               | High     |
| Admin        | Edit/delete video | Replace incorrect metadata/videos                       | Medium   |
| Admin        | User management   | Approve/block students, change permissions              | High     |
| Operations   | Completion status | Manage uploaded/not-uploaded status                     | Medium   |

### Excluded Features

| Excluded feature                          | Reason                                              |
| ----------------------------------------- | --------------------------------------------------- |
| AI problem recommendation                 | Recommended after MVP, once learning history exists |
| Auto wrong-answer notes                   | 1st goal is improving video accessibility           |
| Progress-based reports                    | Develop in phase 2 after watch logs are collected   |
| Payments                                  | Not in current requirements                         |
| Parent accounts                           | Expandable after MVP                                |
| Auto OCR classification of problem images | Manual admin registration is more stable initially  |

---

## 6. User Scenarios

**Student**

1. Open MLS → sign up (name, branch, school, grade, class/assigned teacher).
2. Move to pending-approval state.
3. Branch admin/teacher reviews and approves.
4. Log in → search `Mangpo HS / 2025 / 1st semester / final exam / No. 9`.
5. Click the video → watch the explainer → ask the teacher follow-up questions if needed.

**Teacher**

1. Log in → review the list of students requesting approval.
2. Check branch membership → approve or reject.
3. During class: "Watch the Mangpo HS 2025 1st-semester final No. 9 video."
4. Copy and share the video link if needed.

**Admin**

1. Log in → register a new video.
2. Enter school/year/semester/exam type/problem number/branch/uploader.
3. Upload the video file or enter a URL.
4. Change visibility → becomes available to students.

---

## 7. Permission Policy

| Role            | Description       | Key features                                 |
| --------------- | ----------------- | -------------------------------------------- |
| Student         | Approved student  | Search and watch videos                      |
| Pending Student | Awaiting approval | Can log in, content access restricted        |
| Teacher         | Teacher           | Approve students, register/edit videos       |
| Branch Admin    | Branch manager    | Manage own-branch students and content       |
| Super Admin     | Top admin         | Manage all data/permissions/branches/schools |

**Access policy**

- Unapproved users cannot access the video list or playback.
- Only approved students can watch videos.
- MVP default: **approved students can view all public videos.**
- Design the data structure so a per-branch restriction option can be added if operationally needed.
- Per the meeting context ("a student need not be a Mangpo HS student to solve Mangpo HS problems"), no school-level access restriction is appropriate—though this is an operational policy decision.

---

## 8. Data Structure

### Interpreting the Current Folder Structure

| Folder name example                                 | Embedded info                            |
| --------------------------------------------------- | ---------------------------------------- |
| Dongsuwon-Mangpo Branch(Mangpo HS)(Done)            | Region/branch, school, completion status |
| Dongsuwon-Maegyo Branch(Suwon HS)(May 28)           | Region/branch, school, date/status       |
| Boksuwon-Cheoncheon Branch(Cheoncheon HS)(Complete) | Region/branch, school, completion status |
| Yongin-Suji Branch(Pungdeok HS)(Done)               | Region/branch, school, completion status |

### Normalized Data Model

**Branch**

| Field       | Type     | Description                                        |
| ----------- | -------- | -------------------------------------------------- |
| id          | UUID     | Branch ID                                          |
| region_name | string   | Region name (e.g., Dongsuwon, Yongin)              |
| branch_name | string   | Branch name (e.g., Mangpo Branch, Gwanggyo Branch) |
| status      | enum     | active/inactive                                    |
| created_at  | datetime | Created date                                       |

**School**

| Field       | Type     | Description                   |
| ----------- | -------- | ----------------------------- |
| id          | UUID     | School ID                     |
| school_name | string   | School name (e.g., Mangpo HS) |
| school_type | enum     | middle/high                   |
| region      | string   | Region                        |
| created_at  | datetime | Created date                  |

**ExamSet**

| Field      | Type     | Description            |
| ---------- | -------- | ---------------------- |
| id         | UUID     | Exam set ID            |
| school_id  | UUID     | School ID              |
| year       | integer  | Exam year (e.g., 2025) |
| semester   | enum     | 1st/2nd semester       |
| exam_type  | enum     | midterm/final          |
| grade      | integer  | Grade                  |
| subject    | string   | Subject                |
| title      | string   | Display title          |
| status     | enum     | draft/published/hidden |
| created_by | UUID     | Creator                |
| created_at | datetime | Created date           |

**ProblemVideo**

| Field          | Type     | Description             |
| -------------- | -------- | ----------------------- |
| id             | UUID     | Video ID                |
| exam_set_id    | UUID     | Exam set ID             |
| problem_number | integer  | Problem number          |
| video_title    | string   | Video title             |
| video_url      | string   | Video URL               |
| file_path      | string   | Server storage path     |
| duration       | integer  | Video length (seconds)  |
| upload_status  | enum     | pending/uploaded/failed |
| visibility     | enum     | public/private/hidden   |
| uploaded_by    | UUID     | Uploader                |
| created_at     | datetime | Created date            |
| updated_at     | datetime | Updated date            |

**User**

| Field           | Type     | Description                              |
| --------------- | -------- | ---------------------------------------- |
| id              | UUID     | User ID                                  |
| login_id        | string   | Login ID                                 |
| password_hash   | string   | Password hash                            |
| name            | string   | Name                                     |
| role            | enum     | student/teacher/branch_admin/super_admin |
| branch_id       | UUID     | Branch                                   |
| school_id       | UUID     | Student's school                         |
| approval_status | enum     | pending/approved/rejected/blocked        |
| approved_by     | UUID     | Approver                                 |
| approved_at     | datetime | Approval date                            |
| created_at      | datetime | Sign-up date                             |

---

## 9. Screen Definitions

### Student Screens

**Login** — ID, Password, Login button, Sign-up button

**Sign-up** — Name, ID, Password, Confirm password, Branch, School, Grade, Assigned teacher (optional/input), Request approval button

**Pending approval** — "You are awaiting approval. After your branch teacher approves you, you can use the past-exam explainer videos."

**Video search** — Filters: school name, year, semester, exam type, grade, subject, problem number

Result display: School / Year / Semester / Exam / Problem / View button

**Video playback** — School, year, semester, exam type, problem number + video player + previous/next problem + back-to-list button

### Admin Screens

**Student approval management** — Name / ID / Branch / School / Request date / Status (pending·approved·rejected) / Action (approve·reject·block)

**Video registration** — School, year, semester, exam type, grade, subject, problem number, video title, file upload/URL, visibility

**Video list management** — School / Year / Semester / Exam / Problem / Status (public·private·hidden) / Creator / Action (edit·delete·preview)

---

## 10. Functional Requirements

**Sign-up / Login**

- Students self-register / default state `pending` / pending cannot access videos.
- Only approved users can view videos / password hashing required / duplicate sign-up with the same ID not allowed.

**Student approval**

- Teacher role and above can approve / Branch Admin handles own-branch students / Super Admin handles all.
- Store approval history / provide reject and block functions.

**Video search**

- Filter/search by school name, year, semester, exam type, and problem number.
- Display in a student-friendly form / show "No registered videos" when there are no results.

**Video playback**

- Instant in-browser playback / **responsive across all screen sizes by default.**
- UI design priority is **tablet/mobile-friendly** (the primary usage environment), while remaining fully usable on PC.
- Recommend disabling downloads by default / minimize direct URL exposure / show an error message on playback failure.

**Device compatibility (common)**

- Responsive web is the baseline assumption, with **tablet/mobile prioritized for optimization** as students' primary environment.
- Design around touch interaction, portrait orientation, and small screens first; desktop (PC) delivers the same features in a wider layout.
- Search filters, the video player, and admin screens must all be operable on mobile.

**Video upload / registration**

- Support both file upload and external storage URL input / metadata input required.
- Warn on duplicate problem-number registration within the same exam set / can save as private then switch to public.

**Completion status management**

- Display per school exam-set unit (not registered / partially registered / fully registered).
- Consolidate the current "Done," "Complete," and date notations into a system status value.
- Completion criterion: all problem videos for that exam set are registered.

---

## 11. API Draft

**Auth**

| Method | Endpoint             | Description |
| ------ | -------------------- | ----------- |
| POST   | `/api/auth/register` | Sign up     |
| POST   | `/api/auth/login`    | Log in      |
| POST   | `/api/auth/logout`   | Log out     |
| GET    | `/api/auth/me`       | Get my info |

**Approval**

| Method | Endpoint                            | Description  |
| ------ | ----------------------------------- | ------------ |
| GET    | `/api/admin/users/pending`          | Pending list |
| PATCH  | `/api/admin/users/{userId}/approve` | Approve user |
| PATCH  | `/api/admin/users/{userId}/reject`  | Reject user  |
| PATCH  | `/api/admin/users/{userId}/block`   | Block user   |

**Video**

| Method | Endpoint                      | Description       |
| ------ | ----------------------------- | ----------------- |
| GET    | `/api/videos`                 | Search videos     |
| GET    | `/api/videos/{videoId}`       | Video detail      |
| POST   | `/api/admin/videos`           | Register video    |
| PATCH  | `/api/admin/videos/{videoId}` | Edit video        |
| DELETE | `/api/admin/videos/{videoId}` | Delete video      |
| POST   | `/api/admin/videos/upload`    | Upload video file |

**Metadata**

| Method | Endpoint               | Description       |
| ------ | ---------------------- | ----------------- |
| GET    | `/api/schools`         | School list       |
| POST   | `/api/admin/schools`   | Register school   |
| GET    | `/api/branches`        | Branch list       |
| POST   | `/api/admin/branches`  | Register branch   |
| GET    | `/api/exam-sets`       | Exam set list     |
| POST   | `/api/admin/exam-sets` | Register exam set |

---

## 12. Search UX Design

**Basic flow**: select school name → year → 1st/2nd semester → midterm/final → problem number → watch.

**Quick search examples**

| Input example                  | System interpretation                         |
| ------------------------------ | --------------------------------------------- |
| Mangpo HS No.9                 | Search all No.9 problems related to Mangpo HS |
| Mangpo HS 2025 final No.9      | 2025 Mangpo HS final exam No.9                |
| Suwon HS 1st-sem midterm No.16 | Suwon HS 1st-semester midterm No.16           |

For the MVP, implement **filter search first** over natural-language search, then add natural-language/AI-recommended search once usage logs accumulate.

---

## 13. Content Registration Rules

**Video name standard**: `SchoolName_Year_Semester_ExamType_Grade_Subject_ProblemNumber.mp4`
Example: `MangpoHS_2025_1stSemester_Final_Grade2_Math_No09.mp4`

**Required metadata**: school name, year, semester, exam type, grade, subject, problem number, video file/URL, visibility, creator

**Data migration**

- Auto-extractable from folder names: region, branch, school, completion status.
- Manual input required: year, semester, exam type, grade, subject, problem number, per-video matching info.

---

## 14. Development Priorities

**Phase 1 (MVP essential)** — Login/sign-up, student approval, filter search, video list, video playback, admin video registration, basic permission management.

**Phase 2 (operational enhancement)** — Watch logs, recently watched, teacher→student video recommendations, link copy, per-problem notes, wrong-answer note linkage.

**Phase 3 (AI learning enhancement)** — Weak-problem recommendations, similar-problem recommendations, frequent-type analysis, AI problem tagging, automated learning reports.

---

## 15. Acceptance Criteria

**Student features**

| Check item               | Pass criterion                                                            |
| ------------------------ | ------------------------------------------------------------------------- |
| Sign-up                  | Students can self-register                                                |
| Pre-approval restriction | Unapproved students cannot access videos                                  |
| Post-approval access     | Approved students can search videos                                       |
| School search            | Results can be looked up by school name                                   |
| Problem search           | Videos can be looked up by problem number                                 |
| Video playback           | Plays normally in browser                                                 |
| Tablet/mobile support    | Search, playback, and UI operation work on tablet/mobile (priority check) |
| PC support               | Same features work on desktop browsers                                    |

**Admin features**

| Check item         | Pass criterion                               |
| ------------------ | -------------------------------------------- |
| Approval list      | Pending student list is shown                |
| Student approval   | Student can log in after approval            |
| Student rejection  | Rejected student cannot access               |
| Video registration | Can register with required metadata          |
| Video editing      | Can edit problem number/school/URL           |
| Video deletion     | Can delete with admin permission             |
| Public/private     | Can control visibility on the student screen |

**Data**

| Check item        | Pass criterion                               |
| ----------------- | -------------------------------------------- |
| School name       | Managed without duplicates                   |
| Exam set          | Classified by year/semester/exam type        |
| Problem number    | Duplicates prevented within the same exam    |
| Completion status | Distinguishes fully/partially/not registered |

---

## 16. Security & Operational Requirements

- No plaintext password storage.
- Admin pages accessible only to authorized users.
- Review whether direct video-URL sharing allows external access.
- Where possible, store videos on a server/storage accessible only to authenticated users.
- Need student account deletion/block functions.
- Recommend storing admin action history logs.
- Recommend not providing a download button to prevent external leakage (note: fully preventing copying of browser-played video has technical limits).
- Need video copyright and internal-use policy wording.

---

## 17. Schedule

| Schedule   | Work                                            |
| ---------- | ----------------------------------------------- |
| Day 1      | Finalize requirements, DB design, screen design |
| Day 2      | Implement sign-up/login/approval                |
| Day 3      | Implement video search/list/playback            |
| Day 4      | Implement admin video registration/editing      |
| Day 5      | Register sample data, test, deploy              |
| **Target** | **2026-06-09 15:00 — 1st usable state**         |

> Since a fast launch is required, the 1st version focuses not on a "perfect learning-management system" but on "a system where an approved student can find and watch the past-exam explainer videos they need."

---

## 18. Dev Team Work Breakdown

**Backend** — User/Auth model, Role/Permission, Branch/School/ExamSet/ProblemVideo models, sign-up API, login API, approval API, video search API, video registration API, file upload API, admin permission-check middleware.

**Frontend** — Login, sign-up, pending-approval, student video search, video detail/playback, admin student approval, admin video registration, admin video list page.

**DevOps/Storage** — Decide video storage location, upload size limits, streaming/static-file serving setup, access-controlled video URL structure, backup policy.

---

## 19. Policy Decisions Required

Items requiring CEO/operations decisions before development.

| Item                        | Options                                            | Recommendation                   |
| --------------------------- | -------------------------------------------------- | -------------------------------- |
| Student access scope        | All videos / own-branch videos only                | All videos                       |
| Approval authority          | HQ admin only / each branch teacher                | Each branch teacher              |
| Video storage method        | Direct server upload / external URL / mixed        | Mixed initially                  |
| Download allowed            | Allow / disallow                                   | Disallow                         |
| Student sign-up             | Self sign-up / admin-created                       | Self sign-up then approval       |
| Video publication criterion | Public on registration / public after admin review | Public after admin review        |
| Existing 600 registration   | Bulk migration / manual registration               | Excel-template bulk registration |

---

## 20. Recommended Excel Upload Template

To quickly register the initial 600 videos, adding an Excel upload feature is better than registering them one by one.

**Template columns**

| Column         | Example                                     |
| -------------- | ------------------------------------------- |
| region_name    | Dongsuwon                                   |
| branch_name    | Mangpo Branch                               |
| school_name    | Mangpo HS                                   |
| year           | 2025                                        |
| semester       | 1st semester                                |
| exam_type      | final                                       |
| grade          | 2                                           |
| subject        | Math                                        |
| problem_number | 9                                           |
| video_title    | Mangpo HS 2025 1st-sem final No.9 explainer |
| video_url      | https://...                                 |
| status         | published                                   |

Manual registration is time-consuming; organizing folder-name-based data into Excel enables bulk upload, and teachers can reuse the same format when adding content later.

---

## 21. Key Conclusions

- The core of the MLS MVP is not a "video upload system" but **"a system where approved students quickly find and watch the school-specific past-exam explainer videos they need."**
- The data structure must be normalized by **school, year, semester, exam type, and problem number**.
- Letting students self-register while granting approval authority to each branch teacher/admin is the most operationally efficient model.
- The existing KakaoTalk video-delivery method is replaced by in-system search and playback.
- The 1st MVP focuses on video search/playback, student approval, and admin registration; AI recommendations, wrong-answer notes, and learning reports come in phase 2 and beyond.
