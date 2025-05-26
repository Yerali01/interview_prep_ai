"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getTopicBySlug } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import "highlight.js/styles/github-dark.css";
import { useTopics } from "@/contexts/topics-context";
import { useDefinitions } from "@/contexts/definitions-context";
import { EnhancedMarkdown } from "@/components/enhanced-markdown";
import { CodeSyntaxLegend } from "@/components/code-syntax-legend";

interface TopicSection {
  title: string;
  content: string;
  code?: string;
}

export default function TopicPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { topics } = useTopics();
  const { definitions } = useDefinitions();
  const [topic, setTopic] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchTopic = async () => {
      try {
        if (!slug) {
          setError("Topic not found");
          setLoading(false);
          return;
        }

        // First try to find the topic in the cached topics
        const cachedTopic = topics.find((t) => t.slug === slug);

        if (cachedTopic && cachedTopic.content) {
          console.log("Using cached topic:", cachedTopic);
          setTopic(cachedTopic);
          setLoading(false);
          return;
        }

        // If not found in cache or content is missing, fetch from API
        console.log("Fetching topic with slug:", slug);
        const topicData = await getTopicBySlug(slug);
        console.log("Topic data received:", topicData);

        if (!topicData) {
          setError("Topic not found");
        } else {
          setTopic(topicData);

          // Debug the content field
          if (!topicData.content) {
            console.warn("Topic content is empty or undefined:", topicData);
          }
        }
      } catch (error) {
        console.error("Error fetching topic:", error);
        setError("Failed to load topic");
      } finally {
        setLoading(false);
      }
    };

    fetchTopic();
  }, [slug, topics]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const topicData = await getTopicBySlug(slug);
      if (topicData) {
        setTopic(topicData);
        setError(null);
      } else {
        setError("Topic not found");
      }
    } catch (error) {
      console.error("Error refreshing topic:", error);
      setError("Failed to refresh topic");
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return <TopicSkeleton />;
  }

  if (error || !topic) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="mb-6">
          <Button variant="outline" asChild>
            <Link href="/topics">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Topics
            </Link>
          </Button>
        </div>
        <div className="text-center py-16">
          <h1 className="text-3xl font-bold mb-4">Topic Not Found</h1>
          <p className="text-xl text-muted-foreground mb-8">
            {error ||
              "The topic you're looking for doesn't exist or has been moved."}
          </p>
          <Button asChild>
            <Link href="/topics">Browse All Topics</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Parse content if it's a string
  let contentSections: TopicSection[] = [];
  try {
    if (typeof topic.content === "string") {
      contentSections = JSON.parse(topic.content);
    } else if (Array.isArray(topic.content)) {
      contentSections = topic.content;
    }
  } catch (e) {
    console.error("Error parsing content:", e);
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6 flex justify-between items-center">
        <Button variant="outline" asChild>
          <Link href="/topics">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Topics
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          <CodeSyntaxLegend />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{topic.title}</h1>
          <div className="flex items-center text-muted-foreground">
            <span className="capitalize mr-4">{topic.level} Level</span>
            <span>{topic.estimated_time} min read</span>
          </div>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          {contentSections && contentSections.length > 0 ? (
            contentSections.map((section, index) => (
              <div key={index} className="mb-12">
                {section.title && (
                  <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
                )}

                {section.content && (
                  <EnhancedMarkdown
                    content={section.content}
                    definitions={definitions}
                  />
                )}

                {section.code && (
                  <div className="mt-4 mb-6">
                    <div className="bg-gray-900 rounded-md overflow-hidden">
                      <pre className="language-dart p-4 overflow-x-auto">
                        <code>{section.code}</code>
                      </pre>
                    </div>
                    <Button variant="secondary" size="sm" className="mt-2">
                      Try it Yourself
                    </Button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 p-4 rounded-md">
              <p className="text-yellow-800 dark:text-yellow-200">
                This topic doesn't have any content yet. Check back later!
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function TopicSkeleton() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6">
        <Button variant="outline" disabled>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Topics
        </Button>
      </div>

      <div className="mb-8">
        <Skeleton className="h-12 w-3/4 mb-2" />
        <Skeleton className="h-6 w-1/4" />
      </div>

      <div className="space-y-4">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-2/3" />
      </div>
    </div>
  );
}
