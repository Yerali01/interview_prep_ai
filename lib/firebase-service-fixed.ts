import {
  collection,
  doc,
  getDocs,
  query,
  where,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  increment,
} from "firebase/firestore";
import { db } from "./firebase";
import { getUserRepositories } from "./repository-service-v2";
import { firebaseGetUserQuizResults } from "./firebase-service";

// Type definitions
type DifficultyLevel = "junior" | "middle" | "senior";

export interface Topic {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  level: DifficultyLevel;
  estimated_time: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Quiz {
  id: string;
  slug: string;
  title: string;
  description: string;
  level: string;
  createdAt?: string;
  updatedAt?: string;
  questions?: QuizQuestion[];
  questionsCount?: number;
}

export interface QuizQuestion {
  id: string;
  quiz_id: string;
  quiz_slug: string;
  question: string;
  options: Record<string, string>;
  correct_answer: string;
  explanation: string;
  category: string;
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  description: string;
  difficulty_level: DifficultyLevel;
  estimated_duration: string;
  category: string;
  github_url?: string;
  demo_url?: string;
  image_url?: string;
  is_pet_project: boolean;
  real_world_example?: string;
  createdAt?: string;
  updatedAt?: string;
  features?: string[];
  technologies?: string[];
}

// Get all topics with proper sorting
export async function firebaseGetTopics(): Promise<Topic[]> {
  try {
    console.log("🔥 Fetching topics from Firebase...");
    const topicsCollection = collection(db, "topics");
    const topicsSnapshot = await getDocs(topicsCollection);

    if (topicsSnapshot.empty) {
      console.log("⚠️ No topics found in Firebase");
      return [];
    }

    const topics = topicsSnapshot.docs.map((doc) => {
      const data = doc.data() as Topic;
      return {
        ...data,
        id: doc.id,
      };
    });

    // Sort topics by difficulty level (junior -> middle -> senior)
    const difficultyOrder: Record<DifficultyLevel, number> = {
      junior: 1,
      middle: 2,
      senior: 3,
    };

    topics.sort((a, b) => {
      const aOrder = difficultyOrder[a.level] || 999;
      const bOrder = difficultyOrder[b.level] || 999;
      return aOrder - bOrder;
    });

    console.log(
      `✅ Successfully fetched ${topics.length} topics from Firebase (sorted by difficulty)`
    );
    return topics;
  } catch (error: any) {
    console.error("❌ Error fetching topics from Firebase:", error);
    throw new Error(`Failed to fetch topics: ${error.message}`);
  }
}

// Get topic by slug
export async function firebaseGetTopicBySlug(
  slug: string
): Promise<Topic | null> {
  try {
    console.log(`🔥 Fetching topic with slug "${slug}" from Firebase...`);
    const topicsCollection = collection(db, "topics");
    const q = query(topicsCollection, where("slug", "==", slug));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log(`⚠️ No topic found with slug "${slug}"`);
      return null;
    }

    const doc = querySnapshot.docs[0];
    const topic = { ...doc.data(), id: doc.id } as Topic;

    console.log(`✅ Successfully fetched topic "${topic.title}"`);
    return topic;
  } catch (error: any) {
    console.error(`❌ Error fetching topic with slug "${slug}":`, error);
    throw new Error(`Failed to fetch topic: ${error.message}`);
  }
}

// Get all quizzes
export async function firebaseGetQuizzes(): Promise<Quiz[]> {
  try {
    console.log("🔥 Fetching quizzes from Firebase...");
    const quizzesCollection = collection(db, "quizzes");
    const quizzesSnapshot = await getDocs(quizzesCollection);

    if (quizzesSnapshot.empty) {
      console.log("⚠️ No quizzes found in Firebase");
      return [];
    }

    const quizzes = quizzesSnapshot.docs.map((doc) => {
      const data = doc.data() as Quiz;
      return {
        ...data,
        id: doc.id,
      };
    });

    console.log(
      `✅ Successfully fetched ${quizzes.length} quizzes from Firebase`
    );
    return quizzes;
  } catch (error: any) {
    console.error("❌ Error fetching quizzes from Firebase:", error);
    throw new Error(`Failed to fetch quizzes: ${error.message}`);
  }
}

