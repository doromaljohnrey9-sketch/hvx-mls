import { readFileSync } from "fs";
import { join } from "path";
import { and, eq, isNotNull, or } from "drizzle-orm";
import { db } from "../lib/drizzle/db";
import { branches, examSets, problemVideos, profiles, schools } from "./schemas";

type VideoSeedRow = {
  problemNumber: number;
  questionType?: "multiple_choice" | "essay";
  part?: number;
  videoUrl: string;
  filePath: string | null;
  duration: number | null;
  title: string;
  visibility?: "public" | "private" | "hidden";
  uploadStatus?: "pending" | "completed" | "failed";
  examSet: {
    year: number;
    semester: "1st" | "2nd";
    examType: "midterm" | "final";
    grade: number;
    subject: string;
    title: string;
    status?: "draft" | "published" | "hidden";
    school: {
      name: string;
      schoolType?: "high_school" | "middle_school" | "elementary";
      region: string | null;
      branch: {
        name: string;
        status?: "active" | "inactive";
      };
    };
  };
};

type ClearLevel = "none" | "videos" | "exam-sets" | "all";

type SkipReason =
  | "null_branch"
  | "missing_branch"
  | "missing_school"
  | "missing_exam_set"
  | "duplicate";

interface SkippedEntry {
  reason: SkipReason;
  title: string;
  problemNumber?: number;
  branchName?: string;
  schoolName?: string;
  examSetTitle?: string;
  detail?: string;
}

const SKIP_REASON_LABELS: Record<SkipReason, string> = {
  null_branch: "Missing branch name in JSON",
  missing_branch: "Branch not found in database",
  missing_school: "School not found in database",
  missing_exam_set: "Exam set not found in database",
  duplicate: "Video already exists (same exam set + problem number)",
};

const videosData: VideoSeedRow[] = JSON.parse(
  readFileSync(join(__dirname, "seed-data", "videos.json"), "utf8")
);

function parseArgs(): { clear: ClearLevel } {
  const args = process.argv.slice(2);
  let clear: ClearLevel = "none";

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === "--clear" && args[i + 1]) {
      clear = args[i + 1] as ClearLevel;
      i++;
      continue;
    }

    if (arg.startsWith("--clear=")) {
      clear = arg.split("=")[1] as ClearLevel;
    }
  }

  const validLevels: ClearLevel[] = ["none", "videos", "exam-sets", "all"];
  if (!validLevels.includes(clear)) {
    console.error(`Invalid --clear value: "${clear}". Use one of: ${validLevels.join(", ")}`);
    process.exit(1);
  }

  return { clear };
}

function trackSkip(skipped: SkippedEntry[], entry: SkippedEntry) {
  skipped.push(entry);
}

function printSkipSummary(skipped: SkippedEntry[]) {
  if (skipped.length === 0) {
    console.log("\n📋 Skip summary: none");
    return;
  }

  console.log(`\n📋 Skip summary (${skipped.length} total):`);

  const byReason = new Map<SkipReason, SkippedEntry[]>();
  for (const entry of skipped) {
    const group = byReason.get(entry.reason) ?? [];
    group.push(entry);
    byReason.set(entry.reason, group);
  }

  for (const reason of Object.keys(SKIP_REASON_LABELS) as SkipReason[]) {
    const entries = byReason.get(reason);
    if (!entries?.length) continue;

    console.log(`\n  ${SKIP_REASON_LABELS[reason]} (${entries.length})`);
    for (const entry of entries) {
      const parts = [`    - ${entry.title}`];
      if (entry.problemNumber !== undefined) parts.push(`#${entry.problemNumber}`);
      if (entry.branchName) parts.push(`branch="${entry.branchName}"`);
      if (entry.schoolName) parts.push(`school="${entry.schoolName}"`);
      if (entry.examSetTitle) parts.push(`examSet="${entry.examSetTitle}"`);
      if (entry.detail) parts.push(`(${entry.detail})`);
      console.log(parts.join(" | "));
    }
  }
}

