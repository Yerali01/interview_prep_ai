"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Loader2,
  Trophy,
  Github,
  Calendar,
  User,
} from "lucide-react";
import { firebaseGetPublicUserProfile } from "@/lib/firebase-service-fixed";
import { RepositoryShowcase } from "@/components/repository-showcase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface PublicProfile {
  id: string;
  display_name: string | null;
  github_username: string | null;
  github_avatar: string | null;
  repositories: any[];
  quiz_count: number;
  created_at: string;
}

export default function PublicProfilePage() {
  const params = useParams();
  const userId = params.userId as string;
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    try {
      const profileData = await firebaseGetPublicUserProfile(userId);
      if (!profileData) {
        setError("Profile not found");
      } else {
        setProfile(profileData);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
    }).format(date);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <Button variant="ghost" className="mb-6" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Link>
        </Button>

        <Card>
          <CardContent className="text-center py-12">
            <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Profile Not Found</h2>
            <p className="text-muted-foreground">
              The profile you're looking for doesn't exist or is not public.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <Button variant="ghost" className="mb-6" asChild>
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
        </Link>
      </Button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Profile Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-6">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={profile.github_avatar || "/placeholder.svg"}
                  alt={profile.display_name || "User"}
                />
                <AvatarFallback className="text-lg">
                  {(profile.display_name || profile.github_username || "U")
                    .charAt(0)
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <h1 className="text-2xl font-bold mb-2">
                  {profile.display_name ||
                    profile.github_username ||
                    "Anonymous User"}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                  {profile.github_username && (
                    <div className="flex items-center gap-1">
                      <Github className="h-4 w-4" />
                      <a
                        href={`https://github.com/${profile.github_username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-foreground"
                      >
                        @{profile.github_username}
                      </a>
                    </div>
                  )}

                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Joined {formatDate(profile.created_at)}
                  </div>
                </div>

                <div className="flex gap-4">
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <Trophy className="h-3 w-3" />
                    {profile.quiz_count} Quiz
                    {profile.quiz_count !== 1 ? "zes" : ""} Completed
                  </Badge>

                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <Github className="h-3 w-3" />
                    {profile.repositories.length} Repository
                    {profile.repositories.length !== 1 ? "ies" : ""} Showcased
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Repository Showcase */}
        <RepositoryShowcase
          userId={profile.id}
          isOwnProfile={false}
          githubUsername={profile.github_username || undefined}
        />

        {/* Additional Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Overview</CardTitle>
            <CardDescription>Public activity and achievements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {profile.quiz_count}
                </div>
                <div className="text-sm text-muted-foreground">
                  Quizzes Completed
                </div>
              </div>

              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {profile.repositories.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Projects Showcased
                </div>
              </div>

              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {profile.repositories.reduce(
                    (total, repo) => total + repo.stargazers_count,
                    0
                  )}
                </div>
                <div className="text-sm text-muted-foreground">Total Stars</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
