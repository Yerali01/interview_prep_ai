import {
  getTopics as supabaseGetTopics,
  getDefinitions as supabaseGetDefinitions,
  getProjects as supabaseGetProjects,
  getQuizzes as supabaseGetQuizzes,
} from "./supabase-new"

import { firebaseGetTopics } from "./firebase-service"

import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "./firebase"

export interface MigrationResult {
  success: boolean
  migrated: number
  errors: string[]
  skipped: number
}

export async function migrateSupabaseToFirebase(): Promise<{
  topics: MigrationResult
  definitions: MigrationResult
  projects: MigrationResult
  quizzes: MigrationResult
}> {
  console.log("🚀 Starting migration from Supabase to Firebase...")

  const results = {
    topics: { success: false, migrated: 0, errors: [], skipped: 0 },
    definitions: { success: false, migrated: 0, errors: [], skipped: 0 },
    projects: { success: false, migrated: 0, errors: [], skipped: 0 },
    quizzes: { success: false, migrated: 0, errors: [], skipped: 0 },
  }

  // Migrate Topics
  try {
    console.log("📚 Migrating topics...")
    const supabaseTopics = await supabaseGetTopics()
    const firebaseTopics = await firebaseGetTopics()
    const existingSlugs = new Set(firebaseTopics.map((t) => t.slug))

    for (const topic of supabaseTopics) {
      if (existingSlugs.has(topic.slug)) {
        results.topics.skipped++
        continue
      }

      try {
        await addDoc(collection(db, "topics"), {
          title: topic.title,
          slug: topic.slug,
          description: topic.description,
          content: topic.content,
          level: topic.level,
          estimated_time: topic.estimated_time,
          created_at: serverTimestamp(),
          updated_at: serverTimestamp(),
        })
        results.topics.migrated++
      } catch (error: any) {
        results.topics.errors.push(`Topic ${topic.slug}: ${error.message}`)
      }
    }
    results.topics.success = true
  } catch (error: any) {
    results.topics.errors.push(`Failed to migrate topics: ${error.message}`)
  }

  // Migrate Definitions
  try {
    console.log("📖 Migrating definitions...")
    const supabaseDefinitions = await supabaseGetDefinitions()

    for (const definition of supabaseDefinitions) {
      try {
        await addDoc(collection(db, "definitions"), {
          term: definition.term,
          definition: definition.definition,
          category: definition.category,
          created_at: serverTimestamp(),
          updated_at: serverTimestamp(),
        })
        results.definitions.migrated++
      } catch (error: any) {
        results.definitions.errors.push(`Definition ${definition.term}: ${error.message}`)
      }
    }
    results.definitions.success = true
  } catch (error: any) {
    results.definitions.errors.push(`Failed to migrate definitions: ${error.message}`)
  }

  // Migrate Projects
  try {
    console.log("🚀 Migrating projects...")
    const supabaseProjects = await supabaseGetProjects()

    for (const project of supabaseProjects) {
      try {
        const projectRef = await addDoc(collection(db, "projects"), {
          name: project.name,
          slug: project.slug,
          description: project.description,
          difficulty_level: project.difficulty_level,
          estimated_duration: project.estimated_duration,
          category: project.category,
          github_url: project.github_url,
          demo_url: project.demo_url,
          image_url: project.image_url,
          is_pet_project: project.is_pet_project,
          real_world_example: project.real_world_example,
          created_at: serverTimestamp(),
          updated_at: serverTimestamp(),
        })

        // Migrate project technologies
        if (project.technologies) {
          for (const tech of project.technologies) {
            await addDoc(collection(db, "project_technologies"), {
              project_id: projectRef.id,
              technology_name: tech.technology_name,
              explanation: tech.explanation,
              is_required: tech.is_required,
              category: tech.category,
            })
          }
        }

        // Migrate project features
        if (project.features) {
          for (const feature of project.features) {
            await addDoc(collection(db, "project_features"), {
              project_id: projectRef.id,
              feature_name: feature.feature_name,
              description: feature.description,
              priority: feature.priority,
            })
          }
        }

        results.projects.migrated++
      } catch (error: any) {
        results.projects.errors.push(`Project ${project.slug}: ${error.message}`)
      }
    }
    results.projects.success = true
  } catch (error: any) {
    results.projects.errors.push(`Failed to migrate projects: ${error.message}`)
  }

  // Migrate Quizzes
  try {
    console.log("🧠 Migrating quizzes...")
    const supabaseQuizzes = await supabaseGetQuizzes()

    for (const quiz of supabaseQuizzes) {
      try {
        const quizRef = await addDoc(collection(db, "quizzes"), {
          slug: quiz.slug,
          title: quiz.title,
          description: quiz.description,
          level: quiz.level,
          created_at: serverTimestamp(),
          updated_at: serverTimestamp(),
        })

        // Note: You'll need to implement question migration separately
        // as the structure might be different

        results.quizzes.migrated++
      } catch (error: any) {
        results.quizzes.errors.push(`Quiz ${quiz.slug}: ${error.message}`)
      }
    }
    results.quizzes.success = true
  } catch (error: any) {
    results.quizzes.errors.push(`Failed to migrate quizzes: ${error.message}`)
  }

  console.log("✅ Migration completed!")
  console.log("📊 Results:", results)

  return results
}

export async function validateMigration() {
  console.log("🔍 Validating migration...")

  try {
    const [supabaseTopics, firebaseTopics] = await Promise.all([supabaseGetTopics(), firebaseGetTopics()])

    console.log(`📚 Topics: Supabase(${supabaseTopics.length}) vs Firebase(${firebaseTopics.length})`)

    // Add more validation logic here

    return {
      valid: supabaseTopics.length === firebaseTopics.length,
      supabaseCount: supabaseTopics.length,
      firebaseCount: firebaseTopics.length,
    }
  } catch (error) {
    console.error("❌ Validation failed:", error)
    return { valid: false, error }
  }
}
