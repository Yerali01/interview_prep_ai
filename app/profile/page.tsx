"use client";

// Force dynamic rendering to prevent prerendering issues
export const dynamic = "force-dynamic";

import * as React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider"; // Fixed import path
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Github, User, Code, BookOpen, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import {
  getUserRepositories,
  saveUserRepositories,
} from "@/lib/repository-service-v2";
import { UserProjectsShowcase } from "@/components/user-projects-showcase";
import {
  dualGetUserQuizResults,
  dualGetQuizzes,
} from "@/lib/dual-database-service";

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [repositories, setRepositories] = useState<string[]>([]);
  const [newRepo, setNewRepo] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [quizResults, setQuizResults] = useState<any[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [quizLoading, setQuizLoading] = useState(true);

  useEffect(() => {
    // Redirect to sign in if not authenticated
    if (!authLoading && !user) {
      router.push("/auth/sign-in");
      return;
    }

    // Load repositories if user is authenticated
    if (user) {
      loadRepositories();
      loadQuizResults();
    }
  }, [user, authLoading, router]);

  const loadRepositories = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const userRepos = await getUserRepositories(user.id); // Use user.id instead of user.uid
      setRepositories(userRepos || []);
    } catch (error) {
      console.error("Error loading repositories:", error);
      toast({
        title: "Error",
        description: "Failed to load your repositories.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadQuizResults = async () => {
    if (!user) return;
    setQuizLoading(true);
    try {
      const [results, allQuizzes] = await Promise.all([
        dualGetUserQuizResults(user.id),
        dualGetQuizzes(),
      ]);
      setQuizResults(results || []);
      setQuizzes(allQuizzes || []);
    } catch (error) {
      console.error("Error loading quiz results:", error);
      toast({
        title: "Error",
        description: "Failed to load your quiz results.",
        variant: "destructive",
      });
    } finally {
      setQuizLoading(false);
    }
  };

  const handleAddRepository = () => {
    if (!newRepo.trim()) return;

    // Simple validation for GitHub URL format
    if (!isValidGitHubUrl(newRepo)) {
      toast({
        title: "Invalid GitHub URL",
        description: "Please enter a valid GitHub repository URL.",
        variant: "destructive",
      });
      return;
    }

    // Add repository if it doesn't already exist
    if (!repositories.includes(newRepo)) {
      setRepositories([...repositories, newRepo]);
      setNewRepo("");
    } else {
      toast({
        title: "Repository already added",
        description: "This repository is already in your list.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveRepository = (repo: string) => {
    setRepositories(repositories.filter((r: string) => r !== repo));
  };

  const handleSaveRepositories = async () => {
    if (!user) return;

    try {
      setIsSaving(true);
      await saveUserRepositories(user.id, repositories); // Use user.id instead of user.uid
      toast({
        title: "Repositories saved",
        description: "Your repositories have been updated successfully.",
      });
    } catch (error) {
      console.error("Error saving repositories:", error);
      toast({
        title: "Save Error",
        description: `Failed to save repositories: ${
          error instanceof Error ? error.message : "Unknown error"
        }. Check Firebase console and network connection`,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const isValidGitHubUrl = (url: string) => {
    // Simple validation - can be enhanced
    return url.includes("github.com/");
  };

  // Show loading spinner while auth is loading
  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Don't render anything if no user (will redirect)
  if (!user) {
    return null;
  }

  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <Button variant="ghost" className="mb-6" asChild>
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
        </Link>
      </Button>

      <div className="max-w-3xl mx-auto">
        {/* Profile Header */}
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="h-16 w-16">
            <AvatarImage
              src={user.github_avatar || user.avatar_url || "/placeholder.svg"}
              alt={user.display_name || user.email || "User"}
            />
            <AvatarFallback>
              <User className="h-8 w-8" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">
              {user.display_name || user.email || "Anonymous User"}
            </h1>
            <p className="text-muted-foreground">{user.email}</p>
            {user.github_username && (
              <p className="text-sm text-muted-foreground">
                @{user.github_username}
              </p>
            )}
          </div>
        </div>

        {/* Profile Content */}
        <Tabs defaultValue="repositories">
          <TabsList className="mb-4">
            <TabsTrigger value="repositories">
              <Github className="h-4 w-4 mr-2" />
              Repositories
            </TabsTrigger>
            <TabsTrigger value="projects">
              <Code className="h-4 w-4 mr-2" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="learning">
              <BookOpen className="h-4 w-4 mr-2" />
              Learning Progress
            </TabsTrigger>
          </TabsList>

          {/* Repositories Tab */}
          <TabsContent value="repositories">
            <Card>
              <CardHeader>
                <CardTitle>GitHub Repositories</CardTitle>
                <CardDescription>
                  Add links to your GitHub repositories to showcase your work.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Add Repository Form */}
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Label htmlFor="repo-url" className="sr-only">
                        Repository URL
                      </Label>
                      <Input
                        id="repo-url"
                        placeholder="https://github.com/username/repository"
                        value={newRepo}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setNewRepo(e.target.value)
                        }
                        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                          e.key === "Enter" && handleAddRepository()
                        }
                      />
                    </div>
                    <Button onClick={handleAddRepository}>Add</Button>
                  </div>

                  {/* Repository List */}
                  <div className="space-y-2">
                    {isLoading ? (
                      <>
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                      </>
                    ) : repositories.length > 0 ? (
                      repositories.map((repo: string, index: number) => (
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
                              {repo.replace("https://github.com/", "")}
                            </a>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveRepository(repo)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            Remove
                          </Button>
                        </div>
                      ))
                    ) : (
                      <p className="text-center py-4 text-muted-foreground">
                        No repositories added yet. Add your first repository
                        above.
                      </p>
                    )}
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end">
                    <Button
                      onClick={handleSaveRepositories}
                      disabled={isSaving}
                    >
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects">
            <Card>
              <CardHeader>
                <CardTitle>My Projects</CardTitle>
                <CardDescription>
                  Projects you've completed from the Flutter Interview Prep
                  platform.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UserProjectsShowcase userId={user.id} isCurrentUser={true} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Learning Progress Tab */}
          <TabsContent value="learning">
            <Card>
              <CardHeader>
                <CardTitle>Learning Progress</CardTitle>
                <CardDescription>
                  Track your progress through Flutter topics and quizzes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {quizLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : quizResults.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">
                    No quizzes taken yet. Take a quiz to see your progress here!
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm border">
                      <thead>
                        <tr className="bg-muted">
                          <th className="px-4 py-2 text-left">Quiz</th>
                          <th className="px-4 py-2 text-left">Score</th>
                          <th className="px-4 py-2 text-left">Percentage</th>
                          <th className="px-4 py-2 text-left">Completed At</th>
                        </tr>
                      </thead>
                      <tbody>
                        {quizResults.map((result: any, idx: number) => {
                          const quiz = quizzes.find(
                            (q: any) => q.id === result.quizId
                          );
                          return (
                            <tr key={result.id || idx} className="border-t">
                              <td className="px-4 py-2 font-medium">
                                {quiz ? quiz.title : result.quizId}
                              </td>
                              <td className="px-4 py-2">
                                {result.score} / {result.totalQuestions}
                              </td>
                              <td className="px-4 py-2">
                                {result.percentage}%
                              </td>
                              <td className="px-4 py-2">
                                {result.completedAt
                                  ? new Date(
                                      result.completedAt
                                    ).toLocaleString()
                                  : "-"}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
