declare module "@supabase/ssr" {
  export function createServerClient(
    supabaseUrl: string,
    supabaseKey: string,
    options?: {
      cookies: {
        get: (name: string) => string | undefined;
        set: (
          name: string,
          value: string,
          options: { path: string; maxAge: number }
        ) => void;
        remove: (name: string, options: { path: string }) => void;
      };
    }
  ): any;
}

declare module "@/lib/supabase/server" {
  export function createClient(): any;
}

declare module "@/lib/supabase" {
  export interface Project {
    id: number;
    name: string;
    slug: string;
    description: string;
    difficulty_level: string;
    estimated_duration: string;
    category: string;
    github_url?: string;
    demo_url?: string;
    image_url?: string;
    is_pet_project: boolean;
    real_world_example?: string;
  }

  export function getProjects(): Promise<Project[]>;
}