async function clearData(level: ClearLevel) {
  if (level === "none") return;

  console.log(`\n🗑️  Clearing existing data (level: ${level})...`);

  if (level === "videos" || level === "exam-sets" || level === "all") {
    const deletedVideos = await db.delete(problemVideos).returning({ id: problemVideos.id });
    console.log(`  ✓ Deleted ${deletedVideos.length} problem videos`);
  }

  if (level === "exam-sets" || level === "all") {
    const deletedExamSets = await db.delete(examSets).returning({ id: examSets.id });
    console.log(`  ✓ Deleted ${deletedExamSets.length} exam sets`);
  }

  if (level === "all") {
    const nulledProfiles = await db
      .update(profiles)
      .set({ branchId: null, schoolId: null })
      .where(or(isNotNull(profiles.branchId), isNotNull(profiles.schoolId)))
      .returning({ id: profiles.id });
    if (nulledProfiles.length > 0) {
      console.log(`  ✓ Cleared branch/school references on ${nulledProfiles.length} profiles`);
    }

    const deletedSchools = await db.delete(schools).returning({ id: schools.id });
    console.log(`  ✓ Deleted ${deletedSchools.length} schools`);

    const deletedBranches = await db.delete(branches).returning({ id: branches.id });
    console.log(`  ✓ Deleted ${deletedBranches.length} branches`);
  }
}

