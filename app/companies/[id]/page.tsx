import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { notFound } from "next/navigation"

// Sample company data - this would ideally come from a database
const companies = {
  yandex: {
    id: "yandex",
    name: "Yandex",
    description: "Russian multinational technology company providing internet-related products and services.",
    difficulty: "High",
    focusAreas: "Performance, Architecture",
    status: "Coming Soon",
    logo: "/companies/yandex-logo.png",
  },
  google: {
    id: "google",
    name: "Google",
    description:
      "American multinational technology company focusing on search engine technology, online advertising, and more.",
    difficulty: "Very High",
    focusAreas: "Algorithms, System Design",
    status: "Planned",
    logo: "/companies/google-logo.png",
  },
  // Add other companies as needed
}

export default function CompanyPage({ params }: { params: { id: string } }) {
  const companyId = params.id
  const company = companies[companyId as keyof typeof companies]

  if (!company) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Button variant="ghost" className="mb-6" asChild>
        <Link href="/companies">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Companies
        </Link>
      </Button>

      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">{company.name} Interview Preparation</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">{company.description}</p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">{company.name} Interview Guide</CardTitle>
            <Badge>{company.status}</Badge>
          </div>
          <CardDescription>
            Comprehensive preparation guide for Flutter developer interviews at {company.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-lg">Interview Difficulty</h3>
              <p>{company.difficulty}</p>
            </div>
            <div>
              <h3 className="font-medium text-lg">Focus Areas</h3>
              <p>{company.focusAreas}</p>
            </div>
            <div>
              <h3 className="font-medium text-lg">Coming Soon</h3>
              <p>
                We're currently developing detailed interview preparation materials for {company.name}. Check back soon!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
