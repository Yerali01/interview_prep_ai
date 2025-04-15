import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, BookOpen, Brain, Trophy, ExternalLink, Users, FileQuestion } from "lucide-react"
import { topics } from "@/lib/data"
import LowerSections from "@/components/home/lower-sections"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <section className="mb-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text">
          Flutter Interview Preparation
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          Master Flutter and Dart concepts, practice with interactive quizzes, and ace your next interview
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            <Link href="/topics">
              Start Learning <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/quiz">
              Take a Quiz <Brain className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <BookOpen className="h-12 w-12 mb-4 text-blue-400" />,
              title: "Comprehensive Topics",
              description: "Explore Flutter and Dart topics organized by difficulty level from Junior to Senior",
              link: "/topics",
            },
            {
              icon: <Brain className="h-12 w-12 mb-4 text-purple-400" />,
              title: "Interactive Quizzes",
              description: "Test your knowledge with quizzes that provide detailed explanations for each answer",
              link: "/quiz",
            },
            {
              icon: <Trophy className="h-12 w-12 mb-4 text-yellow-400" />,
              title: "Skill Progression",
              description: "Track your progress and gradually advance from Junior to Senior level concepts",
              link: "/topics",
            },
            {
              icon: <Users className="h-12 w-12 mb-4 text-green-400" />,
              title: "AI Interview Practice",
              description:
                "Practice with our AI interviewer that asks Flutter questions tailored to your experience level",
              link: "/interview",
            },
            {
              icon: <FileQuestion className="h-12 w-12 mb-4 text-pink-400" />,
              title: "Interview Preparation",
              description: "Access a curated collection of real Flutter interview questions with detailed answers",
              link: "/interview-prep",
            },
            {
              icon: <ExternalLink className="h-12 w-12 mb-4 text-orange-400" />,
              title: "Additional Resources",
              description: "Explore our curated list of external Flutter resources to enhance your knowledge",
              link: "/resources",
            },
          ].map((feature, index) => (
            <div key={index}>
              <Link href={feature.link}>
                <Card className="bg-card/50 backdrop-blur border-primary/20 hover:border-primary/50 transition-all h-full">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    {feature.icon}
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Popular Topics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.slice(0, 6).map((topic, index) => (
            <div key={topic.id}>
              <Link href={`/topics/${topic.slug}`}>
                <Card className="h-full hover:border-primary/50 transition-all hover:shadow-md hover:shadow-primary/10">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold">{topic.title}</h3>
                      <DifficultyBadge level={topic.level} />
                    </div>
                    <p className="text-muted-foreground mb-4">{topic.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">{topic.estimatedTime} min read</span>
                      <Button variant="ghost" size="sm">
                        Learn More <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Button asChild variant="outline">
            <Link href="/topics">
              View All Topics <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <LowerSections />
    </div>
  )
}

function DifficultyBadge({ level }: { level: "junior" | "middle" | "senior" }) {
  const colors = {
    junior: "bg-green-500/20 text-green-400 border-green-500/30",
    middle: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    senior: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  }

  const labels = {
    junior: "Junior",
    middle: "Middle",
    senior: "Senior",
  }

  return <span className={`px-2 py-1 rounded-full text-xs font-medium border ${colors[level]}`}>{labels[level]}</span>
}
