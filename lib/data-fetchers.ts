import { getTopics, getTopicBySlug } from "./supabase"
import topicCache from "./topic-cache"

export async function fetchTopicWithCache(slug: string) {
  const cacheKey = `topic:${slug}`
  const cachedTopic = topicCache.get(cacheKey)

  if (cachedTopic) {
    return cachedTopic
  }

  const topic = await getTopicBySlug(slug)

  if (topic) {
    topicCache.set(cacheKey, topic)
  }

  return topic
}

export async function fetchTopicsWithCache() {
  const cacheKey = "all-topics"
  const cachedTopics = topicCache.get(cacheKey)

  if (cachedTopics) {
    return cachedTopics
  }

  const topics = await getTopics()

  if (topics) {
    topicCache.set(cacheKey, topics)
  }

  return topics
}