// FIXED: Get quiz by slug with questions - Multiple strategies
export async function firebaseGetQuizBySlug(
  slug: string
): Promise<Quiz | null> {
  try {
    console.log(`🔥 Fetching quiz with slug "${slug}" from Firebase...`);

    // First, get the quiz
    const quizzesCollection = collection(db, "quizzes");
    const q = query(quizzesCollection, where("slug", "==", slug));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log(`⚠️ No quiz found with slug "${slug}"`);
      return null;
    }

    const doc = querySnapshot.docs[0];
    const quiz = { ...doc.data(), id: doc.id } as Quiz;
    console.log(`✅ Found quiz: ${quiz.title} (ID: ${quiz.id})`);

    // Now fetch questions using multiple strategies
    try {
      console.log(`🔍 Fetching questions for quiz...`);
      const questionsCollection = collection(db, "quiz_questions");

      // Strategy 1: Try quiz_slug
      console.log(`🔍 Strategy 1: Searching by quiz_slug = "${slug}"`);
      let questionsQuery = query(
        questionsCollection,
        where("quiz_slug", "==", slug)
      );
      let questionsSnapshot = await getDocs(questionsQuery);

      if (questionsSnapshot.empty) {
        console.log(`⚠️ No questions found with quiz_slug, trying quiz_id...`);
        // Strategy 2: Try quiz_id
        console.log(`🔍 Strategy 2: Searching by quiz_id = "${quiz.id}"`);
        questionsQuery = query(
          questionsCollection,
          where("quiz_id", "==", quiz.id)
        );
        questionsSnapshot = await getDocs(questionsQuery);
      }

      if (questionsSnapshot.empty) {
        console.log(
          `⚠️ No questions found with quiz_id, trying all questions...`
        );
        // Strategy 3: Get all questions and filter manually
        console.log(
          `🔍 Strategy 3: Getting all questions and filtering manually`
        );
        const allQuestionsSnapshot = await getDocs(questionsCollection);
        const allQuestions = allQuestionsSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            quiz_id: data.quiz_id || "",
            quiz_slug: data.quiz_slug || "",
            question: data.question || "",
            options: data.options || {}, // Ensure options is an object
            correct_answer: data.correct_answer || "",
            explanation: data.explanation || "",
            category: data.category || "",
          } as QuizQuestion; // Explicitly cast to QuizQuestion
        });

        console.log(`📊 Total questions in database: ${allQuestions.length}`);
        console.log(
          `📊 Sample questions:`,
          allQuestions.slice(0, 3).map((q) => ({
            id: q.id,
            quiz_id: q.quiz_id,
            quiz_slug: q.quiz_slug,
            question: q.question?.substring(0, 50) + "...",
          }))
        );

        // Filter questions that match either quiz_id or quiz_slug
        const matchingQuestions = allQuestions.filter(
          (q) =>
            q.quiz_id === quiz.id ||
            q.quiz_slug === slug ||
            q.quiz_slug === quiz.slug
        );

        console.log(`📊 Matching questions found: ${matchingQuestions.length}`);
        questionsSnapshot = {
          docs: matchingQuestions.map((q) => ({ data: () => q, id: q.id })),
        } as any; // Cast for compatibility
      }

      const questions = questionsSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as QuizQuestion[];

      console.log(
        `✅ Successfully fetched ${questions.length} questions for quiz "${quiz.title}"`
      );
      return { ...quiz, questions };
    } catch (error: any) {
      console.error(`❌ Error fetching questions for quiz "${slug}":`, error);
      return { ...quiz, questions: [] };
    }
  } catch (error: any) {
    console.error(`❌ Error fetching quiz with slug "${slug}":`, error);
    throw new Error(`Failed to fetch quiz: ${error.message}`);
  }
}

// Get questions by quiz slug
export async function firebaseGetQuestionsByQuizSlug(
  quizSlug: string
): Promise<QuizQuestion[]> {
  try {
    const questionsCollection = collection(db, "quiz_questions");
    const q = query(questionsCollection, where("quiz_slug", "==", quizSlug));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => {
      const data = doc.data() as QuizQuestion;
      return {
        id: doc.id,
        quiz_id: data.quiz_id || "",
        quiz_slug: data.quiz_slug || "",
        question: data.question || "",
        options: data.options || {}, // Ensure options is an object
        correct_answer: data.correct_answer || "",
        explanation: data.explanation || "",
        category: data.category || "",
      };
    });
  } catch (error: any) {
    console.error(
      `❌ Error fetching questions by quiz slug "${quizSlug}":`,
      error
    );
    throw new Error(`Failed to fetch questions: ${error.message}`);
  }
}

