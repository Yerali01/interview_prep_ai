"use client";

import dynamic from "next/dynamic";

const QuizContentClient = dynamic(() => import("./quiz-content-client"), {
  ssr: false,
  loading: () => (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Loading Quizzes...</h1>
      </div>
    </div>
  ),
});

export default function QuizContent() {
  return <QuizContentClient />;
}
