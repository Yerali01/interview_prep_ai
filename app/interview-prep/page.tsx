"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { interviewQuestions, flutterResources, flutterChallenges } from "@/lib/interview-questions"
import { ArrowLeft, BookOpen, Code, ExternalLink } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function InterviewPrepPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [expandedQuestions, setExpandedQuestions] = useState<Record<number, boolean>>({})

  // Filter questions based on search query, category, and level
  const filteredQuestions = useMemo(() => {
    return interviewQuestions.filter((question) => {
      const matchesSearch =
        question.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        question.answer.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = selectedCategory === "all" || question.category === selectedCategory
      const matchesLevel = selectedLevel === "all" || question.level === selectedLevel

      return matchesSearch && matchesCategory && matchesLevel
    })
  }, [searchQuery, selectedCategory, selectedLevel])

  // Toggle question expansion
  const toggleQuestion = (index: number) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Button variant="ghost" className="mb-6" asChild>
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
        </Link>
      </Button>

      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold mb-8 text-center"
      >
        Flutter Interview Preparation
      </motion.h1>

      <Tabs defaultValue="questions" className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="questions">Interview Questions</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="challenges">Coding Challenges</TabsTrigger>
        </TabsList>

        <TabsContent value="questions">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Flutter & Dart Interview Questions</CardTitle>
              <CardDescription>
                Prepare for your Flutter interview with these common questions and answers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <Input
                    placeholder="Search questions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="flex gap-4">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="dart">Dart</SelectItem>
                      <SelectItem value="flutter">Flutter</SelectItem>
                      <SelectItem value="state-management">State Management</SelectItem>
                      <SelectItem value="architecture">Architecture</SelectItem>
                      <SelectItem value="performance">Performance</SelectItem>
                      <SelectItem value="testing">Testing</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="junior">Junior</SelectItem>
                      <SelectItem value="middle">Middle</SelectItem>
                      <SelectItem value="senior">Senior</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                {filteredQuestions.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No questions found matching your criteria.</p>
                  </div>
                ) : (
                  filteredQuestions.map((question, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Card className="overflow-hidden">
                        <CardHeader className="p-4 cursor-pointer" onClick={() => toggleQuestion(index)}>
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">{question.question}</CardTitle>
                            <div className="flex gap-2">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  question.level === "junior"
                                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                    : question.level === "middle"
                                      ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                                      : "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                                }`}
                              >
                                {question.level.charAt(0).toUpperCase() + question.level.slice(1)}
                              </span>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  question.category === "dart"
                                    ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                                    : question.category === "flutter"
                                      ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                                      : question.category === "state-management"
                                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                        : question.category === "architecture"
                                          ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                                          : question.category === "performance"
                                            ? "bg-red-500/20 text-red-400 border border-red-500/30"
                                            : question.category === "testing"
                                              ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                                              : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                                }`}
                              >
                                {question.category
                                  .split("-")
                                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                  .join(" ")}
                              </span>
                            </div>
                          </div>
                        </CardHeader>
                        {expandedQuestions[index] && (
                          <CardContent className="p-4 pt-0 bg-muted/30">
                            <div className="whitespace-pre-wrap">{question.answer}</div>
                          </CardContent>
                        )}
                      </Card>
                    </motion.div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {flutterResources.map((resource, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Card className="h-full hover:shadow-md transition-all">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BookOpen className="h-5 w-5 mr-2 text-primary" />
                      {resource.title}
                    </CardTitle>
                    <CardDescription>{resource.description}</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button asChild variant="outline" className="w-full">
                      <a href={resource.url} target="_blank" rel="noopener noreferrer">
                        Visit Resource <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="challenges">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {flutterChallenges.map((challenge, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Card className="h-full hover:shadow-md transition-all">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="flex items-center">
                        <Code className="h-5 w-5 mr-2 text-primary" />
                        {challenge.title}
                      </CardTitle>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          challenge.level === "junior"
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : challenge.level === "middle"
                              ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                              : "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                        }`}
                      >
                        {challenge.level.charAt(0).toUpperCase() + challenge.level.slice(1)}
                      </span>
                    </div>
                    <CardDescription>{challenge.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
