import { questions as defaultQuestions } from '@/constants/questions';
import React, { createContext, useContext, useEffect, useState } from 'react';

export interface Question {
  id: number;
  type: 'multiple' | 'truefalse' | 'checkbox';
  question: string;
  choices: {
    [key: string]: string;
  };
  answer: string | string[];
}

interface Answer {
  questionId: number;
  answer: string | string[];
}

interface QuizContextType {
  // Questions
  questions: Question[];
  setQuestions: (questions: Question[]) => void;
  addQuestion: (question: Question) => void;
  updateQuestion: (id: number, question: Question) => void;
  deleteQuestion: (id: number) => void;
  
  // Timer
  quizTimer: number; // in seconds
  setQuizTimer: (seconds: number) => void;
  
  // Quiz State
  currentQuestionIndex: number;
  answers: Answer[];
  score: number;
  highestScore: number;
  currentQuestion: Question | null;
  timeRemaining: number;
  isQuizActive: boolean;
  
  // Quiz Actions
  selectAnswer: (questionId: number, answer: string | string[]) => void;
  goToNextQuestion: () => void;
  goToPreviousQuestion: () => void;
  startQuiz: () => void;
  submitQuiz: () => Promise<void>;
  resetQuiz: () => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({ children }: { children: React.ReactNode }) {
  const [questions, setQuestionsState] = useState<Question[]>(defaultQuestions as Question[]);
  const [quizTimer, setQuizTimer] = useState(300); // 5 minutes default
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [score, setScore] = useState(0);
  const [highestScore, setHighestScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(quizTimer);
  const [isQuizActive, setIsQuizActive] = useState(false);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isQuizActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timeRemaining === 0 && isQuizActive) {
      // Auto submit when timer ends
      handleSubmitQuiz();
    }

    return () => clearInterval(interval);
  }, [isQuizActive, timeRemaining]);

  const handleSubmitQuiz = async () => {
    const calculatedScore = calculateScore(answers);
    setScore(calculatedScore);
    if (calculatedScore > highestScore) {
      setHighestScore(calculatedScore);
    }
    setIsQuizActive(false);
  };

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
    setTimeRemaining(quizTimer);
    setIsQuizActive(true);
  };

  const calculateScore = (userAnswers: Answer[]) => {
    let calculatedScore = 0;
    userAnswers.forEach(userAnswer => {
      const question = questions.find(q => q.id === userAnswer.questionId);
      if (question) {
        if (Array.isArray(question.answer)) {
          if (
            Array.isArray(userAnswer.answer) &&
            JSON.stringify(userAnswer.answer.sort()) === JSON.stringify(question.answer.sort())
          ) {
            calculatedScore++;
          }
        } else {
          if (userAnswer.answer === question.answer) {
            calculatedScore++;
          }
        }
      }
    });
    return calculatedScore;
  };

  const submitQuiz = async () => {
    await handleSubmitQuiz();
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setScore(0);
    setTimeRemaining(quizTimer);
    setIsQuizActive(false);
  };

  const setQuestions = (newQuestions: Question[]) => {
    setQuestionsState(newQuestions);
  };

  const addQuestion = (question: Question) => {
    const newId = Math.max(...questions.map(q => q.id), 0) + 1;
    setQuestionsState([...questions, { ...question, id: newId }]);
  };

  const updateQuestion = (id: number, question: Question) => {
    setQuestionsState(questions.map(q => q.id === id ? { ...question, id } : q));
  };

  const deleteQuestion = (id: number) => {
    setQuestionsState(questions.filter(q => q.id !== id));
  };

  const currentQuestion = questions[currentQuestionIndex] || null;

  const value: QuizContextType = {
    // Questions
    questions,
    setQuestions,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    
    // Timer
    quizTimer,
    setQuizTimer,
    
    // Quiz State
    currentQuestionIndex,
    answers,
    score,
    highestScore,
    currentQuestion,
    timeRemaining,
    isQuizActive,
    
    // Quiz Actions
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
