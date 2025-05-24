"use server";

import { getTopics, type Topic } from "@/lib/supabase";

/**
 * Get topic recommendations based on the current topic
 * This function uses a simple algorithm to recommend topics based on the level and category
 */
export async function getTopicRecommendations(
  currentSlug: string,
  title: string,
  contentSummary: string,
  level: "junior" | "middle" | "senior"
): Promise<Topic[]> {
  try {
    // Get all topics
    const allTopics = await getTopics();

    // Filter out the current topic
    const otherTopics = allTopics.filter(
      (topic: Topic) => topic.slug !== currentSlug
    );

    // First, try to find topics of the same level
    const sameLevelTopics = otherTopics.filter(
      (topic: Topic) => topic.level === level
    );

    // If we have enough topics of the same level, return a subset
    if (sameLevelTopics.length >= 3) {
      // Shuffle the array to get random topics each time
      return shuffleArray(sameLevelTopics).slice(0, 3) as Topic[];
    }

    // If we don't have enough topics of the same level, include topics from adjacent levels
    let recommendedTopics = [...sameLevelTopics];

    // Add topics from adjacent levels if needed
    if (level === "junior") {
      // For junior, add middle topics
      const middleTopics = otherTopics.filter(
        (topic: Topic) => topic.level === "middle"
      );
      recommendedTopics = [...recommendedTopics, ...middleTopics];
    } else if (level === "senior") {
      // For senior, add middle topics
      const middleTopics = otherTopics.filter(
        (topic: Topic) => topic.level === "middle"
      );
      recommendedTopics = [...recommendedTopics, ...middleTopics];
    } else {
      // For middle, add both junior and senior topics
      const juniorTopics = otherTopics.filter(
        (topic: Topic) => topic.level === "junior"
      );
      const seniorTopics = otherTopics.filter(
        (topic: Topic) => topic.level === "senior"
      );
      recommendedTopics = [
        ...recommendedTopics,
        ...juniorTopics,
        ...seniorTopics,
      ];
    }

    // Shuffle and return up to 3 topics
    return shuffleArray(recommendedTopics).slice(0, 3) as Topic[];
  } catch (error) {
    console.error("Error getting topic recommendations:", error);
    return [];
  }
}

// Helper function to shuffle an array
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}
