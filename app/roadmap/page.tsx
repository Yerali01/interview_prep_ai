"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  ChevronRight,
  BookOpen,
  Code,
  Database,
  Globe,
  Layout,
  Settings,
  Server,
  Zap,
  Brain,
  Users,
  ArrowDown,
  LayoutGrid,
  List,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function RoadmapPage() {
  const [activeLevel, setActiveLevel] = useState("junior")
  const [viewMode, setViewMode] = useState<"tabbed" | "vertical">("tabbed")

  const toggleViewMode = () => {
    setViewMode(viewMode === "tabbed" ? "vertical" : "tabbed")
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text">
          Flutter Developer Roadmap
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
          A comprehensive guide to becoming a proficient Flutter developer, from beginner to senior level
        </p>

        <div className="flex justify-center mb-4">
          <div className="border rounded-lg p-1 flex">
            <Button
              variant={viewMode === "tabbed" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("tabbed")}
              className="flex items-center gap-2"
            >
              <LayoutGrid size={16} />
              <span className="hidden sm:inline">Tabbed View</span>
            </Button>
            <Button
              variant={viewMode === "vertical" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("vertical")}
              className="flex items-center gap-2"
            >
              <List size={16} />
              <span className="hidden sm:inline">Vertical View</span>
            </Button>
          </div>
        </div>
      </motion.div>

      {viewMode === "tabbed" ? <TabbedRoadmap /> : <VerticalRoadmap />}
    </div>
  )
}

