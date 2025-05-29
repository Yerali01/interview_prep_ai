import {
  getTopics as supabaseGetTopics,
  getDefinitions as supabaseGetDefinitions,
  getProjects as supabaseGetProjects,
  getQuizzes as supabaseGetQuizzes,
  getQuizBySlug as supabaseGetQuizBySlug,
} from "./supabase-new"

import { collection, addDoc, serverTimestamp, writeBatch, doc, getDocs, query, where, setDoc } from "firebase/firestore"
import { db } from "./firebase"

export interface RobustMigrationResult {
  success: boolean
  totalMigrated: number
  totalErrors: number
  totalSkipped: number
  details: {
    topics: MigrationDetail
    definitions: MigrationDetail
    projects: MigrationDetail
    quizzes: MigrationDetail
    questions: MigrationDetail
  }
  errors: string[]
}

export interface MigrationDetail {
  attempted: number
  migrated: number
  skipped: number
  errors: string[]
}

// Helper function to safely convert data
function sanitizeData(data: any): any {
  if (data === null || data === undefined) {
    return null
  }

  if (typeof data === "string") {
    return data.trim()
  }

  if (typeof data === "object" && !Array.isArray(data)) {
    const sanitized: any = {}
    for (const [key, value] of Object.entries(data)) {
      // Skip undefined values and functions
      if (value !== undefined && typeof value !== "function") {
        sanitized[key] = sanitizeData(value)
      }
    }
    return sanitized
  }

  if (Array.isArray(data)) {
    return data.map(sanitizeData)
  }

  return data
}

// Helper function to check if document exists
async function documentExists(collectionName: string, field: string, value: string): Promise<boolean> {
  try {
    const q = query(collection(db, collectionName), where(field, "==", value))
    const snapshot = await getDocs(q)
    return !snapshot.empty
  } catch (error) {
    console.error(`Error checking if document exists:`, error)
    return false
  }
}

export async function runRobustMigration(): Promise<RobustMigrationResult> {
  console.log("🚀 Starting ROBUST migration from Supabase to Firebase...")

  const result: RobustMigrationResult = {
    success: false,
    totalMigrated: 0,
    totalErrors: 0,
    totalSkipped: 0,
    details: {
      topics: { attempted: 0, migrated: 0, skipped: 0, errors: [] },
      definitions: { attempted: 0, migrated: 0, skipped: 0, errors: [] },
      projects: { attempted: 0, migrated: 0, skipped: 0, errors: [] },
      quizzes: { attempted: 0, migrated: 0, skipped: 0, errors: [] },
      questions: { attempted: 0, migrated: 0, skipped: 0, errors: [] },
    },
    errors: [],
  }

  try {
    // Test Firebase connection first
    console.log("🔍 Testing Firebase connection...")
    await getDocs(collection(db, "test"))
    console.log("✅ Firebase connection successful")

    // Step 1: Migrate Topics
    console.log("📚 Step 1: Migrating topics...")
    await migrateTopicsRobust(result.details.topics)

    // Step 2: Migrate Definitions
    console.log("📖 Step 2: Migrating definitions...")
    await migrateDefinitionsRobust(result.details.definitions)

    // Step 3: Migrate Projects
    console.log("🚀 Step 3: Migrating projects...")
    await migrateProjectsRobust(result.details.projects)

    // Step 4: Migrate Quizzes and Questions
    console.log("🧠 Step 4: Migrating quizzes and questions...")
    await migrateQuizzesRobust(result.details.quizzes, result.details.questions)

    // Calculate totals
    result.totalMigrated = Object.values(result.details).reduce((sum, detail) => sum + detail.migrated, 0)
    result.totalErrors = Object.values(result.details).reduce((sum, detail) => sum + detail.errors.length, 0)
    result.totalSkipped = Object.values(result.details).reduce((sum, detail) => sum + detail.skipped, 0)
    result.success = result.totalErrors === 0

    console.log("✅ ROBUST migration completed!")
    console.log(`📊 Total migrated: ${result.totalMigrated}`)
    console.log(`⏭️ Total skipped: ${result.totalSkipped}`)
    console.log(`❌ Total errors: ${result.totalErrors}`)

    return result
  } catch (error: any) {
    console.error("💥 Robust migration failed:", error)
    result.errors.push(`Migration failed: ${error.message}`)
    result.success = false
    return result
  }
}

