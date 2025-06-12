// TEST COMMENT - PLEASE IGNORE
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, BookOpen, Code, Github, User } from "lucide-react";
import Link from "next/link";
import { UserProjectsShowcase } from "@/components/user-projects-showcase";
import { useAuth } from "@/components/auth/auth-provider";
import { firebaseGetPublicUserProfile } from "@/lib/firebase-service-fixed";
import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "@/hooks/use-toast";
import { logUserActivity } from "@/lib/firebase-service";

interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  photoURL: string | null;
  githubUsername: string | null;
  bio: string | null;
  repositories: string[];
  quizCount: number;
  joinedAt: string | null;
  isPaid: boolean;
}

function ActivityBar({ userId }: { userId: string }) {
  console.log(`✅ ActivityBar: STARTED`);
  const [activity, setActivity] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Enhanced debugging
  console.log("🚀 ActivityBar: Component is rendering!", { 
    userId, 
    userIdType: typeof userId,
    timestamp: new Date().toISOString()
  });

  useEffect(() => {
    async function fetchActivity() {
      console.log("🔍 ActivityBar: useEffect started");
      console.log("🔍 ActivityBar: userId:", userId, "Type:", typeof userId);
      
      if (!userId) {
        console.error("❌ ActivityBar: No userId provided");
        setError("No user ID provided");
        setIsLoading(false);
        return;
      }

      const today = new Date();
      const lastYear = new Date(today);
      lastYear.setFullYear(today.getFullYear() - 1);
      const fromDate = lastYear.toISOString().slice(0, 10);
      const toDate = today.toISOString().slice(0, 10);
      
      console.log("🔍 ActivityBar: Date range:", fromDate, "to", toDate);
      console.log("🔍 ActivityBar: Database reference:", db ? "✅ DB exists" : "❌ DB is null");

      try {
        setIsLoading(true);
        console.log("🔍 ActivityBar: Creating query...");
        
        const q = query(
          collection(db, "user_activity"),
          where("userId", "==", userId),
          where("date", ">=", fromDate),
          where("date", "<=", toDate)
        );
        
        console.log("🔍 ActivityBar: Executing query...");
        const snapshot = await getDocs(q);
        console.log("🔍 ActivityBar: Query executed, docs found:", snapshot.size);
        
        const data: Record<string, number> = {};
        snapshot.forEach((doc) => {
          const d = doc.data();
          data[d.date] = d.count;
          console.log(`✅ ActivityBar: Fetched activity for ${d.date}: ${d.count}`);
        });
        
        setActivity(data);
        console.log("✅ ActivityBar: Activity data set:", data);
        setError(null);
      } catch (error) {
        console.error("❌ ActivityBar: Error fetching activity:", error);
        setError(error instanceof Error ? error.message : "Unknown error");
      } finally {
        setIsLoading(false);
        console.log("🔍 ActivityBar: Fetch completed");
      }
    }
    
    fetchActivity();
  }, [userId]);

  console.log("🔄 ActivityBar: Current state:", { 
    activity, 
    isLoading, 
    error, 
    userId,
    activityKeys: Object.keys(activity),
    activityCount: Object.keys(activity).length 
  });

  // Show loading state with debug info
  if (isLoading) {
    return (
      <div style={{ 
        border: "3px solid orange", 
        padding: "20px", 
        margin: "20px 0",
        backgroundColor: "rgba(255, 165, 0, 0.1)",
        borderRadius: "8px"
      }}>
        <h3 style={{ color: "orange", margin: "0 0 10px 0" }}>
          🔄 ActivityBar Loading...
        </h3>
        <p>UserID: {userId}</p>
        <p>Loading activity data from Firestore...</p>
      </div>
    );
  }

  // Show error state with debug info
  if (error) {
    return (
      <div style={{ 
        border: "3px solid red", 
        padding: "20px", 
        margin: "20px 0",
        backgroundColor: "rgba(255, 0, 0, 0.1)",
        borderRadius: "8px"
      }}>
        <h3 style={{ color: "red", margin: "0 0 10px 0" }}>
          ❌ ActivityBar Error
        </h3>
        <p><strong>UserID:</strong> {userId}</p>
        <p><strong>Error:</strong> {error}</p>
        <p><strong>Database:</strong> {db ? "Connected" : "Not connected"}</p>
      </div>
    );
  }

  // Build days grid for the last year
  const days: { date: string; count: number }[] = [];
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - (364 - i));
    const dateStr = d.toISOString().slice(0, 10);
    days.push({ date: dateStr, count: activity[dateStr] || 0 });
  }

  const weeks: { date: string; count: number }[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const getColor = (count: number) => {
    if (count === 0) return "bg-gray-200 dark:bg-gray-800";
    if (count === 1) return "bg-green-200 dark:bg-green-700";
    if (count < 4) return "bg-green-400 dark:bg-green-600";
    if (count < 8) return "bg-green-600 dark:bg-green-500";
    return "bg-green-800 dark:bg-green-400";
  };

  const totalActiveDays = Object.keys(activity).length;
  const totalActivity = Object.values(activity).reduce((sum, count) => sum + count, 0);

  return (
    <div style={{ 
      border: "3px solid green", 
      padding: "20px", 
      margin: "20px 0",
      backgroundColor: "rgba(0, 255, 0, 0.1)",
      borderRadius: "8px"
    }}>
      <div style={{ marginBottom: "10px", padding: "10px", backgroundColor: "white", borderRadius: "4px" }}>
        <h3 style={{ color: "green", margin: "0 0 5px 0" }}>
          ✅ ActivityBar Loaded Successfully
        </h3>
        <p><strong>UserID:</strong> {userId}</p>
        <p><strong>Active Days:</strong> {totalActiveDays}</p>
        <p><strong>Total Activity:</strong> {totalActivity}</p>
        <p><strong>Data Keys:</strong> {Object.keys(activity).slice(0, 5).join(", ")}
          {Object.keys(activity).length > 5 ? "..." : ""}
        </p>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">
            Activity in the last year ({totalActiveDays} active days)
          </span>
          <div className="flex items-center gap-2 text-xs">
            <span>Less</span>
            <div className="flex gap-1">
              <div className="w-4 h-4 rounded-sm bg-gray-200 dark:bg-gray-800" />
              <div className="w-4 h-4 rounded-sm bg-green-200 dark:bg-green-700" />
              <div className="w-4 h-4 rounded-sm bg-green-400 dark:bg-green-600" />
              <div className="w-4 h-4 rounded-sm bg-green-600 dark:bg-green-500" />
              <div className="w-4 h-4 rounded-sm bg-green-800 dark:bg-green-400" />
            </div>
            <span>More</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <div className="flex">
            {weeks.map((week, i) => (
              <div key={i} className="flex flex-col gap-1 mr-1">
                {week.map((day, j) => (
                  <div
                    key={j}
                    title={`${day.date}: ${day.count} activity`}
                    className={`w-4 h-4 rounded-sm ${getColor(day.count)}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UserProfilePage() {
  const { userId } = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isCurrentUser = user?.id === userId;

  // Debug log at the very start
  console.log("🚀 PROFILE PAGE LOADED", { 
    userId,
    userIdType: typeof userId,
    profile: profile?.id, 
    db: !!db,
    timestamp: new Date().toISOString()
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      console.log("🔍 UserProfilePage: fetchUserProfile started", { userId });
      
      if (!userId || typeof userId !== "string") {
        console.error("❌ UserProfilePage: Invalid user ID", { userId, type: typeof userId });
        setError("Invalid user ID");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("🔍 UserProfilePage: Calling firebaseGetPublicUserProfile...");
        const result = await firebaseGetPublicUserProfile(userId);

        if (result.error) {
          throw new Error(result.error);
        }

        console.log("✅ UserProfilePage: Profile fetched successfully", result.data);
        setProfile(result.data);

        // Log activity when viewing a profile
        if (user?.id) {
          console.log("🔍 UserProfilePage: Logging user activity...");
          await logUserActivity(user.id);
        }
      } catch (err) {
        console.error("❌ UserProfilePage: Error fetching user profile:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load user profile"
        );
      } finally {
        setLoading(false);
        console.log("🔍 UserProfilePage: Fetch completed");
      }
    };

    fetchUserProfile();
  }, [userId, user?.id]);

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <div style={{ border: "2px solid blue", padding: "20px", margin: "20px 0" }}>
          <h3 style={{ color: "blue" }}>🔄 Profile Page Loading...</h3>
          <p>UserID: {userId}</p>
        </div>
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <div style={{ border: "2px solid red", padding: "20px", margin: "20px 0" }}>
          <h3 style={{ color: "red" }}>❌ Profile Page Error</h3>
          <p>UserID: {userId}</p>
          <p>Error: {error}</p>
        </div>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">User Not Found</h2>
          <p className="text-muted-foreground mb-6">
            {error || "Could not load user profile"}
          </p>
          <Button asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  console.log("✅ UserProfilePage: Rendering profile", { 
    profileId: profile.id, 
    displayName: profile.displayName,
    isPaid: profile.isPaid 
  });

  return (
    <div
      className={`container mx-auto px-4 py-12${
        profile.isPaid
          ? " bg-gradient-to-br from-yellow-200 via-pink-200 to-purple-200"
          : ""
      }`}
    >
      <div style={{ border: "2px solid purple", padding: "10px", margin: "10px 0" }}>
        <h3 style={{ color: "purple" }}>🎉 Profile Page Rendered Successfully!</h3>
        <p>Profile ID: {profile.id}</p>
        <p>Display Name: {profile.displayName}</p>
      </div>

      <div
        className={`max-w-4xl mx-auto${
          profile.isPaid
            ? " border-4 border-yellow-400 rounded-xl shadow-xl"
            : ""
        }`}
      >
        <Card className={profile.isPaid ? "bg-white/90" : ""}>
          <CardHeader className="flex flex-row items-center gap-4">
            <CardTitle className="text-3xl font-bold flex items-center gap-2">
              {profile.displayName || profile.email || "User"}
              {profile.isPaid && (
                <span className="ml-2 px-3 py-1 rounded-full bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 text-white text-xs font-bold shadow">
                  PRO
                </span>
              )}
            </CardTitle>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={profile.photoURL || undefined}
                  alt={profile.displayName}
                />
                <AvatarFallback>
                  <User className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              <div>
                {isCurrentUser && (
                  <p className="text-muted-foreground">{profile.email}</p>
                )}
                {profile.githubUsername && (
                  <p className="text-sm text-muted-foreground">
                    <a
                      href={`https://github.com/${profile.githubUsername}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      @{profile.githubUsername}
                    </a>
                  </p>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Enhanced ActivityBar with debugging */}
            <ActivityBar userId={profile.id} />

            <Tabs defaultValue="projects">
              <TabsList className="mb-4">
                <TabsTrigger value="projects">
                  <Code className="h-4 w-4 mr-2" />
                  Projects
                </TabsTrigger>
                {profile.repositories.length > 0 && (
                  <TabsTrigger value="repositories">
                    <Github className="h-4 w-4 mr-2" />
                    Repositories
                  </TabsTrigger>
                )}
                <TabsTrigger value="learning">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Learning Progress
                </TabsTrigger>
              </TabsList>

              {/* Projects Tab */}
              <TabsContent value="projects">
                <Card>
                  <CardHeader>
                    <CardTitle>Projects</CardTitle>
                    <CardDescription>
                      {isCurrentUser
                        ? "Projects you've completed from the Flutter Interview Prep platform."
                        : `Projects ${profile.displayName} has completed from the Flutter Interview Prep platform.`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <UserProjectsShowcase
                      userId={userId as string}
                      isCurrentUser={isCurrentUser}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Repositories Tab */}
              {profile.repositories.length > 0 && (
                <TabsContent value="repositories">
                  <Card>
                    <CardHeader>
                      <CardTitle>GitHub Repositories</CardTitle>
                      <CardDescription>
                        {isCurrentUser
                          ? "Your GitHub repositories."
                          : `${profile.displayName}'s GitHub repositories.`}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {profile.repositories.map(
                          (repo: string, index: number) => {
                            const isValidUrl =
                              typeof repo === "string" &&
                              repo.startsWith("https://");
                            return (
                              <div
                                key={index}
                                className="flex items-center justify-between p-3 border rounded-md"
                              >
                                <div className="flex items-center gap-2 overflow-hidden">
                                  <Github className="h-4 w-4 flex-shrink-0" />
                                  <a
                                    href={isValidUrl ? repo : undefined}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`text-sm truncate ${
                                      isValidUrl
                                        ? "hover:underline"
                                        : "text-muted-foreground cursor-default"
                                    }`}
                                  >
                                    {isValidUrl
                                      ? repo.replace("https://github.com/", "")
                                      : "Invalid Repository URL"}
                                  </a>
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}

              {/* Learning Progress Tab */}
              <TabsContent value="learning">
                <Card>
                  <CardHeader>
                    <CardTitle>Learning Progress</CardTitle>
                    <CardDescription>
                      {isCurrentUser
                        ? "Track your progress through Flutter topics and quizzes."
                        : `${profile.displayName}'s progress through Flutter topics and quizzes.`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-4 border rounded-md">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <BookOpen className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">Quizzes Completed</h3>
                            <p className="text-sm text-muted-foreground">
                              Total quizzes completed on the platform
                            </p>
                          </div>
                        </div>
                        <div className="text-2xl font-bold">
                          {profile.quizCount}
                        </div>
                      </div>

                      {/* More learning stats will be added here */}
                      <p className="text-center py-4 text-muted-foreground">
                        More detailed learning progress tracking coming soon!
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
