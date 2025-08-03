import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Quiz, QuizAttempt, QuizResult, Question } from '../models/quiz.model';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  constructor(private http: HttpClient) {}

  // Get quizzes for a course
  getCourseQuizzes(courseId: number): Observable<Quiz[]> {
    return this.http.get<Quiz[]>(`/api/courses/${courseId}/quizzes`);
  }

  // Get all quizzes
  getAllQuizzes(): Observable<Quiz[]> {
    return this.http.get<Quiz[]>('/api/quiz');
  }

  // Get quiz by ID
  getQuizById(quizId: number): Observable<Quiz> {
    return this.http.get<Quiz>(`/api/quizzes/${quizId}`);
  }

  // Start a quiz attempt
  startQuizAttempt(quizId: number): Observable<QuizAttempt> {
    return this.http.post<QuizAttempt>(`/api/quizzes/${quizId}/start`, {});
  }

  // Submit quiz answers
  submitQuizAnswers(attemptId: number, answers: { questionId: number; answer: string | string[] }[]): Observable<QuizResult> {
    return this.http.post<QuizResult>(`/api/quiz-attempts/${attemptId}/submit`, { answers });
  }

  // Get quiz attempt
  getQuizAttempt(attemptId: number): Observable<QuizAttempt> {
    return this.http.get<QuizAttempt>(`/api/quiz-attempts/${attemptId}`);
  }

  // Get user's quiz attempts
  getUserQuizAttempts(): Observable<QuizAttempt[]> {
    return this.http.get<QuizAttempt[]>('/api/quiz-attempts');
  }

  // Get quiz results
  getQuizResults(quizId: number): Observable<QuizResult[]> {
    return this.http.get<QuizResult[]>(`/api/quizzes/${quizId}/results`);
  }

  // Create new quiz (for instructors)
  createQuiz(quizData: Partial<Quiz>): Observable<Quiz> {
    return this.http.post<Quiz>('/api/quizzes', quizData);
  }

  // Update quiz (for instructors)
  updateQuiz(quizId: number, quizData: Partial<Quiz>): Observable<Quiz> {
    return this.http.put<Quiz>(`/api/quizzes/${quizId}`, quizData);
  }

  // Delete quiz (for instructors)
  deleteQuiz(quizId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`/api/quizzes/${quizId}`);
  }

  // Add question to quiz (for instructors)
  addQuestion(quizId: number, questionData: Partial<Question>): Observable<Question> {
    return this.http.post<Question>(`/api/quizzes/${quizId}/questions`, questionData);
  }

  // Update question (for instructors)
  updateQuestion(questionId: number, questionData: Partial<Question>): Observable<Question> {
    return this.http.put<Question>(`/api/questions/${questionId}`, questionData);
  }

  // Delete question (for instructors)
  deleteQuestion(questionId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`/api/questions/${questionId}`);
  }

  // Get quiz analytics
  getQuizAnalytics(quizId: number): Observable<{
    totalAttempts: number;
    averageScore: number;
    passRate: number;
    questionAnalytics: any[];
  }> {
    return this.http.get<any>(`/api/quizzes/${quizId}/analytics`);
  }

  // Get user's quiz statistics
  getUserQuizStats(): Observable<{
    totalQuizzesTaken: number;
    averageScore: number;
    certificatesEarned: number;
    recentAttempts: QuizAttempt[];
  }> {
    return this.http.get<any>('/api/quiz-attempts/stats');
  }
}