async function migrateTopicsRobust(detail: MigrationDetail): Promise<void> {
  try {
    const supabaseTopics = await supabaseGetTopics()
    detail.attempted = supabaseTopics.length
    console.log(`📚 Found ${supabaseTopics.length} topics in Supabase`)

    for (const topic of supabaseTopics) {
      try {
        // Check if topic already exists
        if (await documentExists("topics", "slug", topic.slug)) {
          detail.skipped++
          console.log(`⏭️ Skipping existing topic: ${topic.slug}`)
          continue
        }

        // Sanitize and validate topic data
        const topicData = {
          title: sanitizeData(topic.title) || "Untitled",
          slug: sanitizeData(topic.slug) || `topic-${Date.now()}`,
          description: sanitizeData(topic.description) || "",
          content: sanitizeData(topic.content) || "",
          level: sanitizeData(topic.level) || "beginner",
          estimated_time: Number(topic.estimated_time) || 0,
          created_at: serverTimestamp(),
          updated_at: serverTimestamp(),
        }

        // Validate required fields
        if (!topicData.title || !topicData.slug) {
          detail.errors.push(`Topic missing required fields: ${JSON.stringify(topic)}`)
          continue
        }

        // Add to Firebase
        await addDoc(collection(db, "topics"), topicData)
        detail.migrated++
        console.log(`✅ Migrated topic: ${topicData.title}`)
      } catch (error: any) {
        detail.errors.push(`Topic ${topic.slug}: ${error.message}`)
        console.error(`❌ Failed to migrate topic ${topic.slug}:`, error)
      }
    }
  } catch (error: any) {
    detail.errors.push(`Failed to fetch topics from Supabase: ${error.message}`)
    console.error("❌ Topics migration failed:", error)
  }
}

async function migrateDefinitionsRobust(detail: MigrationDetail): Promise<void> {
  try {
    const supabaseDefinitions = await supabaseGetDefinitions()
    detail.attempted = supabaseDefinitions.length
    console.log(`📖 Found ${supabaseDefinitions.length} definitions in Supabase`)

    for (const definition of supabaseDefinitions) {
      try {
        // Check if definition already exists
        if (await documentExists("definitions", "term", definition.term)) {
          detail.skipped++
          console.log(`⏭️ Skipping existing definition: ${definition.term}`)
          continue
        }

        // Sanitize and validate definition data
        const definitionData = {
          term: sanitizeData(definition.term) || "Unknown Term",
          definition: sanitizeData(definition.definition) || "",
          category: sanitizeData(definition.category) || "general",
          created_at: serverTimestamp(),
          updated_at: serverTimestamp(),
        }

        // Validate required fields
        if (!definitionData.term || !definitionData.definition) {
          detail.errors.push(`Definition missing required fields: ${JSON.stringify(definition)}`)
          continue
        }

        // Add to Firebase
        await addDoc(collection(db, "definitions"), definitionData)
        detail.migrated++
        console.log(`✅ Migrated definition: ${definitionData.term}`)
      } catch (error: any) {
        detail.errors.push(`Definition ${definition.term}: ${error.message}`)
        console.error(`❌ Failed to migrate definition ${definition.term}:`, error)
      }
    }
  } catch (error: any) {
    detail.errors.push(`Failed to fetch definitions from Supabase: ${error.message}`)
    console.error("❌ Definitions migration failed:", error)
  }
}

async function migrateProjectsRobust(detail: MigrationDetail): Promise<void> {
  try {
    const supabaseProjects = await supabaseGetProjects()
    detail.attempted = supabaseProjects.length
    console.log(`🚀 Found ${supabaseProjects.length} projects in Supabase`)

    for (const project of supabaseProjects) {
      try {
        // Check if project already exists
        if (await documentExists("projects", "slug", project.slug)) {
          detail.skipped++
          console.log(`⏭️ Skipping existing project: ${project.slug}`)
          continue
        }

        // Sanitize and validate project data
        const projectData = {
          name: sanitizeData(project.name) || "Untitled Project",
          slug: sanitizeData(project.slug) || `project-${Date.now()}`,
          description: sanitizeData(project.description) || "",
          difficulty_level: sanitizeData(project.difficulty_level) || "beginner",
          estimated_duration: sanitizeData(project.estimated_duration) || "1 hour",
          category: sanitizeData(project.category) || "general",
          github_url: sanitizeData(project.github_url) || null,
          demo_url: sanitizeData(project.demo_url) || null,
          image_url: sanitizeData(project.image_url) || null,
          is_pet_project: Boolean(project.is_pet_project),
          real_world_example: sanitizeData(project.real_world_example) || null,
          // Store technologies and features as arrays in the project document
          technologies: sanitizeData(project.technologies) || [],
          features: sanitizeData(project.features) || [],
          created_at: serverTimestamp(),
          updated_at: serverTimestamp(),
        }

        // Validate required fields
        if (!projectData.name || !projectData.slug) {
          detail.errors.push(`Project missing required fields: ${JSON.stringify(project)}`)
          continue
        }

        // Add to Firebase with a specific document ID based on slug
        const projectRef = doc(db, "projects", projectData.slug)
        await setDoc(projectRef, projectData)
        detail.migrated++
        console.log(`✅ Migrated project: ${projectData.name}`)
        console.log(`📦 Technologies: ${projectData.technologies.length}`)
        console.log(`🎯 Features: ${projectData.features.length}`)
      } catch (error: any) {
        detail.errors.push(`Project ${project.slug}: ${error.message}`)
        console.error(`❌ Failed to migrate project ${project.slug}:`, error)
      }
    }
  } catch (error: any) {
    detail.errors.push(`Failed to fetch projects from Supabase: ${error.message}`)
    console.error("❌ Projects migration failed:", error)
  }
}

