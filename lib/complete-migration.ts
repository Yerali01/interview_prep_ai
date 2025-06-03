import {
  getTopics as supabaseGetTopics,
  getDefinitions as supabaseGetDefinitions,
  getProjects as supabaseGetProjects,
  getQuizzes as supabaseGetQuizzes,
} from "./supabase-new";

import {
  collection,
  addDoc,
  serverTimestamp,
  writeBatch,
  doc,
  getDocs,
} from "firebase/firestore";
import { db } from "./firebase";

export interface CompleteMigrationResult {
  success: boolean;
  totalMigrated: number;
  totalErrors: number;
  details: {
    topics: MigrationResult;
    definitions: MigrationResult;
    projects: MigrationResult;
    quizzes: MigrationResult;
    projectTechnologies: MigrationResult;
    projectFeatures: MigrationResult;
    quizQuestions: MigrationResult;
  };
}

export interface MigrationResult {
  success: boolean;
  migrated: number;
  errors: string[];
  skipped: number;
}

export async function runCompleteMigration(): Promise<CompleteMigrationResult> {
  console.log("🚀 Starting COMPLETE migration from Supabase to Firebase...");

  const results: CompleteMigrationResult = {
    success: false,
    totalMigrated: 0,
    totalErrors: 0,
    details: {
      topics: { success: false, migrated: 0, errors: [], skipped: 0 },
      definitions: { success: false, migrated: 0, errors: [], skipped: 0 },
      projects: { success: false, migrated: 0, errors: [], skipped: 0 },
      quizzes: { success: false, migrated: 0, errors: [], skipped: 0 },
      projectTechnologies: {
        success: false,
        migrated: 0,
        errors: [],
        skipped: 0,
      },
      projectFeatures: { success: false, migrated: 0, errors: [], skipped: 0 },
      quizQuestions: { success: false, migrated: 0, errors: [], skipped: 0 },
    },
  };

  try {
    // Step 1: Migrate Topics
    console.log("📚 Step 1: Migrating topics...");
    results.details.topics = await migrateTopics();

    // Step 2: Migrate Definitions
    console.log("📖 Step 2: Migrating definitions...");
    results.details.definitions = await migrateDefinitions();

    // Step 3: Migrate Projects (and related data)
    console.log("🚀 Step 3: Migrating projects...");
    const projectMigration = await migrateProjectsComplete();
    results.details.projects = projectMigration.projects;
    results.details.projectTechnologies = projectMigration.technologies;
    results.details.projectFeatures = projectMigration.features;

    // Step 4: Migrate Quizzes (and questions)
    console.log("🧠 Step 4: Migrating quizzes...");
    const quizMigration = await migrateQuizzesComplete();
    results.details.quizzes = quizMigration.quizzes;
    results.details.quizQuestions = quizMigration.questions;

    // Calculate totals
    results.totalMigrated = Object.values(results.details).reduce(
      (sum, result) => sum + result.migrated,
      0
    );
    results.totalErrors = Object.values(results.details).reduce(
      (sum, result) => sum + result.errors.length,
      0
    );
    results.success = results.totalErrors === 0;

    console.log("✅ COMPLETE migration finished!");
    console.log(`📊 Total migrated: ${results.totalMigrated}`);
    console.log(`❌ Total errors: ${results.totalErrors}`);

    return results;
  } catch (error: any) {
    console.error("💥 Complete migration failed:", error);
    results.success = false;
    return results;
  }
}

async function migrateTopics(): Promise<MigrationResult> {
  const result: MigrationResult = {
    success: false,
    migrated: 0,
    errors: [],
    skipped: 0,
  };

  try {
    // Get existing Firebase topics to avoid duplicates
    const existingTopics = await getDocs(collection(db, "topics"));
    const existingSlugs = new Set(
      existingTopics.docs.map((doc) => doc.data().slug)
    );

    // Get Supabase topics
    const supabaseTopics = await supabaseGetTopics();
    console.log(`📚 Found ${supabaseTopics.length} topics in Supabase`);

    const batch = writeBatch(db);
    let batchCount = 0;

    for (const topic of supabaseTopics) {
      if (existingSlugs.has(topic.slug)) {
        result.skipped++;
        continue;
      }

      try {
        const topicRef = doc(collection(db, "topics"));
        batch.set(topicRef, {
          title: topic.title,
          slug: topic.slug,
          description: topic.description,
          content: topic.content,
          level: topic.level,
          estimated_time: topic.estimated_time,
          created_at: serverTimestamp(),
          updated_at: serverTimestamp(),
        });

        batchCount++;
        result.migrated++;

        // Commit batch every 500 operations (Firestore limit)
        if (batchCount >= 500) {
          await batch.commit();
          console.log(`📚 Committed batch of ${batchCount} topics`);
          batchCount = 0;
        }
      } catch (error: any) {
        result.errors.push(`Topic ${topic.slug}: ${error.message}`);
      }
    }

    // Commit remaining items
    if (batchCount > 0) {
      await batch.commit();
      console.log(`📚 Committed final batch of ${batchCount} topics`);
    }

    result.success = true;
    console.log(
      `✅ Topics migration completed: ${result.migrated} migrated, ${result.skipped} skipped`
    );
  } catch (error: any) {
    result.errors.push(`Failed to migrate topics: ${error.message}`);
    console.error("❌ Topics migration failed:", error);
  }

  return result;
}

