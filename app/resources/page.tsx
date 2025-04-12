"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import { flutterResources } from "@/lib/additional-data"
import { motion } from "framer-motion"
import Link from "next/link"

export default function ResourcesPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-12"
    >
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold mb-8"
      >
        Flutter Resources
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-xl text-muted-foreground mb-8"
      >
        Explore these valuable resources to enhance your Flutter knowledge and prepare for interviews.
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {flutterResources.map((resource, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 * (index + 1) }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <Card className="hover:shadow-md transition-shadow h-full">
              <CardHeader>
                <CardTitle>{resource.title}</CardTitle>
                <CardDescription>{resource.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button asChild variant="outline">
                  <a href={resource.url} target="_blank" rel="noopener noreferrer">
                    Visit Resource <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
        <motion.div
          key="circular-dependencies"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 * (flutterResources.length + 1) }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <Card className="hover:shadow-md transition-shadow h-full">
            <CardHeader>
              <CardTitle>Understanding Circular Dependencies</CardTitle>
              <CardDescription>
                Learn about circular dependencies in JavaScript/TypeScript and how to avoid them
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild variant="outline">
                <Link href="/resources/circular-dependencies">
                  Read Article <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-12"
      >
        <h2 className="text-2xl font-bold mb-4">Additional Learning Tips</h2>
        <Card>
          <CardContent className="p-6">
            <ul className="space-y-2 list-disc pl-5">
              {[
                "Practice coding Flutter widgets from scratch to understand their inner workings",
                "Contribute to open-source Flutter projects to gain real-world experience",
                "Join Flutter communities on Discord, Reddit, or Stack Overflow to learn from others",
                "Build a portfolio of Flutter projects to showcase your skills during interviews",
                "Stay updated with the latest Flutter releases and features",
              ].map((tip, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                >
                  {tip}
                </motion.li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
