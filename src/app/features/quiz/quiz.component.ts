import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { QuizService } from '../../core/services/quiz.service';
import { Quiz, Question, QuizAttempt, QuizResult } from '../../core/models/quiz.model';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="quiz-container">
      <!-- Quiz Header -->
      <div class="quiz-header" *ngIf="currentQuiz">
        <div class="quiz-info">
          <h1>{{ currentQuiz.title }}</h1>
          <p>{{ currentQuiz.description }}</p>
        </div>
        <div class="quiz-timer" *ngIf="isQuizActive">
          <div class="timer-display">
            <span class="timer-icon">⏱️</span>
            <span class="timer-text">{{ formatTime(remainingTime) }}</span>
          </div>
        </div>
      </div>

      <!-- Quiz Navigation -->
      <div class="quiz-nav" *ngIf="isQuizActive">
        <div class="progress-bar">
          <div class="progress-fill" [style.width.%]="getProgressPercentage()"></div>
        </div>
        <div class="question-nav">
          <button 
            class="nav-btn" 
            *ngFor="let question of currentQuiz?.questions; let i = index"
            [class.current]="currentQuestionIndex === i"
            [class.answered]="isQuestionAnswered(i)"
            (click)="goToQuestion(i)"
          >
            {{ i + 1 }}
          </button>
        </div>
      </div>

      <!-- Quiz Content -->
      <div class="quiz-content">
        <!-- Quiz Selection Interface -->
        <div *ngIf="!currentQuiz && !isQuizActive" class="quiz-selection">
          <div class="quiz-selection-header">
            <h1>Available Quizzes</h1>
            <p>Test your knowledge with these programming quizzes</p>
          </div>
          
          <div class="quiz-grid">
            <div 
              *ngFor="let quiz of availableQuizzes" 
              class="quiz-card"
              (click)="previewQuiz(quiz.id)"
            >
              <div class="quiz-card-header">
                <h3>{{ quiz.title }}</h3>
                <span class="quiz-difficulty">Programming</span>
              </div>
              <div class="quiz-card-body">
                <p>{{ quiz.description }}</p>
                <div class="quiz-meta">
                  <span class="quiz-time">⏱️ {{ quiz.timeLimit }} min</span>
                  <span class="quiz-score">🎯 {{ quiz.passingScore }}% to pass</span>
                  <span class="quiz-attempts">🔄 {{ quiz.maxAttempts }} attempts</span>
                </div>
              </div>
              <div class="quiz-card-footer">
                <button class="start-quiz-btn">Start Quiz</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Quiz Taking Interface -->
        <div *ngIf="isQuizActive && currentQuestion" class="question-container">
          <div class="question-header">
            <h2>Question {{ currentQuestionIndex + 1 }} of {{ currentQuiz?.questions?.length }}</h2>
            <div class="question-meta">
              <span class="question-type">{{ getQuestionTypeLabel(currentQuestion.type) }}</span>
              <span class="question-points">{{ currentQuestion.points }} points</span>
            </div>
          </div>

          <div class="question-content">
            <h3>{{ currentQuestion.text }}</h3>
            
            <!-- Multiple Choice Questions -->
            <div *ngIf="currentQuestion.type === 'multiple_choice'" class="options-container">
              <label 
                class="option-item" 
                *ngFor="let option of currentQuestion.options; let i = index"
              >
                <input 
                  type="checkbox" 
                  [value]="i"
                  [checked]="isOptionSelected(i)"
                  (change)="toggleOption(i)"
                >
                <span class="option-text">{{ option.text }}</span>
              </label>
            </div>

            <!-- Single Choice Questions -->
            <div *ngIf="currentQuestion.type === 'single_choice'" class="options-container">
              <label 
                class="option-item" 
                *ngFor="let option of currentQuestion.options; let i = index"
              >
                <input 
                  type="radio" 
                  name="singleChoice"
                  [value]="i"
                  [checked]="isOptionSelected(i)"
                  (change)="selectOption(i)"
                >
                <span class="option-text">{{ option.text }}</span>
              </label>
            </div>

            <!-- True/False Questions -->
            <div *ngIf="currentQuestion.type === 'true_false'" class="options-container">
              <label class="option-item">
                <input 
                  type="radio" 
                  name="trueFalse"
                  value="true"
                  [checked]="getTrueFalseAnswer() === 'true'"
                  (change)="setTrueFalseAnswer('true')"
                >
                <span class="option-text">True</span>
              </label>
              <label class="option-item">
                <input 
                  type="radio" 
                  name="trueFalse"
                  value="false"
                  [checked]="getTrueFalseAnswer() === 'false'"
                  (change)="setTrueFalseAnswer('false')"
                >
                <span class="option-text">False</span>
              </label>
            </div>

            <!-- Fill in the Blank -->
            <div *ngIf="currentQuestion.type === 'fill_blank'" class="fill-blank-container">
              <input 
                type="text" 
                placeholder="Enter your answer..."
                [(ngModel)]="fillBlankAnswer"
                class="fill-blank-input"
              >
            </div>

            <!-- Essay Questions -->
            <div *ngIf="currentQuestion.type === 'essay'" class="essay-container">
              <textarea 
                placeholder="Write your answer here..."
                [(ngModel)]="essayAnswer"
                rows="6"
                class="essay-input"
              ></textarea>
            </div>
          </div>

          <div class="question-actions">
            <button 
              class="btn-secondary" 
              (click)="previousQuestion()"
              [disabled]="currentQuestionIndex === 0"
            >
              ← Previous
            </button>
            <button 
              class="btn-primary" 
              (click)="nextQuestion()"
              *ngIf="currentQuestionIndex < (currentQuiz?.questions?.length || 0) - 1"
            >
              Next →
            </button>
            <button 
              class="btn-submit" 
              (click)="submitQuiz()"
              *ngIf="currentQuestionIndex === (currentQuiz?.questions?.length || 0) - 1"
            >
              Submit Quiz
            </button>
          </div>
        </div>

        <!-- Quiz Results -->
        <div *ngIf="quizResult" class="results-container">
          <div class="results-header">
            <h2>Quiz Results</h2>
            <div class="results-summary">
              <div class="result-stat">
                <span class="stat-number">{{ quizResult.attempt.score }}/{{ quizResult.attempt.maxScore }}</span>
                <span class="stat-label">Score</span>
              </div>
              <div class="result-stat">
                <span class="stat-number">{{ quizResult.attempt.percentage }}%</span>
                <span class="stat-label">Percentage</span>
              </div>
              <div class="result-stat">
                <span class="stat-number" [class.passed]="quizResult.attempt.isPassed" [class.failed]="!quizResult.attempt.isPassed">
                  {{ quizResult.attempt.isPassed ? 'PASSED' : 'FAILED' }}
                </span>
                <span class="stat-label">Status</span>
              </div>
            </div>
          </div>

          <div class="results-feedback">
            <h3>{{ getFeedbackMessage() }}</h3>
            <p>{{ quizResult.feedback }}</p>
          </div>

          <div class="question-review">
            <h3>Question Review</h3>
            <div class="review-list">
              <div 
                class="review-item" 
                *ngFor="let question of quizResult.questions; let i = index"
                [class.correct]="quizResult.answers[i]?.isCorrect"
                [class.incorrect]="!quizResult.answers[i]?.isCorrect"
              >
                <div class="review-header">
                  <h4>Question {{ i + 1 }}</h4>
                  <span class="review-status">
                    {{ quizResult.answers[i]?.isCorrect ? '✅' : '❌' }}
                  </span>
                </div>
                <p class="review-question">{{ question.text }}</p>
                <div class="review-answer">
                  <strong>Your Answer:</strong> {{ getAnswerText(quizResult.answers[i]) }}
                </div>
                <div class="review-explanation" *ngIf="question.explanation">
                  <strong>Explanation:</strong> {{ question.explanation }}
                </div>
              </div>
            </div>
          </div>

          <div class="results-actions">
            <button class="btn-primary" routerLink="/courses">
              Back to Course
            </button>
            <button class="btn-secondary" (click)="retakeQuiz()">
              Retake Quiz
            </button>
            <button class="btn-download" (click)="downloadCertificate()" *ngIf="quizResult.attempt.isPassed">
              Download Certificate
            </button>
          </div>
        </div>

        <!-- Quiz List -->
        <div *ngIf="!isQuizActive && !quizResult" class="quiz-list">
          <div class="quiz-list-header">
            <h2>Available Quizzes</h2>
            <p>Test your knowledge with these assessments</p>
          </div>
          
          <div class="quiz-grid">
            <div class="quiz-card" *ngFor="let quiz of availableQuizzes">
              <div class="quiz-card-header">
                <h3>{{ quiz.title }}</h3>
                <div class="quiz-meta">
                  <span class="meta-item">⏱️ {{ quiz.timeLimit }} min</span>
                  <span class="meta-item">📝 {{ quiz.questions.length }} questions</span>
                  <span class="meta-item">🎯 {{ quiz.passingScore }}% to pass</span>
                </div>
              </div>
              <p class="quiz-description">{{ quiz.description }}</p>
              <div class="quiz-actions">
                <button class="btn-start" (click)="startQuiz(quiz.id)">
                  Start Quiz
                </button>
                <button class="btn-preview" (click)="previewQuiz(quiz.id)">
                  Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .quiz-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 2rem;
    }

    .quiz-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding: 2rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      color: white;
    }

    .quiz-info h1 {
      margin: 0 0 0.5rem 0;
      font-size: 2rem;
    }

    .quiz-info p {
      margin: 0;
      opacity: 0.9;
    }

    .quiz-timer {
      background: rgba(255,255,255,0.2);
      padding: 1rem 1.5rem;
      border-radius: 8px;
    }

    .timer-display {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1.25rem;
      font-weight: bold;
    }

    .quiz-nav {
      background: white;
      padding: 1rem;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
    }

    .progress-bar {
      height: 8px;
      background: #e1e5e9;
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 1rem;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      transition: width 0.3s;
    }

    .question-nav {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .nav-btn {
      width: 40px;
      height: 40px;
      border: 2px solid #e1e5e9;
      background: white;
      border-radius: 50%;
      cursor: pointer;
      font-weight: bold;
      transition: all 0.2s;
    }

    .nav-btn.current {
      background: #667eea;
      color: white;
      border-color: #667eea;
    }

    .nav-btn.answered {
      background: #27ae60;
      color: white;
      border-color: #27ae60;
    }

    .quiz-content {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      padding: 2rem;
    }

    .question-container {
      max-width: 800px;
      margin: 0 auto;
    }

    .question-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #f8f9fa;
    }

    .question-header h2 {
      margin: 0;
      color: #333;
    }

    .question-meta {
      display: flex;
      gap: 1rem;
      font-size: 0.875rem;
      color: #666;
    }

    .question-type {
      background: #e3f2fd;
      color: #1976d2;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
    }

    .question-points {
      background: #fff3e0;
      color: #f57c00;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
    }

    .question-content h3 {
      margin: 0 0 2rem 0;
      font-size: 1.25rem;
      color: #333;
      line-height: 1.5;
    }

    .options-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .option-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      border: 2px solid #e1e5e9;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .option-item:hover {
      border-color: #667eea;
      background: #f8f9fa;
    }

    .option-item input {
      margin: 0;
    }

    .option-text {
      flex: 1;
      font-size: 1rem;
      color: #333;
    }

    .fill-blank-container, .essay-container {
      margin-bottom: 2rem;
    }

    .fill-blank-input, .essay-input {
      width: 100%;
      padding: 1rem;
      border: 2px solid #e1e5e9;
      border-radius: 8px;
      font-size: 1rem;
      resize: vertical;
    }

    .fill-blank-input:focus, .essay-input:focus {
      outline: none;
      border-color: #667eea;
    }

    .question-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 2rem;
    }

    .btn-primary, .btn-secondary, .btn-submit {
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      border: none;
      font-weight: 500;
      cursor: pointer;
      transition: transform 0.2s;
    }

    .btn-primary {
      background: #667eea;
      color: white;
    }

    .btn-secondary {
      background: white;
      color: #667eea;
      border: 2px solid #667eea;
    }

    .btn-submit {
      background: #27ae60;
      color: white;
    }

    .btn-primary:hover, .btn-secondary:hover, .btn-submit:hover {
      transform: translateY(-2px);
    }

    .results-container {
      max-width: 800px;
      margin: 0 auto;
    }

    .results-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .results-header h2 {
      margin: 0 0 1rem 0;
      color: #333;
    }

    .results-summary {
      display: flex;
      justify-content: center;
      gap: 2rem;
    }

    .result-stat {
      text-align: center;
    }

    .stat-number {
      display: block;
      font-size: 2rem;
      font-weight: bold;
      color: #333;
    }

    .stat-number.passed {
      color: #27ae60;
    }

    .stat-number.failed {
      color: #e74c3c;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #666;
    }

    .results-feedback {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 2rem;
      text-align: center;
    }

    .results-feedback h3 {
      margin: 0 0 0.5rem 0;
      color: #333;
    }

    .results-feedback p {
      margin: 0;
      color: #666;
    }

    .question-review h3 {
      margin: 0 0 1.5rem 0;
      color: #333;
    }

    .review-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .review-item {
      padding: 1.5rem;
      border-radius: 8px;
      border-left: 4px solid;
    }

    .review-item.correct {
      background: #d4edda;
      border-left-color: #27ae60;
    }

    .review-item.incorrect {
      background: #f8d7da;
      border-left-color: #e74c3c;
    }

    .review-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .review-header h4 {
      margin: 0;
      color: #333;
    }

    .review-status {
      font-size: 1.5rem;
    }

    .review-question {
      margin: 0 0 1rem 0;
      color: #333;
      font-weight: 500;
    }

    .review-answer, .review-explanation {
      margin: 0.5rem 0;
      color: #666;
    }

    .results-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin-top: 2rem;
    }

    .btn-download {
      background: #f39c12;
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      border: none;
      font-weight: 500;
      cursor: pointer;
      transition: transform 0.2s;
    }

    .btn-download:hover {
      transform: translateY(-2px);
    }

    .quiz-list-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .quiz-list-header h2 {
      margin: 0 0 0.5rem 0;
      color: #333;
    }

    .quiz-list-header p {
      margin: 0;
      color: #666;
    }

    .quiz-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .quiz-card {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 8px;
      transition: transform 0.2s;
    }

    .quiz-card:hover {
      transform: translateY(-4px);
    }

    .quiz-card-header h3 {
      margin: 0 0 1rem 0;
      color: #333;
    }

    .quiz-meta {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
      font-size: 0.875rem;
      color: #666;
    }

    .quiz-description {
      margin: 0 0 1.5rem 0;
      color: #666;
      line-height: 1.5;
    }

    .quiz-actions {
      display: flex;
      gap: 1rem;
    }

    .btn-start, .btn-preview {
      flex: 1;
      padding: 0.75rem;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      font-weight: 500;
      transition: background 0.2s;
    }

    .btn-start {
      background: #667eea;
      color: white;
    }

    .btn-preview {
      background: white;
      color: #667eea;
      border: 2px solid #667eea;
    }

    /* Quiz Selection Styles */
    .quiz-selection {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .quiz-selection-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .quiz-selection-header h1 {
      margin: 0 0 0.5rem 0;
      color: #333;
      font-size: 2.5rem;
    }

    .quiz-selection-header p {
      margin: 0;
      color: #666;
      font-size: 1.1rem;
    }

    .quiz-card {
      background: white;
      border: 1px solid #e1e5e9;
      border-radius: 12px;
      padding: 1.5rem;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .quiz-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
      border-color: #667eea;
    }

    .quiz-card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }

    .quiz-card-header h3 {
      margin: 0;
      color: #333;
      font-size: 1.25rem;
    }

    .quiz-difficulty {
      background: #667eea;
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .quiz-card-body p {
      margin: 0 0 1rem 0;
      color: #666;
      line-height: 1.6;
    }

    .quiz-meta {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
      font-size: 0.875rem;
      color: #666;
      flex-wrap: wrap;
    }

    .quiz-time, .quiz-score, .quiz-attempts {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .quiz-card-footer {
      text-align: center;
    }

    .start-quiz-btn {
      background: #667eea;
      color: white;
      padding: 0.75rem 2rem;
      border-radius: 8px;
      border: none;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 1rem;
    }

    .start-quiz-btn:hover {
      background: #5a6fd8;
      transform: translateY(-1px);
    }

    @media (max-width: 768px) {
      .quiz-container {
        padding: 1rem;
      }

      .quiz-header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }

      .question-header {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
      }

      .question-actions {
        flex-direction: column;
        gap: 1rem;
      }

      .results-summary {
        flex-direction: column;
        gap: 1rem;
      }

      .results-actions {
        flex-direction: column;
      }

      .quiz-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class QuizComponent implements OnInit {
  currentQuiz: Quiz | null = null;
  currentQuestion: Question | null = null;
  currentQuestionIndex = 0;
  isQuizActive = false;
  remainingTime = 0;
  quizResult: QuizResult | null = null;
  availableQuizzes: Quiz[] = [];
  userAnswers: Map<number, any> = new Map();
  fillBlankAnswer = '';
  essayAnswer = '';
  timerInterval: any;

  constructor(
    private quizService: QuizService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadAvailableQuizzes();
    
    // Check if there's a quiz ID in the route
    const quizId = this.route.snapshot.params['quizId'];
    if (quizId) {
      this.loadQuiz(quizId);
    }
  }

  loadAvailableQuizzes(): void {
    // Load all available quizzes
    this.quizService.getAllQuizzes().subscribe({
      next: (quizzes) => {
        this.availableQuizzes = quizzes;
        console.log('Loaded quizzes:', quizzes);
      },
      error: (error) => {
        console.error('Error loading quizzes:', error);
        // Fallback: load from a mock service or show demo quizzes
        this.loadDemoQuizzes();
      }
    });
  }

  loadDemoQuizzes(): void {
    // Demo quizzes for testing
    this.availableQuizzes = [
      {
        id: 1,
        title: 'JavaScript Fundamentals',
        description: 'Test your knowledge of JavaScript basics including variables, functions, and control structures.',
        courseId: 1,
        timeLimit: 30,
        passingScore: 70,
        maxAttempts: 3,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        questions: [],
        attempts: []
      },
      {
        id: 2,
        title: 'Python Basics',
        description: 'Test your understanding of Python fundamentals including syntax, data structures, and basic operations.',
        courseId: 1,
        timeLimit: 25,
        passingScore: 75,
        maxAttempts: 3,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        questions: [],
        attempts: []
      },
      {
        id: 3,
        title: 'Web Development Fundamentals',
        description: 'Test your knowledge of HTML, CSS, and basic web development concepts.',
        courseId: 1,
        timeLimit: 20,
        passingScore: 70,
        maxAttempts: 3,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        questions: [],
        attempts: []
      },
      {
        id: 4,
        title: 'Database Fundamentals',
        description: 'Test your understanding of database concepts, SQL basics, and data modeling.',
        courseId: 1,
        timeLimit: 30,
        passingScore: 75,
        maxAttempts: 3,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        questions: [],
        attempts: []
      }
    ];
  }

  loadQuiz(quizId: number): void {
    this.quizService.getQuizById(quizId).subscribe({
      next: (quiz) => {
        this.currentQuiz = quiz;
        this.currentQuestion = quiz.questions[0];
        this.startQuiz(quizId);
      },
      error: (error) => {
        console.error('Error loading quiz:', error);
      }
    });
  }

  startQuiz(quizId: number): void {
    this.quizService.startQuizAttempt(quizId).subscribe({
      next: (attempt) => {
        this.isQuizActive = true;
        this.remainingTime = this.currentQuiz!.timeLimit * 60; // Convert to seconds
        this.startTimer();
      },
      error: (error) => {
        console.error('Error starting quiz:', error);
      }
    });
  }

  startTimer(): void {
    this.timerInterval = setInterval(() => {
      this.remainingTime--;
      if (this.remainingTime <= 0) {
        this.submitQuiz();
      }
    }, 1000);
  }

  stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  getProgressPercentage(): number {
    if (!this.currentQuiz) return 0;
    return ((this.currentQuestionIndex + 1) / this.currentQuiz.questions.length) * 100;
  }

  getQuestionTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'multiple_choice': 'Multiple Choice',
      'single_choice': 'Single Choice',
      'true_false': 'True/False',
      'fill_blank': 'Fill in the Blank',
      'essay': 'Essay'
    };
    return labels[type] || type;
  }

  isQuestionAnswered(questionIndex: number): boolean {
    return this.userAnswers.has(questionIndex);
  }

  isOptionSelected(optionIndex: number): boolean {
    const currentAnswers = this.userAnswers.get(this.currentQuestionIndex);
    if (Array.isArray(currentAnswers)) {
      return currentAnswers.includes(optionIndex);
    }
    return currentAnswers === optionIndex;
  }

  toggleOption(optionIndex: number): void {
    const currentAnswers = this.userAnswers.get(this.currentQuestionIndex) || [];
    const newAnswers = Array.isArray(currentAnswers) ? [...currentAnswers] : [];
    
    if (newAnswers.includes(optionIndex)) {
      const index = newAnswers.indexOf(optionIndex);
      newAnswers.splice(index, 1);
    } else {
      newAnswers.push(optionIndex);
    }
    
    this.userAnswers.set(this.currentQuestionIndex, newAnswers);
  }

  selectOption(optionIndex: number): void {
    this.userAnswers.set(this.currentQuestionIndex, optionIndex);
  }

  getTrueFalseAnswer(): string {
    return this.userAnswers.get(this.currentQuestionIndex) || '';
  }

  setTrueFalseAnswer(answer: string): void {
    this.userAnswers.set(this.currentQuestionIndex, answer);
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < (this.currentQuiz?.questions.length || 0) - 1) {
      this.currentQuestionIndex++;
      this.currentQuestion = this.currentQuiz!.questions[this.currentQuestionIndex];
      this.resetQuestionInputs();
    }
  }

  previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.currentQuestion = this.currentQuiz!.questions[this.currentQuestionIndex];
      this.resetQuestionInputs();
    }
  }

  goToQuestion(index: number): void {
    this.currentQuestionIndex = index;
    this.currentQuestion = this.currentQuiz!.questions[index];
    this.resetQuestionInputs();
  }

  resetQuestionInputs(): void {
    this.fillBlankAnswer = '';
    this.essayAnswer = '';
  }

  submitQuiz(): void {
    this.stopTimer();
    
    // Prepare answers for submission
    const answers = Array.from(this.userAnswers.entries()).map(([questionIndex, answer]) => ({
      questionId: this.currentQuiz!.questions[questionIndex].id,
      answer: answer
    }));

    this.quizService.submitQuizAnswers(1, answers).subscribe({
      next: (result) => {
        this.quizResult = result;
        this.isQuizActive = false;
      },
      error: (error) => {
        console.error('Error submitting quiz:', error);
      }
    });
  }

  getFeedbackMessage(): string {
    if (!this.quizResult) return '';
    
    const percentage = this.quizResult.attempt.percentage;
    if (percentage >= 90) return 'Excellent work!';
    if (percentage >= 80) return 'Great job!';
    if (percentage >= 70) return 'Good effort!';
    if (percentage >= 60) return 'You passed!';
    return 'Keep studying!';
  }

  getAnswerText(answer: any): string {
    if (!answer) return 'No answer provided';
    
    if (typeof answer.answer === 'string') {
      return answer.answer;
    }
    
    if (Array.isArray(answer.answer)) {
      return answer.answer.join(', ');
    }
    
    return answer.answer.toString();
  }

  retakeQuiz(): void {
    this.quizResult = null;
    this.userAnswers.clear();
    this.currentQuestionIndex = 0;
    this.currentQuestion = this.currentQuiz!.questions[0];
    this.startQuiz(this.currentQuiz!.id);
  }

  downloadCertificate(): void {
    // Implement certificate download logic
    console.log('Downloading certificate...');
  }

  previewQuiz(quizId: number): void {
    // Implement quiz preview logic
    console.log('Previewing quiz:', quizId);
  }
}