async function migrateDefinitions(): Promise<MigrationResult> {
  const result: MigrationResult = {
    success: false,
    migrated: 0,
    errors: [],
    skipped: 0,
  };

  try {
    // Get existing Firebase definitions to avoid duplicates
    const existingDefinitions = await getDocs(collection(db, "definitions"));
    const existingTerms = new Set(
      existingDefinitions.docs.map((doc) => doc.data().term)
    );

    // Get Supabase definitions
    const supabaseDefinitions = await supabaseGetDefinitions();
    console.log(
      `📖 Found ${supabaseDefinitions.length} definitions in Supabase`
    );

    const batch = writeBatch(db);
    let batchCount = 0;

    for (const definition of supabaseDefinitions) {
      if (existingTerms.has(definition.term)) {
        result.skipped++;
        continue;
      }

      try {
        const definitionRef = doc(collection(db, "definitions"));
        batch.set(definitionRef, {
          term: definition.term,
          definition: definition.definition,
          category: definition.category,
          created_at: serverTimestamp(),
          updated_at: serverTimestamp(),
        });

        batchCount++;
        result.migrated++;

        if (batchCount >= 500) {
          await batch.commit();
          console.log(`📖 Committed batch of ${batchCount} definitions`);
          batchCount = 0;
        }
      } catch (error: any) {
        result.errors.push(`Definition ${definition.term}: ${error.message}`);
      }
    }

    if (batchCount > 0) {
      await batch.commit();
      console.log(`📖 Committed final batch of ${batchCount} definitions`);
    }

    result.success = true;
    console.log(
      `✅ Definitions migration completed: ${result.migrated} migrated, ${result.skipped} skipped`
    );
  } catch (error: any) {
    result.errors.push(`Failed to migrate definitions: ${error.message}`);
    console.error("❌ Definitions migration failed:", error);
  }

  return result;
}

async function migrateProjectsComplete(): Promise<{
  projects: MigrationResult;
  technologies: MigrationResult;
  features: MigrationResult;
}> {
  const projectsResult: MigrationResult = {
    success: false,
    migrated: 0,
    errors: [],
    skipped: 0,
  };
  const technologiesResult: MigrationResult = {
    success: false,
    migrated: 0,
    errors: [],
    skipped: 0,
  };
  const featuresResult: MigrationResult = {
    success: false,
    migrated: 0,
    errors: [],
    skipped: 0,
  };

  try {
    // Get existing Firebase projects to avoid duplicates
    const existingProjects = await getDocs(collection(db, "projects"));
    const existingSlugs = new Set(
      existingProjects.docs.map((doc) => doc.data().slug)
    );

    // Get Supabase projects
    const supabaseProjects = await supabaseGetProjects();
    console.log(`🚀 Found ${supabaseProjects.length} projects in Supabase`);

    for (const project of supabaseProjects) {
      if (existingSlugs.has(project.slug)) {
        projectsResult.skipped++;
        continue;
      }

      try {
        // Add project
        const projectRef = await addDoc(collection(db, "projects"), {
          name: project.name,
          slug: project.slug,
          description: project.description,
          difficulty_level: project.difficulty_level,
          estimated_duration: project.estimated_duration,
          category: project.category,
          github_url: project.github_url || null,
          demo_url: project.demo_url || null,
          image_url: project.image_url || null,
          is_pet_project: project.is_pet_project || false,
          real_world_example: project.real_world_example || null,
          created_at: serverTimestamp(),
          updated_at: serverTimestamp(),
        });

        projectsResult.migrated++;

        // Add project technologies
        if (project.technologies && project.technologies.length > 0) {
          const techBatch = writeBatch(db);
          let techBatchCount = 0;

          for (const tech of project.technologies) {
            const techRef = doc(collection(db, "project_technologies"));
            techBatch.set(techRef, {
              project_id: projectRef.id,
              technology_name: tech.technology_name,
              explanation: tech.explanation,
              is_required: tech.is_required || false,
              category: tech.category || "general",
            });
            techBatchCount++;
            technologiesResult.migrated++;
          }

          if (techBatchCount > 0) {
            await techBatch.commit();
          }
        }

        // Add project features
        if (project.features && project.features.length > 0) {
          const featuresBatch = writeBatch(db);
          let featuresBatchCount = 0;

          for (const feature of project.features) {
            const featureRef = doc(collection(db, "project_features"));
            featuresBatch.set(featureRef, {
              project_id: projectRef.id,
              feature_name: feature.feature_name,
              description: feature.description,
              priority: feature.priority || "medium",
            });
            featuresBatchCount++;
            featuresResult.migrated++;
          }

          if (featuresBatchCount > 0) {
            await featuresBatch.commit();
          }
        }

        console.log(`✅ Migrated project: ${project.name}`);
      } catch (error: any) {
        projectsResult.errors.push(`Project ${project.slug}: ${error.message}`);
      }
    }

    projectsResult.success = true;
    technologiesResult.success = true;
    featuresResult.success = true;

    console.log(
      `✅ Projects migration completed: ${projectsResult.migrated} projects migrated`
    );
    console.log(
      `✅ Technologies migration completed: ${technologiesResult.migrated} technologies migrated`
    );
    console.log(
      `✅ Features migration completed: ${featuresResult.migrated} features migrated`
    );
  } catch (error: any) {
    projectsResult.errors.push(`Failed to migrate projects: ${error.message}`);
    console.error("❌ Projects migration failed:", error);
  }

  return {
    projects: projectsResult,
    technologies: technologiesResult,
    features: featuresResult,
  };
}

