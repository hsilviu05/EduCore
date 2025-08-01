import { Certificate } from './course.model';

export interface Quiz {
  id: number;
  title: string;
  description: string;
  courseId: number;
  lessonId?: number;
  timeLimit: number; // in minutes
  passingScore: number; // percentage
  maxAttempts: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  questions: Question[];
  attempts: QuizAttempt[];
}

export interface Question {
  id: number;
  quizId: number;
  text: string;
  type: QuestionType;
  points: number;
  order: number;
  options?: QuestionOption[];
  correctAnswer?: string | string[];
  explanation?: string;
}

export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  SINGLE_CHOICE = 'single_choice',
  TRUE_FALSE = 'true_false',
  FILL_BLANK = 'fill_blank',
  ESSAY = 'essay',
  MATCHING = 'matching'
}

export interface QuestionOption {
  id: number;
  questionId: number;
  text: string;
  isCorrect: boolean;
  order: number;
}

export interface QuizAttempt {
  id: number;
  quizId: number;
  userId: number;
  startedAt: Date;
  completedAt?: Date;
  score: number;
  maxScore: number;
  percentage: number;
  isPassed: boolean;
  answers: QuizAnswer[];
  timeSpent: number; // in seconds
}

export interface QuizAnswer {
  id: number;
  attemptId: number;
  questionId: number;
  answer: string | string[];
  isCorrect: boolean;
  pointsEarned: number;
  timeSpent: number; // in seconds
}

export interface QuizResult {
  attempt: QuizAttempt;
  questions: Question[];
  answers: QuizAnswer[];
  feedback: string;
  certificate?: Certificate;
}