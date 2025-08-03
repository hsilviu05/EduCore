import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <div class="app-container">
      <!-- Header -->
      <header class="app-header">
        <div class="header-content">
          <div class="logo-section">
            <div class="logo">
              <span class="logo-icon">🎓</span>
              <h1 class="logo-text">EduCore</h1>
            </div>
            <p class="logo-subtitle">Learning Platform</p>
          </div>
          
          <nav class="main-nav">
            <a routerLink="/dashboard" routerLinkActive="active" class="nav-link">
              <span class="nav-icon">📊</span>
              Dashboard
            </a>
            <a routerLink="/courses" routerLinkActive="active" class="nav-link">
              <span class="nav-icon">📚</span>
              Courses
            </a>
            <a routerLink="/quiz" routerLinkActive="active" class="nav-link">
              <span class="nav-icon">🧠</span>
              Quizzes
            </a>
            <a routerLink="/profile" routerLinkActive="active" class="nav-link">
              <span class="nav-icon">👤</span>
              Profile
            </a>
            <a routerLink="/admin" routerLinkActive="active" class="nav-link admin-link">
              <span class="nav-icon">⚙️</span>
              Admin
            </a>
          </nav>

          <div class="header-actions">
            <button class="theme-toggle" (click)="toggleTheme()">
              <span class="theme-icon">{{ isDarkMode ? '☀️' : '🌙' }}</span>
            </button>
            <div class="user-menu">
              <button class="user-avatar" (click)="toggleUserMenu()">
                <span class="avatar-text">👤</span>
              </button>
              <div class="user-dropdown" *ngIf="showUserMenu">
                <a routerLink="/profile" class="dropdown-item">
                  <span>👤</span> My Profile
                </a>
                <a routerLink="/settings" class="dropdown-item">
                  <span>⚙️</span> Settings
                </a>
                <div class="dropdown-divider"></div>
                <button class="dropdown-item logout-btn" (click)="logout()">
                  <span>🚪</span> Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="app-main">
        <div class="content-wrapper">
          <router-outlet></router-outlet>
        </div>
      </main>

      <!-- Footer -->
      <footer class="app-footer">
        <div class="footer-content">
          <div class="footer-section">
            <h3>EduCore</h3>
            <p>Empowering learners worldwide with modern education technology.</p>
          </div>
          <div class="footer-section">
            <h4>Quick Links</h4>
            <a routerLink="/courses">Browse Courses</a>
            <a routerLink="/quiz">Take Quizzes</a>
            <a routerLink="/profile">My Learning</a>
          </div>
          <div class="footer-section">
            <h4>Support</h4>
            <a href="#">Help Center</a>
            <a href="#">Contact Us</a>
            <a href="#">Privacy Policy</a>
          </div>
          <div class="footer-section">
            <h4>Connect</h4>
            <div class="social-links">
              <a href="#" class="social-link">📘</a>
              <a href="#" class="social-link">🐦</a>
              <a href="#" class="social-link">📷</a>
              <a href="#" class="social-link">💼</a>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2024 EduCore. All rights reserved. Built with ❤️ for learners everywhere.</p>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .app-header {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
    }

    .header-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 1rem 2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .logo-section {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .logo-icon {
      font-size: 2rem;
    }

    .logo-text {
      font-size: 1.5rem;
      font-weight: 700;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin: 0;
    }

    .logo-subtitle {
      color: #666;
      font-size: 0.9rem;
      margin: 0;
    }

    .main-nav {
      display: flex;
      gap: 2rem;
      align-items: center;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      text-decoration: none;
      color: #333;
      font-weight: 500;
      border-radius: 8px;
      transition: all 0.3s ease;
      position: relative;
    }

    .nav-link:hover {
      background: rgba(102, 126, 234, 0.1);
      color: #667eea;
      transform: translateY(-2px);
    }

    .nav-link.active {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    }

    .nav-icon {
      font-size: 1.2rem;
    }

    .admin-link {
      background: rgba(255, 193, 7, 0.1);
      color: #ffc107;
    }

    .admin-link:hover {
      background: rgba(255, 193, 7, 0.2);
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .theme-toggle {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 50%;
      transition: all 0.3s ease;
    }

    .theme-toggle:hover {
      background: rgba(102, 126, 234, 0.1);
      transform: scale(1.1);
    }

    .user-menu {
      position: relative;
    }

    .user-avatar {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      transition: all 0.3s ease;
    }

    .user-avatar:hover {
      transform: scale(1.1);
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    }

    .user-dropdown {
      position: absolute;
      top: 100%;
      right: 0;
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      padding: 0.5rem;
      min-width: 200px;
      z-index: 1000;
      margin-top: 0.5rem;
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      text-decoration: none;
      color: #333;
      border-radius: 8px;
      transition: all 0.3s ease;
      border: none;
      background: none;
      width: 100%;
      text-align: left;
      cursor: pointer;
    }

    .dropdown-item:hover {
      background: rgba(102, 126, 234, 0.1);
      color: #667eea;
    }

    .dropdown-divider {
      height: 1px;
      background: #eee;
      margin: 0.5rem 0;
    }

    .logout-btn {
      color: #dc3545;
    }

    .logout-btn:hover {
      background: rgba(220, 53, 69, 0.1);
      color: #dc3545;
    }

    .app-main {
      flex: 1;
      padding: 2rem;
    }

    .content-wrapper {
      max-width: 1400px;
      margin: 0 auto;
      background: white;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      min-height: calc(100vh - 200px);
    }

    .app-footer {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-top: 1px solid rgba(255, 255, 255, 0.2);
      margin-top: auto;
    }

    .footer-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 3rem 2rem 2rem;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
    }

    .footer-section h3 {
      color: #333;
      margin-bottom: 1rem;
      font-size: 1.5rem;
    }

    .footer-section h4 {
      color: #333;
      margin-bottom: 1rem;
      font-size: 1.1rem;
    }

    .footer-section p {
      color: #666;
      line-height: 1.6;
    }

    .footer-section a {
      display: block;
      color: #666;
      text-decoration: none;
      margin-bottom: 0.5rem;
      transition: color 0.3s ease;
    }

    .footer-section a:hover {
      color: #667eea;
    }

    .social-links {
      display: flex;
      gap: 1rem;
    }

    .social-link {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 50%;
      text-decoration: none;
      font-size: 1.2rem;
      transition: all 0.3s ease;
    }

    .social-link:hover {
      transform: scale(1.1);
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    }

    .footer-bottom {
      text-align: center;
      padding: 1.5rem 2rem;
      border-top: 1px solid #eee;
      color: #666;
    }

    /* Dark mode styles */
    .app-container.dark-mode {
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    }

    .app-container.dark-mode .app-header {
      background: rgba(26, 26, 46, 0.95);
      border-bottom-color: rgba(255, 255, 255, 0.1);
    }

    .app-container.dark-mode .logo-text {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .app-container.dark-mode .logo-subtitle {
      color: #aaa;
    }

    .app-container.dark-mode .nav-link {
      color: #fff;
    }

    .app-container.dark-mode .nav-link:hover {
      background: rgba(102, 126, 234, 0.2);
    }

    .app-container.dark-mode .content-wrapper {
      background: #1a1a2e;
      color: #fff;
    }

    .app-container.dark-mode .app-footer {
      background: rgba(26, 26, 46, 0.95);
      border-top-color: rgba(255, 255, 255, 0.1);
    }

    .app-container.dark-mode .footer-section h3,
    .app-container.dark-mode .footer-section h4 {
      color: #fff;
    }

    .app-container.dark-mode .footer-section p,
    .app-container.dark-mode .footer-section a {
      color: #aaa;
    }

    .app-container.dark-mode .footer-section a:hover {
      color: #667eea;
    }

    /* Responsive design */
    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        gap: 1rem;
        padding: 1rem;
      }

      .main-nav {
        flex-wrap: wrap;
        justify-content: center;
        gap: 1rem;
      }

      .nav-link {
        padding: 0.5rem 0.75rem;
        font-size: 0.9rem;
      }

      .app-main {
        padding: 1rem;
      }

      .footer-content {
        grid-template-columns: 1fr;
        text-align: center;
        padding: 2rem 1rem 1rem;
      }

      .social-links {
        justify-content: center;
      }
    }

    @media (max-width: 480px) {
      .logo-text {
        font-size: 1.2rem;
      }

      .nav-link {
        padding: 0.5rem;
        font-size: 0.8rem;
      }

      .nav-icon {
        font-size: 1rem;
      }
    }
  `]
})
export class AppComponent {
  isDarkMode = false;
  showUserMenu = false;

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark-mode', this.isDarkMode);
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  logout(): void {
    // Implement logout logic
    console.log('Logout clicked');
    this.showUserMenu = false;
  }
}
