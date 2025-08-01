import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { User, UserProfile, Achievement } from '../../core/models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="profile-container">
      <!-- Profile Header -->
      <div class="profile-header">
        <div class="profile-cover">
          <div class="cover-overlay"></div>
        </div>
        <div class="profile-info">
          <div class="profile-avatar">
            <img [src]="userProfile?.user?.avatar || 'https://via.placeholder.com/150x150'">
            <button class="avatar-edit" (click)="editAvatar()">
              <span>📷</span>
            </button>
          </div>
          <div class="profile-details">
            <h1>{{ userProfile?.user?.firstName }} {{ userProfile?.user?.lastName }}</h1>
            <p class="username">@{{ userProfile?.user?.username }}</p>
            <p class="bio">{{ userProfile?.user?.bio || 'No bio added yet.' }}</p>
            <div class="profile-stats">
              <div class="stat">
                <span class="stat-number">{{ userProfile?.enrolledCourses || 0 }}</span>
                <span class="stat-label">Courses</span>
              </div>
              <div class="stat">
                <span class="stat-number">{{ userProfile?.completedCourses || 0 }}</span>
                <span class="stat-label">Completed</span>
              </div>
              <div class="stat">
                <span class="stat-number">{{ userProfile?.totalPoints || 0 }}</span>
                <span class="stat-label">Points</span>
              </div>
              <div class="stat">
                <span class="stat-number">{{ userProfile?.achievements?.length || 0 }}</span>
                <span class="stat-label">Achievements</span>
              </div>
            </div>
          </div>
          <div class="profile-actions">
            <button class="btn-primary" (click)="editProfile()">
              <span>✏️</span>
              Edit Profile
            </button>
            <button class="btn-secondary" routerLink="/settings">
              <span>⚙️</span>
              Settings
            </button>
          </div>
        </div>
      </div>

      <!-- Profile Navigation -->
      <div class="profile-nav">
        <button 
          class="nav-tab" 
          [class.active]="activeTab === 'overview'"
          (click)="setActiveTab('overview')"
        >
          Overview
        </button>
        <button 
          class="nav-tab" 
          [class.active]="activeTab === 'courses'"
          (click)="setActiveTab('courses')"
        >
          My Courses
        </button>
        <button 
          class="nav-tab" 
          [class.active]="activeTab === 'achievements'"
          (click)="setActiveTab('achievements')"
        >
          Achievements
        </button>
        <button 
          class="nav-tab" 
          [class.active]="activeTab === 'certificates'"
          (click)="setActiveTab('certificates')"
        >
          Certificates
        </button>
        <button 
          class="nav-tab" 
          [class.active]="activeTab === 'activity'"
          (click)="setActiveTab('activity')"
        >
          Activity
        </button>
      </div>

      <!-- Tab Content -->
      <div class="tab-content">
        <!-- Overview Tab -->
        <div *ngIf="activeTab === 'overview'" class="overview-tab">
          <div class="overview-grid">
            <!-- Learning Progress -->
            <div class="overview-card">
              <h3>Learning Progress</h3>
              <div class="progress-chart">
                <div class="progress-item">
                  <div class="progress-label">
                    <span>Courses in Progress</span>
                    <span>{{ learningStats.coursesInProgress }}</span>
                  </div>
                  <div class="progress-bar">
                    <div class="progress-fill" [style.width.%]="learningStats.progressPercentage"></div>
                  </div>
                </div>
                <div class="progress-item">
                  <div class="progress-label">
                    <span>Average Score</span>
                    <span>{{ learningStats.averageScore }}%</span>
                  </div>
                  <div class="progress-bar">
                    <div class="progress-fill" [style.width.%]="learningStats.averageScore"></div>
                  </div>
                </div>
                <div class="progress-item">
                  <div class="progress-label">
                    <span>Learning Streak</span>
                    <span>{{ learningStats.learningStreak }} days</span>
                  </div>
                  <div class="progress-bar">
                    <div class="progress-fill" [style.width.%]="Math.min(learningStats.learningStreak * 10, 100)"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Recent Achievements -->
            <div class="overview-card">
              <h3>Recent Achievements</h3>
              <div class="achievements-list">
                <div class="achievement-item" *ngFor="let achievement of recentAchievements">
                  <div class="achievement-icon">{{ achievement.icon }}</div>
                  <div class="achievement-content">
                    <h4>{{ achievement.name }}</h4>
                    <p>{{ achievement.description }}</p>
                    <span class="achievement-date">{{ achievement.earnedAt | date }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Learning Goals -->
            <div class="overview-card">
              <h3>Learning Goals</h3>
              <div class="goals-list">
                <div class="goal-item" *ngFor="let goal of learningGoals">
                  <div class="goal-header">
                    <h4>{{ goal.title }}</h4>
                    <span class="goal-deadline">{{ goal.deadline }}</span>
                  </div>
                  <div class="goal-progress">
                    <div class="progress-bar">
                      <div class="progress-fill" [style.width.%]="goal.progress"></div>
                    </div>
                    <span class="progress-text">{{ goal.progress }}%</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Certificates -->
            <div class="overview-card">
              <h3>Recent Certificates</h3>
              <div class="certificates-list">
                <div class="certificate-item" *ngFor="let certificate of recentCertificates">
                  <div class="certificate-icon">🏆</div>
                  <div class="certificate-content">
                    <h4>{{ certificate.courseName }}</h4>
                    <p>Completed on {{ certificate.issuedAt | date }}</p>
                    <span class="certificate-grade">Grade: {{ certificate.grade }}</span>
                  </div>
                  <button class="btn-download">📥</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Courses Tab -->
        <div *ngIf="activeTab === 'courses'" class="courses-tab">
          <div class="courses-header">
            <h3>My Courses</h3>
            <div class="courses-filter">
              <select [(ngModel)]="courseFilter" (change)="filterCourses()">
                <option value="all">All Courses</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="enrolled">Enrolled</option>
              </select>
            </div>
          </div>
          <div class="courses-grid">
            <div class="course-item" *ngFor="let course of filteredCourses">
              <div class="course-thumbnail">
                <img [src]="course.thumbnail" [alt]="course.title">
                <div class="course-progress-overlay">
                  <div class="progress-circle">
                    <span>{{ course.progress }}%</span>
                  </div>
                </div>
              </div>
              <div class="course-content">
                <h4>{{ course.title }}</h4>
                <p>{{ course.instructor }}</p>
                <div class="course-meta">
                  <span>⏱️ {{ course.duration }} min</span>
                  <span>📅 {{ course.lastAccessed }}</span>
                </div>
                <div class="course-actions">
                  <button class="btn-continue" [routerLink]="['/courses', course.id]">
                    Continue
                  </button>
                  <button class="btn-view" [routerLink]="['/courses', course.id]">
                    View Course
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Achievements Tab -->
        <div *ngIf="activeTab === 'achievements'" class="achievements-tab">
          <div class="achievements-header">
            <h3>Achievements</h3>
            <div class="achievements-stats">
              <span>{{ achievements.length }} earned</span>
            </div>
          </div>
          <div class="achievements-grid">
            <div class="achievement-card" *ngFor="let achievement of achievements">
              <div class="achievement-icon">{{ achievement.icon }}</div>
              <div class="achievement-content">
                <h4>{{ achievement.name }}</h4>
                <p>{{ achievement.description }}</p>
                <span class="achievement-date">Earned {{ achievement.earnedAt | date }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Certificates Tab -->
        <div *ngIf="activeTab === 'certificates'" class="certificates-tab">
          <div class="certificates-header">
            <h3>Certificates</h3>
            <div class="certificates-stats">
              <span>{{ certificates.length }} earned</span>
            </div>
          </div>
          <div class="certificates-grid">
            <div class="certificate-card" *ngFor="let certificate of certificates">
              <div class="certificate-preview">
                <div class="certificate-icon">🏆</div>
                <h4>{{ certificate.courseName }}</h4>
                <p>Issued on {{ certificate.issuedAt | date }}</p>
                <span class="certificate-grade">Grade: {{ certificate.grade }}</span>
              </div>
              <div class="certificate-actions">
                <button class="btn-download">Download PDF</button>
                <button class="btn-share">Share</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Activity Tab -->
        <div *ngIf="activeTab === 'activity'" class="activity-tab">
          <div class="activity-header">
            <h3>Learning Activity</h3>
            <div class="activity-filter">
              <select [(ngModel)]="activityFilter" (change)="filterActivity()">
                <option value="all">All Activity</option>
                <option value="courses">Course Activity</option>
                <option value="achievements">Achievements</option>
                <option value="certificates">Certificates</option>
              </select>
            </div>
          </div>
          <div class="activity-timeline">
            <div class="activity-item" *ngFor="let activity of filteredActivity">
              <div class="activity-icon" [class]="activity.type">
                {{ activity.icon }}
              </div>
              <div class="activity-content">
                <h4>{{ activity.title }}</h4>
                <p>{{ activity.description }}</p>
                <span class="activity-time">{{ activity.timestamp | date:'medium' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Profile Modal -->
    <div class="modal" *ngIf="showEditModal" (click)="closeEditModal()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>Edit Profile</h3>
          <button class="modal-close" (click)="closeEditModal()">×</button>
        </div>
        <form [formGroup]="editForm" (ngSubmit)="saveProfile()" class="edit-form">
          <div class="form-group">
            <label>First Name</label>
            <input type="text" formControlName="firstName">
          </div>
          <div class="form-group">
            <label>Last Name</label>
            <input type="text" formControlName="lastName">
          </div>
          <div class="form-group">
            <label>Username</label>
            <input type="text" formControlName="username">
          </div>
          <div class="form-group">
            <label>Bio</label>
            <textarea formControlName="bio" rows="3"></textarea>
          </div>
          <div class="form-actions">
            <button type="button" class="btn-secondary" (click)="closeEditModal()">Cancel</button>
            <button type="submit" class="btn-primary" [disabled]="editForm.invalid">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .profile-header {
      position: relative;
      margin-bottom: 2rem;
      border-radius: 12px;
      overflow: hidden;
      background: white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .profile-cover {
      height: 200px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      position: relative;
    }

    .cover-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.3);
    }

    .profile-info {
      padding: 2rem;
      display: flex;
      align-items: flex-end;
      gap: 2rem;
    }

    .profile-avatar {
      position: relative;
      margin-top: -60px;
    }

    .profile-avatar img {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      border: 4px solid white;
      object-fit: cover;
    }

    .avatar-edit {
      position: absolute;
      bottom: 0;
      right: 0;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      cursor: pointer;
      font-size: 1.2rem;
    }

    .profile-details {
      flex: 1;
    }

    .profile-details h1 {
      margin: 0 0 0.5rem 0;
      color: #333;
      font-size: 2rem;
    }

    .username {
      color: #666;
      font-size: 1.1rem;
      margin: 0 0 1rem 0;
    }

    .bio {
      color: #666;
      line-height: 1.5;
      margin: 0 0 1.5rem 0;
    }

    .profile-stats {
      display: flex;
      gap: 2rem;
    }

    .stat {
      text-align: center;
    }

    .stat-number {
      display: block;
      font-size: 1.5rem;
      font-weight: bold;
      color: #667eea;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #666;
    }

    .profile-actions {
      display: flex;
      gap: 1rem;
    }

    .btn-primary, .btn-secondary {
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      border: none;
      font-weight: 500;
      cursor: pointer;
      transition: transform 0.2s;
      display: flex;
      align-items: center;
      gap: 0.5rem;
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

    .btn-primary:hover, .btn-secondary:hover {
      transform: translateY(-2px);
    }

    .profile-nav {
      display: flex;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
      overflow: hidden;
    }

    .nav-tab {
      flex: 1;
      padding: 1rem 1.5rem;
      background: none;
      border: none;
      cursor: pointer;
      font-weight: 500;
      color: #666;
      transition: all 0.2s;
    }

    .nav-tab.active {
      background: #667eea;
      color: white;
    }

    .nav-tab:hover:not(.active) {
      background: #f8f9fa;
    }

    .tab-content {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      padding: 2rem;
    }

    .overview-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }

    .overview-card {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 8px;
    }

    .overview-card h3 {
      margin: 0 0 1rem 0;
      color: #333;
    }

    .progress-chart {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .progress-item {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .progress-label {
      display: flex;
      justify-content: space-between;
      font-size: 0.875rem;
      color: #666;
    }

    .progress-bar {
      height: 8px;
      background: #e1e5e9;
      border-radius: 4px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      transition: width 0.3s;
    }

    .achievements-list, .goals-list, .certificates-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .achievement-item, .goal-item, .certificate-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: white;
      border-radius: 8px;
    }

    .achievement-icon {
      width: 50px;
      height: 50px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      color: white;
    }

    .achievement-content h4, .goal-item h4, .certificate-item h4 {
      margin: 0 0 0.25rem 0;
      color: #333;
    }

    .achievement-content p, .goal-item p, .certificate-item p {
      margin: 0 0 0.25rem 0;
      color: #666;
      font-size: 0.875rem;
    }

    .achievement-date, .goal-deadline {
      font-size: 0.75rem;
      color: #888;
    }

    .goal-progress {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-top: 0.5rem;
    }

    .progress-text {
      font-size: 0.875rem;
      color: #666;
      min-width: 40px;
    }

    .courses-header, .achievements-header, .certificates-header, .activity-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .courses-grid, .achievements-grid, .certificates-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .course-item {
      display: flex;
      gap: 1rem;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 8px;
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

    .course-progress-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.7);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .progress-circle {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #27ae60;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: bold;
    }

    .course-content {
      flex: 1;
    }

    .course-content h4 {
      margin: 0 0 0.25rem 0;
      color: #333;
    }

    .course-content p {
      margin: 0 0 0.5rem 0;
      color: #666;
      font-size: 0.875rem;
    }

    .course-meta {
      display: flex;
      gap: 1rem;
      font-size: 0.75rem;
      color: #888;
      margin-bottom: 0.5rem;
    }

    .course-actions {
      display: flex;
      gap: 0.5rem;
    }

    .btn-continue, .btn-view {
      padding: 0.5rem 1rem;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      font-size: 0.875rem;
      transition: background 0.2s;
    }

    .btn-continue {
      background: #667eea;
      color: white;
    }

    .btn-view {
      background: transparent;
      color: #667eea;
      border: 1px solid #667eea;
    }

    .achievement-card, .certificate-card {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 8px;
      text-align: center;
    }

    .certificate-preview {
      margin-bottom: 1rem;
    }

    .certificate-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .certificate-grade {
      display: block;
      font-weight: bold;
      color: #27ae60;
      margin-top: 0.5rem;
    }

    .certificate-actions {
      display: flex;
      gap: 0.5rem;
    }

    .btn-download, .btn-share {
      flex: 1;
      padding: 0.75rem;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      font-size: 0.875rem;
      transition: background 0.2s;
    }

    .btn-download {
      background: #27ae60;
      color: white;
    }

    .btn-share {
      background: #667eea;
      color: white;
    }

    .activity-timeline {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .activity-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .activity-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
    }

    .activity-icon.course { background: #cce5ff; }
    .activity-icon.achievement { background: #fff3cd; }
    .activity-icon.certificate { background: #d4edda; }

    .activity-content h4 {
      margin: 0 0 0.25rem 0;
      color: #333;
    }

    .activity-content p {
      margin: 0 0 0.25rem 0;
      color: #666;
      font-size: 0.875rem;
    }

    .activity-time {
      font-size: 0.75rem;
      color: #888;
    }

    .modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      width: 90%;
      max-width: 500px;
      max-height: 90vh;
      overflow-y: auto;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .modal-close {
      background: none;
      border: none;
      font-size: 2rem;
      cursor: pointer;
      color: #666;
    }

    .edit-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-group label {
      font-weight: 500;
      color: #333;
    }

    .form-group input, .form-group textarea {
      padding: 0.75rem;
      border: 2px solid #e1e5e9;
      border-radius: 6px;
      font-size: 1rem;
    }

    .form-group input:focus, .form-group textarea:focus {
      outline: none;
      border-color: #667eea;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
    }

    @media (max-width: 768px) {
      .profile-container {
        padding: 1rem;
      }

      .profile-info {
        flex-direction: column;
        text-align: center;
      }

      .profile-stats {
        justify-content: center;
      }

      .profile-actions {
        justify-content: center;
      }

      .profile-nav {
        flex-wrap: wrap;
      }

      .nav-tab {
        flex: none;
        min-width: 120px;
      }

      .overview-grid {
        grid-template-columns: 1fr;
      }

      .courses-grid, .achievements-grid, .certificates-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ProfileComponent implements OnInit {
  activeTab = 'overview';
  userProfile: UserProfile | null = null;
  learningStats = {
    coursesInProgress: 3,
    progressPercentage: 65,
    averageScore: 85,
    learningStreak: 7
  };
  recentAchievements: Achievement[] = [];
  learningGoals = [
    { title: 'Complete 5 courses this month', deadline: 'Dec 31, 2024', progress: 60 },
    { title: 'Achieve 90% average score', deadline: 'Ongoing', progress: 85 }
  ];
  recentCertificates = [
    { courseName: 'Angular Fundamentals', issuedAt: new Date(), grade: 'A' },
    { courseName: 'TypeScript Mastery', issuedAt: new Date(), grade: 'A+' }
  ];
  filteredCourses: any[] = [];
  achievements: Achievement[] = [];
  certificates: any[] = [];
  filteredActivity: any[] = [];
  courseFilter = 'all';
  activityFilter = 'all';
  showEditModal = false;
  editForm: FormGroup;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.editForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      bio: ['']
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
    this.loadUserData();
  }

  loadUserProfile(): void {
    this.userService.getCurrentUserProfile().subscribe({
      next: (profile) => {
        this.userProfile = profile;
        this.editForm.patchValue({
          firstName: profile.user.firstName,
          lastName: profile.user.lastName,
          username: profile.user.username,
          bio: profile.user.bio || ''
        });
      },
      error: (error) => {
        console.error('Error loading user profile:', error);
      }
    });
  }

  loadUserData(): void {
    // Load achievements
    this.userService.getUserAchievements().subscribe({
      next: (achievements) => {
        this.achievements = achievements;
        this.recentAchievements = achievements.slice(0, 3);
      }
    });

    // Load certificates
    this.userService.getUserCertificates().subscribe({
      next: (certificates) => {
        this.certificates = certificates;
      }
    });

    // Load activity history
    this.userService.getUserActivityHistory().subscribe({
      next: (activity) => {
        this.filteredActivity = activity;
      }
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  filterCourses(): void {
    // Implement course filtering logic
  }

  filterActivity(): void {
    // Implement activity filtering logic
  }

  editProfile(): void {
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
  }

  saveProfile(): void {
    if (this.editForm.valid) {
      const profileData = this.editForm.value;
      this.userService.updateProfile(profileData).subscribe({
        next: (user) => {
          this.userProfile = { ...this.userProfile!, user };
          this.closeEditModal();
        },
        error: (error) => {
          console.error('Error updating profile:', error);
        }
      });
    }
  }

  editAvatar(): void {
    // Implement avatar upload logic
  }
}