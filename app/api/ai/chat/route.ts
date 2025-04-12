import { type NextRequest, NextResponse } from "next/server"

const GROQ_API_KEY = process.env.GROQ_API_KEY
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

export async function POST(request: NextRequest) {
  try {
    // Validate that we have an API key
    if (!GROQ_API_KEY) {
      return NextResponse.json({ error: "GROQ API key is not configured" }, { status: 500 })
    }

    // Parse the request body
    const { messages, temperature = 0.7, maxTokens = 1000 } = await request.json()

    // Validate the request
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid request: messages must be an array" }, { status: 400 })
    }

    // Make the request to GROQ API
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages,
        temperature,
        max_tokens: maxTokens,
      }),
    })

    // Handle API errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("GROQ API Error:", errorData)
      return NextResponse.json(
        { error: `GROQ API Error: ${errorData.error?.message || response.statusText}` },
        { status: response.status },
      )
    }

    // Parse and return the response
    const data = await response.json()

    if (!data || !data.choices || !data.choices[0] || !data.choices[0].message) {
      return NextResponse.json({ error: "Invalid response from GROQ API" }, { status: 500 })
    }

    return NextResponse.json({
      content: data.choices[0].message.content,
    })
  } catch (error) {
    console.error("Error in AI chat API route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
