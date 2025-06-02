"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github, User } from "lucide-react";
import { getProjectShowcases } from "@/lib/project-showcase-service";
import { Skeleton } from "@/components/ui/skeleton";

interface ProjectShowcase {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  projectId: string;
  projectSlug: string;
  projectName: string;
  githubUrl: string;
  demoUrl?: string;
  description?: string;
  isPublic: boolean;
  createdAt: string;
}

interface ProjectShowcasesProps {
  projectSlug: string;
  projectName: string;
}

export function ProjectShowcases({
  projectSlug,
  projectName,
}: ProjectShowcasesProps) {
  const [showcases, setShowcases] = useState<ProjectShowcase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShowcases = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await getProjectShowcases(projectSlug);

        if (result.error) {
          throw new Error(result.error.message);
        }

        setShowcases(result.data || []);
      } catch (err) {
        console.error("Error fetching project showcases:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load showcases"
        );
      } finally {
        setLoading(false);
      }
    };

    if (projectSlug) {
      fetchShowcases();
    }

    // Listen for custom event to refresh
    const handler = () => fetchShowcases();
    window.addEventListener("userProjectAdded", handler);
    return () => window.removeEventListener("userProjectAdded", handler);
  }, [projectSlug]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">
          Failed to load community implementations
        </p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  if (showcases.length === 0) {
    return (
      <div className="text-center py-8">
        <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
        <h3 className="text-lg font-medium mb-2">No implementations yet</h3>
        <p className="text-muted-foreground">
          Be the first to share your implementation of this project!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">
          Community Implementations ({showcases.length})
        </h3>
      </div>

      <div className="space-y-4">
        {showcases.map((showcase) => (
          <Card key={showcase.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage
                      src={showcase.userAvatar || "/placeholder.svg"}
                      alt={showcase.userName}
                    />
                    <AvatarFallback>
                      {showcase.userName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">
                      {showcase.userName}
                    </CardTitle>
                    <CardDescription>
                      {new Date(showcase.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="secondary">Public</Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              {showcase.description && (
                <p className="text-sm text-muted-foreground">
                  {showcase.description}
                </p>
              )}

              <div className="flex gap-2">
                <Button size="sm" asChild>
                  <a
                    href={showcase.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="h-4 w-4 mr-2" />
                    View Code
                  </a>
                </Button>

                {showcase.demoUrl && (
                  <Button size="sm" variant="outline" asChild>
                    <a
                      href={showcase.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Live Demo
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
