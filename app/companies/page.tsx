"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, ArrowRight, Building2, Calendar, Code2, FileCheck, Rocket, Timer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

// Sample company data - moved outside the component to avoid any server/client issues
const companies = [
  {
    id: "yandex",
    name: "Yandex",
    description: "Russian multinational technology company providing internet-related products and services.",
    difficulty: "High",
    focusAreas: "Performance, Architecture",
  },
  {
    id: "google",
    name: "Google",
    description:
      "American multinational technology company focusing on search engine technology, online advertising, and more.",
    difficulty: "Very High",
    focusAreas: "Algorithms, System Design",
  },
  {
    id: "microsoft",
    name: "Microsoft",
    description:
      "American multinational technology corporation producing computer software, consumer electronics, and related services.",
    difficulty: "High",
    focusAreas: "Architecture, State Management",
  },
  {
    id: "facebook",
    name: "Meta (Facebook)",
    description: "American multinational technology conglomerate focusing on social media, AR/VR, and more.",
    difficulty: "High",
    focusAreas: "UI Performance, Testing",
  },
  {
    id: "amazon",
    name: "Amazon",
    description: "American multinational technology company focusing on e-commerce, cloud computing, and more.",
    difficulty: "High",
    focusAreas: "Scalability, Architecture",
  },
  {
    id: "uber",
    name: "Uber",
    description: "American technology company offering services including ride-hailing, food delivery, and more.",
    difficulty: "Medium-High",
    focusAreas: "Maps, Real-time Features",
  },
]

export default function CompaniesPage() {
  const [searchQuery, setSearchQuery] = useState("")

  // Filter companies based on search query
  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="container mx-auto px-4 py-12">
      <Button variant="ghost" className="mb-6" asChild>
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
        </Link>
      </Button>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold mb-4">Company-Specific Interview Preparation</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Prepare for Flutter interviews at specific companies with tailored questions, practice exercises, and insider
          tips. This feature is currently under development.
        </p>
      </motion.div>

      <Card className="mb-8 border-2 border-dashed border-primary/50 bg-primary/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl flex items-center">
              <Rocket className="mr-2 h-6 w-6 text-primary" />
              Coming Soon
            </CardTitle>
            <Badge variant="outline" className="bg-primary/10 text-primary">
              In Development
            </Badge>
          </div>
          <CardDescription className="text-base">
            We're working on company-specific interview preparation modules. Yandex will be our first supported company,
            with more to follow. These modules will include real interview questions, company-specific technical
            assessments, and tips from successful candidates.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start">
              <FileCheck className="h-5 w-5 mr-2 text-primary mt-0.5" />
              <div>
                <h3 className="font-medium">Real Interview Questions</h3>
                <p className="text-sm text-muted-foreground">
                  Questions sourced from actual interviews at each company
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <Code2 className="h-5 w-5 mr-2 text-primary mt-0.5" />
              <div>
                <h3 className="font-medium">Technical Assessments</h3>
                <p className="text-sm text-muted-foreground">Practice with company-specific coding challenges</p>
              </div>
            </div>
            <div className="flex items-start">
              <Calendar className="h-5 w-5 mr-2 text-primary mt-0.5" />
              <div>
                <h3 className="font-medium">Interview Process Guide</h3>
                <p className="text-sm text-muted-foreground">
                  Step-by-step walkthrough of each company's hiring process
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <Timer className="h-5 w-5 mr-2 text-primary mt-0.5" />
              <div>
                <h3 className="font-medium">Timed Mock Interviews</h3>
                <p className="text-sm text-muted-foreground">Simulate real interview conditions with timed sessions</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button disabled className="w-full">
            Subscribe for Updates
          </Button>
        </CardFooter>
      </Card>

      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold">Companies (Preview)</h2>
          <Input
            placeholder="Search companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company, index) => (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Card
                className={`h-full hover:shadow-md transition-all ${company.id === "yandex" ? "border-primary/50" : ""}`}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="flex items-center">
                      <Building2 className="h-5 w-5 mr-2 text-primary" />
                      {company.name}
                    </CardTitle>
                    <Badge variant={company.id === "yandex" ? "default" : "outline"}>
                      {company.id === "yandex" ? "Coming First" : "Planned"}
                    </Badge>
                  </div>
                  <CardDescription>{company.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm">
                    <div className="flex justify-between mb-1">
                      <span>Interview Difficulty:</span>
                      <span className="font-medium">{company.difficulty}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Flutter Focus Areas:</span>
                      <span className="font-medium">{company.focusAreas}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" disabled className="w-full flex justify-between">
                    <span>Coming Soon</span>
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
