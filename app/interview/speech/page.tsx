"use client";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type AIMessage,
  getAIResponse,
  INTERVIEW_SYSTEM_PROMPT,
} from "@/lib/ai-utils";
import { Mic, MicOff, Volume2, Home, RotateCcw, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useSearchParams } from "next/navigation";

// Mark this page as dynamic to prevent static generation
export const dynamic = "force-dynamic";

type InterviewLevel = "junior" | "middle" | "senior";
type SpeechState =
  | "waiting"
  | "ai-speaking"
  | "listening"
  | "processing"
  | "finished";

export default function SpeechInterviewPage() {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [currentState, setCurrentState] = useState<SpeechState>("waiting");
  const [questionCount, setQuestionCount] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [assessment, setAssessment] = useState<string | null>(null);
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState("");

  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const level = (searchParams.get("level") as InterviewLevel) || "junior";

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize speech APIs
  useEffect(() => {
    console.log("🎤 Initializing speech APIs...");

    if (typeof window !== "undefined") {
      // Check for speech recognition support
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        console.error("❌ Speech recognition not supported");
        setIsSpeechSupported(false);
        toast({
          title: "Speech not supported",
          description:
            "Your browser doesn't support speech recognition. Please use a modern browser.",
          variant: "destructive",
        });
        return;
      }

      // Initialize speech recognition
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        console.log("🎤 Speech recognition started");
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        let finalTranscript = "";
        let interimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript + interimTranscript);

        // Reset silence timer on speech
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
        }

        // Set timer to detect end of speech
        if (finalTranscript) {
          silenceTimerRef.current = setTimeout(() => {
            console.log("🔇 Silence detected, processing answer...");
            stopListening();
            if (finalTranscript.trim()) {
              processUserAnswer(finalTranscript.trim());
            }
          }, 2000); // 2 seconds of silence
        }
      };

      recognition.onerror = (event) => {
        console.error("❌ Speech recognition error:", event.error);
        setIsListening(false);
        toast({
          title: "Speech recognition error",
          description:
            "There was an error with speech recognition. Please try again.",
          variant: "destructive",
        });
      };

      recognition.onend = () => {
        console.log("🔇 Speech recognition ended");
        setIsListening(false);
      };

      recognitionRef.current = recognition;

      // Initialize speech synthesis
      if ("speechSynthesis" in window) {
        synthRef.current = window.speechSynthesis;
        console.log("🔊 Speech synthesis initialized");
      } else {
        console.error("❌ Speech synthesis not supported");
        setIsSpeechSupported(false);
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
    };
  }, []);

  // Start the interview
  const startInterview = async () => {
    console.log(`🚀 Starting ${level} level speech interview...`);
    setCurrentState("processing");
    setMessages([]);
    setQuestionCount(0);
    setAssessment(null);

    // Initialize with system message
    const systemMessage: AIMessage = {
      role: "system",
      content: `${INTERVIEW_SYSTEM_PROMPT}\n\nYou are conducting a ${level} level Flutter interview via SPEECH ONLY. Keep your responses concise and clear for speech. Start by briefly introducing yourself and asking the first question about Flutter or Dart appropriate for a ${level} level developer. Keep questions focused and not too long since this is a voice conversation.`,
    };

    try {
      const initialMessages: AIMessage[] = [systemMessage];
      const response = await getAIResponse(initialMessages);

      setMessages([
        ...initialMessages,
        { role: "assistant", content: response },
      ]);
      setCurrentQuestion(response);
      setQuestionCount(1);

      // Speak the first question
      speakText(response);
    } catch (error) {
      console.error("❌ Error starting interview:", error);
      toast({
        title: "Error starting interview",
        description:
          "There was an error starting the interview. Please try again.",
        variant: "destructive",
      });
      setCurrentState("waiting");
    }
  };

  // Speak text using TTS
  const speakText = (text: string) => {
    if (!synthRef.current || !isSpeechSupported) return;

    console.log("🔊 Speaking:", text.substring(0, 50) + "...");
    setCurrentState("ai-speaking");

    // Cancel any ongoing speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;

    // Select Google UK English Male (en-GB) voice if available
    const setVoiceAndSpeak = () => {
      const voices = window.speechSynthesis.getVoices();
      let ukMaleVoice = voices.find(
        (v) => v.name === "Google UK English Male" && v.lang === "en-GB"
      );
      if (!ukMaleVoice) {
        // fallback: use any en-GB voice
        ukMaleVoice = voices.find((v) => v.lang === "en-GB");
      }
      if (ukMaleVoice) {
        utterance.voice = ukMaleVoice;
      }
      synthRef.current!.speak(utterance);
    };

    // If voices are not loaded yet, wait for them
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = setVoiceAndSpeak;
    } else {
      setVoiceAndSpeak();
    }

    utterance.onstart = () => {
      console.log("🔊 Started speaking");
      setCurrentState("ai-speaking");
    };

    utterance.onend = () => {
      console.log("🔇 Finished speaking, waiting for user response");
      setCurrentState("listening");
      startListening();
    };

    utterance.onerror = (event) => {
      console.error("❌ Speech synthesis error:", event.error);
      setCurrentState("listening");
      startListening();
    };
  };

  // Start listening for user input
  const startListening = () => {
    if (!recognitionRef.current || !isSpeechSupported) return;

    console.log("👂 Starting to listen...");
    setTranscript("");
    setCurrentState("listening");

    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error("❌ Error starting recognition:", error);
      // Recognition might already be running
    }
  };

  // Stop listening
  const stopListening = () => {
    if (!recognitionRef.current) return;

    console.log("🔇 Stopping listening...");
    setIsListening(false);

    try {
      recognitionRef.current.stop();
    } catch (error) {
      console.error("❌ Error stopping recognition:", error);
    }

    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }
  };

  // Process user's spoken answer
  const processUserAnswer = async (userAnswer: string) => {
    console.log("💭 Processing user answer:", userAnswer);
    setCurrentState("processing");
    setTranscript("");

    const userMessage: AIMessage = { role: "user", content: userAnswer };
    setMessages((prev) => [...prev, userMessage]);

    try {
      // Prepare context for the AI
      let promptContext = "";

      if (questionCount >= 10) {
        promptContext = `This is the final question. After acknowledging the user's answer, provide a comprehensive but concise assessment of their Flutter knowledge based on all their answers. Keep it conversational since this is speech-only. Evaluate their strengths, weaknesses, and provide specific recommendations for improvement.`;
      } else {
        promptContext = `This is question #${questionCount} out of 10. After briefly acknowledging the user's answer, ask the next question about Flutter or Dart appropriate for a ${level} level developer. Keep responses concise for speech conversation.`;
      }

      const contextMessage: AIMessage = {
        role: "system",
        content: promptContext,
      };

      // Get all messages including the system context
      const allMessages = [
        ...messages.filter((m) => m.role !== "system"),
        contextMessage,
        userMessage,
      ];

      const response = await getAIResponse(allMessages);

      // Add the assistant's response
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response },
      ]);
      setCurrentQuestion(response);

      // Check if interview is finished
      if (questionCount >= 10) {
        setAssessment(response);
        setCurrentState("finished");
      } else {
        setQuestionCount(questionCount + 1);
      }

      // Speak the response
      speakText(response);
    } catch (error) {
      console.error("❌ Error processing answer:", error);
      toast({
        title: "Error",
        description:
          "There was an error processing your answer. Please try again.",
        variant: "destructive",
      });
      setCurrentState("listening");
      startListening();
    }
  };

  // Manual controls
  const handleManualStart = () => {
    if (currentState === "listening") return;
    startListening();
  };

  const handleManualStop = () => {
    stopListening();
    if (transcript.trim()) {
      processUserAnswer(transcript.trim());
    }
  };

  const restartInterview = () => {
    setCurrentState("waiting");
    setMessages([]);
    setQuestionCount(0);
    setAssessment(null);
    setTranscript("");
    stopListening();
  };

  const goHome = () => {
    router.push("/interview");
  };

  // Render state-specific content
  const renderStateContent = () => {
    switch (currentState) {
      case "waiting":
        return (
          <div className="text-center space-y-6">
            <div className="w-32 h-32 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <Volume2 className="w-16 h-16 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Ready for Speech Interview
              </h2>
              <p className="text-muted-foreground mb-4">
                Level: <span className="font-semibold capitalize">{level}</span>
              </p>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                This is a voice-only interview. The AI will ask questions and
                you'll speak your answers. Make sure your microphone is working
                and you're in a quiet environment.
              </p>
            </div>
            <Button onClick={startInterview} size="lg" className="px-8">
              <Volume2 className="mr-2 h-5 w-5" />
              Start Speech Interview
            </Button>
          </div>
        );

      case "ai-speaking":
        return (
          <div className="text-center space-y-6">
            <div className="w-32 h-32 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <Volume2 className="w-16 h-16 text-primary animate-pulse" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">AI is asking...</h2>
              <p className="text-muted-foreground">
                Question {questionCount} of 10
              </p>
            </div>
            <div className="max-w-2xl mx-auto p-4 bg-muted rounded-lg">
              <p className="text-sm">{currentQuestion}</p>
            </div>
          </div>
        );

      case "listening":
        return (
          <div className="text-center space-y-6">
            <div className="w-32 h-32 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <Mic className="w-16 h-16 text-green-600 animate-pulse" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Your turn to speak</h2>
              <p className="text-muted-foreground">
                Question {questionCount} of 10
              </p>
            </div>
            {transcript && (
              <div className="max-w-2xl mx-auto p-4 bg-green-50 rounded-lg border-2 border-green-200">
                <p className="text-sm font-medium text-green-800">
                  You're saying:
                </p>
                <p className="text-green-700">{transcript}</p>
              </div>
            )}
            <div className="flex gap-4 justify-center">
              <Button
                onClick={handleManualStop}
                variant="outline"
                disabled={!transcript.trim()}
              >
                <MicOff className="mr-2 h-4 w-4" />
                Stop & Submit
              </Button>
            </div>
          </div>
        );

      case "processing":
        return (
          <div className="text-center space-y-6">
            <div className="w-32 h-32 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
              <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Processing your answer...
              </h2>
              <p className="text-muted-foreground">
                Question {questionCount} of 10
              </p>
            </div>
          </div>
        );

      case "finished":
        return (
          <div className="text-center space-y-6">
            <div className="w-32 h-32 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <Volume2 className="w-16 h-16 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Interview Complete!</h2>
              <p className="text-muted-foreground">Listen to your assessment</p>
            </div>
            {assessment && (
              <div className="max-w-2xl mx-auto p-4 bg-muted rounded-lg">
                <p className="text-sm">{assessment}</p>
              </div>
            )}
            <div className="flex gap-4 justify-center">
              <Button onClick={restartInterview} variant="outline">
                <RotateCcw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
              <Button onClick={goHome}>
                <Home className="mr-2 h-4 w-4" />
                Back to Interview
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isSpeechSupported) {
    return (
      <div className="container py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center text-red-600">
              Speech Not Supported
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p>Your browser doesn't support speech recognition or synthesis.</p>
            <p className="text-sm text-muted-foreground">
              Please use a modern browser like Chrome, Edge, or Safari to use
              speech interview mode.
            </p>
            <Button onClick={goHome}>
              <Home className="mr-2 h-4 w-4" />
              Back to Text Interview
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <Card className="max-w-4xl mx-auto min-h-[600px]">
        <CardContent className="p-8">{renderStateContent()}</CardContent>
      </Card>
    </div>
  );
}
