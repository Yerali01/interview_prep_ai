// Override Next.js types to avoid conflicts
declare namespace NextJS {
  interface PageProps {
    params?: any
    searchParams?: any
  }
}

// Declare module for nodemailer to avoid type errors
declare module "nodemailer" {
  const createTransport: any
  export default { createTransport }
}

// Additional type declarations for better TypeScript support
declare module "@/lib/supabase" {
  export interface Topic {
    id: number
    title: string
    slug: string
    description: string
    content: string | TopicSection[]
    level: string
    estimated_time: number
    created_at: string
    updated_at: string
  }

  export interface TopicSection {
    title: string
    content: string
    code?: string
  }

  export interface Definition {
    id: number
    term: string
    definition: string
    category?: string
    created_at: string
    updated_at: string
  }

  export interface Project {
    id: number
    name: string
    slug: string
    description: string
    difficulty_level: "beginner" | "intermediate" | "advanced"
    estimated_duration: string
    category: string
    github_url?: string
    demo_url?: string
    image_url?: string
    is_pet_project: boolean
    real_world_example?: string
    created_at: string
    updated_at: string
    technologies?: ProjectTechnology[]
    features?: ProjectFeature[]
  }

  export interface ProjectTechnology {
    id: number
    project_id: number
    technology_name: string
    explanation: string
    is_required: boolean
    category: string
  }

  export interface ProjectFeature {
    id: number
    project_id: number
    feature_name: string
    description: string
    priority: "low" | "medium" | "high"
  }
}
