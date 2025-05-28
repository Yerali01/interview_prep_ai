"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Database, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Import both database services
import {
  dualGetTopics,
  dualGetDefinitions,
  dualGetProjects,
  dualGetQuizzes,
  getDatabaseConfig,
} from "@/lib/dual-database-service"

import { migrateSupabaseToFirebase, validateMigration, type MigrationResult } from "@/lib/data-migration"

// Import individual services for comparison
import { getTopics as supabaseGetTopics } from "@/lib/supabase-new"
import { firebaseGetTopics } from "@/lib/firebase-service"
import { runCompleteMigration, type CompleteMigrationResult } from "@/lib/complete-migration"

interface TestResult {
  name: string
  status: "success" | "error" | "warning"
  message: string
  duration?: number
  data?: any
}

export default function DatabaseTestPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [migrationResults, setMigrationResults] = useState<{
    topics: MigrationResult
    definitions: MigrationResult
    projects: MigrationResult
    quizzes: MigrationResult
  } | null>(null)
  const [validationResult, setValidationResult] = useState<any>(null)
  const { toast } = useToast()
  const [completeMigrationResults, setCompleteMigrationResults] = useState<CompleteMigrationResult | null>(null)

  const config = getDatabaseConfig()

  const runDatabaseTests = async () => {
    setIsLoading(true)
    setTestResults([])
    const results: TestResult[] = []

    // Test 1: Database Configuration
    results.push({
      name: "Database Configuration",
      status: "success",
      message: `Primary: ${config.primaryDatabase}, Backup: ${config.backupDatabase}, Dual Write: ${config.dualWriteEnabled ? "Enabled" : "Disabled"}`,
    })

    // Test 2: Firebase Connection
    try {
      const startTime = Date.now()
      const firebaseTopics = await firebaseGetTopics()
      const duration = Date.now() - startTime
      results.push({
        name: "Firebase Connection",
        status: "success",
        message: `Connected successfully. Found ${firebaseTopics.length} topics`,
        duration,
        data: { count: firebaseTopics.length },
      })
    } catch (error: any) {
      results.push({
        name: "Firebase Connection",
        status: "error",
        message: `Failed to connect: ${error.message}`,
      })
    }

    // Test 3: Supabase Connection
    try {
      const startTime = Date.now()
      const supabaseTopics = await supabaseGetTopics()
      const duration = Date.now() - startTime
      results.push({
        name: "Supabase Connection",
        status: "success",
        message: `Connected successfully. Found ${supabaseTopics.length} topics`,
        duration,
        data: { count: supabaseTopics.length },
      })
    } catch (error: any) {
      results.push({
        name: "Supabase Connection",
        status: "error",
        message: `Failed to connect: ${error.message}`,
      })
    }

    // Test 4: Dual Database Topics
    try {
      const startTime = Date.now()
      const topics = await dualGetTopics()
      const duration = Date.now() - startTime
      results.push({
        name: "Dual Database - Topics",
        status: "success",
        message: `Retrieved ${topics.length} topics via dual system`,
        duration,
        data: { count: topics.length },
      })
    } catch (error: any) {
      results.push({
        name: "Dual Database - Topics",
        status: "error",
        message: `Failed: ${error.message}`,
      })
    }

    // Test 5: Dual Database Definitions
    try {
      const startTime = Date.now()
      const definitions = await dualGetDefinitions()
      const duration = Date.now() - startTime
      results.push({
        name: "Dual Database - Definitions",
        status: "success",
        message: `Retrieved ${definitions.length} definitions via dual system`,
        duration,
        data: { count: definitions.length },
      })
    } catch (error: any) {
      results.push({
        name: "Dual Database - Definitions",
        status: "error",
        message: `Failed: ${error.message}`,
      })
    }

    // Test 6: Dual Database Projects
    try {
      const startTime = Date.now()
      const projects = await dualGetProjects()
      const duration = Date.now() - startTime
      results.push({
        name: "Dual Database - Projects",
        status: "success",
        message: `Retrieved ${projects.length} projects via dual system`,
        duration,
        data: { count: projects.length },
      })
    } catch (error: any) {
      results.push({
        name: "Dual Database - Projects",
        status: "error",
        message: `Failed: ${error.message}`,
      })
    }

    // Test 7: Dual Database Quizzes
    try {
      const startTime = Date.now()
      const quizzes = await dualGetQuizzes()
      const duration = Date.now() - startTime
      results.push({
        name: "Dual Database - Quizzes",
        status: "success",
        message: `Retrieved ${quizzes.length} quizzes via dual system`,
        duration,
        data: { count: quizzes.length },
      })
    } catch (error: any) {
      results.push({
        name: "Dual Database - Quizzes",
        status: "error",
        message: `Failed: ${error.message}`,
      })
    }

    setTestResults(results)
    setIsLoading(false)

    // Show summary toast
    const successCount = results.filter((r) => r.status === "success").length
    const errorCount = results.filter((r) => r.status === "error").length

    toast({
      title: "Database Tests Completed",
      description: `${successCount} passed, ${errorCount} failed`,
      variant: errorCount > 0 ? "destructive" : "default",
    })
  }

  const runMigration = async () => {
    setIsLoading(true)
    try {
      toast({
        title: "Migration Started",
        description: "Migrating data from Supabase to Firebase...",
      })

      const results = await migrateSupabaseToFirebase()
      setMigrationResults(results)

      const totalMigrated = Object.values(results).reduce((sum, result) => sum + result.migrated, 0)
      const totalErrors = Object.values(results).reduce((sum, result) => sum + result.errors.length, 0)

      toast({
        title: "Migration Completed",
        description: `Migrated ${totalMigrated} items with ${totalErrors} errors`,
        variant: totalErrors > 0 ? "destructive" : "default",
      })
    } catch (error: any) {
      toast({
        title: "Migration Failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const runValidation = async () => {
    setIsLoading(true)
    try {
      const result = await validateMigration()
      setValidationResult(result)

      toast({
        title: "Validation Completed",
        description: result.valid ? "Data is synchronized" : "Data mismatch detected",
        variant: result.valid ? "default" : "destructive",
      })
    } catch (error: any) {
      toast({
        title: "Validation Failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      default:
        return <Database className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      success: "default",
      error: "destructive",
      warning: "secondary",
    } as const

    return <Badge variant={variants[status as keyof typeof variants] || "outline"}>{status.toUpperCase()}</Badge>
  }

  const runCompleteMigrationProcess = async () => {
    setIsLoading(true)
    try {
      toast({
        title: "Complete Migration Started",
        description: "Migrating ALL data from Supabase to Firebase...",
      })

      const results = await runCompleteMigration()
      setCompleteMigrationResults(results)

      toast({
        title: "Complete Migration Finished",
        description: `Migrated ${results.totalMigrated} items with ${results.totalErrors} errors`,
        variant: results.totalErrors > 0 ? "destructive" : "default",
      })
    } catch (error: any) {
      toast({
        title: "Complete Migration Failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Database Testing & Migration</h1>
          <p className="text-muted-foreground">Test dual database functionality and migrate data</p>
        </div>
        <div className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          <span className="text-sm font-medium">
            Primary: {config.primaryDatabase} | Backup: {config.backupDatabase}
          </span>
        </div>
      </div>

      <Alert>
        <Database className="h-4 w-4" />
        <AlertDescription>
          <strong>Current Configuration:</strong> Primary database is {config.primaryDatabase}, backup is{" "}
          {config.backupDatabase}. Dual write is {config.dualWriteEnabled ? "enabled" : "disabled"}.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="tests" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tests">Database Tests</TabsTrigger>
          <TabsTrigger value="migration">Data Migration</TabsTrigger>
          <TabsTrigger value="validation">Validation</TabsTrigger>
        </TabsList>

        <TabsContent value="tests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Database Connectivity Tests</CardTitle>
              <CardDescription>Test connections to both Supabase and Firebase databases</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={runDatabaseTests} disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Database className="mr-2 h-4 w-4" />}
                Run Database Tests
              </Button>

              {testResults.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Test Results:</h3>
                  {testResults.map((result, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(result.status)}
                        <div>
                          <p className="font-medium">{result.name}</p>
                          <p className="text-sm text-muted-foreground">{result.message}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {result.duration && <span className="text-xs text-muted-foreground">{result.duration}ms</span>}
                        {getStatusBadge(result.status)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="migration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Migration</CardTitle>
              <CardDescription>Migrate data from Supabase to Firebase for backup</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  This will copy all data from Supabase to Firebase. Existing Firebase data will be preserved.
                </AlertDescription>
              </Alert>

              <Button onClick={runMigration} disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Database className="mr-2 h-4 w-4" />}
                Start Migration
              </Button>

              <Button onClick={runCompleteMigrationProcess} disabled={isLoading} className="w-full" variant="default">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Database className="mr-2 h-4 w-4" />}
                Run COMPLETE Migration (All Data)
              </Button>

              {migrationResults && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Migration Results:</h3>
                  {Object.entries(migrationResults).map(([key, result]) => (
                    <div key={key} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium capitalize">{key}</h4>
                        {getStatusBadge(result.success ? "success" : "error")}
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Migrated:</span>
                          <span className="ml-2 font-medium text-green-600">{result.migrated}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Skipped:</span>
                          <span className="ml-2 font-medium text-yellow-600">{result.skipped}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Errors:</span>
                          <span className="ml-2 font-medium text-red-600">{result.errors.length}</span>
                        </div>
                      </div>
                      {result.errors.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm font-medium text-red-600">Errors:</p>
                          <ul className="text-xs text-red-500 list-disc list-inside">
                            {result.errors.map((error, index) => (
                              <li key={index}>{error}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {completeMigrationResults && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Complete Migration Results:</h3>
                  <div className="p-4 border rounded-lg">
                    <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                      <div>
                        <span className="text-muted-foreground">Total Migrated:</span>
                        <span className="ml-2 font-medium text-green-600">
                          {completeMigrationResults.totalMigrated}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Total Errors:</span>
                        <span className="ml-2 font-medium text-red-600">{completeMigrationResults.totalErrors}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Status:</span>
                        <span
                          className={`ml-2 font-medium ${completeMigrationResults.success ? "text-green-600" : "text-red-600"}`}
                        >
                          {completeMigrationResults.success ? "Success" : "Failed"}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {Object.entries(completeMigrationResults.details).map(([key, result]) => (
                        <div key={key} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="font-medium capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-green-600">✓ {result.migrated}</span>
                            <span className="text-yellow-600">⏭ {result.skipped}</span>
                            <span className="text-red-600">✗ {result.errors.length}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="validation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Validation</CardTitle>
              <CardDescription>Validate that data is synchronized between databases</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={runValidation} disabled={isLoading} className="w-full">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle className="mr-2 h-4 w-4" />
                )}
                Validate Data Sync
              </Button>

              {validationResult && (
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Validation Result</h4>
                    {getStatusBadge(validationResult.valid ? "success" : "error")}
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Supabase Topics:</span>
                      <span className="ml-2 font-medium">{validationResult.supabaseCount}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Firebase Topics:</span>
                      <span className="ml-2 font-medium">{validationResult.firebaseCount}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Status:</span>
                      <span
                        className={`ml-2 font-medium ${validationResult.valid ? "text-green-600" : "text-red-600"}`}
                      >
                        {validationResult.valid ? "Synchronized" : "Mismatch Detected"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
