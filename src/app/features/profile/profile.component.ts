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
      <div class="profile-header">
        <h1>Profile</h1>
        <p>Welcome, {{ userProfile?.user?.firstName || 'User' }}!</p>
      </div>
      
      <div class="profile-content">
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
        </div>
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
      text-align: center;
      margin-bottom: 2rem;
    }

    .profile-header h1 {
      color: #333;
      margin-bottom: 0.5rem;
    }

    .profile-content {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .profile-stats {
      display: flex;
      justify-content: space-around;
      gap: 2rem;
    }

    .stat {
      text-align: center;
    }

    .stat-number {
      display: block;
      font-size: 2rem;
      font-weight: bold;
      color: #667eea;
    }

    .stat-label {
      color: #666;
      font-size: 0.9rem;
    }
  `]
})
export class ProfileComponent implements OnInit {
  userProfile: UserProfile | null = null;

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.userService.getCurrentUserProfile().subscribe({
      next: (profile) => {
        this.userProfile = profile;
      },
      error: (error) => {
        console.error('Error loading user profile:', error);
      }
    });
  }
}