async function migrateQuizzesRobust(quizDetail: MigrationDetail, questionDetail: MigrationDetail): Promise<void> {
  try {
    const supabaseQuizzes = await supabaseGetQuizzes()
    quizDetail.attempted = supabaseQuizzes.length
    console.log(`🧠 Found ${supabaseQuizzes.length} quizzes in Supabase`)

    for (const quiz of supabaseQuizzes) {
      try {
        // Check if quiz already exists
        if (await documentExists("quizzes", "slug", quiz.slug)) {
          quizDetail.skipped++
          console.log(`⏭️ Skipping existing quiz: ${quiz.slug}`)
          continue
        }

        // Sanitize and validate quiz data
        const quizData = {
          slug: sanitizeData(quiz.slug) || `quiz-${Date.now()}`,
          title: sanitizeData(quiz.title) || "Untitled Quiz",
          description: sanitizeData(quiz.description) || "",
          level: sanitizeData(quiz.level) || "junior",
          created_at: serverTimestamp(),
          updated_at: serverTimestamp(),
        }

        // Validate required fields
        if (!quizData.title || !quizData.slug) {
          quizDetail.errors.push(`Quiz missing required fields: ${JSON.stringify(quiz)}`)
          continue
        }

        // Add quiz to Firebase
        const quizRef = await addDoc(collection(db, "quizzes"), quizData)
        quizDetail.migrated++
        console.log(`✅ Migrated quiz: ${quizData.title}`)

        // Get and migrate quiz questions
        try {
          const fullQuiz = await supabaseGetQuizBySlug(quiz.slug)
          if (fullQuiz && fullQuiz.questions && Array.isArray(fullQuiz.questions)) {
            questionDetail.attempted += fullQuiz.questions.length

            for (const question of fullQuiz.questions) {
              try {
                // Parse options if they're a string
                let options = question.options
                if (typeof options === "string") {
                  try {
                    options = JSON.parse(options)
                  } catch (e) {
                    console.warn(`Failed to parse options for question: ${question.question}`)
                    options = {}
                  }
                }

                const questionData = {
                  quiz_id: quizRef.id,
                  quiz_slug: quiz.slug,
                  question: sanitizeData(question.question) || "Unknown Question",
                  options: sanitizeData(options) || {},
                  correct_answer: sanitizeData(question.correct_answer) || "",
                  explanation: sanitizeData(question.explanation) || "",
                  category: sanitizeData(question.category) || "general",
                }

                // Validate required fields
                if (!questionData.question || !questionData.correct_answer) {
                  questionDetail.errors.push(`Question missing required fields: ${JSON.stringify(question)}`)
                  continue
                }

                await addDoc(collection(db, "quiz_questions"), questionData)
                questionDetail.migrated++
              } catch (error: any) {
                questionDetail.errors.push(`Question in quiz ${quiz.slug}: ${error.message}`)
                console.error(`❌ Failed to migrate question in quiz ${quiz.slug}:`, error)
              }
            }
          }
        } catch (error: any) {
          console.error(`❌ Failed to fetch questions for quiz ${quiz.slug}:`, error)
        }
      } catch (error: any) {
        quizDetail.errors.push(`Quiz ${quiz.slug}: ${error.message}`)
        console.error(`❌ Failed to migrate quiz ${quiz.slug}:`, error)
      }
    }
  } catch (error: any) {
    quizDetail.errors.push(`Failed to fetch quizzes from Supabase: ${error.message}`)
    console.error("❌ Quizzes migration failed:", error)
  }
}

// Test Firebase connection
export async function testFirebaseConnection(): Promise<{ success: boolean; error?: string }> {
  try {
    console.log("🔍 Testing Firebase connection...")

    // Test Firestore read
    const testCollection = collection(db, "test")
    await getDocs(testCollection)

    // Test Firestore write
    const testDoc = doc(testCollection, "connection-test")
    await setDoc(testDoc, {
      timestamp: serverTimestamp(),
      test: true,
    })

    console.log("✅ Firebase connection test successful")
    return { success: true }
  } catch (error: any) {
    console.error("❌ Firebase connection test failed:", error)
    return { success: false, error: error.message }
  }
}

// Clear Firebase collections for testing
export async function clearFirebaseCollections(): Promise<void> {
  const collections = [
    "topics",
    "definitions",
    "projects",
    "project_technologies",
    "project_features",
    "quizzes",
    "quiz_questions",
  ]

  console.log("🗑️ Clearing Firebase collections...")

  for (const collectionName of collections) {
    try {
      const snapshot = await getDocs(collection(db, collectionName))
      const batch = writeBatch(db)
      let count = 0

      snapshot.docs.forEach((document) => {
        batch.delete(document.ref)
        count++
      })

      if (count > 0) {
        await batch.commit()
        console.log(`🗑️ Cleared ${count} documents from ${collectionName}`)
      }
    } catch (error) {
      console.error(`❌ Error clearing ${collectionName}:`, error)
    }
  }

  console.log("✅ Firebase collections cleared")
}
