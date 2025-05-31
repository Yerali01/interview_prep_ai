import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "./firebase"

// Enhanced interfaces for better type safety
export interface Technology {
  technology_name?: string
  package_name?: string
  category?: string
  is_required?: boolean
  purpose?: string
  explanation?: string
  installation_command?: string
  version_requirement?: string
  documentation_url?: string
}

export interface Feature {
  feature_name?: string
  description?: string
  priority?: string
}

export interface EnhancedProject {
  id: string
  name: string
  slug: string
  description: string
  difficulty_level: string
  estimated_duration: string
  category: string
  github_url?: string
  demo_url?: string
  image_url?: string
  is_pet_project: boolean
  real_world_example?: string
  technologies?: Technology[] | Record<string, Technology>
  features?: Feature[] | Record<string, Feature>
  createdAt?: string
  updatedAt?: string
}

// Enhanced project fetcher that properly handles nested data
export async function firebaseGetEnhancedProjectBySlug(slug: string): Promise<EnhancedProject | null> {
  try {
    console.log(`🔥 Fetching enhanced project with slug "${slug}" from Firebase...`)
    const projectsCollection = collection(db, "projects")
    const q = query(projectsCollection, where("slug", "==", slug))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      console.log(`⚠️ No project found with slug "${slug}"`)
      return null
    }

    const doc = querySnapshot.docs[0]
    const rawData = doc.data()

    // Enhanced data processing
    const project: EnhancedProject = {
      id: doc.id,
      name: rawData.name || "Untitled Project",
      slug: rawData.slug || slug,
      description: rawData.description || "",
      difficulty_level: rawData.difficulty_level || "beginner",
      estimated_duration: rawData.estimated_duration || "Unknown",
      category: rawData.category || "General",
      github_url: rawData.github_url,
      demo_url: rawData.demo_url,
      image_url: rawData.image_url,
      is_pet_project: rawData.is_pet_project || false,
      real_world_example: rawData.real_world_example,
      technologies: rawData.technologies || [],
      features: rawData.features || [],
      createdAt: rawData.createdAt,
      updatedAt: rawData.updatedAt,
    }

    console.log(`✅ Successfully fetched enhanced project "${project.name}"`)
    console.log("📊 Project data structure:", {
      technologiesType: typeof project.technologies,
      technologiesLength: Array.isArray(project.technologies)
        ? project.technologies.length
        : Object.keys(project.technologies).length,
      featuresType: typeof project.features,
      featuresLength: Array.isArray(project.features) ? project.features.length : Object.keys(project.features).length,
    })

    return project
  } catch (error) {
    console.error(`❌ Error fetching enhanced project with slug "${slug}":`, error)
    throw new Error(`Failed to fetch project: ${error.message}`)
  }
}

// Helper functions for data processing
export function processTechnologies(technologies: Technology[] | Record<string, Technology> | undefined): Technology[] {
  if (!technologies) return []

  if (Array.isArray(technologies)) {
    return technologies.filter((tech) => tech && typeof tech === "object")
  }

  if (typeof technologies === "object") {
    return Object.values(technologies).filter((tech) => tech && typeof tech === "object")
  }

  return []
}

export function processFeatures(features: Feature[] | Record<string, Feature> | undefined): Feature[] {
  if (!features) return []

  if (Array.isArray(features)) {
    return features.filter((feature) => feature && typeof feature === "object")
  }

  if (typeof features === "object") {
    return Object.values(features).filter((feature) => feature && typeof feature === "object")
  }

  return []
}
