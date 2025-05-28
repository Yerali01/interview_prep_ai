import { type NextRequest, NextResponse } from "next/server"
import {
  dualGetTopics,
  dualGetDefinitions,
  dualGetProjects,
  dualGetQuizzes,
  getDatabaseConfig,
} from "@/lib/dual-database-service"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const testType = searchParams.get("type") || "all"

    const config = getDatabaseConfig()
    const results: any = {
      config,
      timestamp: new Date().toISOString(),
      tests: {},
    }

    if (testType === "all" || testType === "topics") {
      try {
        const startTime = Date.now()
        const topics = await dualGetTopics()
        results.tests.topics = {
          success: true,
          count: topics.length,
          duration: Date.now() - startTime,
          sample: topics.slice(0, 3).map((t) => ({ id: t.id, title: t.title, slug: t.slug })),
        }
      } catch (error: any) {
        results.tests.topics = {
          success: false,
          error: error.message,
        }
      }
    }

    if (testType === "all" || testType === "definitions") {
      try {
        const startTime = Date.now()
        const definitions = await dualGetDefinitions()
        results.tests.definitions = {
          success: true,
          count: definitions.length,
          duration: Date.now() - startTime,
          sample: definitions.slice(0, 3).map((d) => ({ id: d.id, term: d.term })),
        }
      } catch (error: any) {
        results.tests.definitions = {
          success: false,
          error: error.message,
        }
      }
    }

    if (testType === "all" || testType === "projects") {
      try {
        const startTime = Date.now()
        const projects = await dualGetProjects()
        results.tests.projects = {
          success: true,
          count: projects.length,
          duration: Date.now() - startTime,
          sample: projects.slice(0, 3).map((p) => ({ id: p.id, name: p.name, slug: p.slug })),
        }
      } catch (error: any) {
        results.tests.projects = {
          success: false,
          error: error.message,
        }
      }
    }

    if (testType === "all" || testType === "quizzes") {
      try {
        const startTime = Date.now()
        const quizzes = await dualGetQuizzes()
        results.tests.quizzes = {
          success: true,
          count: quizzes.length,
          duration: Date.now() - startTime,
          sample: quizzes.slice(0, 3).map((q) => ({ id: q.id, title: q.title, slug: q.slug })),
        }
      } catch (error: any) {
        results.tests.quizzes = {
          success: false,
          error: error.message,
        }
      }
    }

    return NextResponse.json(results)
  } catch (error: any) {
    console.error("Dual database test error:", error)
    return NextResponse.json(
      {
        error: "Failed to test dual database",
        message: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
