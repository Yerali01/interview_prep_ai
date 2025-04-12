interface Window {
  SpeechRecognition: typeof SpeechRecognition
  webkitSpeechRecognition: typeof SpeechRecognition
}

declare var SpeechRecognition: any

namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production" | "test"
    NEXT_PUBLIC_SUPABASE_URL: string
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string
    SUPABASE_SERVICE_ROLE_KEY: string
    EMAIL_USER: string
    EMAIL_PASSWORD: string
    GROQ_API_KEY: string
    NEXT_PUBLIC_GROQ_API_KEY: string
  }
}
