import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h2>Create Account</h2>
          <p>Join thousands of learners worldwide</p>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-row">
            <div class="form-group">
              <label for="firstName">First Name</label>
              <input 
                type="text" 
                id="firstName" 
                formControlName="firstName" 
                placeholder="Enter your first name"
                [class.error]="isFieldInvalid('firstName')"
              />
              <div class="error-message" *ngIf="isFieldInvalid('firstName')">
                First name is required
              </div>
            </div>

            <div class="form-group">
              <label for="lastName">Last Name</label>
              <input 
                type="text" 
                id="lastName" 
                formControlName="lastName" 
                placeholder="Enter your last name"
                [class.error]="isFieldInvalid('lastName')"
              />
              <div class="error-message" *ngIf="isFieldInvalid('lastName')">
                Last name is required
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="username">Username</label>
            <input 
              type="text" 
              id="username" 
              formControlName="username" 
              placeholder="Choose a username"
              [class.error]="isFieldInvalid('username')"
            />
            <div class="error-message" *ngIf="isFieldInvalid('username')">
              Username must be at least 3 characters
            </div>
          </div>

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
                placeholder="Create a strong password"
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
            <div class="password-strength" *ngIf="registerForm.get('password')?.value">
              <div class="strength-bar">
                <div 
                  class="strength-fill" 
                  [class]="getPasswordStrengthClass()"
                  [style.width.%]="getPasswordStrength()"
                ></div>
              </div>
              <div class="strength-text">{{ getPasswordStrengthText() }}</div>
            </div>
            <div class="error-message" *ngIf="isFieldInvalid('password')">
              Password must be at least 8 characters with uppercase, lowercase, number, and special character
            </div>
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <div class="password-input">
              <input 
                [type]="showConfirmPassword ? 'text' : 'password'" 
                id="confirmPassword" 
                formControlName="confirmPassword" 
                placeholder="Confirm your password"
                [class.error]="isFieldInvalid('confirmPassword')"
              />
              <button 
                type="button" 
                class="password-toggle"
                (click)="toggleConfirmPassword()"
              >
                {{ showConfirmPassword ? '👁️' : '👁️‍🗨️' }}
              </button>
            </div>
            <div class="error-message" *ngIf="isFieldInvalid('confirmPassword')">
              Passwords do not match
            </div>
          </div>

          <div class="form-options">
            <label class="checkbox-label">
              <input type="checkbox" formControlName="agreeToTerms" />
              <span>I agree to the <a href="#" class="terms-link">Terms of Service</a> and <a href="#" class="terms-link">Privacy Policy</a></span>
            </label>
            <label class="checkbox-label">
              <input type="checkbox" formControlName="newsletter" />
              <span>Subscribe to our newsletter for updates</span>
            </label>
          </div>

          <button 
            type="submit" 
            class="btn-primary" 
            [disabled]="registerForm.invalid || isLoading"
          >
            <span *ngIf="!isLoading">Create Account</span>
            <span *ngIf="isLoading">Creating Account...</span>
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
            <p>Already have an account? <a routerLink="/auth/login">Sign in</a></p>
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
      max-width: 500px;
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

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
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

    .password-strength {
      margin-top: 0.5rem;
    }

    .strength-bar {
      height: 4px;
      background: #e1e5e9;
      border-radius: 2px;
      overflow: hidden;
    }

    .strength-fill {
      height: 100%;
      transition: width 0.3s, background-color 0.3s;
    }

    .strength-fill.weak {
      background: #e74c3c;
    }

    .strength-fill.medium {
      background: #f39c12;
    }

    .strength-fill.strong {
      background: #27ae60;
    }

    .strength-text {
      font-size: 0.875rem;
      margin-top: 0.25rem;
      color: #666;
    }

    .error-message {
      color: #e74c3c;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .form-options {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      font-size: 0.875rem;
    }

    .checkbox-label {
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
      cursor: pointer;
      line-height: 1.4;
    }

    .terms-link {
      color: #667eea;
      text-decoration: none;
    }

    .terms-link:hover {
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
      
      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  showPassword = false;
  showConfirmPassword = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required, 
        Validators.minLength(8),
        this.passwordStrengthValidator()
      ]],
      confirmPassword: ['', [Validators.required]],
      agreeToTerms: [false, [Validators.requiredTrue]],
      newsletter: [false]
    }, { validators: this.passwordMatchValidator });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const { firstName, lastName, username, email, password } = this.registerForm.value;

      this.authService.register({
        firstName,
        lastName,
        username,
        email,
        password
      }).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
        }
      });
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  getPasswordStrength(): number {
    const password = this.registerForm.get('password')?.value;
    if (!password) return 0;

    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;

    return Math.min(strength, 100);
  }

  getPasswordStrengthClass(): string {
    const strength = this.getPasswordStrength();
    if (strength < 40) return 'weak';
    if (strength < 80) return 'medium';
    return 'strong';
  }

  getPasswordStrengthText(): string {
    const strength = this.getPasswordStrength();
    if (strength < 40) return 'Weak password';
    if (strength < 80) return 'Medium strength password';
    return 'Strong password';
  }

  private passwordStrengthValidator() {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const password = control.value;
      if (!password) return null;

      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumbers = /\d/.test(password);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

      if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
        return { 'passwordStrength': true };
      }

      return null;
    };
  }

  private passwordMatchValidator(group: AbstractControl): {[key: string]: any} | null {
    const password = group.get('password');
    const confirmPassword = group.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { 'passwordMismatch': true };
    }

    return null;
  }
} 