async function migrateQuizzesComplete(): Promise<{
  quizzes: MigrationResult;
  questions: MigrationResult;
}> {
  const quizzesResult: MigrationResult = {
    success: false,
    migrated: 0,
    errors: [],
    skipped: 0,
  };
  const questionsResult: MigrationResult = {
    success: false,
    migrated: 0,
    errors: [],
    skipped: 0,
  };

  try {
    // Get existing Firebase quizzes to avoid duplicates
    const existingQuizzes = await getDocs(collection(db, "quizzes"));
    const existingSlugs = new Set(
      existingQuizzes.docs.map((doc) => doc.data().slug)
    );

    // Get Supabase quizzes
    const supabaseQuizzes = await supabaseGetQuizzes();
    console.log(`🧠 Found ${supabaseQuizzes.length} quizzes in Supabase`);

    for (const quiz of supabaseQuizzes) {
      if (existingSlugs.has(quiz.slug)) {
        quizzesResult.skipped++;
        continue;
      }

      try {
        // Add quiz
        const quizRef = await addDoc(collection(db, "quizzes"), {
          slug: quiz.slug,
          title: quiz.title,
          description: quiz.description,
          level: quiz.level,
          created_at: serverTimestamp(),
          updated_at: serverTimestamp(),
        });

        quizzesResult.migrated++;

        // Add quiz questions
        if (quiz.questions && quiz.questions.length > 0) {
          const questionsBatch = writeBatch(db);
          let questionsBatchCount = 0;

          for (const question of quiz.questions) {
            const questionRef = doc(collection(db, "quiz_questions"));
            questionsBatch.set(questionRef, {
              quiz_id: quizRef.id,
              question: question.question,
              options: question.options || [],
              correct_answer: question.correct_answer,
              explanation: question.explanation || null,
              order_index: question.order_index || 0,
            });
            questionsBatchCount++;
            questionsResult.migrated++;
          }

          if (questionsBatchCount > 0) {
            await questionsBatch.commit();
          }
        }

        console.log(`✅ Migrated quiz: ${quiz.title}`);
      } catch (error: any) {
        quizzesResult.errors.push(`Quiz ${quiz.slug}: ${error.message}`);
      }
    }

    quizzesResult.success = true;
    questionsResult.success = true;

    console.log(
      `✅ Quizzes migration completed: ${quizzesResult.migrated} quizzes migrated`
    );
    console.log(
      `✅ Questions migration completed: ${questionsResult.migrated} questions migrated`
    );
  } catch (error: any) {
    quizzesResult.errors.push(`Failed to migrate quizzes: ${error.message}`);
    console.error("❌ Quizzes migration failed:", error);
  }

  return {
    quizzes: quizzesResult,
    questions: questionsResult,
  };
}

export async function clearFirebaseData() {
  console.log("🗑️ Clearing Firebase data...");

  const collections = [
    "topics",
    "definitions",
    "projects",
    "project_technologies",
    "project_features",
    "quizzes",
    "quiz_questions",
    "users",
    "quiz_results",
    "user_topic_progress",
  ];

  for (const collectionName of collections) {
    try {
      const snapshot = await getDocs(collection(db, collectionName));
      const batch = writeBatch(db);
      let batchCount = 0;

      snapshot.docs.forEach((document) => {
        batch.delete(document.ref);
        batchCount++;
      });

      if (batchCount > 0) {
        await batch.commit();
        console.log(
          `🗑️ Cleared ${batchCount} documents from ${collectionName}`
        );
      }
    } catch (error) {
      console.error(`❌ Error clearing ${collectionName}:`, error);
    }
  }

  console.log("✅ Firebase data cleared");
}
