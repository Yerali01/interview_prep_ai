"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, FileCode } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export default function CircularDependenciesPage() {
  const router = useRouter()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-12"
    >
      <Button variant="ghost" className="mb-6" onClick={() => router.push("/resources")}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Resources
      </Button>

      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold mb-8"
      >
        Understanding Circular Dependencies
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="mb-8">
          <CardContent className="p-6 md:p-8">
            <div className="prose prose-invert max-w-none dark:prose-invert">
              <h2>What Are Circular Dependencies?</h2>
              <p>
                Circular dependencies occur when two or more modules depend on each other, either directly or
                indirectly. For example, if module A imports from module B, and module B imports from module A, they
                form a circular dependency.
              </p>

              <div className="bg-muted p-4 rounded-md my-6">
                <h3 className="text-lg font-medium mb-2 flex items-center">
                  <FileCode className="mr-2 h-5 w-5" /> Example of a Circular Dependency
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium mb-1">moduleA.ts</p>
                    <pre className="bg-muted-foreground/10 p-3 rounded-md text-sm overflow-x-auto">
                      <code>{`import { functionB } from './moduleB';

export function functionA() {
  console.log('Function A');
  functionB();
}
`}</code>
                    </pre>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">moduleB.ts</p>
                    <pre className="bg-muted-foreground/10 p-3 rounded-md text-sm overflow-x-auto">
                      <code>{`import { functionA } from './moduleA';

export function functionB() {
  console.log('Function B');
  functionA();
}
`}</code>
                    </pre>
                  </div>
                </div>
              </div>

              <h2>Why Are Circular Dependencies Problematic?</h2>
              <p>Circular dependencies can cause several issues in your application:</p>
              <ul>
                <li>
                  <strong>Initialization Problems:</strong> When modules depend on each other, one module might try to
                  use exports from another module that hasn't been fully initialized yet.
                </li>
                <li>
                  <strong>Runtime Errors:</strong> Values might be undefined when you expect them to be defined, leading
                  to errors like "X is not a function" or "cannot read property of undefined".
                </li>
                <li>
                  <strong>Maintenance Challenges:</strong> Circular dependencies make code harder to understand, test,
                  and maintain.
                </li>
                <li>
                  <strong>Build Issues:</strong> Some bundlers and build tools may have problems optimizing code with
                  circular dependencies.
                </li>
              </ul>

              <h2>How JavaScript Handles Circular Dependencies</h2>
              <p>
                JavaScript's module system tries to resolve circular dependencies by partially executing modules. Here's
                what happens:
              </p>
              <ol>
                <li>Module A starts loading</li>
                <li>Module A imports from Module B</li>
                <li>JavaScript pauses loading Module A and starts loading Module B</li>
                <li>Module B imports from Module A</li>
                <li>
                  Since Module A is still being loaded, JavaScript returns a partial Module A with potentially
                  uninitialized exports
                </li>
                <li>Module B finishes loading using the partial exports from Module A</li>
                <li>Module A continues loading with the fully initialized Module B</li>
              </ol>
              <p>
                This process can lead to unexpected behavior because some values might be undefined when they're used.
              </p>

              <div className="bg-muted p-4 rounded-md my-6">
                <h3 className="text-lg font-medium mb-2">Real-World Example: Flutter Interview Prep App</h3>
                <p>
                  Our app encountered a circular dependency between <code>data.ts</code> and{" "}
                  <code>additional-data.ts</code>:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-sm font-medium mb-1">data.ts (before fix)</p>
                    <pre className="bg-muted-foreground/10 p-3 rounded-md text-sm overflow-x-auto">
                      <code>{`import { additionalTopics, additionalQuizzes } from "./additional-data"

// Define base topics and quizzes
export const topics = [
  // ...topic definitions
]

export const quizzes = [
  // ...quiz definitions
]

// Export combined data
export const allTopics = [...topics, ...additionalTopics]
export const allQuizzes = [...quizzes, ...additionalQuizzes]
`}</code>
                    </pre>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">additional-data.ts (before fix)</p>
                    <pre className="bg-muted-foreground/10 p-3 rounded-md text-sm overflow-x-auto">
                      <code>{`import { topics, quizzes } from "./data"

// Define additional topics
export const additionalTopics = [
  // ...additional topic definitions
]

// Define additional quizzes
export const additionalQuizzes = [
  // ...additional quiz definitions
]
`}</code>
                    </pre>
                  </div>
                </div>
                <p className="mt-4">
                  This caused the error: <code>FatalRendererError: topics is not iterable</code> because{" "}
                  <code>topics</code> was undefined when <code>additional-data.ts</code> tried to use it.
                </p>
              </div>

              <h2>Best Practices for Avoiding Circular Dependencies</h2>
              <ol>
                <li>
                  <strong>Restructure Your Code:</strong> Reorganize your modules to eliminate the circular dependency.
                  This often involves creating a new module that both dependent modules can import from.
                </li>
                <li>
                  <strong>Extract Shared Types/Interfaces:</strong> If both files need the same types, extract them to a
                  separate file that both can import.
                </li>
                <li>
                  <strong>Use Dependency Injection:</strong> Pass dependencies as parameters rather than importing them
                  directly.
                </li>
                <li>
                  <strong>Create a Mediator Module:</strong> Have a third module that imports from both and coordinates
                  between them.
                </li>
                <li>
                  <strong>Use Dynamic Imports:</strong> In some cases, you can use dynamic imports to break the cycle.
                </li>
              </ol>

              <h2>How We Fixed Our Circular Dependency</h2>
              <p>
                We restructured the code to make <code>additional-data.ts</code> completely independent and have{" "}
                <code>data.ts</code> depend on it, not the other way around:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-sm font-medium mb-1">data.ts (after fix)</p>
                  <pre className="bg-muted-foreground/10 p-3 rounded-md text-sm overflow-x-auto">
                    <code>{`// Add import for additional data at the top of the file
import { additionalTopics, additionalQuizzes } from "./additional-data"

// Define base topics and quizzes
export const topics = [
  // ...topic definitions
]

export const quizzes = [
  // ...quiz definitions
]

// Combine the original topics with the additional topics
export const allTopics = [...topics, ...additionalTopics]

// Combine the original quizzes with the additional quizzes
export const allQuizzes = [...quizzes, ...additionalQuizzes]
`}</code>
                  </pre>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">additional-data.ts (after fix)</p>
                  <pre className="bg-muted-foreground/10 p-3 rounded-md text-sm overflow-x-auto">
                    <code>{`// No imports from data.ts

// Define additional topics without importing from data.ts
export const additionalTopics = [
  // ...additional topic definitions
]

// Define additional quizzes without importing from data.ts
export const additionalQuizzes = [
  // ...additional quiz definitions
]

// Export other data as needed
export const flutterResources = [
  // ...resource definitions
]
`}</code>
                  </pre>
                </div>
              </div>

              <p className="mt-4">
                This approach maintains a clean separation of concerns while ensuring that dependencies flow in one
                direction only, preventing the circular reference that was causing the error.
              </p>

              <h2>Tools for Detecting Circular Dependencies</h2>
              <p>Several tools can help you detect and visualize circular dependencies in your codebase:</p>
              <ul>
                <li>
                  <strong>madge:</strong> A tool for generating a visual graph of module dependencies
                </li>
                <li>
                  <strong>ESLint plugin:</strong> The eslint-plugin-import has a rule called "no-cycle" that can detect
                  circular dependencies
                </li>
                <li>
                  <strong>TypeScript Project References:</strong> TypeScript's project references feature can help
                  enforce a proper dependency graph
                </li>
                <li>
                  <strong>Webpack Circular Dependency Plugin:</strong> For webpack users, this plugin can detect
                  circular dependencies during the build process
                </li>
              </ul>

              <h2>Conclusion</h2>
              <p>
                Circular dependencies are a common issue in JavaScript/TypeScript applications, but they can be avoided
                with proper code organization and architecture. By understanding how module loading works and following
                best practices, you can create more maintainable and robust applications.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
