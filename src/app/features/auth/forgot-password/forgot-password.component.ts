import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h2>Forgot Password</h2>
          <p>Enter your email to reset your password</p>
        </div>

        <div *ngIf="!emailSent" class="auth-form">
          <form [formGroup]="forgotPasswordForm" (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label for="email">Email Address</label>
              <input 
                type="email" 
                id="email" 
                formControlName="email" 
                placeholder="Enter your email address"
                [class.error]="isFieldInvalid('email')"
              />
              <div class="error-message" *ngIf="isFieldInvalid('email')">
                Please enter a valid email address
              </div>
            </div>

            <button 
              type="submit" 
              class="btn-primary" 
              [disabled]="forgotPasswordForm.invalid || isLoading"
            >
              <span *ngIf="!isLoading">Send Reset Link</span>
              <span *ngIf="isLoading">Sending...</span>
            </button>

            <div class="auth-footer">
              <p>Remember your password? <a routerLink="/auth/login">Sign in</a></p>
            </div>
          </form>
        </div>

        <div *ngIf="emailSent" class="success-message">
          <div class="success-icon">✅</div>
          <h3>Check Your Email</h3>
          <p>We've sent a password reset link to <strong>{{ email }}</strong></p>
          <p class="note">If you don't see the email, check your spam folder.</p>
          
          <div class="action-buttons">
            <button class="btn-secondary" (click)="resendEmail()">
              Resend Email
            </button>
            <button class="btn-primary" routerLink="/auth/login">
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

    .auth-form {
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

    .form-group input {
      padding: 1rem;
      border: 2px solid #e1e5e9;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.3s;
    }

    .form-group input:focus {
      outline: none;
      border-color: #667eea;
    }

    .form-group input.error {
      border-color: #e74c3c;
    }

    .error-message {
      color: #e74c3c;
      font-size: 0.875rem;
      margin-top: 0.25rem;
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
      width: 100%;
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .auth-footer {
      text-align: center;
      margin-top: 2rem;
      color: #666;
    }

    .auth-footer a {
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
    }

    .success-message {
      text-align: center;
      padding: 2rem 0;
    }

    .success-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .success-message h3 {
      color: #333;
      margin-bottom: 1rem;
      font-size: 1.5rem;
    }

    .success-message p {
      color: #666;
      margin-bottom: 0.5rem;
      line-height: 1.5;
    }

    .note {
      font-size: 0.875rem;
      color: #888;
      font-style: italic;
    }

    .action-buttons {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
    }

    .btn-secondary {
      background: white;
      color: #667eea;
      border: 2px solid #667eea;
      padding: 1rem;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      flex: 1;
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
      
      .action-buttons {
        flex-direction: column;
      }
    }
  `]
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  isLoading = false;
  emailSent = false;
  email = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const { email } = this.forgotPasswordForm.value;
      this.email = email;

      this.authService.forgotPassword(email).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.emailSent = true;
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Failed to send reset email. Please try again.';
        }
      });
    }
  }

  resendEmail(): void {
    this.emailSent = false;
    this.errorMessage = '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.forgotPasswordForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }
} 