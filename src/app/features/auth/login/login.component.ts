import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h2>Welcome Back</h2>
          <p>Sign in to continue your learning journey</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              formControlName="email" 
              placeholder="Enter your email"
              [class.error]="isFieldInvalid('email')"
            />
            <div class="error-message" *ngIf="isFieldInvalid('email')">
              Please enter a valid email address
            </div>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <div class="password-input">
              <input 
                [type]="showPassword ? 'text' : 'password'" 
                id="password" 
                formControlName="password" 
                placeholder="Enter your password"
                [class.error]="isFieldInvalid('password')"
              />
              <button 
                type="button" 
                class="password-toggle"
                (click)="togglePassword()"
              >
                {{ showPassword ? '👁️' : '👁️‍🗨️' }}
              </button>
            </div>
            <div class="error-message" *ngIf="isFieldInvalid('password')">
              Password is required
            </div>
          </div>

          <div class="form-options">
            <label class="checkbox-label">
              <input type="checkbox" formControlName="rememberMe" />
              <span>Remember me</span>
            </label>
            <a routerLink="/auth/forgot-password" class="forgot-link">Forgot Password?</a>
          </div>

          <button 
            type="submit" 
            class="btn-primary" 
            [disabled]="loginForm.invalid || isLoading"
          >
            <span *ngIf="!isLoading">Sign In</span>
            <span *ngIf="isLoading">Signing In...</span>
          </button>

          <div class="auth-divider">
            <span>or</span>
          </div>

          <div class="social-login">
            <button type="button" class="btn-social btn-google">
              <span>Continue with Google</span>
            </button>
            <button type="button" class="btn-social btn-facebook">
              <span>Continue with Facebook</span>
            </button>
          </div>

          <div class="auth-footer">
            <p>Don't have an account? <a routerLink="/auth/register">Sign up</a></p>
          </div>
        </form>

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

    .password-input {
      position: relative;
    }

    .password-toggle {
      position: absolute;
      right: 1rem;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1.2rem;
    }

    .error-message {
      color: #e74c3c;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .form-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.875rem;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
    }

    .forgot-link {
      color: #667eea;
      text-decoration: none;
    }

    .forgot-link:hover {
      text-decoration: underline;
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

    .auth-divider {
      text-align: center;
      position: relative;
      margin: 1.5rem 0;
    }

    .auth-divider::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 1px;
      background: #e1e5e9;
    }

    .auth-divider span {
      background: white;
      padding: 0 1rem;
      color: #666;
    }

    .social-login {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .btn-social {
      padding: 1rem;
      border: 2px solid #e1e5e9;
      border-radius: 8px;
      background: white;
      cursor: pointer;
      transition: border-color 0.3s;
      font-size: 1rem;
    }

    .btn-social:hover {
      border-color: #667eea;
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
      
      .form-options {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
      }
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  showPassword = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Login failed. Please try again.';
        }
      });
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
} 