async function seedVideos(clear: ClearLevel) {
  const skipped: SkippedEntry[] = [];

  console.log("🌱 Starting video seed process...");
  if (clear !== "none") {
    console.log(`   Clear mode: ${clear}`);
  }

  await clearData(clear);

  const nullBranchVideos = videosData.filter((video) => {
    const branchName = video.examSet?.school?.branch?.name;
    return branchName === null || branchName === undefined || branchName === "";
  });

  for (const video of nullBranchVideos) {
    trackSkip(skipped, {
      reason: "null_branch",
      title: video.title ?? "(untitled)",
      problemNumber: video.problemNumber,
      schoolName: video.examSet?.school?.name,
      examSetTitle: video.examSet?.title,
      detail: "examSet.school.branch.name is empty",
    });
  }

  const validVideos = videosData.filter((video) => {
    const branchName = video.examSet?.school?.branch?.name;
    return branchName !== null && branchName !== undefined && branchName !== "";
  });

  console.log(`\nTotal videos in JSON: ${videosData.length}`);
  console.log(`Valid videos (with branch): ${validVideos.length}`);
  console.log(`Skipped videos (null branch): ${nullBranchVideos.length}`);

  console.log("\n📦 Step 1: Seeding branches...");
  const branchNameToIdMap = new Map<string, string>();
  const uniqueBranches = new Map<string, { name: string; status: "active" | "inactive" }>();

  for (const video of validVideos) {
    const branch = video.examSet.school.branch;
    if (branch?.name) {
      uniqueBranches.set(branch.name, {
        name: branch.name,
        status: branch.status || "active",
      });
    }
  }

  console.log(`Found ${uniqueBranches.size} unique branches:`, Array.from(uniqueBranches.keys()));

  for (const [branchName, branchData] of uniqueBranches) {
    const [existingBranch] = await db
      .select()
      .from(branches)
      .where(eq(branches.name, branchName))
      .limit(1);

    if (!existingBranch) {
      const [branch] = await db
        .insert(branches)
        .values({
          name: branchData.name,
          status: branchData.status,
        })
        .returning();
      branchNameToIdMap.set(branchName, branch.id);
      console.log(`  ✓ Created branch: ${branchName}`);
    } else {
      branchNameToIdMap.set(branchName, existingBranch.id);
      console.log(`  ✓ Found existing branch: ${branchName}`);
    }
  }

  console.log("\n🏫 Step 2: Seeding schools...");
  const schoolKeyToIdMap = new Map<string, string>();
  const uniqueSchools = new Map<
    string,
    {
      name: string;
      branchId: string;
      schoolType: "high_school" | "middle_school" | "elementary";
      region: string | null;
    }
  >();

  for (const video of validVideos) {
    const schoolData = video.examSet.school;
    const branchName = schoolData.branch.name;
    const branchId = branchNameToIdMap.get(branchName);

    if (!branchId) {
      console.warn(
        `  ⚠ No branch found for branch: ${branchName}, skipping school: ${schoolData.name}`
      );
      continue;
    }

    const schoolKey = `${schoolData.name}|${branchId}`;
    if (!uniqueSchools.has(schoolKey)) {
      uniqueSchools.set(schoolKey, {
        name: schoolData.name,
        branchId,
        schoolType: schoolData.schoolType || "high_school",
        region: schoolData.region,
      });
    }
  }

  console.log(`Found ${uniqueSchools.size} unique schools`);

  for (const [schoolKey, schoolData] of uniqueSchools) {
    const [existingSchool] = await db
      .select()
      .from(schools)
      .where(and(eq(schools.name, schoolData.name), eq(schools.branchId, schoolData.branchId)))
      .limit(1);

    if (!existingSchool) {
      const [school] = await db
        .insert(schools)
        .values({
          name: schoolData.name,
          branchId: schoolData.branchId,
          schoolType: schoolData.schoolType,
          region: schoolData.region,
        })
        .returning();
      schoolKeyToIdMap.set(schoolKey, school.id);
      console.log(`  ✓ Created school: ${schoolData.name}`);
    } else {
      schoolKeyToIdMap.set(schoolKey, existingSchool.id);
      console.log(`  ✓ Found existing school: ${schoolData.name}`);
    }
  }

  console.log("\n📝 Step 3: Seeding exam sets...");
  const examSetKeyToIdMap = new Map<string, string>();
  const uniqueExamSets = new Map<
    string,
    {
      schoolId: string;
      year: number;
      semester: "1st" | "2nd";
      examType: "midterm" | "final";
      grade: number;
      subject: string;
      title: string;
      status: "draft" | "published" | "hidden";
    }
  >();

  for (const video of validVideos) {
    const examSetData = video.examSet;
    const schoolData = examSetData.school;
    const branchName = schoolData.branch.name;
    const branchId = branchNameToIdMap.get(branchName);

    if (!branchId) {
      console.warn(`  ⚠ No branch found for branch: ${branchName}, skipping exam set`);
      continue;
    }

    const schoolKey = `${schoolData.name}|${branchId}`;
    const schoolId = schoolKeyToIdMap.get(schoolKey);

    if (!schoolId) {
      console.warn(`  ⚠ No school found for: ${schoolData.name}, skipping exam set`);
      continue;
    }

    const examSetKey = `${schoolId}|${examSetData.year}|${examSetData.semester}|${examSetData.examType}|${examSetData.grade}|${examSetData.subject}`;

    if (!uniqueExamSets.has(examSetKey)) {
      uniqueExamSets.set(examSetKey, {
        schoolId,
        year: examSetData.year,
        semester: examSetData.semester,
        examType: examSetData.examType,
        grade: examSetData.grade,
        subject: examSetData.subject,
        title: examSetData.title,
        status: examSetData.status || "draft",
      });
    }
  }

  console.log(`Found ${uniqueExamSets.size} unique exam sets`);

  for (const [examSetKey, examSetData] of uniqueExamSets) {
    const [existingExamSet] = await db
      .select()
      .from(examSets)
      .where(
        and(
          eq(examSets.schoolId, examSetData.schoolId),
          eq(examSets.year, examSetData.year),
          eq(examSets.semester, examSetData.semester),
          eq(examSets.examType, examSetData.examType),
          eq(examSets.grade, examSetData.grade),
          eq(examSets.subject, examSetData.subject)
        )
      )
      .limit(1);

    if (!existingExamSet) {
      const [examSet] = await db
        .insert(examSets)
        .values({
          schoolId: examSetData.schoolId,
          year: examSetData.year,
          semester: examSetData.semester,
          examType: examSetData.examType,
          grade: examSetData.grade,
          subject: examSetData.subject,
          title: examSetData.title,
          status: examSetData.status,
        })
        .returning();
      examSetKeyToIdMap.set(examSetKey, examSet.id);
      console.log(`  ✓ Created exam set: ${examSetData.title}`);
    } else {
      examSetKeyToIdMap.set(examSetKey, existingExamSet.id);
      console.log(`  ✓ Found existing exam set: ${examSetData.title}`);
    }
  }

  console.log("\n🎥 Step 4: Seeding videos...");
  let createdCount = 0;

  for (const video of validVideos) {
    const examSetData = video.examSet;
    const schoolData = examSetData.school;
    const branchName = schoolData.branch.name;
    const branchId = branchNameToIdMap.get(branchName);

    if (!branchId) {
      trackSkip(skipped, {
        reason: "missing_branch",
        title: video.title,
        problemNumber: video.problemNumber,
        branchName,
        schoolName: schoolData.name,
        examSetTitle: examSetData.title,
      });
      continue;
    }

    const schoolKey = `${schoolData.name}|${branchId}`;
    const schoolId = schoolKeyToIdMap.get(schoolKey);

    if (!schoolId) {
      trackSkip(skipped, {
        reason: "missing_school",
        title: video.title,
        problemNumber: video.problemNumber,
        branchName,
        schoolName: schoolData.name,
        examSetTitle: examSetData.title,
      });
      continue;
    }

    const examSetKey = `${schoolId}|${examSetData.year}|${examSetData.semester}|${examSetData.examType}|${examSetData.grade}|${examSetData.subject}`;
    const examSetId = examSetKeyToIdMap.get(examSetKey);

    if (!examSetId) {
      trackSkip(skipped, {
        reason: "missing_exam_set",
        title: video.title,
        problemNumber: video.problemNumber,
        branchName,
        schoolName: schoolData.name,
        examSetTitle: examSetData.title,
      });
      continue;
    }

    const questionType = video.questionType ?? "multiple_choice";
    const part = video.part ?? 1;

    const [existingVideo] = await db
      .select()
      .from(problemVideos)
      .where(
        and(
          eq(problemVideos.examSetId, examSetId),
          eq(problemVideos.problemNumber, video.problemNumber),
          eq(problemVideos.questionType, questionType),
          eq(problemVideos.part, part)
        )
      )
      .limit(1);

    if (existingVideo) {
      trackSkip(skipped, {
        reason: "duplicate",
        title: video.title,
        problemNumber: video.problemNumber,
        branchName,
        schoolName: schoolData.name,
        examSetTitle: examSetData.title,
        detail: `existing video id=${existingVideo.id}`,
      });
      continue;
    }

    await db.insert(problemVideos).values({
      examSetId,
      problemNumber: video.problemNumber,
      questionType,
      part,
      videoUrl: video.videoUrl,
      filePath: video.filePath,
      duration: video.duration,
      title: video.title,
      visibility: video.visibility || "private",
      uploadStatus: video.uploadStatus || "completed",
    });

    createdCount++;
    if (createdCount % 100 === 0) {
      console.log(`  Processed ${createdCount} videos...`);
    }
  }

  const videoStepSkipped = skipped.filter((e) => e.reason !== "null_branch").length;

  console.log(`\n✅ Seed process completed!`);
  console.log(`   Created ${createdCount} videos`);
  console.log(`   Skipped ${videoStepSkipped} videos during seeding`);
  console.log(`   Skipped ${nullBranchVideos.length} videos before seeding (null branch)`);
  console.log(`   Total skipped: ${skipped.length}`);
  console.log(`   Total valid videos: ${validVideos.length}`);

  printSkipSummary(skipped);
}

const { clear } = parseArgs();

seedVideos(clear)
  .then(() => {
    console.log("\n🎉 Seed completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Seed failed:", error);
    process.exit(1);
  });
