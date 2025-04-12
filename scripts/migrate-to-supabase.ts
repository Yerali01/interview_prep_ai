import { topics, quizzes } from "../lib/data"
import { supabase } from "../lib/supabase"

async function migrateTopics() {
  console.log("Migrating topics...")

  for (const topic of topics) {
    const { data, error } = await supabase
      .from("topics")
      .insert([
        {
          slug: topic.id,
          title: topic.title,
          description: topic.description,
          level: topic.level,
          estimated_time: topic.estimatedTime,
          content: topic.content,
          summary: topic.summary || null,
        },
      ])
      .select()

    if (error) {
      console.error(`Error inserting topic ${topic.title}:`, error)
    } else {
      console.log(`Inserted topic: ${topic.title}`)
    }
  }

  console.log("Topics migration completed.")
}

async function migrateQuizzesAndQuestions() {
  console.log("Migrating quizzes and questions...")

  for (const quiz of quizzes) {
    // Insert quiz
    const { data: quizData, error: quizError } = await supabase
      .from("quizzes")
      .insert([
        {
          slug: quiz.id,
          title: quiz.title,
          description: quiz.description,
          level: quiz.level,
        },
      ])
      .select()

    if (quizError) {
      console.error(`Error inserting quiz ${quiz.title}:`, quizError)
      continue
    }

    console.log(`Inserted quiz: ${quiz.title}`)

    // Insert questions for this quiz
    const quizId = quizData[0].id

    for (const question of quiz.questions) {
      const { error: questionError } = await supabase.from("questions").insert([
        {
          quiz_id: quizId,
          question: question.question,
          options: question.options,
          correct_answer: question.correctAnswer,
          explanation: question.explanation,
          category: question.category || null,
        },
      ])

      if (questionError) {
        console.error(`Error inserting question for quiz ${quiz.title}:`, questionError)
      }
    }

    console.log(`Inserted ${quiz.questions.length} questions for quiz: ${quiz.title}`)
  }

  console.log("Quizzes and questions migration completed.")
}

async function migrateData() {
  try {
    await migrateTopics()
    await migrateQuizzesAndQuestions()
    console.log("Data migration completed successfully!")
  } catch (error) {
    console.error("Error during migration:", error)
  }
}

// Run the migration
migrateData()
