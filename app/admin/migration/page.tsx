"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Database, CheckCircle, AlertCircle, RefreshCw } from "lucide-react"
import { runMigrationFromAdmin } from "@/lib/complete-data-migration"
import { useToast } from "@/hooks/use-toast"

export default function MigrationPage() {
  const [migrating, setMigrating] = useState(false)
  const [migrationResult, setMigrationResult] = useState<any>(null)
  const { toast } = useToast()

  const handleRunMigration = async () => {
    setMigrating(true)
    setMigrationResult(null)

    try {
      console.log("🚀 Starting migration from admin panel...")
      const result = await runMigrationFromAdmin()

      setMigrationResult(result)

      if (result.success) {
        toast({
          title: "Migration Successful!",
          description: result.message,
        })
      } else {
        toast({
          title: "Migration Failed",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error("❌ Migration error:", error)
      toast({
        title: "Migration Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setMigrating(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Database Migration</h1>
          <p className="text-muted-foreground">
            Migrate all data from Supabase to Firebase including projects, technologies, features, topics, definitions,
            and quizzes.
          </p>
        </div>

        <div className="grid gap-6">
          {/* Migration Control */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Complete Data Migration
              </CardTitle>
              <CardDescription>
                This will migrate all data from Supabase to Firebase. Existing Firebase data will be cleared first.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleRunMigration} disabled={migrating} className="w-full" size="lg">
                {migrating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Migrating Data...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Start Complete Migration
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Migration Results */}
          {migrationResult && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {migrationResult.success ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  )}
                  Migration Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Status</span>
                    <Badge variant={migrationResult.success ? "default" : "destructive"}>
                      {migrationResult.success ? "Success" : "Failed"}
                    </Badge>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Message:</p>
                    <p className="text-sm">{migrationResult.message}</p>
                  </div>

                  {migrationResult.details && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Detailed Results:</p>
                      <div className="space-y-2">
                        {Object.entries(migrationResult.details.details).map(([type, detail]: [string, any]) => (
                          <div key={type} className="flex items-center justify-between text-sm">
                            <span className="capitalize">{type}</span>
                            <div className="flex gap-2">
                              <Badge variant="outline">{detail.migrated} migrated</Badge>
                              <Badge variant="secondary">{detail.skipped} skipped</Badge>
                              {detail.errors.length > 0 && (
                                <Badge variant="destructive">{detail.errors.length} errors</Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Migration Status */}
          <Card>
            <CardHeader>
              <CardTitle>Migration Status</CardTitle>
              <CardDescription>Current status of the data migration process</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Topics</span>
                  <Badge variant="outline">Ready</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Definitions</span>
                  <Badge variant="outline">Ready</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Projects</span>
                  <Badge variant="outline">Ready</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Project Technologies</span>
                  <Badge variant="outline">Ready</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Project Features</span>
                  <Badge variant="outline">Ready</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Quizzes</span>
                  <Badge variant="outline">Ready</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Quiz Questions</span>
                  <Badge variant="outline">Ready</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
