import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CourseService } from '../../core/services/course.service';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <!-- Hero Section -->
      <div class="hero-section">
        <div class="hero-content">
          <div class="welcome-message">
            <h1>Welcome back, {{ currentUser?.firstName || 'Learner' }}! 👋</h1>
            <p class="hero-subtitle">Continue your learning journey and track your progress</p>
            <div class="hero-stats">
              <div class="hero-stat">
                <span class="stat-number">{{ stats.learningStreak }}</span>
                <span class="stat-label">Day Streak</span>
              </div>
              <div class="hero-stat">
                <span class="stat-number">{{ stats.totalPoints }}</span>
                <span class="stat-label">Total Points</span>
              </div>
              <div class="hero-stat">
                <span class="stat-number">{{ stats.completedCourses }}</span>
                <span class="stat-label">Courses Completed</span>
              </div>
            </div>
          </div>
          <div class="hero-actions">
            <button class="btn-primary" routerLink="/courses">
              <span class="btn-icon">🎓</span>
              Browse Courses
            </button>
            <button class="btn-secondary" routerLink="/quiz">
              <span class="btn-icon">🧠</span>
              Take Quiz
            </button>
          </div>
        </div>
        <div class="hero-visual">
          <div class="achievement-badge">
            <span class="badge-icon">🏆</span>
            <div class="badge-content">
              <h3>Learning Champion</h3>
              <p>{{ stats.learningStreak }} day streak!</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="stats-grid">
        <div class="stat-card primary">
          <div class="stat-icon">📚</div>
          <div class="stat-content">
            <h3>{{ stats.enrolledCourses }}</h3>
            <p>Enrolled Courses</p>
            <div class="stat-progress">
              <div class="progress-bar">
                <div class="progress-fill" [style.width.%]="getEnrollmentProgress()"></div>
              </div>
              <span class="progress-text">{{ getEnrollmentProgress() }}%</span>
            </div>
          </div>
        </div>
        <div class="stat-card success">
          <div class="stat-icon">✅</div>
          <div class="stat-content">
            <h3>{{ stats.completedCourses }}</h3>
            <p>Completed Courses</p>
            <div class="stat-progress">
              <div class="progress-bar">
                <div class="progress-fill" [style.width.%]="getCompletionRate()"></div>
              </div>
              <span class="progress-text">{{ getCompletionRate() }}%</span>
            </div>
          </div>
        </div>
        <div class="stat-card warning">
          <div class="stat-icon">🏆</div>
          <div class="stat-content">
            <h3>{{ stats.totalPoints }}</h3>
            <p>Total Points</p>
            <div class="stat-progress">
              <div class="progress-bar">
                <div class="progress-fill" [style.width.%]="getPointsProgress()"></div>
              </div>
              <span class="progress-text">{{ getPointsProgress() }}%</span>
            </div>
          </div>
        </div>
        <div class="stat-card info">
          <div class="stat-icon">🔥</div>
          <div class="stat-content">
            <h3>{{ stats.learningStreak }}</h3>
            <p>Day Streak</p>
            <div class="stat-progress">
              <div class="progress-bar">
                <div class="progress-fill" [style.width.%]="getStreakProgress()"></div>
              </div>
              <span class="progress-text">{{ getStreakProgress() }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="dashboard-grid">
        <!-- Recent Activity -->
        <div class="dashboard-card">
          <div class="card-header">
            <h2>Recent Activity</h2>
            <button class="btn-link" routerLink="/profile">View All</button>
          </div>
          <div class="activity-list">
            <div class="activity-item" *ngFor="let activity of recentActivities">
              <div class="activity-icon" [class]="activity.type">
                {{ activity.icon }}
              </div>
              <div class="activity-content">
                <p class="activity-text">{{ activity.text }}</p>
                <span class="activity-time">{{ activity.time }}</span>
              </div>
              <div class="activity-badge" *ngIf="activity.badge">
                {{ activity.badge }}
              </div>
            </div>
          </div>
        </div>

        <!-- Current Courses -->
        <div class="dashboard-card">
          <div class="card-header">
            <h2>Current Courses</h2>
            <button class="btn-link" routerLink="/courses">View All</button>
          </div>
          <div class="courses-list">
            <div class="course-item" *ngFor="let course of currentCourses">
              <div class="course-thumbnail">
                <img [src]="course.thumbnail" [alt]="course.title">
                <div class="course-overlay">
                  <button class="btn-play" routerLink="/courses/{{ course.id }}">
                    <span>▶️</span>
                  </button>
                </div>
              </div>
              <div class="course-info">
                <h4>{{ course.title }}</h4>
                <p class="course-instructor">{{ course.instructor }}</p>
                <div class="course-meta">
                  <span class="course-duration">⏱️ {{ course.duration }}h</span>
                  <span class="course-lessons">📖 {{ course.lessons }} lessons</span>
                </div>
              </div>
              <div class="course-progress">
                <div class="progress-bar">
                  <div class="progress-fill" [style.width.%]="course.progress"></div>
                </div>
                <span class="progress-text">{{ course.progress }}%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Learning Goals -->
        <div class="dashboard-card">
          <div class="card-header">
            <h2>Learning Goals</h2>
            <button class="btn-link">Edit</button>
          </div>
          <div class="goals-list">
            <div class="goal-item" *ngFor="let goal of learningGoals">
              <div class="goal-header">
                <h4>{{ goal.title }}</h4>
                <span class="goal-deadline">{{ goal.deadline }}</span>
              </div>
              <p class="goal-description">{{ goal.description }}</p>
              <div class="goal-progress">
                <div class="progress-bar">
                  <div class="progress-fill" [style.width.%]="goal.progress"></div>
                </div>
                <span class="progress-text">{{ goal.progress }}%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Recommended Courses -->
        <div class="dashboard-card">
          <div class="card-header">
            <h2>Recommended for You</h2>
            <button class="btn-link" routerLink="/courses">View All</button>
          </div>
          <div class="recommended-courses">
            <div class="course-card" *ngFor="let course of recommendedCourses">
              <div class="course-image">
                <img [src]="course.thumbnail" [alt]="course.title">
                <div class="course-overlay">
                  <button class="btn-play" routerLink="/courses/{{ course.id }}">▶️</button>
                </div>
                <div class="course-badge" *ngIf="course.isNew">NEW</div>
              </div>
              <div class="course-content">
                <h4>{{ course.title }}</h4>
                <p class="course-instructor">{{ course.instructor }}</p>
                <div class="course-meta">
                  <span class="course-rating">⭐ {{ course.rating }}</span>
                  <span class="course-duration">⏱️ {{ course.duration }}h</span>
                  <span class="course-level" [class]="course.level">{{ course.level }}</span>
                </div>
                <div class="course-actions">
                  <button class="btn-enroll" routerLink="/courses/{{ course.id }}">Enroll Now</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Achievements -->
        <div class="dashboard-card">
          <div class="card-header">
            <h2>Recent Achievements</h2>
            <button class="btn-link" routerLink="/profile">View All</button>
          </div>
          <div class="achievements-list">
            <div class="achievement-item" *ngFor="let achievement of recentAchievements">
              <div class="achievement-icon">{{ achievement.icon }}</div>
              <div class="achievement-content">
                <h4>{{ achievement.name }}</h4>
                <p>{{ achievement.description }}</p>
                <span class="achievement-date">{{ achievement.earnedAt | date }}</span>
              </div>
              <div class="achievement-points">+{{ achievement.points }}pts</div>
            </div>
          </div>
        </div>

        <!-- Learning Streak -->
        <div class="dashboard-card">
          <div class="card-header">
            <h2>Learning Streak</h2>
            <span class="streak-count">{{ stats.learningStreak }} days</span>
          </div>
          <div class="streak-calendar">
            <div class="calendar-grid">
              <div 
                class="calendar-day" 
                *ngFor="let day of streakCalendar"
                [class.active]="day.active"
                [class.today]="day.today"
              >
                {{ day.date }}
              </div>
            </div>
            <div class="streak-motivation">
              <p>Keep up the great work! You're on fire! 🔥</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .hero-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 3rem;
      border-radius: 20px;
      margin-bottom: 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      overflow: hidden;
    }

    .hero-section::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
      opacity: 0.3;
    }

    .hero-content {
      position: relative;
      z-index: 1;
      flex: 1;
    }

    .welcome-message h1 {
      margin: 0 0 0.5rem 0;
      font-size: 2.5rem;
      font-weight: 700;
    }

    .hero-subtitle {
      margin: 0 0 2rem 0;
      opacity: 0.9;
      font-size: 1.1rem;
    }

    .hero-stats {
      display: flex;
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .hero-stat {
      text-align: center;
    }

    .hero-stat .stat-number {
      display: block;
      font-size: 2rem;
      font-weight: 700;
    }

    .hero-stat .stat-label {
      font-size: 0.9rem;
      opacity: 0.8;
    }

    .hero-actions {
      display: flex;
      gap: 1rem;
    }

    .btn-primary, .btn-secondary {
      padding: 1rem 2rem;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.3s ease;
      font-size: 1rem;
    }

    .btn-primary {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .btn-primary:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: translateY(-2px);
    }

    .btn-secondary {
      background: transparent;
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateY(-2px);
    }

    .hero-visual {
      position: relative;
      z-index: 1;
    }

    .achievement-badge {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 16px;
      padding: 1.5rem;
      text-align: center;
      backdrop-filter: blur(10px);
    }

    .badge-icon {
      font-size: 3rem;
      display: block;
      margin-bottom: 1rem;
    }

    .badge-content h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1.2rem;
    }

    .badge-content p {
      margin: 0;
      opacity: 0.8;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      padding: 2rem;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      gap: 1.5rem;
      transition: all 0.3s ease;
      border-left: 4px solid;
    }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
    }

    .stat-card.primary { border-left-color: #667eea; }
    .stat-card.success { border-left-color: #28a745; }
    .stat-card.warning { border-left-color: #ffc107; }
    .stat-card.info { border-left-color: #17a2b8; }

    .stat-icon {
      font-size: 2.5rem;
      width: 80px;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 16px;
      color: white;
    }

    .stat-card.primary .stat-icon { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
    .stat-card.success .stat-icon { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); }
    .stat-card.warning .stat-icon { background: linear-gradient(135deg, #ffc107 0%, #fd7e14 100%); }
    .stat-card.info .stat-icon { background: linear-gradient(135deg, #17a2b8 0%, #6f42c1 100%); }

    .stat-content h3 {
      margin: 0 0 0.5rem 0;
      font-size: 2rem;
      font-weight: 700;
      color: #333;
    }

    .stat-content p {
      margin: 0 0 1rem 0;
      color: #666;
      font-size: 0.9rem;
    }

    .stat-progress {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .progress-bar {
      flex: 1;
      height: 8px;
      background: #f0f0f0;
      border-radius: 4px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      border-radius: 4px;
      transition: width 0.3s ease;
    }

    .stat-card.primary .progress-fill { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
    .stat-card.success .progress-fill { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); }
    .stat-card.warning .progress-fill { background: linear-gradient(135deg, #ffc107 0%, #fd7e14 100%); }
    .stat-card.info .progress-fill { background: linear-gradient(135deg, #17a2b8 0%, #6f42c1 100%); }

    .progress-text {
      font-size: 0.85rem;
      color: #666;
      font-weight: 600;
      min-width: 40px;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 1.5rem;
    }

    .dashboard-card {
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      transition: all 0.3s ease;
    }

    .dashboard-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
    }

    .card-header {
      padding: 1.5rem;
      border-bottom: 1px solid #eee;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .card-header h2 {
      margin: 0;
      font-size: 1.25rem;
      color: #333;
      font-weight: 600;
    }

    .btn-link {
      background: none;
      border: none;
      color: #667eea;
      cursor: pointer;
      font-weight: 600;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      transition: all 0.3s ease;
    }

    .btn-link:hover {
      background: rgba(102, 126, 234, 0.1);
      text-decoration: none;
    }

    .activity-list, .courses-list, .goals-list, .recommended-courses, .achievements-list {
      padding: 1.5rem;
    }

    .activity-item, .course-item, .goal-item, .achievement-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 0;
      border-bottom: 1px solid #f5f5f5;
    }

    .activity-item:last-child, .course-item:last-child, .goal-item:last-child, .achievement-item:last-child {
      border-bottom: none;
    }

    .activity-icon {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
    }

    .activity-icon.completed { background: #e8f5e8; color: #28a745; }
    .activity-icon.enrolled { background: #e3f2fd; color: #2196f3; }
    .activity-icon.achievement { background: #fff3e0; color: #ff9800; }

    .activity-content {
      flex: 1;
    }

    .activity-text {
      margin: 0 0 0.25rem 0;
      color: #333;
      font-weight: 500;
    }

    .activity-time {
      color: #666;
      font-size: 0.85rem;
    }

    .activity-badge {
      background: #667eea;
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .course-thumbnail {
      position: relative;
      width: 80px;
      height: 60px;
      border-radius: 8px;
      overflow: hidden;
    }

    .course-thumbnail img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .course-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .course-thumbnail:hover .course-overlay {
      opacity: 1;
    }

    .btn-play {
      background: white;
      border: none;
      border-radius: 50%;
      width: 30px;
      height: 30px;
      cursor: pointer;
      font-size: 0.8rem;
    }

    .course-info {
      flex: 1;
    }

    .course-info h4 {
      margin: 0 0 0.25rem 0;
      color: #333;
      font-weight: 600;
    }

    .course-instructor {
      margin: 0 0 0.5rem 0;
      color: #666;
      font-size: 0.9rem;
    }

    .course-meta {
      display: flex;
      gap: 1rem;
      font-size: 0.75rem;
      color: #888;
    }

    .course-progress {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .goal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .goal-header h4 {
      margin: 0;
      color: #333;
      font-weight: 600;
    }

    .goal-deadline {
      font-size: 0.8rem;
      color: #666;
      background: #f8f9fa;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
    }

    .goal-description {
      margin: 0 0 1rem 0;
      color: #666;
      font-size: 0.9rem;
    }

    .goal-progress {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .recommended-courses {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
    }

    .course-card {
      border: 1px solid #eee;
      border-radius: 12px;
      overflow: hidden;
      transition: transform 0.2s ease;
    }

    .course-card:hover {
      transform: translateY(-4px);
    }

    .course-image {
      position: relative;
      height: 150px;
      overflow: hidden;
    }

    .course-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .course-badge {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      background: #ff6b6b;
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .course-content {
      padding: 1rem;
    }

    .course-content h4 {
      margin: 0 0 0.5rem 0;
      font-size: 1rem;
      color: #333;
    }

    .course-level {
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-weight: 600;
    }

    .course-level.beginner { background: #e8f5e8; color: #28a745; }
    .course-level.intermediate { background: #fff3e0; color: #ff9800; }
    .course-level.advanced { background: #ffe6e6; color: #dc3545; }

    .course-actions {
      margin-top: 1rem;
    }

    .btn-enroll {
      width: 100%;
      padding: 0.75rem;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s ease;
    }

    .btn-enroll:hover {
      background: #5a6fd8;
    }

    .achievement-icon {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      color: white;
    }

    .achievement-content h4 {
      margin: 0 0 0.25rem 0;
      color: #333;
      font-weight: 600;
    }

    .achievement-content p {
      margin: 0 0 0.25rem 0;
      color: #666;
      font-size: 0.9rem;
    }

    .achievement-date {
      font-size: 0.8rem;
      color: #999;
    }

    .achievement-points {
      background: #28a745;
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .streak-count {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-weight: 600;
    }

    .streak-calendar {
      padding: 1.5rem;
    }

    .calendar-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .calendar-day {
      aspect-ratio: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      font-size: 0.8rem;
      font-weight: 600;
      background: #f5f5f5;
      color: #666;
      transition: all 0.3s ease;
    }

    .calendar-day.active {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .calendar-day.today {
      border: 2px solid #667eea;
      background: #667eea;
      color: white;
    }

    .streak-motivation {
      text-align: center;
      color: #666;
      font-style: italic;
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: 1rem;
      }

      .hero-section {
        flex-direction: column;
        text-align: center;
        padding: 2rem;
      }

      .hero-stats {
        justify-content: center;
      }

      .hero-actions {
        justify-content: center;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .dashboard-grid {
        grid-template-columns: 1fr;
      }

      .recommended-courses {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  currentUser: any;
  stats = {
    enrolledCourses: 12,
    completedCourses: 8,
    totalPoints: 2450,
    learningStreak: 15
  };
  recentActivities = [
    {
      type: 'completed',
      icon: '✅',
      text: 'Completed "Advanced JavaScript" course',
      time: '2 hours ago',
      badge: 'NEW'
    },
    {
      type: 'enrolled',
      icon: '📚',
      text: 'Enrolled in "React Fundamentals"',
      time: '1 day ago'
    },
    {
      type: 'achievement',
      icon: '🏆',
      text: 'Earned "Quick Learner" badge',
      time: '3 days ago',
      badge: '+50pts'
    }
  ];
  currentCourses = [
    {
      id: 1,
      title: 'React Fundamentals',
      instructor: 'John Doe',
      progress: 65,
      thumbnail: '/assets/images/programming-react.svg',
      duration: 6,
      lessons: 24
    },
    {
      id: 2,
      title: 'Node.js Backend',
      instructor: 'Jane Smith',
      progress: 30,
      thumbnail: '/assets/images/programming-node.svg',
      duration: 8,
      lessons: 32
    },
    {
      id: 3,
      title: 'JavaScript Mastery',
      instructor: 'Mike Johnson',
      progress: 85,
      thumbnail: '/assets/images/programming-js.svg',
      duration: 4,
      lessons: 16
    }
  ];
  learningGoals = [
    {
      title: 'Complete 5 courses this month',
      description: 'Focus on web development and design principles',
      progress: 60,
      deadline: 'Dec 31, 2024'
    },
    {
      title: 'Earn 1000 points',
      description: 'Stay active and engaged with learning activities',
      progress: 75,
      deadline: 'Ongoing'
    }
  ];
  recommendedCourses = [
    {
      id: 4,
      title: 'Vue.js Mastery',
      instructor: 'Sarah Wilson',
      thumbnail: '/assets/images/programming-react.svg',
      rating: 4.8,
      duration: 6,
      level: 'intermediate',
      isNew: true
    },
    {
      id: 5,
      title: 'Python for Data Science',
      instructor: 'David Brown',
      thumbnail: '/assets/images/programming-python.svg',
      rating: 4.9,
      duration: 8,
      level: 'advanced'
    }
  ];
  recentAchievements = [
    {
      icon: '🎯',
      name: 'Goal Setter',
      description: 'Set your first learning goal',
      earnedAt: new Date('2024-01-15'),
      points: 25
    },
    {
      icon: '🔥',
      name: 'Streak Master',
      description: 'Maintained 10-day learning streak',
      earnedAt: new Date('2024-01-10'),
      points: 50
    }
  ];
  streakCalendar = Array.from({ length: 30 }, (_, i) => ({
    date: i + 1,
    active: i < 15,
    today: i === 14
  }));

  constructor(
    private courseService: CourseService,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.userService.getUserLearningStats().subscribe({
      next: (stats) => {
        this.stats = {
          enrolledCourses: stats.totalCoursesEnrolled,
          completedCourses: stats.totalCoursesCompleted,
          totalPoints: stats.totalPoints,
          learningStreak: stats.learningStreak
        };
      },
      error: (error) => {
        console.error('Error loading user stats:', error);
      }
    });

    this.courseService.getEnrolledCourses().subscribe({
      next: (courses) => {
        this.currentCourses = courses.map((course: any) => ({
          id: course.id,
          title: course.title,
          instructor: `${course.instructor.firstName} ${course.instructor.lastName}`,
          progress: course.progress,
          thumbnail: course.thumbnail || '/assets/images/placeholder-80x60.svg',
          duration: course.duration,
          lessons: course.lessons?.length || 0
        }));
      },
      error: (error) => {
        console.error('Error loading enrolled courses:', error);
      }
    });
  }

  getEnrollmentProgress(): number {
    return Math.round((this.stats.enrolledCourses / 20) * 100);
  }

  getCompletionRate(): number {
    return this.stats.enrolledCourses > 0 
      ? Math.round((this.stats.completedCourses / this.stats.enrolledCourses) * 100)
      : 0;
  }

  getPointsProgress(): number {
    return Math.round((this.stats.totalPoints / 5000) * 100);
  }

  getStreakProgress(): number {
    return Math.round((this.stats.learningStreak / 30) * 100);
  }
} 