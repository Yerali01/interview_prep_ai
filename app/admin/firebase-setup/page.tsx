"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { setupFirebaseData, verifyFirebaseData, clearFirebaseData } from "@/lib/firebase-data-setup"
import { CheckCircle, XCircle, AlertCircle, Database, Trash2, RefreshCw } from "lucide-react"

export default function FirebaseSetupPage() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [verification, setVerification] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSetupData = async () => {
    setLoading(true)
    setError(null)
    setResults(null)

    try {
      console.log("🚀 Starting Firebase data setup...")
      const result = await setupFirebaseData()
      setResults(result)

      if (result.success) {
        // Verify the data was set up correctly
        const verifyResult = await verifyFirebaseData()
        setVerification(verifyResult)
      }
    } catch (err: any) {
      setError(err.message)
      console.error("❌ Setup failed:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyData = async () => {
    setLoading(true)
    setError(null)

    try {
      console.log("🔍 Verifying Firebase data...")
      const result = await verifyFirebaseData()
      setVerification(result)
    } catch (err: any) {
      setError(err.message)
      console.error("❌ Verification failed:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleClearData = async () => {
    if (!confirm("Are you sure you want to clear ALL Firebase data? This cannot be undone!")) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      console.log("🗑️ Clearing Firebase data...")
      await clearFirebaseData()
      setVerification(null)
      setResults({ success: true, message: "All data cleared successfully!" })
    } catch (err: any) {
      setError(err.message)
      console.error("❌ Clear failed:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">🔥 Firebase Data Setup</h1>
          <p className="text-muted-foreground">
            Set up and manage your Firebase database with sample data for topics, quizzes, and projects.
          </p>
        </div>

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Error:</strong> {error}
            </AlertDescription>
          </Alert>
        )}

        {results && (
          <Alert className={`mb-6 ${results.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
            {results.success ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <XCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={results.success ? "text-green-800" : "text-red-800"}>
              <strong>{results.success ? "Success:" : "Error:"}</strong> {results.message || results.error}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6">
          {/* Setup Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Database Setup Actions
              </CardTitle>
              <CardDescription>Set up your Firebase database with sample data or verify existing data.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-4">
                <Button onClick={handleSetupData} disabled={loading} className="flex items-center gap-2">
                  {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Database className="h-4 w-4" />}
                  Setup Sample Data
                </Button>

                <Button
                  variant="outline"
                  onClick={handleVerifyData}
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                  Verify Data
                </Button>

                <Button
                  variant="destructive"
                  onClick={handleClearData}
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  Clear All Data
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Data Verification */}
          {verification && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Data Verification Results
                </CardTitle>
                <CardDescription>Current data counts in your Firebase database.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{verification.topics}</div>
                    <div className="text-sm text-muted-foreground">Topics</div>
                    <Badge variant={verification.topics > 0 ? "default" : "destructive"} className="mt-2">
                      {verification.topics > 0 ? "✓ Ready" : "✗ Empty"}
                    </Badge>
                  </div>

                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{verification.quizzes}</div>
                    <div className="text-sm text-muted-foreground">Quizzes</div>
                    <Badge variant={verification.quizzes > 0 ? "default" : "destructive"} className="mt-2">
                      {verification.quizzes > 0 ? "✓ Ready" : "✗ Empty"}
                    </Badge>
                  </div>

                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{verification.questions}</div>
                    <div className="text-sm text-muted-foreground">Questions</div>
                    <Badge variant={verification.questions > 0 ? "default" : "destructive"} className="mt-2">
                      {verification.questions > 0 ? "✓ Ready" : "✗ Empty"}
                    </Badge>
                  </div>

                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{verification.projects}</div>
                    <div className="text-sm text-muted-foreground">Projects</div>
                    <Badge variant={verification.projects > 0 ? "default" : "destructive"} className="mt-2">
                      {verification.projects > 0 ? "✓ Ready" : "✗ Empty"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-blue-600" />
                Setup Instructions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">1. First Time Setup:</h4>
                <p className="text-sm text-muted-foreground">
                  Click "Setup Sample Data" to populate your Firebase database with sample topics, quizzes, and
                  projects.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">2. Verify Data:</h4>
                <p className="text-sm text-muted-foreground">
                  Click "Verify Data" to check how many records exist in each collection.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">3. Clear Data (Dangerous):</h4>
                <p className="text-sm text-muted-foreground">
                  Click "Clear All Data" to remove all data from Firebase. Use with caution!
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">4. After Setup:</h4>
                <p className="text-sm text-muted-foreground">
                  Once data is set up, your Topics, Quiz, and Projects pages should work perfectly!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
