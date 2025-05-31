"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Copy, ExternalLink, AlertTriangle, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { RECOMMENDED_FIRESTORE_RULES } from "@/lib/firebase-rules-helper"

export function FirebaseSetupHelper() {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const copyRules = async () => {
    try {
      await navigator.clipboard.writeText(RECOMMENDED_FIRESTORE_RULES)
      setCopied(true)
      toast({
        title: "Rules Copied!",
        description: "Firebase security rules have been copied to clipboard.",
      })
      setTimeout(() => setCopied(false), 3000)
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Could not copy to clipboard. Please copy manually.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Firebase Permissions Issue Detected</AlertTitle>
        <AlertDescription>
          The application is experiencing permission errors when accessing Firebase. This is likely due to restrictive
          Firestore security rules.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Fix Firebase Permissions
          </CardTitle>
          <CardDescription>
            Follow these steps to update your Firestore security rules and resolve permission issues.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold">Step 1: Access Firebase Console</h3>
            <p className="text-sm text-muted-foreground">
              Go to the Firebase Console and navigate to your project's Firestore Database rules.
            </p>
            <Button variant="outline" size="sm" asChild>
              <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Firebase Console
              </a>
            </Button>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Step 2: Update Security Rules</h3>
            <p className="text-sm text-muted-foreground">
              Copy the security rules below and paste them in your Firestore Rules tab.
            </p>
            <div className="relative">
              <pre className="bg-muted p-4 rounded-md text-xs overflow-x-auto max-h-64">
                <code>{RECOMMENDED_FIRESTORE_RULES}</code>
              </pre>
              <Button
                variant="outline"
                size="sm"
                className="absolute top-2 right-2"
                onClick={copyRules}
                disabled={copied}
              >
                {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Step 3: Publish Rules</h3>
            <p className="text-sm text-muted-foreground">
              After pasting the rules, click the "Publish" button in the Firebase Console.
            </p>
            <Badge variant="outline" className="text-xs">
              ⚠️ Make sure to publish the rules for changes to take effect
            </Badge>
          </div>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>What These Rules Do</AlertTitle>
            <AlertDescription className="text-sm">
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Allow public read access to topics, quizzes, questions, and projects</li>
                <li>Allow authenticated users to manage their own repositories and quiz results</li>
                <li>Ensure proper security for user-specific data</li>
                <li>Prevent unauthorized access to sensitive user information</li>
              </ul>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}
