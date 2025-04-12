import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, ExternalLink } from "lucide-react"

export default function LowerSections() {
  return (
    <>
      <section>
        <h2 className="text-3xl font-bold mb-8 text-center">Ready to Test Your Knowledge?</h2>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xl text-muted-foreground mb-8">
            Put what you've learned to the test. Our quizzes aren't just multiple choice questions - they're designed to
            make you think like a Flutter developer and reinforce what you've learned.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            <Link href="/quiz">
              Start a Quiz <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="mt-16 text-center">
        <h2 className="text-3xl font-bold mb-8">Explore Additional Resources</h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          Check out our curated list of Flutter resources to further enhance your knowledge
        </p>
        <Button asChild variant="outline" size="lg">
          <Link href="/resources">
            View Resources <ExternalLink className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </section>

      {/* Coming Soon: Company-Specific Preparation */}
      <section className="mt-20">
        <div className="relative overflow-hidden rounded-lg border bg-background p-2">
          <div className="flex justify-between p-4">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight">Coming Soon</h2>
              <p className="text-muted-foreground">Company-specific interview preparation</p>
            </div>
            <div className="flex items-center">
              <Badge variant="outline" className="bg-primary/10 text-primary">
                In Development
              </Badge>
            </div>
          </div>
          <div className="p-4 pt-0">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="border-2 border-primary/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Yandex</CardTitle>
                  <CardDescription>Coming First</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    Prepare for Flutter interviews at Yandex with tailored questions and exercises.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/companies">
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
              {["Google", "Microsoft", "Meta"].map((company) => (
                <Card key={company} className="opacity-70">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{company}</CardTitle>
                    <CardDescription>Planned</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">Company-specific Flutter interview preparation coming soon.</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" disabled className="w-full">
                      Coming Soon
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
          <div className="p-4 pt-0">
            <Button asChild>
              <Link href="/companies">
                View All Companies
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
