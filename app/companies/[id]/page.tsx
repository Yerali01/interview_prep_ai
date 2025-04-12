"use client"

import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

// Mock company data - in a real app, this would come from an API or database
const companies = [
  {
    id: "google",
    name: "Google",
    logo: "/companies/google.png",
    description:
      "Google LLC is an American multinational technology company focusing on search engine technology, online advertising, cloud computing, computer software, quantum computing, e-commerce, artificial intelligence, and consumer electronics.",
    interviewProcess: [
      "Initial phone screen with a recruiter",
      "Technical phone interview with an engineer",
      "Onsite interviews (4-5 rounds)",
      "Team matching and offer",
    ],
    flutterQuestions: [
      "Explain the difference between StatefulWidget and StatelessWidget",
      "How does Flutter achieve 60fps?",
      "Explain the widget tree and element tree in Flutter",
      "What are keys in Flutter and when would you use them?",
      "How would you implement state management in a large Flutter application?",
    ],
    tips: [
      "Focus on data structures and algorithms",
      "Be familiar with Flutter's widget lifecycle",
      "Practice system design for senior roles",
      "Understand Flutter's rendering pipeline",
      "Be prepared to write code on a whiteboard or shared document",
    ],
  },
  {
    id: "facebook",
    name: "Meta (Facebook)",
    logo: "/companies/meta.png",
    description:
      "Meta Platforms, Inc., doing business as Meta and formerly named Facebook, Inc., is an American multinational technology conglomerate based in Menlo Park, California. The company owns Facebook, Instagram, and WhatsApp, among other products and services.",
    interviewProcess: [
      "Initial screen with a recruiter",
      "Technical phone/video interview",
      "Onsite interviews (usually 4-5 rounds)",
      "Team matching and offer",
    ],
    flutterQuestions: [
      "Explain how you would optimize a Flutter application",
      "How does Flutter differ from React Native?",
      "Explain the concept of isolates in Dart",
      "How would you implement a custom animation in Flutter?",
      "Describe how you would architect a complex Flutter application",
    ],
    tips: [
      "Practice coding problems on a whiteboard",
      "Be prepared to discuss previous projects in detail",
      "Understand Flutter's internals and rendering",
      "Be familiar with state management solutions",
      "Study system design for senior positions",
    ],
  },
]

export default function CompanyPage() {
  const params = useParams()
  const id = typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : ""
  const [company, setCompany] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would be an API call
    const foundCompany = companies.find((c) => c.id === id)
    setCompany(foundCompany || null)
    setLoading(false)
  }, [id])

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex items-center space-x-4 animate-pulse">
          <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-[250px]"></div>
            <div className="h-4 bg-gray-200 rounded w-[200px]"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!company) {
    return (
      <div className="container py-8">
        <Card>
          <CardHeader>
            <CardTitle>Company Not Found</CardTitle>
            <CardDescription>
              The company you're looking for doesn't exist or hasn't been added to our database yet.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex items-center space-x-4 mb-6">
        <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center">
          {/* In a real app, this would be an actual logo */}
          <span className="text-xl font-bold">{company.name.charAt(0)}</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold">{company.name}</h1>
          <p className="text-muted-foreground">{company.description}</p>
        </div>
      </div>

      <Tabs defaultValue="interview-process">
        <TabsList className="mb-4">
          <TabsTrigger value="interview-process">Interview Process</TabsTrigger>
          <TabsTrigger value="flutter-questions">Flutter Questions</TabsTrigger>
          <TabsTrigger value="tips">Tips</TabsTrigger>
        </TabsList>

        <TabsContent value="interview-process">
          <Card>
            <CardHeader>
              <CardTitle>Interview Process</CardTitle>
              <CardDescription>Typical interview stages at {company.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4 list-decimal list-inside">
                {company.interviewProcess.map((step: string, index: number) => (
                  <li key={index} className="pl-2">
                    <span className="font-medium">{step}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flutter-questions">
          <Card>
            <CardHeader>
              <CardTitle>Common Flutter Questions</CardTitle>
              <CardDescription>Questions frequently asked in {company.name} Flutter interviews</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {company.flutterQuestions.map((question: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <Badge className="mr-2 mt-1" variant="outline">
                      {index + 1}
                    </Badge>
                    <span>{question}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tips">
          <Card>
            <CardHeader>
              <CardTitle>Interview Tips</CardTitle>
              <CardDescription>How to prepare for a Flutter interview at {company.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {company.tips.map((tip: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <div className="mr-2 h-5 w-5 text-primary flex items-center justify-center">•</div>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
