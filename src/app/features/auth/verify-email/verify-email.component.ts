import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h2>Verify Your Email</h2>
          <p>Please check your email and click the verification link</p>
        </div>

        <div class="verify-content">
          <div class="email-icon">📧</div>
          <p class="verify-message">
            We've sent a verification link to your email address. 
            Please check your inbox and click the link to verify your account.
          </p>
          
          <div class="verify-actions">
            <button class="btn-primary" (click)="resendEmail()" [disabled]="isResending">
              <span *ngIf="!isResending">Resend Email</span>
              <span *ngIf="isResending">Sending...</span>
            </button>
            
            <button class="btn-secondary" (click)="goToLogin()">
              Back to Login
            </button>
          </div>
        </div>

        <div class="error-alert" *ngIf="errorMessage">
          {{ errorMessage }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 2rem;
    }

    .auth-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.1);
      padding: 3rem;
      width: 100%;
      max-width: 450px;
    }

    .auth-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .auth-header h2 {
      color: #333;
      margin-bottom: 0.5rem;
      font-size: 2rem;
    }

    .auth-header p {
      color: #666;
      font-size: 1rem;
    }

    .verify-content {
      text-align: center;
    }

    .email-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .verify-message {
      color: #666;
      line-height: 1.6;
      margin-bottom: 2rem;
    }

    .verify-actions {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 1rem;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: transform 0.2s;
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: transparent;
      color: #667eea;
      border: 2px solid #667eea;
      padding: 1rem;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-secondary:hover {
      background: #667eea;
      color: white;
    }

    .error-alert {
      background: #fee;
      color: #e74c3c;
      padding: 1rem;
      border-radius: 8px;
      margin-top: 1rem;
      text-align: center;
    }

    @media (max-width: 480px) {
      .auth-card {
        padding: 2rem;
      }
    }
  `]
})
export class VerifyEmailComponent {
  isResending = false;
  errorMessage = '';

  constructor(private router: Router) {}

  resendEmail(): void {
    this.isResending = true;
    this.errorMessage = '';
    
    // Simulate API call
    setTimeout(() => {
      this.isResending = false;
      // In a real app, you would call the auth service here
    }, 2000);
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
} 