// Get all projects with proper sorting
export async function firebaseGetProjects(): Promise<Project[]> {
  try {
    console.log("🔥 Fetching projects from Firebase...");
    const projectsRef = collection(db, "projects");
    const snapshot = await getDocs(projectsRef);
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || "",
        slug: data.slug || "",
        description: data.description || "",
        difficulty_level: data.difficulty_level || "junior",
        estimated_duration: data.estimated_duration || "",
        category: data.category || "",
        github_url: data.github_url || null,
        demo_url: data.demo_url || null,
        image_url: data.image_url || null,
        is_pet_project: data.is_pet_project || false,
        real_world_example: data.real_world_example || null,
        createdAt: data.createdAt || "",
        updatedAt: data.updatedAt || "",
        features: (Array.isArray(data.features)
          ? data.features.map((f: any) =>
              typeof f === "object" && f !== null && "name" in f
                ? f.name
                : String(f)
            )
          : []) as string[],
        technologies: (Array.isArray(data.technologies)
          ? data.technologies.map((t: any) =>
              typeof t === "object" && t !== null && "name" in t
                ? t.name
                : String(t)
            )
          : []) as string[],
      };
    });
  } catch (error: any) {
    console.error("❌ Error fetching projects from Firebase:", error);
    throw new Error(`Failed to fetch projects: ${error.message}`);
  }
}

// Get project by slug
export async function firebaseGetProjectBySlug(
  slug: string
): Promise<Project | null> {
  try {
    console.log(`🔥 Fetching project with slug "${slug}" from Firebase...`);
    const projectsCollection = collection(db, "projects");
    const q = query(projectsCollection, where("slug", "==", slug));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log(`⚠️ No project found with slug "${slug}"`);
      return null;
    }

    const doc = querySnapshot.docs[0];
    const data = doc.data(); // Get data without casting immediately

    const project: Project = {
      id: doc.id,
      name: data.name || "",
      slug: data.slug || "",
      description: data.description || "",
      difficulty_level: data.difficulty_level || "junior",
      estimated_duration: data.estimated_duration || "",
      category: data.category || "",
      github_url: data.github_url || null,
      demo_url: data.demo_url || null,
      image_url: data.image_url || null,
      is_pet_project: data.is_pet_project || false,
      real_world_example: data.real_world_example || null,
      createdAt: data.createdAt || "",
      updatedAt: data.updatedAt || "",
      features: (Array.isArray(data.features)
        ? data.features.map((f: any) =>
            typeof f === "object" && f !== null && "name" in f
              ? f.name
              : String(f)
          )
        : []) as string[],
      technologies: (Array.isArray(data.technologies)
        ? data.technologies.map((t: any) =>
            typeof t === "object" && t !== null && "name" in t
              ? t.name
              : String(t)
          )
        : []) as string[],
    };

    console.log(`✅ Successfully fetched project "${project.name}"`);
    return project;
  } catch (error: any) {
    console.error(`❌ Error fetching project with slug "${slug}":`, error);
    throw new Error(`Failed to fetch project: ${error.message}`);
  }
}

// CRUD Operations for Quizzes
export async function firebaseCreateQuiz(
  quizData: Omit<Quiz, "id" | "createdAt" | "updatedAt">
): Promise<Quiz> {
  try {
    const docRef = doc(collection(db, "quizzes"));
    const now = new Date().toISOString();

    const quiz: Quiz = {
      id: docRef.id,
      ...quizData,
      createdAt: now,
      updatedAt: now,
    };

    await setDoc(docRef, quiz);
    console.log("✅ Quiz created successfully:", quiz.id);
    return quiz;
  } catch (error: any) {
    console.error("❌ Error creating quiz:", error);
    throw new Error(`Failed to create quiz: ${error.message}`);
  }
}

