import { Database } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AdminPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Example Card - Replace with your actual cards */}
        <Card>
          <CardHeader>
            <CardTitle>Card Title 1</CardTitle>
            <CardDescription>Card Description 1</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Card Content 1</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Card Title 2</CardTitle>
            <CardDescription>Card Description 2</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Card Content 2</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Card Title 3</CardTitle>
            <CardDescription>Card Description 3</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Card Content 3</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Card Title 4</CardTitle>
            <CardDescription>Card Description 4</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Card Content 4</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Card Title 5</CardTitle>
            <CardDescription>Card Description 5</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Card Content 5</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Card Title 6</CardTitle>
            <CardDescription>Card Description 6</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Card Content 6</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database Testing
            </CardTitle>
            <CardDescription>
              Test dual database functionality and migrate data between Supabase and Firebase
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Primary DB:</span>
                  <span className="ml-2 font-medium">
                    {process.env.NEXT_PUBLIC_USE_FIREBASE_PRIMARY === "true" ? "Firebase" : "Supabase"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Dual Write:</span>
                  <span className="ml-2 font-medium">
                    {process.env.NEXT_PUBLIC_ENABLE_DUAL_WRITE !== "false" ? "Enabled" : "Disabled"}
                  </span>
                </div>
              </div>
              <Link href="/admin/database-test">
                <Button className="w-full">
                  <Database className="mr-2 h-4 w-4" />
                  Open Database Testing
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
