import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="app-container">
      <header class="app-header">
        <h1>EduCore - Learning Platform</h1>
        <nav class="main-nav">
          <a routerLink="/dashboard">Dashboard</a>
          <a routerLink="/courses">Courses</a>
          <a routerLink="/profile">Profile</a>
          <a routerLink="/admin">Admin</a>
        </nav>
      </header>
      
      <main class="app-main">
        <router-outlet></router-outlet>
      </main>
      
      <footer class="app-footer">
        <p>&copy; 2024 EduCore. All rights reserved.</p>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    
    .app-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .main-nav {
      display: flex;
      gap: 2rem;
    }
    
    .main-nav a {
      color: white;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: background-color 0.3s;
    }
    
    .main-nav a:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
    
    .app-main {
      flex: 1;
      padding: 2rem;
    }
    
    .app-footer {
      background: #f8f9fa;
      padding: 1rem 2rem;
      text-align: center;
      border-top: 1px solid #e9ecef;
    }
  `]
})
export class AppComponent {
  title = 'EduCore';
}
