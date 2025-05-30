"use server"

import {
  firebaseCreateQuiz,
  firebaseUpdateQuiz,
  firebaseDeleteQuiz,
  firebaseCreateTopic,
  firebaseUpdateTopic,
  firebaseDeleteTopic,
  firebaseCreateProject,
  firebaseUpdateProject,
  firebaseDeleteProject,
} from "./firebase-service-fixed"

// Quiz Actions
export async function createQuiz(data: { title: string; description: string }) {
  try {
    const quiz = await firebaseCreateQuiz({
      title: data.title,
      description: data.description,
      level: "junior", // default level
      slug: data.title.toLowerCase().replace(/\s+/g, "-"),
      questions: [],
    })
    return { success: true, quiz }
  } catch (error: any) {
    console.error("Error creating quiz:", error)
    return { error: error.message || "Failed to create quiz" }
  }
}

export async function updateQuiz(data: { id: string; title: string; description: string }) {
  try {
    await firebaseUpdateQuiz(data.id, {
      title: data.title,
      description: data.description,
      slug: data.title.toLowerCase().replace(/\s+/g, "-"),
    })
    return { success: true }
  } catch (error: any) {
    console.error("Error updating quiz:", error)
    return { error: error.message || "Failed to update quiz" }
  }
}

export async function deleteQuiz(id: string) {
  try {
    await firebaseDeleteQuiz(id)
    return { success: true }
  } catch (error: any) {
    console.error("Error deleting quiz:", error)
    return { error: error.message || "Failed to delete quiz" }
  }
}

// Topic Actions
export async function createTopic(data: { title: string; description: string; content: string }) {
  try {
    const topic = await firebaseCreateTopic({
      title: data.title,
      description: data.description,
      content: data.content,
      level: "junior", // default level
      slug: data.title.toLowerCase().replace(/\s+/g, "-"),
      category: "general",
    })
    return { success: true, topic }
  } catch (error: any) {
    console.error("Error creating topic:", error)
    return { error: error.message || "Failed to create topic" }
  }
}

export async function updateTopic(data: { id: string; title: string; description: string; content: string }) {
  try {
    await firebaseUpdateTopic(data.id, {
      title: data.title,
      description: data.description,
      content: data.content,
      slug: data.title.toLowerCase().replace(/\s+/g, "-"),
    })
    return { success: true }
  } catch (error: any) {
    console.error("Error updating topic:", error)
    return { error: error.message || "Failed to update topic" }
  }
}

export async function deleteTopic(id: string) {
  try {
    await firebaseDeleteTopic(id)
    return { success: true }
  } catch (error: any) {
    console.error("Error deleting topic:", error)
    return { error: error.message || "Failed to delete topic" }
  }
}

// Project Actions
export async function createProject(data: { title: string; description: string; content: string }) {
  try {
    const project = await firebaseCreateProject({
      title: data.title,
      description: data.description,
      content: data.content,
      level: "junior", // default level
      slug: data.title.toLowerCase().replace(/\s+/g, "-"),
      category: "general",
      technologies: [],
      githubUrl: "",
      liveUrl: "",
    })
    return { success: true, project }
  } catch (error: any) {
    console.error("Error creating project:", error)
    return { error: error.message || "Failed to create project" }
  }
}

export async function updateProject(data: { id: string; title: string; description: string; content: string }) {
  try {
    await firebaseUpdateProject(data.id, {
      title: data.title,
      description: data.description,
      content: data.content,
      slug: data.title.toLowerCase().replace(/\s+/g, "-"),
    })
    return { success: true }
  } catch (error: any) {
    console.error("Error updating project:", error)
    return { error: error.message || "Failed to update project" }
  }
}

export async function deleteProject(id: string) {
  try {
    await firebaseDeleteProject(id)
    return { success: true }
  } catch (error: any) {
    console.error("Error deleting project:", error)
    return { error: error.message || "Failed to delete project" }
  }
}