function TabbedRoadmap() {
  return (
    <Tabs defaultValue="overview" className="mb-12">
      <div className="flex justify-center mb-8">
        <TabsList className="grid grid-cols-4 w-full max-w-2xl">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="junior">Junior</TabsTrigger>
          <TabsTrigger value="middle">Middle</TabsTrigger>
          <TabsTrigger value="senior">Senior</TabsTrigger>
        </TabsList>
      </div>

      {/* Overview Tab */}
      <TabsContent value="overview">
        <div className="grid grid-cols-1 gap-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Flutter Development Journey</CardTitle>
                <CardDescription>
                  The complete path to becoming a Flutter developer from scratch to senior level
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-8">
                  {/* Junior */}
                  <div className="flex flex-col items-center text-center max-w-xs">
                    <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                      <BookOpen className="h-10 w-10 text-green-500" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Junior</h3>
                    <p className="text-muted-foreground text-sm">
                      Learn the fundamentals of Dart and Flutter, build basic apps with UI components
                    </p>
                  </div>

                  <ChevronRight className="hidden md:block h-8 w-8 text-muted-foreground" />
                  <div className="h-8 w-0.5 bg-border md:hidden my-2"></div>

                  {/* Middle */}
                  <div className="flex flex-col items-center text-center max-w-xs">
                    <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                      <Code className="h-10 w-10 text-blue-500" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Middle</h3>
                    <p className="text-muted-foreground text-sm">
                      Master state management, navigation, and APIs, build more complex applications
                    </p>
                  </div>

                  <ChevronRight className="hidden md:block h-8 w-8 text-muted-foreground" />
                  <div className="h-8 w-0.5 bg-border md:hidden my-2"></div>

                  {/* Senior */}
                  <div className="flex flex-col items-center text-center max-w-xs">
                    <div className="w-20 h-20 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                      <Zap className="h-10 w-10 text-purple-500" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Senior</h3>
                    <p className="text-muted-foreground text-sm">
                      Implement advanced patterns, optimize performance, architect complex solutions
                    </p>
                  </div>
                </div>

                <div className="bg-muted p-6 rounded-lg">
                  <h4 className="font-bold mb-4 text-lg">Key highlights of the roadmap:</h4>
                  <ul className="grid gap-2 md:grid-cols-2">
                    {[
                      "Dart programming language fundamentals",
                      "Flutter framework and UI components",
                      "State management techniques",
                      "Navigation and routing",
                      "Working with APIs and data",
                      "Platform integration",
                      "Testing and debugging",
                      "Architecture patterns",
                      "Advanced UI and animations",
                      "Performance optimization",
                    ].map((item, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <ChevronRight className="h-4 w-4 text-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">How to Use This Roadmap</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <p>
                    This roadmap is designed to guide you through your Flutter development journey from beginner to
                    senior level. Here's how to make the most of it:
                  </p>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <h4 className="font-bold">1. Identify your level</h4>
                      <p className="text-sm text-muted-foreground">
                        Assess your current skills and choose the appropriate starting point: Junior, Middle, or Senior.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-bold">2. Follow the sequence</h4>
                      <p className="text-sm text-muted-foreground">
                        Work through the topics in order, as concepts build upon each other progressively.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-bold">3. Study the topics</h4>
                      <p className="text-sm text-muted-foreground">
                        Click on each topic to access detailed explanations, examples, and resources.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-bold">4. Practice with quizzes</h4>
                      <p className="text-sm text-muted-foreground">
                        Test your knowledge with our interactive quizzes for each topic to reinforce learning.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-bold">5. Build projects</h4>
                      <p className="text-sm text-muted-foreground">
                        Apply your knowledge by working on progressively more complex projects.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-bold">6. Track your progress</h4>
                      <p className="text-sm text-muted-foreground">
                        Monitor your development journey as you advance through the levels.
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-center mt-4">
                    <Button asChild size="lg">
                      <Link href="#junior-section">
                        Start Your Journey <ChevronRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </TabsContent>

      {/* Junior Level Tab */}
      <TabsContent value="junior">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="mb-8">
            <CardHeader className="bg-green-50 dark:bg-green-900/20 rounded-t-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Junior Flutter Developer</CardTitle>
                  <CardDescription>Foundation & Fundamentals (0-12 months)</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-8">
                {/* Dart Fundamentals */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-muted p-4 flex items-center justify-between">
                    <h3 className="text-lg font-bold">1. Dart Programming Language</h3>
                    <Badge variant="outline">Essential</Badge>
                  </div>
                  <div className="p-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {[
                      { name: "Dart Basics", link: "/topics/dart-fundamentals", icon: <Code size={16} /> },
                      { name: "Variables & Types", link: "/topics/dart-fundamentals", icon: <Code size={16} /> },
                      { name: "Control Flow", link: "/topics/dart-fundamentals", icon: <Code size={16} /> },
                      { name: "Functions", link: "/topics/dart-fundamentals", icon: <Code size={16} /> },
                      { name: "Collections", link: "/topics/dart-fundamentals", icon: <Code size={16} /> },
                      {
                        name: "Object-Oriented Programming",
                        link: "/topics/dart-fundamentals",
                        icon: <Code size={16} />,
                      },
                      { name: "Null Safety", link: "/topics/dart-fundamentals", icon: <Code size={16} /> },
                    ].map((item, i) => (
                      <Link
                        href={item.link}
                        key={i}
                        className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
                      >
                        {item.icon}
                        <span>{item.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Flutter Basics */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-muted p-4 flex items-center justify-between">
                    <h3 className="text-lg font-bold">2. Flutter Basics</h3>
                    <Badge variant="outline">Essential</Badge>
                  </div>
                  <div className="p-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {[
                      { name: "Flutter Introduction", link: "/topics/flutter-basics", icon: <Layout size={16} /> },
                      { name: "Project Structure", link: "/topics/flutter-basics", icon: <Layout size={16} /> },
                      { name: "Widgets Overview", link: "/topics/flutter-widgets", icon: <Layout size={16} /> },
                      { name: "Basic Layouts", link: "/topics/flutter-widgets", icon: <Layout size={16} /> },
                      { name: "Stateless Widgets", link: "/topics/flutter-widgets", icon: <Layout size={16} /> },
                      { name: "Stateful Widgets", link: "/topics/flutter-widgets", icon: <Layout size={16} /> },
                      { name: "Basic State Management", link: "/topics/state-management", icon: <Layout size={16} /> },
                    ].map((item, i) => (
                      <Link
                        href={item.link}
                        key={i}
                        className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
                      >
                        {item.icon}
                        <span>{item.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* UI Components */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-muted p-4 flex items-center justify-between">
                    <h3 className="text-lg font-bold">3. UI Components & Styling</h3>
                    <Badge variant="outline">Essential</Badge>
                  </div>
                  <div className="p-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {[
                      { name: "Text & Typography", link: "/topics/flutter-widgets", icon: <Layout size={16} /> },
                      { name: "Buttons & Inputs", link: "/topics/flutter-widgets", icon: <Layout size={16} /> },
                      { name: "Images & Assets", link: "/topics/flutter-widgets", icon: <Layout size={16} /> },
                      { name: "Lists & Grids", link: "/topics/flutter-widgets", icon: <Layout size={16} /> },
                      { name: "App Bar & Navigation", link: "/topics/navigation-routing", icon: <Layout size={16} /> },
                      { name: "Dialogs & Modals", link: "/topics/flutter-widgets", icon: <Layout size={16} /> },
                      { name: "Theming & Styling", link: "/topics/flutter-widgets", icon: <Layout size={16} /> },
                    ].map((item, i) => (
                      <Link
                        href={item.link}
                        key={i}
                        className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
                      >
                        {item.icon}
                        <span>{item.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Basic State Management */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-muted p-4 flex items-center justify-between">
                    <h3 className="text-lg font-bold">4. Basic Navigation & State Management</h3>
                    <Badge variant="outline">Essential</Badge>
                  </div>
                  <div className="p-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {[
                      { name: "setState", link: "/topics/state-management", icon: <Settings size={16} /> },
                      { name: "Basic Navigation", link: "/topics/navigation-routing", icon: <Settings size={16} /> },
                      { name: "Route Management", link: "/topics/navigation-routing", icon: <Settings size={16} /> },
                      {
                        name: "Passing Data Between Screens",
                        link: "/topics/navigation-routing",
                        icon: <Settings size={16} />,
                      },
                      { name: "InheritedWidget", link: "/topics/state-management", icon: <Settings size={16} /> },
                      {
                        name: "Introduction to Provider",
                        link: "/topics/state-management",
                        icon: <Settings size={16} />,
                      },
                    ].map((item, i) => (
                      <Link
                        href={item.link}
                        key={i}
                        className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
                      >
                        {item.icon}
                        <span>{item.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Basic Data Management */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-muted p-4 flex items-center justify-between">
                    <h3 className="text-lg font-bold">5. Basic Data Management</h3>
                    <Badge variant="outline">Essential</Badge>
                  </div>
                  <div className="p-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {[
                      { name: "JSON Parsing", link: "/topics/async-programming", icon: <Database size={16} /> },
                      { name: "Basic HTTP Requests", link: "/topics/async-programming", icon: <Database size={16} /> },
                      { name: "Async/Await", link: "/topics/async-programming", icon: <Database size={16} /> },
                      { name: "SharedPreferences", link: "/topics/async-programming", icon: <Database size={16} /> },
                      { name: "Form Handling", link: "/topics/flutter-widgets", icon: <Database size={16} /> },
                    ].map((item, i) => (
                      <Link
                        href={item.link}
                        key={i}
                        className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
                      >
                        {item.icon}
                        <span>{item.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Dev Tools & Debugging */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-muted p-4 flex items-center justify-between">
                    <h3 className="text-lg font-bold">6. Dev Tools & Debugging</h3>
                    <Badge variant="outline">Important</Badge>
                  </div>
                  <div className="p-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {[
                      { name: "Flutter DevTools", link: "/topics/flutter-basics", icon: <Code size={16} /> },
                      { name: "Hot Reload/Restart", link: "/topics/flutter-basics", icon: <Code size={16} /> },
                      { name: "Debugging Techniques", link: "/topics/flutter-basics", icon: <Code size={16} /> },
                      { name: "Dart Analyzer", link: "/topics/dart-fundamentals", icon: <Code size={16} /> },
                    ].map((item, i) => (
                      <Link
                        href={item.link}
                        key={i}
                        className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
                      >
                        {item.icon}
                        <span>{item.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Junior Projects Section */}
                <div className="mt-8">
                  <h3 className="text-xl font-bold mb-4">Recommended Junior Level Projects</h3>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[
                      {
                        title: "To-Do List App",
                        description: "Build a simple task manager with basic CRUD operations.",
                        skills: ["UI Components", "setState", "SharedPreferences"],
                      },
                      {
                        title: "Weather App",
                        description: "Create an app that fetches and displays weather data.",
                        skills: ["HTTP Requests", "JSON Parsing", "Async/Await"],
                      },
                      {
                        title: "Recipe Book",
                        description: "Develop an app to browse and view cooking recipes.",
                        skills: ["Lists", "Navigation", "Basic State Management"],
                      },
                    ].map((project, i) => (
                      <Card key={i} className="overflow-hidden">
                        <div className="bg-gradient-to-r from-green-400/20 to-blue-400/20 p-4">
                          <h4 className="font-bold">{project.title}</h4>
                        </div>
                        <CardContent className="p-4">
                          <p className="text-sm mb-3 text-muted-foreground">{project.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {project.skills.map((skill, j) => (
                              <Badge key={j} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Next Level Section */}
                <div className="mt-8 p-6 border rounded-lg bg-muted/50">
                  <h3 className="text-xl font-bold mb-2">Ready for the next level?</h3>
                  <p className="mb-4">
                    Once you're comfortable with these junior-level concepts, move on to the intermediate level to
                    expand your Flutter development skills.
                  </p>
                  <Button variant="default" onClick={() => document.querySelector('[value="middle"]')?.click()}>
                    Proceed to Middle Level <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </TabsContent>

      {/* Middle Level Tab */}
      <TabsContent value="middle">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="mb-8">
            <CardHeader className="bg-blue-50 dark:bg-blue-900/20 rounded-t-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Code className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Middle Flutter Developer</CardTitle>
                  <CardDescription>Advanced Concepts & Best Practices (1-2 years)</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-8">
                {/* Advanced Dart Programming */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-muted p-4 flex items-center justify-between">
                    <h3 className="text-lg font-bold">1. Advanced Dart Programming</h3>
                    <Badge variant="outline">Essential</Badge>
                  </div>
                  <div className="p-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {[
                      { name: "Asynchronous Programming", link: "/topics/async-programming", icon: <Code size={16} /> },
                      { name: "Streams & Futures", link: "/topics/async-programming", icon: <Code size={16} /> },
                      { name: "Generics", link: "/topics/dart-fundamentals", icon: <Code size={16} /> },
                      { name: "Collections in Depth", link: "/topics/dart-fundamentals", icon: <Code size={16} /> },
                      { name: "Extension Methods", link: "/topics/dart-fundamentals", icon: <Code size={16} /> },
                      { name: "Isolates & Concurrency", link: "/topics/async-programming", icon: <Code size={16} /> },
                    ].map((item, i) => (
                      <Link
                        href={item.link}
                        key={i}
                        className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
                      >
                        {item.icon}
                        <span>{item.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Advanced State Management */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-muted p-4 flex items-center justify-between">
                    <h3 className="text-lg font-bold">2. Advanced State Management</h3>
                    <Badge variant="outline">Essential</Badge>
                  </div>
                  <div className="p-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {[
                      { name: "Provider (In Depth)", link: "/topics/state-management", icon: <Settings size={16} /> },
                      { name: "Riverpod", link: "/topics/state-management", icon: <Settings size={16} /> },
                      { name: "BLoC Pattern", link: "/topics/state-management", icon: <Settings size={16} /> },
                      { name: "Redux", link: "/topics/state-management", icon: <Settings size={16} /> },
                      { name: "GetX", link: "/topics/state-management", icon: <Settings size={16} /> },
                      { name: "MobX", link: "/topics/state-management", icon: <Settings size={16} /> },
                    ].map((item, i) => (
                      <Link
                        href={item.link}
                        key={i}
                        className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
                      >
                        {item.icon}
                        <span>{item.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Navigation & Routing */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-muted p-4 flex items-center justify-between">
                    <h3 className="text-lg font-bold">3. Advanced Navigation & Routing</h3>
                    <Badge variant="outline">Essential</Badge>
                  </div>
                  <div className="p-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {[
                      { name: "Named Routes", link: "/topics/navigation-routing", icon: <Layout size={16} /> },
                      { name: "Navigation 2.0", link: "/topics/navigation-routing", icon: <Layout size={16} /> },
                      { name: "GoRouter", link: "/topics/navigation-routing", icon: <Layout size={16} /> },
                      { name: "Auto Route", link: "/topics/navigation-routing", icon: <Layout size={16} /> },
                      { name: "Deep Linking", link: "/topics/navigation-routing", icon: <Layout size={16} /> },
                      { name: "Web URLs", link: "/topics/navigation-routing", icon: <Layout size={16} /> },
                    ].map((item, i) => (
                      <Link
                        href={item.link}
                        key={i}
                        className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
                      >
                        {item.icon}
                        <span>{item.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Data Management & APIs */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-muted p-4 flex items-center justify-between">
                    <h3 className="text-lg font-bold">4. Data Management & APIs</h3>
                    <Badge variant="outline">Essential</Badge>
                  </div>
                  <div className="p-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {[
                      { name: "RESTful APIs", link: "/topics/async-programming", icon: <Globe size={16} /> },
                      { name: "GraphQL", link: "/topics/async-programming", icon: <Globe size={16} /> },
                      { name: "Dio & Http Client", link: "/topics/async-programming", icon: <Globe size={16} /> },
                      {
                        name: "Local Database (SQLite)",
                        link: "/topics/async-programming",
                        icon: <Database size={16} />,
                      },
                      { name: "Firebase Integration", link: "/topics/async-programming", icon: <Database size={16} /> },
                      {
                        name: "Caching Strategies",
                        link: "/topics/performance-optimization",
                        icon: <Database size={16} />,
                      },
                    ].map((item, i) => (
                      <Link
                        href={item.link}
                        key={i}
                        className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
                      >
                        {item.icon}
                        <span>{item.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* UI/UX & Animations */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-muted p-4 flex items-center justify-between">
                    <h3 className="text-lg font-bold">5. UI/UX & Animations</h3>
                    <Badge variant="outline">Essential</Badge>
                  </div>
                  <div className="p-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {[
                      { name: "Custom Animations", link: "/topics/advanced-animations", icon: <Layout size={16} /> },
                      { name: "Implicit Animations", link: "/topics/advanced-animations", icon: <Layout size={16} /> },
                      { name: "Explicit Animations", link: "/topics/advanced-animations", icon: <Layout size={16} /> },
                      { name: "Custom Painters", link: "/topics/custom-painter-clipper", icon: <Layout size={16} /> },
                      { name: "Custom Clippers", link: "/topics/custom-painter-clipper", icon: <Layout size={16} /> },
                      {
                        name: "Responsive Design",
                        link: "/topics/performance-optimization",
                        icon: <Layout size={16} />,
                      },
                      {
                        name: "Internationalization",
                        link: "/topics/flutter-internationalization",
                        icon: <Globe size={16} />,
                      },
                    ].map((item, i) => (
                      <Link
                        href={item.link}
                        key={i}
                        className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
                      >
                        {item.icon}
                        <span>{item.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Testing & Architecture */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-muted p-4 flex items-center justify-between">
                    <h3 className="text-lg font-bold">6. Testing & Architecture</h3>
                    <Badge variant="outline">Important</Badge>
                  </div>
                  <div className="p-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {[
                      { name: "Unit Testing", link: "/topics/flutter-testing-strategies", icon: <Code size={16} /> },
                      { name: "Widget Testing", link: "/topics/flutter-testing-strategies", icon: <Code size={16} /> },
                      {
                        name: "Integration Testing",
                        link: "/topics/flutter-testing-strategies",
                        icon: <Code size={16} />,
                      },
                      { name: "MVVM Pattern", link: "/topics/architecture-patterns", icon: <Code size={16} /> },
                      { name: "Repository Pattern", link: "/topics/architecture-patterns", icon: <Code size={16} /> },
                      { name: "Dependency Injection", link: "/topics/architecture-patterns", icon: <Code size={16} /> },
                    ].map((item, i) => (
                      <Link
                        href={item.link}
                        key={i}
                        className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
                      >
                        {item.icon}
                        <span>{item.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Package Development */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-muted p-4 flex items-center justify-between">
                    <h3 className="text-lg font-bold">7. Package & Plugin Development</h3>
                    <Badge variant="outline">Useful</Badge>
                  </div>
                  <div className="p-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {[
                      {
                        name: "Creating Flutter Packages",
                        link: "/topics/flutter-plugin-development",
                        icon: <Code size={16} />,
                      },
                      {
                        name: "Publishing to pub.dev",
                        link: "/topics/flutter-plugin-development",
                        icon: <Code size={16} />,
                      },
                      {
                        name: "Platform Channels",
                        link: "/topics/flutter-plugin-development",
                        icon: <Code size={16} />,
                      },
                      {
                        name: "Native Plugin Development",
                        link: "/topics/flutter-plugin-development",
                        icon: <Code size={16} />,
                      },
                    ].map((item, i) => (
                      <Link
                        href={item.link}
                        key={i}
                        className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
                      >
                        {item.icon}
                        <span>{item.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Middle Projects Section */}
                <div className="mt-8">
                  <h3 className="text-xl font-bold mb-4">Recommended Middle Level Projects</h3>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[
                      {
                        title: "E-commerce App",
                        description: "Build a complete e-commerce app with product listings, cart, and checkout.",
                        skills: ["State Management", "APIs", "Navigation"],
                      },
                      {
                        title: "Social Media App",
                        description: "Create a social media app with feeds, profiles, and real-time updates.",
                        skills: ["Firebase", "Streams", "UI/UX"],
                      },
                      {
                        title: "Task Management System",
                        description: "Develop a productivity app with complex state and data persistence.",
                        skills: ["Database", "State Management", "Architecture"],
                      },
                    ].map((project, i) => (
                      <Card key={i} className="overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-400/20 to-purple-400/20 p-4">
                          <h4 className="font-bold">{project.title}</h4>
                        </div>
                        <CardContent className="p-4">
                          <p className="text-sm mb-3 text-muted-foreground">{project.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {project.skills.map((skill, j) => (
                              <Badge key={j} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Next Level Section */}
                <div className="mt-8 p-6 border rounded-lg bg-muted/50">
                  <h3 className="text-xl font-bold mb-2">Ready for the next level?</h3>
                  <p className="mb-4">
                    Once you're proficient with these middle-level concepts, move on to the senior level to master
                    advanced Flutter development techniques.
                  </p>
                  <Button variant="default" onClick={() => document.querySelector('[value="senior"]')?.click()}>
                    Proceed to Senior Level <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </TabsContent>

      {/* Senior Level Tab */}
      <TabsContent value="senior">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="mb-8">
            <CardHeader className="bg-purple-50 dark:bg-purple-900/20 rounded-t-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Senior Flutter Developer</CardTitle>
                  <CardDescription>Mastery & Leadership (2+ years)</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-8">
                {/* Performance Optimization */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-muted p-4 flex items-center justify-between">
                    <h3 className="text-lg font-bold">1. Performance Optimization</h3>
                    <Badge variant="outline">Essential</Badge>
                  </div>
                  <div className="p-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {[
                      { name: "Memory Management", link: "/topics/performance-optimization", icon: <Zap size={16} /> },
                      { name: "Widget Rebuilds", link: "/topics/performance-optimization", icon: <Zap size={16} /> },
                      {
                        name: "Render Optimization",
                        link: "/topics/performance-optimization",
                        icon: <Zap size={16} />,
                      },
                      { name: "App Size Reduction", link: "/topics/performance-optimization", icon: <Zap size={16} /> },
                      {
                        name: "Profiling & Benchmarking",
                        link: "/topics/performance-optimization",
                        icon: <Zap size={16} />,
                      },
                      {
                        name: "Frame Rate Optimization",
                        link: "/topics/performance-optimization",
                        icon: <Zap size={16} />,
                      },
                    ].map((item, i) => (
                      <Link
                        href={item.link}
                        key={i}
                        className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
                      >
                        {item.icon}
                        <span>{item.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Advanced Architecture */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-muted p-4 flex items-center justify-between">
                    <h3 className="text-lg font-bold">2. Advanced Architecture</h3>
                    <Badge variant="outline">Essential</Badge>
                  </div>
                  <div className="p-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {[
                      { name: "Clean Architecture", link: "/topics/architecture-patterns", icon: <Code size={16} /> },
                      { name: "Domain-Driven Design", link: "/topics/architecture-patterns", icon: <Code size={16} /> },
                      {
                        name: "Design Patterns in Flutter",
                        link: "/topics/architecture-patterns",
                        icon: <Code size={16} />,
                      },
                      {
                        name: "Scalable Project Structure",
                        link: "/topics/architecture-patterns",
                        icon: <Code size={16} />,
                      },
                      {
                        name: "Microservices Integration",
                        link: "/topics/architecture-patterns",
                        icon: <Code size={16} />,
                      },
                      { name: "Monorepo Strategies", link: "/topics/architecture-patterns", icon: <Code size={16} /> },
                    ].map((item, i) => (
                      <Link
                        href={item.link}
                        key={i}
                        className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
                      >
                        {item.icon}
                        <span>{item.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Cross-Platform Development */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-muted p-4 flex items-center justify-between">
                    <h3 className="text-lg font-bold">3. Cross-Platform Development</h3>
                    <Badge variant="outline">Important</Badge>
                  </div>
                  <div className="p-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {[
                      { name: "Flutter for Web", link: "/topics/flutter-web", icon: <Globe size={16} /> },
                      { name: "Flutter for Desktop", link: "/topics/flutter-desktop", icon: <Server size={16} /> },
                      { name: "Flutter for Embedded", link: "/topics/flutter-embedded", icon: <Brain size={16} /> },
                      {
                        name: "Adaptive UI Design",
                        link: "/topics/performance-optimization",
                        icon: <Layout size={16} />,
                      },
                    ].map((item, i) => (
                      <Link
                        href={item.link}
                        key={i}
                        className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
                      >
                        {item.icon}
                        <span>{item.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Security Best Practices */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-muted p-4 flex items-center justify-between">
                    <h3 className="text-lg font-bold">4. Security Best Practices</h3>
                    <Badge variant="outline">Important</Badge>
                  </div>
                  <div className="p-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {[
                      { name: "Data Encryption", link: "/topics/security-best-practices", icon: <Code size={16} /> },
                      {
                        name: "Authentication & Authorization",
                        link: "/topics/security-best-practices",
                        icon: <Users size={16} />,
                      },
                      {
                        name: "Secure API Communication",
                        link: "/topics/security-best-practices",
                        icon: <Globe size={16} />,
                      },
                      { name: "Code Obfuscation", link: "/topics/security-best-practices", icon: <Code size={16} /> },
                      {
                        name: "Vulnerability Scanning",
                        link: "/topics/security-best-practices",
                        icon: <Zap size={16} />,
                      },
                    ].map((item, i) => (
                      <Link
                        href={item.link}
                        key={i}
                        className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
                      >
                        {item.icon}
                        <span>{item.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* DevOps & CI/CD */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-muted p-4 flex items-center justify-between">
                    <h3 className="text-lg font-bold">5. DevOps & CI/CD</h3>
                    <Badge variant="outline">Useful</Badge>
                  </div>
                  <div className="p-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {[
                      {
                        name: "Automated Testing",
                        link: "/topics/flutter-testing-strategies",
                        icon: <Code size={16} />,
                      },
                      { name: "Continuous Integration", link: "/topics/devops-ci-cd", icon: <Server size={16} /> },
                      { name: "Continuous Deployment", link: "/topics/devops-ci-cd", icon: <Server size={16} /> },
                      { name: "Release Management", link: "/topics/devops-ci-cd", icon: <Server size={16} /> },
                      { name: "Infrastructure as Code", link: "/topics/devops-ci-cd", icon: <Code size={16} /> },
                    ].map((item, i) => (
                      <Link
                        href={item.link}
                        key={i}
                        className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
                      >
                        {item.icon}
                        <span>{item.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Monitoring & Analytics */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-muted p-4 flex items-center justify-between">
                    <h3 className="text-lg font-bold">6. Monitoring & Analytics</h3>
                    <Badge variant="outline">Useful</Badge>
                  </div>
                  <div className="p-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {[
                      {
                        name: "Performance Monitoring",
                        link: "/topics/performance-optimization",
                        icon: <Zap size={16} />,
                      },
                      { name: "Crash Reporting", link: "/topics/performance-optimization", icon: <Zap size={16} /> },
                      { name: "User Analytics", link: "/topics/performance-optimization", icon: <Users size={16} /> },
                      { name: "A/B Testing", link: "/topics/performance-optimization", icon: <Brain size={16} /> },
                    ].map((item, i) => (
                      <Link
                        href={item.link}
                        key={i}
                        className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
                      >
                        {item.icon}
                        <span>{item.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Senior Projects Section */}
                <div className="mt-8">
                  <h3 className="text-xl font-bold mb-4">Recommended Senior Level Projects</h3>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[
                      {
                        title: "Large-Scale Enterprise App",
                        description: "Architect and develop a complex enterprise-level application.",
                        skills: ["Architecture", "Performance", "Security"],
                      },
                      {
                        title: "Cross-Platform App Suite",
                        description: "Build a suite of apps targeting multiple platforms (web, desktop, mobile).",
                        skills: ["Cross-Platform", "Adaptive UI", "DevOps"],
                      },
                      {
                        title: "AI-Powered Mobile App",
                        description: "Develop an app that leverages AI and machine learning for advanced features.",
                        skills: ["AI/ML", "Data Science", "Performance"],
                      },
                    ].map((project, i) => (
                      <Card key={i} className="overflow-hidden">
                        <div className="bg-gradient-to-r from-purple-400/20 to-pink-400/20 p-4">
                          <h4 className="font-bold">{project.title}</h4>
                        </div>
                        <CardContent className="p-4">
                          <p className="text-sm mb-3 text-muted-foreground">{project.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {project.skills.map((skill, j) => (
                              <Badge key={j} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Conclusion Section */}
                <div className="mt-8 p-6 border rounded-lg bg-muted/50">
                  <h3 className="text-xl font-bold mb-2">Congratulations!</h3>
                  <p className="mb-4">
                    You've reached the senior level and mastered advanced Flutter development techniques. Keep learning,
                    experimenting, and contributing to the Flutter community to stay at the forefront of this exciting
                    technology.
                  </p>
                  <Button variant="default" asChild>
                    <Link href="/">
                      Back to Home <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </TabsContent>
    </Tabs>
  )
}

function VerticalRoadmap() {
  return (
    <div className="space-y-8">
      {/* Overview Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Flutter Development Journey</CardTitle>
            <CardDescription>
              The complete path to becoming a Flutter developer from scratch to senior level
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center gap-4 mb-8">
              {/* Junior */}
              <div className="flex flex-col items-center text-center max-w-xs">
                <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                  <BookOpen className="h-10 w-10 text-green-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">Junior</h3>
                <p className="text-muted-foreground text-sm">
                  Learn the fundamentals of Dart and Flutter, build basic apps with UI components
                </p>
              </div>

              <ArrowDown className="h-8 w-8 text-muted-foreground" />

              {/* Middle */}
              <div className="flex flex-col items-center text-center max-w-xs">
                <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                  <Code className="h-10 w-10 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">Middle</h3>
                <p className="text-muted-foreground text-sm">
                  Master state management, navigation, and APIs, build more complex applications
                </p>
              </div>

              <ArrowDown className="h-8 w-8 text-muted-foreground" />

              {/* Senior */}
              <div className="flex flex-col items-center text-center max-w-xs">
                <div className="w-20 h-20 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                  <Zap className="h-10 w-10 text-purple-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">Senior</h3>
                <p className="text-muted-foreground text-sm">
                  Implement advanced patterns, optimize performance, architect complex solutions
                </p>
              </div>
            </div>

            <div className="bg-muted p-6 rounded-lg">
              <h4 className="font-bold mb-4 text-lg">Key highlights of the roadmap:</h4>
              <ul className="grid gap-2 md:grid-cols-2">
                {[
                  "Dart programming language fundamentals",
                  "Flutter framework and UI components",
                  "State management techniques",
                  "Navigation and routing",
                  "Working with APIs and data",
                  "Platform integration",
                  "Testing and debugging",
                  "Architecture patterns",
                  "Advanced UI and animations",
                  "Performance optimization",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <ChevronRight className="h-4 w-4 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* How to Use This Roadmap Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">How to Use This Roadmap</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <p>
                This roadmap is designed to guide you through your Flutter development journey from beginner to senior
                level. Here's how to make the most of it:
              </p>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-bold">1. Identify your level</h4>
                  <p className="text-sm text-muted-foreground">
                    Assess your current skills and choose the appropriate starting point: Junior, Middle, or Senior.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold">2. Follow the sequence</h4>
                  <p className="text-sm text-muted-foreground">
                    Work through the topics in order, as concepts build upon each other progressively.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold">3. Study the topics</h4>
                  <p className="text-sm text-muted-foreground">
                    Click on each topic to access detailed explanations, examples, and resources.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold">4. Practice with quizzes</h4>
                  <p className="text-sm text-muted-foreground">
                    Test your knowledge with our interactive quizzes for each topic to reinforce learning.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold">5. Build projects</h4>
                  <p className="text-sm text-muted-foreground">
                    Apply your knowledge by working on progressively more complex projects.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold">6. Track your progress</h4>
                  <p className="text-sm text-muted-foreground">
                    Monitor your development journey as you advance through the levels.
                  </p>
                </div>
              </div>

              <div className="flex justify-center mt-4">
                <Button asChild size="lg">
                  <Link href="#junior-section">
                    Start Your Journey <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Junior Level Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="mb-8">
          <CardHeader className="bg-green-50 dark:bg-green-900/20 rounded-t-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <CardTitle className="text-2xl">Junior Flutter Developer</CardTitle>
                <CardDescription>Foundation & Fundamentals (0-12 months)</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-8">
              {/* Dart Fundamentals */}
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted p-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold">1. Dart Programming Language</h3>
                  <Badge variant="outline">Essential</Badge>
                </div>
                <div className="p-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {[
                    { name: "Dart Basics", link: "/topics/dart-fundamentals", icon: <Code size={16} /> },
                    { name: "Variables & Types", link: "/topics/dart-fundamentals", icon: <Code size={16} /> },
                    { name: "Control Flow", link: "/topics/dart-fundamentals", icon: <Code size={16} /> },
                    { name: "Functions", link: "/topics/dart-fundamentals", icon: <Code size={16} /> },
                    { name: "Collections", link: "/topics/dart-fundamentals", icon: <Code size={16} /> },
                    {
                      name: "Object-Oriented Programming",
                      link: "/topics/dart-fundamentals",
                      icon: <Code size={16} />,
                    },
                    { name: "Null Safety", link: "/topics/dart-fundamentals", icon: <Code size={16} /> },
                  ].map((item, i) => (
                    <Link
                      href={item.link}
                      key={i}
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Flutter Basics */}
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted p-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold">2. Flutter Basics</h3>
                  <Badge variant="outline">Essential</Badge>
                </div>
                <div className="p-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {[
                    { name: "Flutter Introduction", link: "/topics/flutter-basics", icon: <Layout size={16} /> },
                    { name: "Project Structure", link: "/topics/flutter-basics", icon: <Layout size={16} /> },
                    { name: "Widgets Overview", link: "/topics/flutter-widgets", icon: <Layout size={16} /> },
                    { name: "Basic Layouts", link: "/topics/flutter-widgets", icon: <Layout size={16} /> },
                    { name: "Stateless Widgets", link: "/topics/flutter-widgets", icon: <Layout size={16} /> },
                    { name: "Stateful Widgets", link: "/topics/flutter-widgets", icon: <Layout size={16} /> },
                    { name: "Basic State Management", link: "/topics/state-management", icon: <Layout size={16} /> },
                  ].map((item, i) => (
                    <Link
                      href={item.link}
                      key={i}
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* UI Components */}
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted p-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold">3. UI Components & Styling</h3>
                  <Badge variant="outline">Essential</Badge>
                </div>
                <div className="p-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {[
                    { name: "Text & Typography", link: "/topics/flutter-widgets", icon: <Layout size={16} /> },
                    { name: "Buttons & Inputs", link: "/topics/flutter-widgets", icon: <Layout size={16} /> },
                    { name: "Images & Assets", link: "/topics/flutter-widgets", icon: <Layout size={16} /> },
                    { name: "Lists & Grids", link: "/topics/flutter-widgets", icon: <Layout size={16} /> },
                    { name: "App Bar & Navigation", link: "/topics/navigation-routing", icon: <Layout size={16} /> },
                    { name: "Dialogs & Modals", link: "/topics/flutter-widgets", icon: <Layout size={16} /> },
                    { name: "Theming & Styling", link: "/topics/flutter-widgets", icon: <Layout size={16} /> },
                  ].map((item, i) => (
                    <Link
                      href={item.link}
                      key={i}
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Basic State Management */}
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted p-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold">4. Basic Navigation & State Management</h3>
                  <Badge variant="outline">Essential</Badge>
                </div>
                <div className="p-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {[
                    { name: "setState", link: "/topics/state-management", icon: <Settings size={16} /> },
                    { name: "Basic Navigation", link: "/topics/navigation-routing", icon: <Settings size={16} /> },
                    { name: "Route Management", link: "/topics/navigation-routing", icon: <Settings size={16} /> },
                    {
                      name: "Passing Data Between Screens",
                      link: "/topics/navigation-routing",
                      icon: <Settings size={16} />,
                    },
                    { name: "InheritedWidget", link: "/topics/state-management", icon: <Settings size={16} /> },
                    {
                      name: "Introduction to Provider",
                      link: "/topics/state-management",
                      icon: <Settings size={16} />,
                    },
                  ].map((item, i) => (
                    <Link
                      href={item.link}
                      key={i}
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Basic Data Management */}
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted p-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold">5. Basic Data Management</h3>
                  <Badge variant="outline">Essential</Badge>
                </div>
                <div className="p-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {[
                    { name: "JSON Parsing", link: "/topics/async-programming", icon: <Database size={16} /> },
                    { name: "Basic HTTP Requests", link: "/topics/async-programming", icon: <Database size={16} /> },
                    { name: "Async/Await", link: "/topics/async-programming", icon: <Database size={16} /> },
                    { name: "SharedPreferences", link: "/topics/async-programming", icon: <Database size={16} /> },
                    { name: "Form Handling", link: "/topics/flutter-widgets", icon: <Database size={16} /> },
                  ].map((item, i) => (
                    <Link
                      href={item.link}
                      key={i}
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Dev Tools & Debugging */}
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted p-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold">6. Dev Tools & Debugging</h3>
                  <Badge variant="outline">Important</Badge>
                </div>
                <div className="p-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {[
                    { name: "Flutter DevTools", link: "/topics/flutter-basics", icon: <Code size={16} /> },
                    { name: "Hot Reload/Restart", link: "/topics/flutter-basics", icon: <Code size={16} /> },
                    { name: "Debugging Techniques", link: "/topics/flutter-basics", icon: <Code size={16} /> },
                    { name: "Dart Analyzer", link: "/topics/dart-fundamentals", icon: <Code size={16} /> },
                  ].map((item, i) => (
                    <Link
                      href={item.link}
                      key={i}
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Junior Projects Section */}
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Recommended Junior Level Projects</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {[
                    {
                      title: "To-Do List App",
                      description: "Build a simple task manager with basic CRUD operations.",
                      skills: ["UI Components", "setState", "SharedPreferences"],
                    },
                    {
                      title: "Weather App",
                      description: "Create an app that fetches and displays weather data.",
                      skills: ["HTTP Requests", "JSON Parsing", "Async/Await"],
                    },
                    {
                      title: "Recipe Book",
                      description: "Develop an app to browse and view cooking recipes.",
                      skills: ["Lists", "Navigation", "Basic State Management"],
                    },
                  ].map((project, i) => (
                    <Card key={i} className="overflow-hidden">
                      <div className="bg-gradient-to-r from-green-400/20 to-blue-400/20 p-4">
                        <h4 className="font-bold">{project.title}</h4>
                      </div>
                      <CardContent className="p-4">
                        <p className="text-sm mb-3 text-muted-foreground">{project.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {project.skills.map((skill, j) => (
                            <Badge key={j} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Middle Level Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="mb-8">
          <CardHeader className="bg-blue-50 dark:bg-blue-900/20 rounded-t-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Code className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <CardTitle className="text-2xl">Middle Flutter Developer</CardTitle>
                <CardDescription>Advanced Concepts & Best Practices (1-2 years)</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-8">
              {/* Advanced Dart Programming */}
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted p-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold">1. Advanced Dart Programming</h3>
                  <Badge variant="outline">Essential</Badge>
                </div>
                <div className="p-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {[
                    { name: "Asynchronous Programming", link: "/topics/async-programming", icon: <Code size={16} /> },
                    { name: "Streams & Futures", link: "/topics/async-programming", icon: <Code size={16} /> },
                    { name: "Generics", link: "/topics/dart-fundamentals", icon: <Code size={16} /> },
                    { name: "Collections in Depth", link: "/topics/dart-fundamentals", icon: <Code size={16} /> },
                    { name: "Extension Methods", link: "/topics/dart-fundamentals", icon: <Code size={16} /> },
                    { name: "Isolates & Concurrency", link: "/topics/async-programming", icon: <Code size={16} /> },
                  ].map((item, i) => (
                    <Link
                      href={item.link}
                      key={i}
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Advanced State Management */}
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted p-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold">2. Advanced State Management</h3>
                  <Badge variant="outline">Essential</Badge>
                </div>
                <div className="p-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {[
                    { name: "Provider (In Depth)", link: "/topics/state-management", icon: <Settings size={16} /> },
                    { name: "Riverpod", link: "/topics/state-management", icon: <Settings size={16} /> },
                    { name: "BLoC Pattern", link: "/topics/state-management", icon: <Settings size={16} /> },
                    { name: "Redux", link: "/topics/state-management", icon: <Settings size={16} /> },
                    { name: "GetX", link: "/topics/state-management", icon: <Settings size={16} /> },
                    { name: "MobX", link: "/topics/state-management", icon: <Settings size={16} /> },
                  ].map((item, i) => (
                    <Link
                      href={item.link}
                      key={i}
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Navigation & Routing */}
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted p-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold">3. Advanced Navigation & Routing</h3>
                  <Badge variant="outline">Essential</Badge>
                </div>
                <div className="p-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {[
                    { name: "Named Routes", link: "/topics/navigation-routing", icon: <Layout size={16} /> },
                    { name: "Navigation 2.0", link: "/topics/navigation-routing", icon: <Layout size={16} /> },
                    { name: "GoRouter", link: "/topics/navigation-routing", icon: <Layout size={16} /> },
                    { name: "Auto Route", link: "/topics/navigation-routing", icon: <Layout size={16} /> },
                    { name: "Deep Linking", link: "/topics/navigation-routing", icon: <Layout size={16} /> },
                    { name: "Web URLs", link: "/topics/navigation-routing", icon: <Layout size={16} /> },
                  ].map((item, i) => (
                    <Link
                      href={item.link}
                      key={i}
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Data Management & APIs */}
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted p-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold">4. Data Management & APIs</h3>
                  <Badge variant="outline">Essential</Badge>
                </div>
                <div className="p-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {[
                    { name: "RESTful APIs", link: "/topics/async-programming", icon: <Globe size={16} /> },
                    { name: "GraphQL", link: "/topics/async-programming", icon: <Globe size={16} /> },
                    { name: "Dio & Http Client", link: "/topics/async-programming", icon: <Globe size={16} /> },
                    {
                      name: "Local Database (SQLite)",
                      link: "/topics/async-programming",
                      icon: <Database size={16} />,
                    },
                    { name: "Firebase Integration", link: "/topics/async-programming", icon: <Database size={16} /> },
                    {
                      name: "Caching Strategies",
                      link: "/topics/performance-optimization",
                      icon: <Database size={16} />,
                    },
                  ].map((item, i) => (
                    <Link
                      href={item.link}
                      key={i}
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* UI/UX & Animations */}
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted p-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold">5. UI/UX & Animations</h3>
                  <Badge variant="outline">Essential</Badge>
                </div>
                <div className="p-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {[
                    { name: "Custom Animations", link: "/topics/advanced-animations", icon: <Layout size={16} /> },
                    { name: "Implicit Animations", link: "/topics/advanced-animations", icon: <Layout size={16} /> },
                    { name: "Explicit Animations", link: "/topics/advanced-animations", icon: <Layout size={16} /> },
                    { name: "Custom Painters", link: "/topics/custom-painter-clipper", icon: <Layout size={16} /> },
                    { name: "Custom Clippers", link: "/topics/custom-painter-clipper", icon: <Layout size={16} /> },
                    { name: "Responsive Design", link: "/topics/performance-optimization", icon: <Layout size={16} /> },
                    {
                      name: "Internationalization",
                      link: "/topics/flutter-internationalization",
                      icon: <Globe size={16} />,
                    },
                  ].map((item, i) => (
                    <Link
                      href={item.link}
                      key={i}
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Testing & Architecture */}
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted p-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold">6. Testing & Architecture</h3>
                  <Badge variant="outline">Important</Badge>
                </div>
                <div className="p-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {[
                    { name: "Unit Testing", link: "/topics/flutter-testing-strategies", icon: <Code size={16} /> },
                    { name: "Widget Testing", link: "/topics/flutter-testing-strategies", icon: <Code size={16} /> },
                    {
                      name: "Integration Testing",
                      link: "/topics/flutter-testing-strategies",
                      icon: <Code size={16} />,
                    },
                    { name: "MVVM Pattern", link: "/topics/architecture-patterns", icon: <Code size={16} /> },
                    { name: "Repository Pattern", link: "/topics/architecture-patterns", icon: <Code size={16} /> },
                    { name: "Dependency Injection", link: "/topics/architecture-patterns", icon: <Code size={16} /> },
                  ].map((item, i) => (
                    <Link
                      href={item.link}
                      key={i}
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Package Development */}
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted p-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold">7. Package & Plugin Development</h3>
                  <Badge variant="outline">Useful</Badge>
                </div>
                <div className="p-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {[
                    {
                      name: "Creating Flutter Packages",
                      link: "/topics/flutter-plugin-development",
                      icon: <Code size={16} />,
                    },
                    {
                      name: "Publishing to pub.dev",
                      link: "/topics/flutter-plugin-development",
                      icon: <Code size={16} />,
                    },
                    { name: "Platform Channels", link: "/topics/flutter-plugin-development", icon: <Code size={16} /> },
                    {
                      name: "Native Plugin Development",
                      link: "/topics/flutter-plugin-development",
                      icon: <Code size={16} />,
                    },
                  ].map((item, i) => (
                    <Link
                      href={item.link}
                      key={i}
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Middle Projects Section */}
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Recommended Middle Level Projects</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {[
                    {
                      title: "E-commerce App",
                      description: "Build a complete e-commerce app with product listings, cart, and checkout.",
                      skills: ["State Management", "APIs", "Navigation"],
                    },
                    {
                      title: "Social Media App",
                      description: "Create a social media app with feeds, profiles, and real-time updates.",
                      skills: ["Firebase", "Streams", "UI/UX"],
                    },
                    {
                      title: "Task Management System",
                      description: "Develop a productivity app with complex state and data persistence.",
                      skills: ["Database", "State Management", "Architecture"],
                    },
                  ].map((project, i) => (
                    <Card key={i} className="overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-400/20 to-purple-400/20 p-4">
                        <h4 className="font-bold">{project.title}</h4>
                      </div>
                      <CardContent className="p-4">
                        <p className="text-sm mb-3 text-muted-foreground">{project.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {project.skills.map((skill, j) => (
                            <Badge key={j} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Senior Level Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="mb-8">
          <CardHeader className="bg-purple-50 dark:bg-purple-900/20 rounded-t-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Zap className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <CardTitle className="text-2xl">Senior Flutter Developer</CardTitle>
                <CardDescription>Mastery & Leadership (2+ years)</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-8">
              {/* Performance Optimization */}
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted p-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold">1. Performance Optimization</h3>
                  <Badge variant="outline">Essential</Badge>
                </div>
                <div className="p-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {[
                    { name: "Memory Management", link: "/topics/performance-optimization", icon: <Zap size={16} /> },
                    { name: "Widget Rebuilds", link: "/topics/performance-optimization", icon: <Zap size={16} /> },
                    { name: "Render Optimization", link: "/topics/performance-optimization", icon: <Zap size={16} /> },
                    { name: "App Size Reduction", link: "/topics/performance-optimization", icon: <Zap size={16} /> },
                    {
                      name: "Profiling & Benchmarking",
                      link: "/topics/performance-optimization",
                      icon: <Zap size={16} />,
                    },
                    {
                      name: "Frame Rate Optimization",
                      link: "/topics/performance-optimization",
                      icon: <Zap size={16} />,
                    },
                  ].map((item, i) => (
                    <Link
                      href={item.link}
                      key={i}
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Advanced Architecture */}
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted p-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold">2. Advanced Architecture</h3>
                  <Badge variant="outline">Essential</Badge>
                </div>
                <div className="p-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {[
                    { name: "Clean Architecture", link: "/topics/architecture-patterns", icon: <Code size={16} /> },
                    { name: "Domain-Driven Design", link: "/topics/architecture-patterns", icon: <Code size={16} /> },
                    {
                      name: "Design Patterns in Flutter",
                      link: "/topics/architecture-patterns",
                      icon: <Code size={16} />,
                    },
                    {
                      name: "Scalable Project Structure",
                      link: "/topics/architecture-patterns",
                      icon: <Code size={16} />,
                    },
                    {
                      name: "Microservices Integration",
                      link: "/topics/architecture-patterns",
                      icon: <Code size={16} />,
                    },
                    { name: "Monorepo Strategies", link: "/topics/architecture-patterns", icon: <Code size={16} /> },
                  ].map((item, i) => (
                    <Link
                      href={item.link}
                      key={i}
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Cross-Platform Development */}
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted p-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold">3. Cross-Platform Development</h3>
                  <Badge variant="outline">Important</Badge>
                </div>
                <div className="p-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {[
                    { name: "Flutter for Web", link: "/topics/flutter-web", icon: <Globe size={16} /> },
                    { name: "Flutter for Desktop", link: "/topics/flutter-desktop", icon: <Server size={16} /> },
                    { name: "Flutter for Embedded", link: "/topics/flutter-embedded", icon: <Brain size={16} /> },
                    {
                      name: "Adaptive UI Design",
                      link: "/topics/performance-optimization",
                      icon: <Layout size={16} />,
                    },
                  ].map((item, i) => (
                    <Link
                      href={item.link}
                      key={i}
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Security Best Practices */}
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted p-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold">4. Security Best Practices</h3>
                  <Badge variant="outline">Important</Badge>
                </div>
                <div className="p-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {[
                    { name: "Data Encryption", link: "/topics/security-best-practices", icon: <Code size={16} /> },
                    {
                      name: "Authentication & Authorization",
                      link: "/topics/security-best-practices",
                      icon: <Users size={16} />,
                    },
                    {
                      name: "Secure API Communication",
                      link: "/topics/security-best-practices",
                      icon: <Globe size={16} />,
                    },
                    { name: "Code Obfuscation", link: "/topics/security-best-practices", icon: <Code size={16} /> },
                    {
                      name: "Vulnerability Scanning",
                      link: "/topics/security-best-practices",
                      icon: <Zap size={16} />,
                    },
                  ].map((item, i) => (
                    <Link
                      href={item.link}
                      key={i}
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* DevOps & CI/CD */}
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted p-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold">5. DevOps & CI/CD</h3>
                  <Badge variant="outline">Useful</Badge>
                </div>
                <div className="p-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {[
                    { name: "Automated Testing", link: "/topics/flutter-testing-strategies", icon: <Code size={16} /> },
                    { name: "Continuous Integration", link: "/topics/devops-ci-cd", icon: <Server size={16} /> },
                    { name: "Continuous Deployment", link: "/topics/devops-ci-cd", icon: <Server size={16} /> },
                    { name: "Release Management", link: "/topics/devops-ci-cd", icon: <Server size={16} /> },
                    { name: "Infrastructure as Code", link: "/topics/devops-ci-cd", icon: <Code size={16} /> },
                  ].map((item, i) => (
                    <Link
                      href={item.link}
                      key={i}
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Monitoring & Analytics */}
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted p-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold">6. Monitoring & Analytics</h3>
                  <Badge variant="outline">Useful</Badge>
                </div>
                <div className="p-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {[
                    {
                      name: "Performance Monitoring",
                      link: "/topics/performance-optimization",
                      icon: <Zap size={16} />,
                    },
                    { name: "Crash Reporting", link: "/topics/performance-optimization", icon: <Zap size={16} /> },
                    { name: "User Analytics", link: "/topics/performance-optimization", icon: <Users size={16} /> },
                    { name: "A/B Testing", link: "/topics/performance-optimization", icon: <Brain size={16} /> },
                  ].map((item, i) => (
                    <Link
                      href={item.link}
                      key={i}
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Senior Projects Section */}
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Recommended Senior Level Projects</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {[
                    {
                      title: "Large-Scale Enterprise App",
                      description: "Architect and develop a complex enterprise-level application.",
                      skills: ["Architecture", "Performance", "Security"],
                    },
                    {
                      title: "Cross-Platform App Suite",
                      description: "Build a suite of apps targeting multiple platforms (web, desktop, mobile).",
                      skills: ["Cross-Platform", "Adaptive UI", "DevOps"],
                    },
                    {
                      title: "AI-Powered Mobile App",
                      description: "Develop an app that leverages AI and machine learning for advanced features.",
                      skills: ["AI/ML", "Data Science", "Performance"],
                    },
                  ].map((project, i) => (
                    <Card key={i} className="overflow-hidden">
                      <div className="bg-gradient-to-r from-purple-400/20 to-pink-400/20 p-4">
                        <h4 className="font-bold">{project.title}</h4>
                      </div>
                      <CardContent className="p-4">
                        <p className="text-sm mb-3 text-muted-foreground">{project.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {project.skills.map((skill, j) => (
                            <Badge key={j} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
