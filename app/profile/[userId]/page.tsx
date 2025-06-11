"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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
  const [activity, setActivity] = useState<Record<string, number>>({});
  useEffect(() => {
    async function fetchActivity() {
      const today = new Date();
      const lastYear = new Date(today);
      lastYear.setFullYear(today.getFullYear() - 1);
      const fromDate = lastYear.toISOString().slice(0, 10);
      const toDate = today.toISOString().slice(0, 10);
      const q = query(
        collection(db, "user_activity"),
        where("userId", "==", userId),
        where("date", ">=", fromDate),
        where("date", "<=", toDate)
      );
      const snapshot = await getDocs(q);
      const data: Record<string, number> = {};
      snapshot.forEach((doc) => {
        const d = doc.data();
        data[d.date] = d.count;
      });
      setActivity(data);
    }
    fetchActivity();
  }, [userId]);

  // Build days grid for the last year
  const days: { date: string; count: number }[] = [];
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - (364 - i));
    const dateStr = d.toISOString().slice(0, 10);
    days.push({ date: dateStr, count: activity[dateStr] || 0 });
  }
  // 7 columns (weeks), 53 rows (days)
  const weeks: { date: string; count: number }[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }
  // Color scale
  const getColor = (count: number) => {
    if (count === 0) return "bg-gray-200 dark:bg-gray-800";
    if (count === 1) return "bg-green-200 dark:bg-green-700";
    if (count < 4) return "bg-green-400 dark:bg-green-600";
    if (count < 8) return "bg-green-600 dark:bg-green-500";
    return "bg-green-800 dark:bg-green-400";
  };
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-muted-foreground">
          Activity in the last year
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
  );
}

export default function UserProfilePage() {
  const { userId } = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isCurrentUser = user?.id === userId;

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId || typeof userId !== "string") {
        setError("Invalid user ID");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const result = await firebaseGetPublicUserProfile(userId);

        if (result.error) {
          throw new Error(result.error);
        }

        setProfile(result.data);
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load user profile"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4">
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

  return (
    <div
      className={`container mx-auto px-4 py-12${
        profile.isPaid
          ? " bg-gradient-to-br from-yellow-200 via-pink-200 to-purple-200"
          : ""
      }`}
    >
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
                        {profile.repositories.map((repo, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 border rounded-md"
                          >
                            <div className="flex items-center gap-2 overflow-hidden">
                              <Github className="h-4 w-4 flex-shrink-0" />
                              <a
                                href={repo}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm truncate hover:underline"
                              >
                                {typeof repo === "string"
                                  ? repo.replace("https://github.com/", "")
                                  : "Unknown Repository"}
                              </a>
                            </div>
                          </div>
                        ))}
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
