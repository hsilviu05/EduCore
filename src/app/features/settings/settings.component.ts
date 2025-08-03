import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { NotificationSettings, PrivacySettings } from '../../core/models/user.model';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="settings-container">
      <!-- Settings Header -->
      <div class="settings-header">
        <div class="header-content">
          <h1>Settings</h1>
          <p>Manage your account preferences and security</p>
        </div>
      </div>

      <!-- Settings Tabs -->
      <div class="settings-tabs">
        <button 
          class="tab-btn" 
          [class.active]="activeTab === 'profile'"
          (click)="setActiveTab('profile')"
        >
          👤 Profile
        </button>
        <button 
          class="tab-btn" 
          [class.active]="activeTab === 'security'"
          (click)="setActiveTab('security')"
        >
          🔒 Security
        </button>
        <button 
          class="tab-btn" 
          [class.active]="activeTab === 'notifications'"
          (click)="setActiveTab('notifications')"
        >
          🔔 Notifications
        </button>
        <button 
          class="tab-btn" 
          [class.active]="activeTab === 'privacy'"
          (click)="setActiveTab('privacy')"
        >
          🛡️ Privacy
        </button>
        <button 
          class="tab-btn" 
          [class.active]="activeTab === 'preferences'"
          (click)="setActiveTab('preferences')"
        >
          ⚙️ Preferences
        </button>
      </div>

      <!-- Tab Content -->
      <div class="tab-content">
        <!-- Profile Tab -->
        <div *ngIf="activeTab === 'profile'" class="profile-tab">
          <div class="settings-card">
            <h3>Profile Information</h3>
            <form [formGroup]="profileForm" (ngSubmit)="updateProfile()">
              <div class="avatar-section">
                <div class="avatar-container">
                  <img [src]="userAvatar || '/assets/images/placeholder-100x100.svg'" [alt]="currentUser?.firstName">
                  <button type="button" class="avatar-upload-btn" (click)="uploadAvatar()">
                    📷 Upload Photo
                  </button>
                </div>
              </div>
              
              <div class="form-grid">
                <div class="form-group">
                  <label>First Name</label>
                  <input type="text" formControlName="firstName" placeholder="Enter your first name">
                  <div class="error-message" *ngIf="profileForm.get('firstName')?.invalid && profileForm.get('firstName')?.touched">
                    First name is required
                  </div>
                </div>
                
                <div class="form-group">
                  <label>Last Name</label>
                  <input type="text" formControlName="lastName" placeholder="Enter your last name">
                  <div class="error-message" *ngIf="profileForm.get('lastName')?.invalid && profileForm.get('lastName')?.touched">
                    Last name is required
                  </div>
                </div>
                
                <div class="form-group">
                  <label>Username</label>
                  <input type="text" formControlName="username" placeholder="Enter your username">
                  <div class="error-message" *ngIf="profileForm.get('username')?.invalid && profileForm.get('username')?.touched">
                    Username is required
                  </div>
                </div>
                
                <div class="form-group">
                  <label>Email</label>
                  <input type="email" formControlName="email" placeholder="Enter your email">
                  <div class="error-message" *ngIf="profileForm.get('email')?.invalid && profileForm.get('email')?.touched">
                    Valid email is required
                  </div>
                </div>
                
                <div class="form-group">
                  <label>Phone Number</label>
                  <input type="tel" formControlName="phoneNumber" placeholder="Enter your phone number">
                </div>
                
                <div class="form-group">
                  <label>Date of Birth</label>
                  <input type="date" formControlName="dateOfBirth">
                </div>
              </div>
              
              <div class="form-actions">
                <button type="submit" class="btn-save" [disabled]="profileForm.invalid || isUpdating">
                  {{ isUpdating ? 'Saving...' : 'Save Changes' }}
                </button>
                <button type="button" class="btn-cancel" (click)="resetProfileForm()">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Security Tab -->
        <div *ngIf="activeTab === 'security'" class="security-tab">
          <div class="settings-card">
            <h3>Change Password</h3>
            <form [formGroup]="passwordForm" (ngSubmit)="changePassword()">
              <div class="form-group">
                <label>Current Password</label>
                <div class="password-input">
                  <input 
                    [type]="showCurrentPassword ? 'text' : 'password'" 
                    formControlName="currentPassword" 
                    placeholder="Enter current password"
                  >
                  <button type="button" class="password-toggle" (click)="toggleCurrentPassword()">
                    {{ showCurrentPassword ? '👁️' : '🙈' }}
                  </button>
                </div>
                <div class="error-message" *ngIf="passwordForm.get('currentPassword')?.invalid && passwordForm.get('currentPassword')?.touched">
                  Current password is required
                </div>
              </div>
              
              <div class="form-group">
                <label>New Password</label>
                <div class="password-input">
                  <input 
                    [type]="showNewPassword ? 'text' : 'password'" 
                    formControlName="newPassword" 
                    placeholder="Enter new password"
                  >
                  <button type="button" class="password-toggle" (click)="toggleNewPassword()">
                    {{ showNewPassword ? '👁️' : '🙈' }}
                  </button>
                </div>
                <div class="password-strength" *ngIf="passwordForm.get('newPassword')?.value">
                  <div class="strength-bar">
                    <div class="strength-fill" [class]="getPasswordStrengthClass()"></div>
                  </div>
                  <span class="strength-text">{{ getPasswordStrengthText() }}</span>
                </div>
                <div class="error-message" *ngIf="passwordForm.get('newPassword')?.invalid && passwordForm.get('newPassword')?.touched">
                  Password must be at least 8 characters
                </div>
              </div>
              
              <div class="form-group">
                <label>Confirm New Password</label>
                <div class="password-input">
                  <input 
                    [type]="showConfirmPassword ? 'text' : 'password'" 
                    formControlName="confirmPassword" 
                    placeholder="Confirm new password"
                  >
                  <button type="button" class="password-toggle" (click)="toggleConfirmPassword()">
                    {{ showConfirmPassword ? '👁️' : '🙈' }}
                  </button>
                </div>
                <div class="error-message" *ngIf="passwordForm.get('confirmPassword')?.invalid && passwordForm.get('confirmPassword')?.touched">
                  Passwords do not match
                </div>
              </div>
              
              <div class="form-actions">
                <button type="submit" class="btn-save" [disabled]="passwordForm.invalid || isChangingPassword">
                  {{ isChangingPassword ? 'Changing...' : 'Change Password' }}
                </button>
              </div>
            </form>
          </div>

          <div class="settings-card">
            <h3>Two-Factor Authentication</h3>
            <div class="two-factor-section">
              <div class="two-factor-info">
                <p>Add an extra layer of security to your account</p>
                <div class="two-factor-status">
                  <span class="status-badge" [class]="twoFactorEnabled ? 'enabled' : 'disabled'">
                    {{ twoFactorEnabled ? 'Enabled' : 'Disabled' }}
                  </span>
                </div>
              </div>
              <button class="btn-toggle" (click)="toggleTwoFactor()">
                {{ twoFactorEnabled ? 'Disable' : 'Enable' }} 2FA
              </button>
            </div>
          </div>
        </div>

        <!-- Notifications Tab -->
        <div *ngIf="activeTab === 'notifications'" class="notifications-tab">
          <div class="settings-card">
            <h3>Email Notifications</h3>
            <div class="notification-settings">
              <div class="notification-item">
                <div class="notification-info">
                  <h4>Course Updates</h4>
                  <p>Get notified when courses you're enrolled in are updated</p>
                </div>
                <label class="toggle-switch">
                  <input type="checkbox" [(ngModel)]="notificationSettings.courseUpdates">
                  <span class="toggle-slider"></span>
                </label>
              </div>
              
              <div class="notification-item">
                <div class="notification-info">
                  <h4>New Messages</h4>
                  <p>Receive notifications for new messages from instructors</p>
                </div>
                <label class="toggle-switch">
                  <input type="checkbox" [(ngModel)]="notificationSettings.newMessages">
                  <span class="toggle-slider"></span>
                </label>
              </div>
              
              <div class="notification-item">
                <div class="notification-info">
                  <h4>Achievement Alerts</h4>
                  <p>Get notified when you earn new achievements</p>
                </div>
                <label class="toggle-switch">
                  <input type="checkbox" [(ngModel)]="notificationSettings.achievements">
                  <span class="toggle-slider"></span>
                </label>
              </div>
              
              <div class="notification-item">
                <div class="notification-info">
                  <h4>Marketing Emails</h4>
                  <p>Receive promotional emails and special offers</p>
                </div>
                <label class="toggle-switch">
                  <input type="checkbox" [(ngModel)]="notificationSettings.marketing">
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>
            
            <div class="form-actions">
              <button class="btn-save" (click)="saveNotificationSettings()">
                Save Notification Settings
              </button>
            </div>
          </div>
        </div>

        <!-- Privacy Tab -->
        <div *ngIf="activeTab === 'privacy'" class="privacy-tab">
          <div class="settings-card">
            <h3>Privacy Settings</h3>
            <div class="privacy-settings">
              <div class="privacy-item">
                <div class="privacy-info">
                  <h4>Profile Visibility</h4>
                  <p>Control who can see your profile information</p>
                </div>
                <select [(ngModel)]="privacySettings.profileVisibility">
                  <option value="public">Public</option>
                  <option value="friends">Friends Only</option>
                  <option value="private">Private</option>
                </select>
              </div>
              
              <div class="privacy-item">
                <div class="privacy-info">
                  <h4>Course Progress</h4>
                  <p>Allow others to see your course progress</p>
                </div>
                <label class="toggle-switch">
                  <input type="checkbox" [(ngModel)]="privacySettings.showProgress">
                  <span class="toggle-slider"></span>
                </label>
              </div>
              
              <div class="privacy-item">
                <div class="privacy-info">
                  <h4>Achievement Display</h4>
                  <p>Show your achievements to other users</p>
                </div>
                <label class="toggle-switch">
                  <input type="checkbox" [(ngModel)]="privacySettings.showAchievements">
                  <span class="toggle-slider"></span>
                </label>
              </div>
              
              <div class="privacy-item">
                <div class="privacy-info">
                  <h4>Activity Status</h4>
                  <p>Show when you're online or recently active</p>
                </div>
                <label class="toggle-switch">
                  <input type="checkbox" [(ngModel)]="privacySettings.showActivity">
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>
            
            <div class="form-actions">
              <button class="btn-save" (click)="savePrivacySettings()">
                Save Privacy Settings
              </button>
            </div>
          </div>
        </div>

        <!-- Preferences Tab -->
        <div *ngIf="activeTab === 'preferences'" class="preferences-tab">
          <div class="settings-card">
            <h3>Display Preferences</h3>
            <div class="preference-settings">
              <div class="preference-item">
                <div class="preference-info">
                  <h4>Theme</h4>
                  <p>Choose your preferred color theme</p>
                </div>
                <select [(ngModel)]="displayPreferences.theme">
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto</option>
                </select>
              </div>
              
              <div class="preference-item">
                <div class="preference-info">
                  <h4>Language</h4>
                  <p>Select your preferred language</p>
                </div>
                <select [(ngModel)]="displayPreferences.language">
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
              
              <div class="preference-item">
                <div class="preference-info">
                  <h4>Time Zone</h4>
                  <p>Set your local time zone</p>
                </div>
                <select [(ngModel)]="displayPreferences.timezone">
                  <option value="UTC">UTC</option>
                  <option value="EST">Eastern Time</option>
                  <option value="PST">Pacific Time</option>
                  <option value="GMT">GMT</option>
                </select>
              </div>
              
              <div class="preference-item">
                <div class="preference-info">
                  <h4>Date Format</h4>
                  <p>Choose your preferred date format</p>
                </div>
                <select [(ngModel)]="displayPreferences.dateFormat">
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
            </div>
            
            <div class="form-actions">
              <button class="btn-save" (click)="saveDisplayPreferences()">
                Save Display Preferences
              </button>
            </div>
          </div>

          <div class="settings-card">
            <h3>Learning Preferences</h3>
            <div class="learning-preferences">
              <div class="preference-item">
                <div class="preference-info">
                  <h4>Auto-play Videos</h4>
                  <p>Automatically play course videos when opened</p>
                </div>
                <label class="toggle-switch">
                  <input type="checkbox" [(ngModel)]="learningPreferences.autoPlayVideos">
                  <span class="toggle-slider"></span>
                </label>
              </div>
              
              <div class="preference-item">
                <div class="preference-info">
                  <h4>Show Subtitles</h4>
                  <p>Display subtitles in course videos</p>
                </div>
                <label class="toggle-switch">
                  <input type="checkbox" [(ngModel)]="learningPreferences.showSubtitles">
                  <span class="toggle-slider"></span>
                </label>
              </div>
              
              <div class="preference-item">
                <div class="preference-info">
                  <h4>Download for Offline</h4>
                  <p>Allow downloading course content for offline viewing</p>
                </div>
                <label class="toggle-switch">
                  <input type="checkbox" [(ngModel)]="learningPreferences.allowOfflineDownload">
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>
            
            <div class="form-actions">
              <button class="btn-save" (click)="saveLearningPreferences()">
                Save Learning Preferences
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Danger Zone -->
      <div class="danger-zone">
        <div class="settings-card danger-card">
          <h3>Danger Zone</h3>
          <div class="danger-actions">
            <div class="danger-item">
              <div class="danger-info">
                <h4>Delete Account</h4>
                <p>Permanently delete your account and all associated data</p>
              </div>
              <button class="btn-danger" (click)="deleteAccount()">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .settings-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .settings-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 2rem;
      border-radius: 12px;
      margin-bottom: 2rem;
      text-align: center;
    }

    .settings-header h1 {
      margin: 0 0 0.5rem 0;
      font-size: 2rem;
    }

    .settings-header p {
      margin: 0;
      opacity: 0.9;
    }

    .settings-tabs {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 2rem;
      border-bottom: 1px solid #eee;
      overflow-x: auto;
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
      white-space: nowrap;
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

    .settings-card {
      padding: 2rem;
      border-bottom: 1px solid #eee;
    }

    .settings-card:last-child {
      border-bottom: none;
    }

    .settings-card h3 {
      margin: 0 0 1.5rem 0;
      color: #333;
      font-size: 1.25rem;
    }

    .avatar-section {
      margin-bottom: 2rem;
    }

    .avatar-container {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .avatar-container img {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      object-fit: cover;
      border: 3px solid #eee;
    }

    .avatar-upload-btn {
      padding: 0.75rem 1.5rem;
      border: 1px solid #ddd;
      background: white;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s ease;
    }

    .avatar-upload-btn:hover {
      background: #f8f9fa;
      border-color: #667eea;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-group label {
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #333;
    }

    .form-group input, .form-group select {
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.3s ease;
    }

    .form-group input:focus, .form-group select:focus {
      outline: none;
      border-color: #667eea;
    }

    .password-input {
      position: relative;
      display: flex;
      align-items: center;
    }

    .password-input input {
      flex: 1;
      padding-right: 3rem;
    }

    .password-toggle {
      position: absolute;
      right: 0.75rem;
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1.2rem;
    }

    .password-strength {
      margin-top: 0.5rem;
    }

    .strength-bar {
      height: 4px;
      background: #eee;
      border-radius: 2px;
      overflow: hidden;
      margin-bottom: 0.25rem;
    }

    .strength-fill {
      height: 100%;
      transition: width 0.3s ease;
    }

    .strength-fill.weak { width: 33%; background: #f44336; }
    .strength-fill.medium { width: 66%; background: #ff9800; }
    .strength-fill.strong { width: 100%; background: #4caf50; }

    .strength-text {
      font-size: 0.8rem;
      color: #666;
    }

    .error-message {
      color: #f44336;
      font-size: 0.8rem;
      margin-top: 0.25rem;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
    }

    .btn-save, .btn-cancel, .btn-danger {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s ease;
    }

    .btn-save {
      background: #667eea;
      color: white;
    }

    .btn-save:hover {
      background: #5a6fd8;
    }

    .btn-save:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .btn-cancel {
      background: #f8f9fa;
      color: #666;
      border: 1px solid #ddd;
    }

    .btn-cancel:hover {
      background: #e9ecef;
    }

    .btn-danger {
      background: #f44336;
      color: white;
    }

    .btn-danger:hover {
      background: #d32f2f;
    }

    .two-factor-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .two-factor-info p {
      margin: 0 0 0.5rem 0;
      color: #666;
    }

    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .status-badge.enabled {
      background: #e8f5e8;
      color: #4caf50;
    }

    .status-badge.disabled {
      background: #ffebee;
      color: #f44336;
    }

    .btn-toggle {
      padding: 0.75rem 1.5rem;
      border: 1px solid #ddd;
      background: white;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s ease;
    }

    .btn-toggle:hover {
      background: #f8f9fa;
      border-color: #667eea;
    }

    .notification-settings, .privacy-settings, .preference-settings, .learning-preferences {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .notification-item, .privacy-item, .preference-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .notification-info, .privacy-info, .preference-info {
      flex: 1;
    }

    .notification-info h4, .privacy-info h4, .preference-info h4 {
      margin: 0 0 0.25rem 0;
      color: #333;
      font-size: 1rem;
    }

    .notification-info p, .privacy-info p, .preference-info p {
      margin: 0;
      color: #666;
      font-size: 0.9rem;
    }

    .toggle-switch {
      position: relative;
      display: inline-block;
      width: 50px;
      height: 24px;
    }

    .toggle-switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .toggle-slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ccc;
      transition: 0.3s;
      border-radius: 24px;
    }

    .toggle-slider:before {
      position: absolute;
      content: "";
      height: 18px;
      width: 18px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: 0.3s;
      border-radius: 50%;
    }

    input:checked + .toggle-slider {
      background-color: #667eea;
    }

    input:checked + .toggle-slider:before {
      transform: translateX(26px);
    }

    .danger-zone {
      margin-top: 2rem;
    }

    .danger-card {
      border: 1px solid #ffebee;
      background: #fff5f5;
    }

    .danger-card h3 {
      color: #f44336;
    }

    .danger-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: white;
      border-radius: 8px;
      border: 1px solid #ffebee;
    }

    .danger-info h4 {
      margin: 0 0 0.25rem 0;
      color: #f44336;
    }

    .danger-info p {
      margin: 0;
      color: #666;
      font-size: 0.9rem;
    }

    @media (max-width: 768px) {
      .settings-container {
        padding: 1rem;
      }

      .settings-tabs {
        flex-wrap: wrap;
      }

      .form-grid {
        grid-template-columns: 1fr;
      }

      .two-factor-section, .danger-item {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }

      .notification-item, .privacy-item, .preference-item {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }

      .form-actions {
        flex-direction: column;
      }
    }
  `]
})
export class SettingsComponent implements OnInit {
  activeTab = 'profile';
  isUpdating = false;
  isChangingPassword = false;
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;
  twoFactorEnabled = false;
  userAvatar: string | null = null;

  currentUser: any = {
    firstName: 'John',
    lastName: 'Doe',
    username: 'johndoe',
    email: 'john@example.com',
    phoneNumber: '+1234567890',
    dateOfBirth: '1990-01-01'
  };

  profileForm: FormGroup;
  passwordForm: FormGroup;

  notificationSettings: NotificationSettings = {
    email: true,
    push: true,
    courseUpdates: true,
    quizReminders: true,
    achievementAlerts: true
  };

  privacySettings: PrivacySettings = {
    profileVisibility: 'public',
    showProgress: true,
    showAchievements: true
  };

  displayPreferences = {
    theme: 'light',
    language: 'en',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY'
  };

  learningPreferences = {
    autoPlayVideos: false,
    showSubtitles: true,
    allowOfflineDownload: true
  };

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      dateOfBirth: ['']
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.loadUserData();
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  private loadUserData(): void {
    this.userService.getCurrentUserProfile().subscribe({
      next: (profile) => {
        this.currentUser = profile.user;
        this.userAvatar = profile.user.avatar || null;
        this.profileForm.patchValue({
          firstName: this.currentUser.firstName,
          lastName: this.currentUser.lastName,
          username: this.currentUser.username,
          email: this.currentUser.email,
          phoneNumber: this.currentUser.phoneNumber || '',
          dateOfBirth: this.currentUser.dateOfBirth ? this.currentUser.dateOfBirth.split('T')[0] : ''
        });
      },
      error: (error) => {
        console.error('Error loading user data:', error);
      }
    });
  }

  updateProfile(): void {
    if (this.profileForm.valid) {
      this.isUpdating = true;
      const profileData = this.profileForm.value;
      
      this.userService.updateProfile(profileData).subscribe({
        next: (user) => {
          this.currentUser = user;
          this.isUpdating = false;
          // Show success message
        },
        error: (error) => {
          console.error('Error updating profile:', error);
          this.isUpdating = false;
          // Show error message
        }
      });
    }
  }

  changePassword(): void {
    if (this.passwordForm.valid) {
      this.isChangingPassword = true;
      const passwordData = this.passwordForm.value;
      
      this.authService.changePassword(passwordData.currentPassword, passwordData.newPassword).subscribe({
        next: () => {
          this.isChangingPassword = false;
          this.passwordForm.reset();
          // Show success message
        },
        error: (error) => {
          console.error('Error changing password:', error);
          this.isChangingPassword = false;
          // Show error message
        }
      });
    }
  }

  toggleCurrentPassword(): void {
    this.showCurrentPassword = !this.showCurrentPassword;
  }

  toggleNewPassword(): void {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  getPasswordStrengthClass(): string {
    const password = this.passwordForm.get('newPassword')?.value;
    if (!password) return '';
    
    const strength = this.calculatePasswordStrength(password);
    if (strength < 3) return 'weak';
    if (strength < 5) return 'medium';
    return 'strong';
  }

  getPasswordStrengthText(): string {
    const password = this.passwordForm.get('newPassword')?.value;
    if (!password) return '';
    
    const strength = this.calculatePasswordStrength(password);
    if (strength < 3) return 'Weak';
    if (strength < 5) return 'Medium';
    return 'Strong';
  }

  private calculatePasswordStrength(password: string): number {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  }

  private passwordMatchValidator(group: FormGroup): {[key: string]: any} | null {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  toggleTwoFactor(): void {
    this.twoFactorEnabled = !this.twoFactorEnabled;
    // Implement 2FA toggle logic
  }

  uploadAvatar(): void {
    // Implement avatar upload logic
    console.log('Upload avatar');
  }

  resetProfileForm(): void {
    this.profileForm.patchValue({
      firstName: this.currentUser.firstName,
      lastName: this.currentUser.lastName,
      username: this.currentUser.username,
      email: this.currentUser.email,
      phoneNumber: this.currentUser.phoneNumber || '',
      dateOfBirth: this.currentUser.dateOfBirth ? this.currentUser.dateOfBirth.split('T')[0] : ''
    });
  }

  saveNotificationSettings(): void {
    this.userService.updatePreferences({ notifications: this.notificationSettings }).subscribe({
      next: () => {
        // Show success message
      },
      error: (error) => {
        console.error('Error saving notification settings:', error);
      }
    });
  }

  savePrivacySettings(): void {
    this.userService.updatePreferences({ privacy: this.privacySettings }).subscribe({
      next: () => {
        // Show success message
      },
      error: (error) => {
        console.error('Error saving privacy settings:', error);
      }
    });
  }

  saveDisplayPreferences(): void {
    // Note: display preferences are not part of the UserPreferences interface
    // This would need to be implemented separately or the interface updated
    console.log('Display preferences:', this.displayPreferences);
  }

  saveLearningPreferences(): void {
    // Note: learning preferences are not part of the UserPreferences interface
    // This would need to be implemented separately or the interface updated
    console.log('Learning preferences:', this.learningPreferences);
  }

  deleteAccount(): void {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      this.userService.deleteAccount().subscribe({
        next: () => {
          this.authService.logout();
          // Redirect to home page
        },
        error: (error) => {
          console.error('Error deleting account:', error);
        }
      });
    }
  }
} 