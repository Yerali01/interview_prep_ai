import { collection, doc, getDocs, writeBatch, getFirestore } from "firebase/firestore"
import { app } from "./firebase"

const db = getFirestore(app)

// Sample data that matches your app structure
const SAMPLE_TOPICS = [
  {
    id: "1",
    title: "Flutter Widgets",
    slug: "flutter-widgets",
    description: "Learn about Flutter widgets and how to use them effectively",
    content: "Flutter widgets are the building blocks of Flutter applications...",
    level: "junior",
    estimated_time: 15,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "State Management",
    slug: "state-management",
    description: "Understanding state management in Flutter applications",
    content: "State management is crucial for building scalable Flutter apps...",
    level: "middle",
    estimated_time: 25,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Performance Optimization",
    slug: "performance-optimization",
    description: "Advanced techniques for optimizing Flutter app performance",
    content: "Performance optimization involves multiple strategies...",
    level: "senior",
    estimated_time: 35,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const SAMPLE_QUIZZES = [
  {
    id: "1",
    slug: "flutter-basics",
    title: "Flutter Basics Quiz",
    description: "Test your knowledge of Flutter fundamentals",
    level: "junior",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    slug: "advanced-flutter",
    title: "Advanced Flutter Quiz",
    description: "Challenge yourself with advanced Flutter concepts",
    level: "senior",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const SAMPLE_QUESTIONS = [
  {
    id: "1",
    quiz_id: "1",
    quiz_slug: "flutter-basics",
    question: "What is a Widget in Flutter?",
    options: {
      a: "A building block of Flutter UI",
      b: "A database connection",
      c: "A network request",
      d: "A file system",
    },
    correct_answer: "a",
    explanation: "Widgets are the building blocks of Flutter user interfaces.",
    category: "basics",
  },
  {
    id: "2",
    quiz_id: "1",
    quiz_slug: "flutter-basics",
    question: "Which widget is used for layout in Flutter?",
    options: {
      a: "Text",
      b: "Container",
      c: "Image",
      d: "Button",
    },
    correct_answer: "b",
    explanation: "Container is commonly used for layout and styling in Flutter.",
    category: "widgets",
  },
  {
    id: "3",
    quiz_id: "2",
    quiz_slug: "advanced-flutter",
    question: "What is the purpose of BuildContext?",
    options: {
      a: "To build widgets",
      b: "To provide widget tree location",
      c: "To manage state",
      d: "To handle events",
    },
    correct_answer: "b",
    explanation: "BuildContext provides the location of a widget in the widget tree.",
    category: "advanced",
  },
]

const SAMPLE_PROJECTS = [
  {
    id: "1",
    name: "Todo App",
    slug: "todo-app",
    description: "Build a simple todo application with CRUD operations",
    difficulty_level: "beginner",
    estimated_duration: "2-3 hours",
    category: "Mobile App",
    github_url: "https://github.com/example/todo-app",
    demo_url: "https://todo-app-demo.com",
    image_url: "/placeholder.svg?height=200&width=300",
    is_pet_project: false,
    real_world_example: "Similar to apps like Any.do or Todoist",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Weather App",
    slug: "weather-app",
    description: "Create a weather application with API integration",
    difficulty_level: "intermediate",
    estimated_duration: "4-6 hours",
    category: "API Integration",
    github_url: "https://github.com/example/weather-app",
    demo_url: "https://weather-app-demo.com",
    image_url: "/placeholder.svg?height=200&width=300",
    is_pet_project: true,
    real_world_example: "Similar to Weather.com or AccuWeather apps",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    name: "E-commerce App",
    slug: "ecommerce-app",
    description: "Build a full-featured e-commerce application",
    difficulty_level: "advanced",
    estimated_duration: "2-3 weeks",
    category: "Full Stack",
    github_url: "https://github.com/example/ecommerce-app",
    demo_url: "https://ecommerce-demo.com",
    image_url: "/placeholder.svg?height=200&width=300",
    is_pet_project: false,
    real_world_example: "Similar to Amazon or eBay mobile apps",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export async function setupFirebaseData() {
  console.log("🔥 Starting Firebase data setup...")

  try {
    const batch = writeBatch(db)

    // Setup Topics
    console.log("📝 Setting up topics...")
    for (const topic of SAMPLE_TOPICS) {
      const topicRef = doc(db, "topics", topic.id)
      batch.set(topicRef, topic)
    }

    // Setup Quizzes
    console.log("🧩 Setting up quizzes...")
    for (const quiz of SAMPLE_QUIZZES) {
      const quizRef = doc(db, "quizzes", quiz.id)
      batch.set(quizRef, quiz)
    }

    // Setup Questions
    console.log("❓ Setting up questions...")
    for (const question of SAMPLE_QUESTIONS) {
      const questionRef = doc(db, "questions", question.id)
      batch.set(questionRef, question)
    }

    // Setup Projects
    console.log("🚀 Setting up projects...")
    for (const project of SAMPLE_PROJECTS) {
      const projectRef = doc(db, "projects", project.id)
      batch.set(projectRef, project)
    }

    // Commit all changes
    await batch.commit()

    console.log("✅ Firebase data setup completed successfully!")
    return { success: true, message: "All data has been set up successfully!" }
  } catch (error) {
    console.error("❌ Firebase data setup failed:", error)
    return { success: false, error: error.message }
  }
}

export async function verifyFirebaseData() {
  console.log("🔍 Verifying Firebase data...")

  try {
    const results = {
      topics: 0,
      quizzes: 0,
      questions: 0,
      projects: 0,
    }

    // Check topics
    const topicsSnapshot = await getDocs(collection(db, "topics"))
    results.topics = topicsSnapshot.size

    // Check quizzes
    const quizzesSnapshot = await getDocs(collection(db, "quizzes"))
    results.quizzes = quizzesSnapshot.size

    // Check questions
    const questionsSnapshot = await getDocs(collection(db, "questions"))
    results.questions = questionsSnapshot.size

    // Check projects
    const projectsSnapshot = await getDocs(collection(db, "projects"))
    results.projects = projectsSnapshot.size

    console.log("📊 Firebase data verification results:", results)
    return results
  } catch (error) {
    console.error("❌ Firebase data verification failed:", error)
    throw error
  }
}

export async function clearFirebaseData() {
  console.log("🗑️ Clearing Firebase data...")

  try {
    const batch = writeBatch(db)

    // Clear all collections
    const collections = ["topics", "quizzes", "questions", "projects"]

    for (const collectionName of collections) {
      const snapshot = await getDocs(collection(db, collectionName))
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref)
      })
    }

    await batch.commit()
    console.log("✅ Firebase data cleared successfully!")
  } catch (error) {
    console.error("❌ Firebase data clearing failed:", error)
    throw error
  }
}
