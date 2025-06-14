"use client";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  type User,
  signInWithPopup,
  linkWithPopup,
  GithubAuthProvider,
} from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  query,
  where,
  orderBy,
  addDoc,
  arrayUnion,
  increment,
} from "firebase/firestore";
import { auth, db } from "./firebase";

// Auth functions
export const firebaseSignUp = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    return { user: null, error: { message: error.message, code: error.code } };
  }
};

export const firebaseSignIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    return { user: null, error: { message: error.message, code: error.code } };
  }
};

export const firebaseSignInWithGitHub = async () => {
  try {
    const provider = new GithubAuthProvider();
    provider.addScope("repo");
    const result = await signInWithPopup(auth, provider);
    return { user: result.user, error: null };
  } catch (error: any) {
    return { user: null, error: { message: error.message, code: error.code } };
  }
};

export const firebaseLinkGitHubAccount = async () => {
  try {
    if (!auth.currentUser) {
      throw new Error("No user signed in");
    }
    const provider = new GithubAuthProvider();
    provider.addScope("repo");
    const result = await linkWithPopup(auth.currentUser, provider);
    return { user: result.user, error: null };
  } catch (error: any) {
    return { user: null, error: { message: error.message, code: error.code } };
  }
};

export const firebaseSignOut = async () => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error: any) {
    return { error: { message: error.message, code: error.code } };
  }
};

export const firebaseResetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { error: null };
  } catch (error: any) {
    return { error: { message: error.message, code: error.code } };
  }
};

export const onFirebaseAuthStateChanged = (
  callback: (user: User | null) => void
) => {
  return onAuthStateChanged(auth, callback);
};

// Data functions
export const firebaseGetTopics = async () => {
  try {
    const topicsRef = collection(db, "topics");
    const snapshot = await getDocs(topicsRef);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching topics from Firebase:", error);
    throw error;
  }
};

export const firebaseGetTopicBySlug = async (slug: string) => {
  try {
    const topicsRef = collection(db, "topics");
    const q = query(topicsRef, where("slug", "==", slug));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  } catch (error) {
    console.error("Error fetching topic by slug from Firebase:", error);
    throw error;
  }
};

export const firebaseGetDefinitions = async () => {
  try {
    const definitionsRef = collection(db, "definitions");
    const snapshot = await getDocs(definitionsRef);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching definitions from Firebase:", error);
    throw error;
  }
};

export const firebaseGetDefinitionByTerm = async (term: string) => {
  try {
    const definitionsRef = collection(db, "definitions");
    const q = query(definitionsRef, where("term", "==", term));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  } catch (error) {
    console.error("Error fetching definition by term from Firebase:", error);
    throw error;
  }
};

export const firebaseGetProjects = async () => {
  try {
    const projectsRef = collection(db, "projects");
    const snapshot = await getDocs(projectsRef);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching projects from Firebase:", error);
    throw error;
  }
};

export const firebaseGetProjectBySlug = async (slug: string) => {
  try {
    const projectsRef = collection(db, "projects");
    const q = query(projectsRef, where("slug", "==", slug));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  } catch (error) {
    console.error("Error fetching project by slug from Firebase:", error);
    throw error;
  }
};

export const firebaseGetQuizzes = async () => {
  try {
    const quizzesRef = collection(db, "quizzes");
    const snapshot = await getDocs(quizzesRef);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching quizzes from Firebase:", error);
    return [];
  }
};

export const firebaseGetQuizBySlug = async (slug: string) => {
  try {
    const quizzesRef = collection(db, "quizzes");
    const q = query(quizzesRef, where("slug", "==", slug));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  } catch (error) {
    console.error("Error fetching quiz by slug from Firebase:", error);
    throw error;
  }
};

export const firebaseGetQuizById = async (id: string) => {
  try {
    const quizRef = doc(db, "quizzes", id);
    const snapshot = await getDoc(quizRef);

    if (!snapshot.exists()) {
      return null;
    }

    return { id: snapshot.id, ...snapshot.data() };
  } catch (error) {
    console.error("Error fetching quiz by ID from Firebase:", error);
    throw error;
  }
};

export const firebaseSaveQuizResult = async (
  userId: string,
  quizId: string,
  score: number,
  totalQuestions: number
) => {
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

    return { error: null };
  } catch (error: any) {
    console.error("Error saving quiz result to Firebase:", error);
    return { error: { message: error.message, code: error.code } };
  }
};

export const firebaseGetUserQuizResults = async (userId: string) => {
  try {
    const resultsRef = collection(db, "quiz_results");
    const q = query(
      resultsRef,
      where("userId", "==", userId),
      orderBy("completedAt", "desc")
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching user quiz results from Firebase:", error);
    return [];
  }
};

export const firebaseMarkTopicAsRead = async (
  userId: string,
  topicId: string
) => {
  try {
    const progressRef = doc(db, "user_progress", userId);
    await setDoc(
      progressRef,
      {
        readTopics: arrayUnion(topicId),
        lastUpdated: new Date().toISOString(),
      },
      { merge: true }
    );

    return { error: null };
  } catch (error: any) {
    console.error("Error marking topic as read in Firebase:", error);
    return { error: { message: error.message, code: error.code } };
  }
};

export const firebaseGetUserTopicProgress = async (userId: string) => {
  try {
    const progressRef = doc(db, "user_progress", userId);
    const snapshot = await getDoc(progressRef);

    if (!snapshot.exists()) {
      return { readTopics: [] };
    }

    return snapshot.data();
  } catch (error) {
    console.error("Error fetching user topic progress from Firebase:", error);
    throw error;
  }
};

export async function logUserActivity(userId: string) {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const ref = doc(db, "user_activity", `${userId}_${today}`);
  await setDoc(
    ref,
    { userId, date: today, count: increment(1) },
    { merge: true }
  );
}

// Re-export auth and db for backward compatibility
export { auth, db };
