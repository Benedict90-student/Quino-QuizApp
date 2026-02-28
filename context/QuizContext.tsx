import { questions } from '@/constants/questions';
import React, { createContext, useContext, useState } from 'react';

interface Answer {
  questionId: number;
  answer: string | string[];
}

interface QuizContextType {
  currentQuestionIndex: number;
  answers: Answer[];
  score: number;
  highestScore: number;
  currentQuestion: typeof questions[0] | null;
  selectAnswer: (questionId: number, answer: string | string[]) => void;
  goToNextQuestion: () => void;
  goToPreviousQuestion: () => void;
  startQuiz: () => void;
  submitQuiz: () => Promise<void>;
  resetQuiz: () => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({ children }: { children: React.ReactNode }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [score, setScore] = useState(0);
  const [highestScore, setHighestScore] = useState(0);

  const selectAnswer = (questionId: number, answer: string | string[]) => {
    setAnswers(prevAnswers => {
      const existingIndex = prevAnswers.findIndex(a => a.questionId === questionId);
      if (existingIndex > -1) {
        const updated = [...prevAnswers];
        updated[existingIndex] = { questionId, answer };
        return updated;
      }
      return [...prevAnswers, { questionId, answer }];
    });
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const startQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setScore(0);
  };

  const calculateScore = (userAnswers: Answer[]) => {
    let calculatedScore = 0;
    userAnswers.forEach(userAnswer => {
      const question = questions.find(q => q.id === userAnswer.questionId);
      if (question) {
        if (Array.isArray(question.answer)) {
          // For checkbox type questions
          if (
            Array.isArray(userAnswer.answer) &&
            JSON.stringify(userAnswer.answer.sort()) === JSON.stringify(question.answer.sort())
          ) {
            calculatedScore++;
          }
        } else {
          // For single answer questions
          if (userAnswer.answer === question.answer) {
            calculatedScore++;
          }
        }
      }
    });
    return calculatedScore;
  };

  const submitQuiz = async () => {
    const calculatedScore = calculateScore(answers);
    setScore(calculatedScore);
    if (calculatedScore > highestScore) {
      setHighestScore(calculatedScore);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setScore(0);
  };

  const currentQuestion = questions[currentQuestionIndex];

  const value: QuizContextType = {
    currentQuestionIndex,
    answers,
    score,
    highestScore,
    currentQuestion,
    selectAnswer,
    goToNextQuestion,
    goToPreviousQuestion,
    startQuiz,
    submitQuiz,
    resetQuiz,
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
}
