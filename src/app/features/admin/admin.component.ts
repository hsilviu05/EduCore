import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { CourseService } from '../../core/services/course.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="admin-container">
      <!-- Admin Header -->
      <div class="admin-header">
        <div class="header-content">
          <h1>Admin Dashboard</h1>
          <p>Manage your eLearning platform</p>
        </div>
        <div class="header-actions">
          <button class="btn-primary">
            <span>📊</span>
            Generate Report
          </button>
        </div>
      </div>

      <!-- Admin Stats -->
      <div class="admin-stats">
        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-content">
            <h3>{{ stats.totalUsers }}</h3>
            <p>Total Users</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📚</div>
          <div class="stat-content">
            <h3>{{ stats.totalCourses }}</h3>
            <p>Total Courses</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">💰</div>
          <div class="stat-content">
            <h3>{{ stats.totalRevenue }}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📈</div>
          <div class="stat-content">
            <h3>{{ stats.activeUsers }}</h3>
            <p>Active Users</p>
          </div>
        </div>
      </div>

      <!-- Admin Tabs -->
      <div class="admin-tabs">
        <button 
          class="tab-btn" 
          [class.active]="activeTab === 'dashboard'"
          (click)="setActiveTab('dashboard')"
        >
          📊 Dashboard
        </button>
        <button 
          class="tab-btn" 
          [class.active]="activeTab === 'users'"
          (click)="setActiveTab('users')"
        >
          👥 Users
        </button>
        <button 
          class="tab-btn" 
          [class.active]="activeTab === 'courses'"
          (click)="setActiveTab('courses')"
        >
          📚 Courses
        </button>
        <button 
          class="tab-btn" 
          [class.active]="activeTab === 'analytics'"
          (click)="setActiveTab('analytics')"
        >
          📈 Analytics
        </button>
        <button 
          class="tab-btn" 
          [class.active]="activeTab === 'settings'"
          (click)="setActiveTab('settings')"
        >
          ⚙️ Settings
        </button>
      </div>

      <!-- Tab Content -->
      <div class="tab-content">
        <!-- Dashboard Tab -->
        <div *ngIf="activeTab === 'dashboard'" class="dashboard-tab">
          <div class="dashboard-grid">
            <div class="dashboard-card">
              <h3>Recent Activity</h3>
              <div class="activity-list">
                <div class="activity-item" *ngFor="let activity of recentActivities">
                  <div class="activity-icon">{{ activity.icon }}</div>
                  <div class="activity-content">
                    <p>{{ activity.text }}</p>
                    <span>{{ activity.time }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="dashboard-card">
              <h3>Quick Actions</h3>
              <div class="quick-actions">
                <button class="action-btn">Add User</button>
                <button class="action-btn">Create Course</button>
                <button class="action-btn">View Reports</button>
                <button class="action-btn">System Settings</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Users Tab -->
        <div *ngIf="activeTab === 'users'" class="users-tab">
          <div class="users-header">
            <div class="search-box">
              <input type="text" placeholder="Search users..." [(ngModel)]="userSearchQuery">
              <button class="search-btn">🔍</button>
            </div>
            <div class="filter-controls">
              <select [(ngModel)]="userFilter">
                <option value="">All Users</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="admin">Admin</option>
                <option value="instructor">Instructor</option>
                <option value="student">Student</option>
              </select>
            </div>
          </div>
          <div class="users-table">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let user of filteredUsers">
                  <td>
                    <div class="user-info">
                      <img [src]="user.avatar || 'https://via.placeholder.com/40x40'" [alt]="user.firstName">
                      <span>{{ user.firstName }} {{ user.lastName }}</span>
                    </div>
                  </td>
                  <td>{{ user.email }}</td>
                  <td>
                    <span class="role-badge" [class]="user.role">{{ user.role }}</span>
                  </td>
                  <td>
                    <span class="status-badge" [class]="user.isActive ? 'active' : 'inactive'">
                      {{ user.isActive ? 'Active' : 'Inactive' }}
                    </span>
                  </td>
                  <td>{{ user.createdAt | date }}</td>
                  <td>
                    <div class="action-buttons">
                      <button class="btn-edit">✏️</button>
                      <button class="btn-delete">🗑️</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Courses Tab -->
        <div *ngIf="activeTab === 'courses'" class="courses-tab">
          <div class="courses-header">
            <div class="search-box">
              <input type="text" placeholder="Search courses..." [(ngModel)]="courseSearchQuery">
              <button class="search-btn">🔍</button>
            </div>
            <div class="filter-controls">
              <select [(ngModel)]="courseFilter">
                <option value="">All Courses</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
          <div class="courses-grid">
            <div class="course-card" *ngFor="let course of filteredCourses">
              <div class="course-image">
                <img [src]="course.thumbnail" [alt]="course.title">
                <div class="course-status" [class]="course.isPublished ? 'published' : 'draft'">
                  {{ course.isPublished ? 'Published' : 'Draft' }}
                </div>
              </div>
              <div class="course-content">
                <h4>{{ course.title }}</h4>
                <p>{{ course.instructor.firstName }} {{ course.instructor.lastName }}</p>
                <div class="course-meta">
                  <span>👥 {{ course.enrolledStudents }}</span>
                  <span>⭐ {{ course.rating }}</span>
                  <span>💰 {{ course.price }}</span>
                </div>
                <div class="course-actions">
                  <button class="btn-edit">Edit</button>
                  <button class="btn-view">View</button>
                  <button class="btn-delete">Delete</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Analytics Tab -->
        <div *ngIf="activeTab === 'analytics'" class="analytics-tab">
          <div class="analytics-grid">
            <div class="analytics-card">
              <h3>User Growth</h3>
              <div class="chart-placeholder">
                📈 User Growth Chart
              </div>
            </div>
            <div class="analytics-card">
              <h3>Revenue Analytics</h3>
              <div class="chart-placeholder">
                💰 Revenue Chart
              </div>
            </div>
            <div class="analytics-card">
              <h3>Course Performance</h3>
              <div class="chart-placeholder">
                📊 Course Performance Chart
              </div>
            </div>
            <div class="analytics-card">
              <h3>Geographic Distribution</h3>
              <div class="chart-placeholder">
                🌍 Geographic Chart
              </div>
            </div>
          </div>
        </div>

        <!-- Settings Tab -->
        <div *ngIf="activeTab === 'settings'" class="settings-tab">
          <div class="settings-grid">
            <div class="settings-card">
              <h3>Platform Settings</h3>
              <div class="setting-item">
                <label>Platform Name</label>
                <input type="text" value="EduCore" [(ngModel)]="platformSettings.name">
              </div>
              <div class="setting-item">
                <label>Contact Email</label>
                <input type="email" value="admin@educore.com" [(ngModel)]="platformSettings.contactEmail">
              </div>
              <div class="setting-item">
                <label>Maintenance Mode</label>
                <input type="checkbox" [(ngModel)]="platformSettings.maintenanceMode">
              </div>
            </div>
            <div class="settings-card">
              <h3>Email Configuration</h3>
              <div class="setting-item">
                <label>SMTP Server</label>
                <input type="text" value="smtp.gmail.com" [(ngModel)]="emailSettings.smtpServer">
              </div>
              <div class="setting-item">
                <label>SMTP Port</label>
                <input type="number" value="587" [(ngModel)]="emailSettings.smtpPort">
              </div>
              <div class="setting-item">
                <label>Email Username</label>
                <input type="text" value="noreply@educore.com" [(ngModel)]="emailSettings.username">
              </div>
            </div>
            <div class="settings-card">
              <h3>Security Settings</h3>
              <div class="setting-item">
                <label>Session Timeout (minutes)</label>
                <input type="number" value="30" [(ngModel)]="securitySettings.sessionTimeout">
              </div>
              <div class="setting-item">
                <label>Password Policy</label>
                <select [(ngModel)]="securitySettings.passwordPolicy">
                  <option value="strong">Strong</option>
                  <option value="medium">Medium</option>
                  <option value="weak">Weak</option>
                </select>
              </div>
              <div class="setting-item">
                <label>Two-Factor Authentication</label>
                <input type="checkbox" [(ngModel)]="securitySettings.twoFactorAuth">
              </div>
            </div>
          </div>
          <div class="settings-actions">
            <button class="btn-save">Save Settings</button>
            <button class="btn-reset">Reset to Default</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .admin-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 2rem;
      border-radius: 12px;
      margin-bottom: 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header-content h1 {
      margin: 0 0 0.5rem 0;
      font-size: 2rem;
    }

    .header-content p {
      margin: 0;
      opacity: 0.9;
    }

    .btn-primary {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.3);
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .admin-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .stat-icon {
      font-size: 2rem;
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      color: white;
    }

    .stat-content h3 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 700;
      color: #333;
    }

    .stat-content p {
      margin: 0;
      color: #666;
      font-size: 0.9rem;
    }

    .admin-tabs {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 2rem;
      border-bottom: 1px solid #eee;
    }

    .tab-btn {
      padding: 1rem 1.5rem;
      border: none;
      background: none;
      cursor: pointer;
      font-weight: 600;
      color: #666;
      border-bottom: 3px solid transparent;
      transition: all 0.3s ease;
    }

    .tab-btn.active {
      color: #667eea;
      border-bottom-color: #667eea;
    }

    .tab-btn:hover {
      color: #667eea;
    }

    .tab-content {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 1.5rem;
      padding: 2rem;
    }

    .dashboard-card {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 8px;
    }

    .dashboard-card h3 {
      margin: 0 0 1rem 0;
      color: #333;
    }

    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .activity-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: white;
      border-radius: 8px;
    }

    .activity-icon {
      font-size: 1.5rem;
    }

    .activity-content p {
      margin: 0;
      font-weight: 600;
      color: #333;
    }

    .activity-content span {
      font-size: 0.85rem;
      color: #666;
    }

    .quick-actions {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
    }

    .action-btn {
      padding: 1rem;
      border: 1px solid #ddd;
      background: white;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s ease;
    }

    .action-btn:hover {
      background: #667eea;
      color: white;
      border-color: #667eea;
    }

    .users-header, .courses-header {
      padding: 2rem;
      border-bottom: 1px solid #eee;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .search-box {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .search-box input {
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 8px;
      width: 300px;
    }

    .search-btn {
      padding: 0.75rem;
      border: 1px solid #ddd;
      background: white;
      border-radius: 8px;
      cursor: pointer;
    }

    .filter-controls select {
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 8px;
      background: white;
    }

    .users-table {
      padding: 2rem;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th, td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid #eee;
    }

    th {
      font-weight: 600;
      color: #333;
      background: #f8f9fa;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-info img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
    }

    .role-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .role-badge.admin { background: #ffebee; color: #f44336; }
    .role-badge.instructor { background: #e3f2fd; color: #2196f3; }
    .role-badge.student { background: #e8f5e8; color: #4caf50; }

    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .status-badge.active { background: #e8f5e8; color: #4caf50; }
    .status-badge.inactive { background: #ffebee; color: #f44336; }

    .action-buttons {
      display: flex;
      gap: 0.5rem;
    }

    .btn-edit, .btn-delete, .btn-view {
      padding: 0.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9rem;
    }

    .btn-edit { background: #e3f2fd; color: #2196f3; }
    .btn-delete { background: #ffebee; color: #f44336; }
    .btn-view { background: #e8f5e8; color: #4caf50; }

    .courses-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
      padding: 2rem;
    }

    .course-card {
      border: 1px solid #eee;
      border-radius: 8px;
      overflow: hidden;
    }

    .course-image {
      position: relative;
      height: 150px;
    }

    .course-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .course-status {
      position: absolute;
      top: 1rem;
      right: 1rem;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .course-status.published { background: #e8f5e8; color: #4caf50; }
    .course-status.draft { background: #fff3e0; color: #ff9800; }

    .course-content {
      padding: 1rem;
    }

    .course-content h4 {
      margin: 0 0 0.5rem 0;
      color: #333;
    }

    .course-content p {
      margin: 0 0 1rem 0;
      color: #666;
      font-size: 0.9rem;
    }

    .course-meta {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
      font-size: 0.8rem;
      color: #999;
    }

    .course-actions {
      display: flex;
      gap: 0.5rem;
    }

    .analytics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 1.5rem;
      padding: 2rem;
    }

    .analytics-card {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 8px;
    }

    .analytics-card h3 {
      margin: 0 0 1rem 0;
      color: #333;
    }

    .chart-placeholder {
      height: 200px;
      background: white;
      border: 2px dashed #ddd;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #999;
      font-size: 1.2rem;
    }

    .settings-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 1.5rem;
      padding: 2rem;
    }

    .settings-card {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 8px;
    }

    .settings-card h3 {
      margin: 0 0 1.5rem 0;
      color: #333;
    }

    .setting-item {
      margin-bottom: 1rem;
    }

    .setting-item label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #333;
    }

    .setting-item input, .setting-item select {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 8px;
      background: white;
    }

    .settings-actions {
      padding: 2rem;
      border-top: 1px solid #eee;
      display: flex;
      gap: 1rem;
    }

    .btn-save, .btn-reset {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
    }

    .btn-save {
      background: #667eea;
      color: white;
    }

    .btn-reset {
      background: #f8f9fa;
      color: #666;
      border: 1px solid #ddd;
    }

    @media (max-width: 768px) {
      .admin-container {
        padding: 1rem;
      }

      .admin-header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }

      .admin-tabs {
        flex-wrap: wrap;
      }

      .users-header, .courses-header {
        flex-direction: column;
        gap: 1rem;
      }

      .search-box input {
        width: 100%;
      }

      .dashboard-grid, .analytics-grid, .settings-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AdminComponent implements OnInit {
  activeTab = 'dashboard';
  userSearchQuery = '';
  courseSearchQuery = '';
  userFilter = '';
  courseFilter = '';

  stats: any = {
    totalUsers: 1250,
    totalCourses: 89,
    totalRevenue: 45600,
    activeUsers: 890
  };

  recentActivities = [
    {
      icon: '👤',
      text: 'New user registered: John Doe',
      time: '2 minutes ago'
    },
    {
      icon: '📚',
      text: 'New course published: React Fundamentals',
      time: '1 hour ago'
    },
    {
      icon: '💰',
      text: 'Payment received: $99.99',
      time: '3 hours ago'
    }
  ];

  filteredUsers = [
    {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      role: 'student',
      isActive: true,
      avatar: 'https://via.placeholder.com/40x40',
      createdAt: new Date('2024-01-15')
    },
    {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      role: 'instructor',
      isActive: true,
      avatar: 'https://via.placeholder.com/40x40',
      createdAt: new Date('2024-01-10')
    }
  ];

  filteredCourses = [
    {
      title: 'React Fundamentals',
      instructor: { firstName: 'John', lastName: 'Doe' },
      thumbnail: 'https://via.placeholder.com/300x150',
      enrolledStudents: 150,
      rating: 4.8,
      price: 99.99,
      isPublished: true
    },
    {
      title: 'Node.js Backend',
      instructor: { firstName: 'Jane', lastName: 'Smith' },
      thumbnail: 'https://via.placeholder.com/300x150',
      enrolledStudents: 89,
      rating: 4.6,
      price: 79.99,
      isPublished: false
    }
  ];

  platformSettings = {
    name: 'EduCore',
    contactEmail: 'admin@educore.com',
    maintenanceMode: false
  };

  emailSettings = {
    smtpServer: 'smtp.gmail.com',
    smtpPort: 587,
    username: 'noreply@educore.com'
  };

  securitySettings = {
    sessionTimeout: 30,
    passwordPolicy: 'strong',
    twoFactorAuth: true
  };

  constructor(
    private userService: UserService,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    this.loadAdminData();
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  private loadAdminData(): void {
    // Load admin statistics and data
    console.log('Loading admin data...');
  }
} 