"use client"

import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Sample company data - this would ideally come from a database
const companyData = {
  google: {
    id: "google",
    name: "Google",
    description:
      "American multinational technology company focusing on search engine technology, online advertising, and more.",
    difficulty: "Very High",
    focusAreas: "Algorithms, System Design",
    status: "Active",
    logo: "/companies/google-logo.png",
  },
  meta: {
    id: "meta",
    name: "Meta",
    description: "American multinational technology conglomerate focused on social media, AR/VR, and more.",
    difficulty: "High",
    focusAreas: "UI Performance, State Management",
    status: "Active",
    logo: "/companies/meta-logo.png",
  },
  yandex: {
    id: "yandex",
    name: "Yandex",
    description: "Russian multinational technology company providing internet-related products and services.",
    difficulty: "High",
    focusAreas: "Performance, Architecture",
    status: "Coming Soon",
    logo: "/companies/yandex-logo.png",
  },
}

function CompanyPageContent() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [company, setCompany] = useState<any>(null)

  useEffect(() => {
    // Get the company ID from the URL params
    const companyId = typeof params.id === "string" ? params.id : ""

    // Simulate API call to get company data
    setTimeout(() => {
      const foundCompany = companyData[companyId as keyof typeof companyData]
      setCompany(foundCompany || null)
      setLoading(false)
    }, 300)
  }, [params])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 w-full bg-gray-200 rounded mb-6"></div>
          <div className="h-64 w-full bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!company) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Button variant="ghost" className="mb-6" asChild>
          <Link href="/companies">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Companies
          </Link>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Company Not Found</CardTitle>
            <CardDescription>The company you're looking for doesn't exist in our database.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/companies")}>View All Companies</Button>
          </CardContent>
        </Card>
      </div>
    )
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
            {company.status === "Coming Soon" && (
              <div>
                <h3 className="font-medium text-lg">Coming Soon</h3>
                <p>
                  We're currently developing detailed interview preparation materials for {company.name}. Check back
                  soon!
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function CompanyPage() {
  return <CompanyPageContent />
}
