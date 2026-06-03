Background | 배경

Replace the current process of teachers manually sending past-exam solution videos via KakaoTalk (~600 videos) with a HEMS sub-module (HVX) where approved students search and watch videos by school / year / semester / exam type / problem number. Access is approval-based to prevent external leakage.

현재 선생님이 카카오톡으로 기출문제 풀이 영상(약 600개)을 개별 전달하는 방식을, 승인된 학생이 학교·연도·학기·시험구분·문항번호로 직접 검색·시청하는 HEMS 하위 모듈(HVX)로 전환. 외부 유출 방지를 위해 승인 기반 접근 제어 적용.

Scope (MVP) | 범위

Focus: "approved students can find & watch the videos they need" — not a full LMS.
핵심: "승인된 학생이 필요한 기출 풀이 영상을 찾아 본다" — 완전한 LMS 아님.

⚠️ Out of scope (this MVP): All AI/ML features (recommendation, auto-tagging, weak-point analysis, auto reports) — Phase 3, ON HOLD.
⚠️ 이번 범위 제외: 모든 AI/ML 기능(추천·자동태깅·취약문항분석·자동리포트) — Phase 3 보류.

Work Breakdown | 작업 분해

Day 1 — Foundation | 기초

Normalize data model & design DB (Branch / School / ExamSet / ProblemVideo / User) | 데이터 모델 정규화 및 DB 설계

Define role/permission policy (Student / Pending / Teacher / Branch Admin / Super Admin) | 권한 정책 정의

Screen design (student + admin) | 화면 설계

Day 2 — Auth & Approval | 인증·승인

[ ] Student self sign-up (default pending) | 학생 직접 회원가입(기본 pending)

[ ] Login (approved users only) + password hashing | 로그인(승인자만)+비밀번호 해시

[ ] Student approval/reject/block by Teacher+ | 강사 이상 학생 승인·반려·차단

[ ] Branch Admin = own branch / Super Admin = all | 관 관리자=자기 관 / 최고관리자=전체

Day 3 — Search & Playback | 검색·재생

Filter search: school/year/semester/exam type/grade/subject/problem no. | 필터 검색(학교·연도·학기·시험구분·학년·과목·문항번호)

Video list & detail | 영상 목록·상세

In-browser playback, responsive (tablet/mobile FIRST, PC parity) | 브라우저 재생, 반응형(태블릿·모바일 우선, PC 동일 기능)

"No videos registered" empty state | 결과 없음 안내

Storage decision + access-controlled video URL structure (no download button) | 저장 방식 결정 + 접근권한 URL 구조(다운로드 버튼 미제공)

Day 4 — Admin | 관리자

Admin video register (file upload + external URL) with required metadata | 관리자 영상 등록(파일 업로드+URL), 필수 메타데이터

Edit / delete / visibility (public·private·hidden) | 수정·삭제·공개관리

Duplicate problem-number warning in same exam set | 동일 시험세트 문항번호 중복 경고

Student approval admin screen | 학생 승인 관리 화면

Day 5 — Migration, QA & Deploy | 마이그레이션·검수·배포

Excel bulk-upload template + migrate existing ~600 videos | 엑셀 일괄 업로드 템플릿 + 기존 약 600개 마이그레이션

Completion status (none / partial / complete) per exam set | 완료상태 표시(미등록·일부등록·등록완료)

Sample data registration, QA per acceptance criteria, deploy | 샘플 등록·검수기준 QA·배포

Acceptance Criteria | 검수 기준

Unapproved students cannot access videos | 미승인 학생 영상 접근 불가

Approved students can search & play videos | 승인 학생 검색·재생 가능

Search by school name & problem number works | 학교명·문항번호 검색 동작

Tablet/mobile UI fully operable (priority QA) | 태블릿·모바일 UI 정상(우선 검수)

PC browser parity | PC 동일 기능

Admin can register video with required metadata | 관리자 필수 메타데이터로 등록

Visibility (public/private/hidden) controllable | 공개·비공개·숨김 제어

Passwords stored hashed (no plaintext) | 비밀번호 해시 저장

Deliverable UI labels in Korean | UI 라벨 한국어

Notes | 비고

Source: PRD (G-HEMS-HVX-PRD-20260602-001) | 출처: PRD 문서

Author / Requested by: CEO (Matt) | 요청자: 대표님

MVP open target in PRD: 2026-06-09 15:00; Internal deadline set to Fri 2026-06-05 (after lunch) per PM | PRD 목표 6/9이나 PM 지시로 내부 마감 6/5(금) 점심 이후로 설정

AIML work currently in progress is ON HOLD while this MVP is prioritized | 현재 진행 중인 AIML 작업은 본 MVP 우선으로 잠시 보류

Policy decisions pending (PRD §19): student access scope, publish criteria, etc. — recommended defaults noted in PRD | 정책 미결정(§19): 학생 접근범위·공개기준 등 — PRD 권장안 기준
