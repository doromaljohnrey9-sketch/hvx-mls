import "dotenv/config";
import { db } from "../lib/drizzle/db";
import { branches, schools } from "./schemas";
import seedData from "./seed-data/schools.json";

async function seed() {
  console.log("🌱 Starting seed...");

  try {
    // Insert branches
    console.log("📦 Seeding branches...");
    const branchRecords: (typeof branches.$inferInsert)[] = [];

    for (const branchData of seedData) {
      const [branch] = await db
        .insert(branches)
        .values({
          name: branchData.name,
        })
        .returning();

      branchRecords.push(branch);
      console.log(`  ✅ Created branch: ${branch.name}`);

      // Insert schools for this branch
      console.log(`📚 Seeding schools for ${branch.name}...`);
      for (const schoolData of branchData.schools) {
        const [school] = await db
          .insert(schools)
          .values({
            name: schoolData.name,
            branchId: branch.id,
          })
          .returning();

        console.log(`  ✅ Created school: ${school.name}`);
      }
    }

    console.log("✅ Seed completed successfully!");
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
}

seed();
