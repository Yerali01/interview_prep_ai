import { NextResponse } from "next/server"

// Don't use edge runtime as it might be causing issues
// export const runtime = "edge"

export async function POST(request: Request) {
  try {
    const { messages } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid request format. Expected an array of messages." }, { status: 400 })
    }

    // Use the GROQ API key from environment variables
    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      console.error("GROQ_API_KEY is not defined in environment variables")
      return NextResponse.json({ error: "API configuration error. Please contact support." }, { status: 500 })
    }

    // Make request to Groq API
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-8b-8192", // Using Llama 3 model
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error("Groq API error:", response.status, errorData)
      return NextResponse.json(
        { content: "I'm having trouble connecting to the AI service. Please try again later." },
        { status: 200 },
      )
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content || "No response generated."

    return NextResponse.json({ content })
  } catch (error) {
    console.error("Error in AI chat API:", error)
    return NextResponse.json(
      { content: "I'm having trouble connecting to the AI service. Please try again later." },
      { status: 200 },
    )
  }
}