export async function firebaseUpdateQuiz(
  id: string,
  updates: Partial<Quiz>
): Promise<void> {
  try {
    const docRef = doc(db, "quizzes", id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
    console.log("✅ Quiz updated successfully:", id);
  } catch (error: any) {
    console.error("❌ Error updating quiz:", error);
    throw new Error(`Failed to update quiz: ${error.message}`);
  }
}

export async function firebaseDeleteQuiz(id: string): Promise<void> {
  try {
    const docRef = doc(db, "quizzes", id);
    await deleteDoc(docRef);
    console.log("✅ Quiz deleted successfully:", id);
  } catch (error: any) {
    console.error("❌ Error deleting quiz:", error);
    throw new Error(`Failed to delete quiz: ${error.message}`);
  }
}

// Add the missing firebaseSaveQuizResult function
export async function firebaseSaveQuizResult(
  userId: string,
  quizId: string,
  score: number,
  totalQuestions: number
) {
  try {
    const resultData = {
      userId,
      quizId,
      score,
      totalQuestions,
      percentage: Math.round((score / totalQuestions) * 100),
      completedAt: new Date().toISOString(),
    };

    const resultsRef = collection(db, "quiz_results");
    await addDoc(resultsRef, resultData);

    console.log("✅ Quiz result saved successfully");
    return { error: null };
  } catch (error: any) {
    console.error("❌ Error saving quiz result to Firebase:", error);
    return { error: { message: error.message, code: error.code } };
  }
}

// CRUD Operations for Topics
export async function firebaseCreateTopic(
  topicData: Omit<Topic, "id" | "createdAt" | "updatedAt">
): Promise<Topic> {
  try {
    const docRef = doc(collection(db, "topics"));
    const now = new Date().toISOString();

    const topic: Topic = {
      id: docRef.id,
      ...topicData,
      createdAt: now,
      updatedAt: now,
    };

    await setDoc(docRef, topic);
    console.log("✅ Topic created successfully:", topic.id);
    return topic;
  } catch (error: any) {
    console.error("❌ Error creating topic:", error);
    throw new Error(`Failed to create topic: ${error.message}`);
  }
}

export async function firebaseUpdateTopic(
  id: string,
  updates: Partial<Topic>
): Promise<void> {
  try {
    const docRef = doc(db, "topics", id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
    console.log("✅ Topic updated successfully:", id);
  } catch (error: any) {
    console.error("❌ Error updating topic:", error);
    throw new Error(`Failed to update topic: ${error.message}`);
  }
}

export async function firebaseDeleteTopic(id: string): Promise<void> {
  try {
    const docRef = doc(db, "topics", id);
    await deleteDoc(docRef);
    console.log("✅ Topic deleted successfully:", id);
  } catch (error: any) {
    console.error("❌ Error deleting topic:", error);
    throw new Error(`Failed to delete topic: ${error.message}`);
  }
}

// CRUD Operations for Projects
export async function firebaseCreateProject(
  projectData: Omit<Project, "id" | "createdAt" | "updatedAt">
): Promise<Project> {
  try {
    const docRef = doc(collection(db, "projects"));
    const now = new Date().toISOString();

    const project: Project = {
      id: docRef.id,
      ...projectData,
      createdAt: now,
      updatedAt: now,
    };

    await setDoc(docRef, project);
    console.log("✅ Project created successfully:", project.id);
    return project;
  } catch (error: any) {
    console.error("❌ Error creating project:", error);
    throw new Error(`Failed to create project: ${error.message}`);
  }
}

export async function firebaseUpdateProject(
  id: string,
  updates: Partial<Project>
): Promise<void> {
  try {
    const docRef = doc(db, "projects", id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
    console.log("✅ Project updated successfully:", id);
  } catch (error: any) {
    console.error("❌ Error updating project:", error);
    throw new Error(`Failed to update project: ${error.message}`);
  }
}

export async function firebaseDeleteProject(id: string): Promise<void> {
  try {
    const docRef = doc(db, "projects", id);
    await deleteDoc(docRef);
    console.log("✅ Project deleted successfully:", id);
  } catch (error: any) {
    console.error("❌ Error deleting project:", error);
    throw new Error(`Failed to delete project: ${error.message}`);
  }
}

// Get public user profile with repositories
export async function firebaseGetPublicUserProfile(userId: string) {
  try {
    console.log(`🔍 Getting public profile for user: ${userId}`);

    if (!userId) {
      console.warn("⚠️ No user ID provided to firebaseGetPublicUserProfile");
      return { error: "No user ID provided" };
    }

    // Get user document
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      console.log(`⚠️ User document not found for ID: ${userId}`);
      return { error: "User not found" };
    }

    const userData = userDoc.data();

    let repositories: string[] = [];
    try {
      repositories = await getUserRepositories(userId);
    } catch (repoError: any) {
      console.error(
        "❌ Error getting user repositories in public profile:",
        repoError
      );
      repositories = []; // Ensure it's an empty array on error
    }

    let quizCount = 0;
    try {
      const quizResults = await firebaseGetUserQuizResults(userId);
      quizCount = quizResults.length;
    } catch (quizError: any) {
      console.error(
        "❌ Error getting user quiz results in public profile:",
        quizError
      );
      quizCount = 0; // Ensure it's 0 on error
    }

    // Construct public profile
    const publicProfile = {
      id: userId,
      displayName: userData.displayName || userData.email || "Anonymous User",
      email: userData.email,
      photoURL: userData.photoURL || null,
      githubUsername: userData.githubUsername || null,
      bio: userData.bio || null,
      repositories,
      quizCount,
      joinedAt: userData.createdAt || null,
    };

    console.log(`✅ Successfully fetched public profile for user: ${userId}`);
    return { data: publicProfile, error: null };
  } catch (error: any) {
    console.error("❌ Error getting public user profile:", error);
    return { error: error.message || "Failed to fetch user profile" };
  }
}
