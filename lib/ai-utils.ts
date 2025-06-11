// lib/ai-utils.ts
"use client";

import { useState, useEffect } from "react";

export type AIMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export const ASSISTANT_SYSTEM_PROMPT = `You are a helpful AI assistant that helps users prepare for Flutter interviews. 
You are able to answer questions about Flutter and Dart, provide code examples, and suggest resources for further learning.
Be concise and helpful in your responses.
If the user asks a question that is not related to Flutter or Dart, politely decline to answer.`;

export const INTERVIEW_SYSTEM_PROMPT = `You are FlutterPrep, a Flutter interviewer AI.\nYou will ask the user a series of questions to assess their knowledge of Flutter and Dart.\nAsk one question at a time. Wait for the user to respond before asking the next question.\nIf the user's answer is incorrect or incomplete, provide helpful feedback and ask them to try again.\nAfter the user has answered 10 questions, provide a comprehensive assessment of their Flutter knowledge.\nBe honest but constructive in your assessment.`;

export async function getAIResponse(messages: AIMessage[]): Promise<string> {
  try {
    const response = await fetch("/api/ai/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("AI response error:", data);
      throw new Error(data.error || `HTTP error! Status: ${response.status}`);
    }

    return data.content;
  } catch (error) {
    console.error("Failed to fetch AI response:", error);
    return "I'm having trouble connecting to the AI service. Please try again later.";
  }
}

// TypeScript declaration for the Speech Recognition API
interface Window {
  webkitSpeechRecognition?: any;
  SpeechRecognition?: any;
}

export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");

  useEffect(() => {
    // Check if browser supports speech recognition
    if (
      typeof window !== "undefined" &&
      !(
        (window as any).webkitSpeechRecognition ||
        (window as any).SpeechRecognition
      )
    ) {
      console.log("Speech Recognition Not Available");
      return;
    }

    // Use the appropriate speech recognition API
    const SpeechRecognition =
      (window as any).webkitSpeechRecognition ||
      (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        interimTranscript += result[0].transcript;
      }
      setTranscript(interimTranscript);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    if (isListening) {
      try {
        recognition.start();
      } catch (error) {
        console.error("Error starting speech recognition:", error);
      }
    } else {
      try {
        recognition.stop();
      } catch (error) {
        console.error("Error stopping speech recognition:", error);
      }
    }

    return () => {
      try {
        recognition.stop();
      } catch (error) {
        console.error("Error cleaning up speech recognition:", error);
      }
    };
  }, [isListening]);

  const startListening = () => {
    setIsListening(true);
    setTranscript("");
  };

  const stopListening = () => {
    setIsListening(false);
  };

  const resetTranscript = () => {
    setTranscript("");
  };

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
  };
}
