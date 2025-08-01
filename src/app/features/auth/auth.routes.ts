import { Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';

export const authRoutes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then(m => m.LoginComponent),
    title: 'Login - EduCore'
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.component').then(m => m.RegisterComponent),
    title: 'Register - EduCore'
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent),
    title: 'Forgot Password - EduCore'
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./reset-password/reset-password.component').then(m => m.ResetPasswordComponent),
    title: 'Reset Password - EduCore'
  },
  {
    path: 'verify-email',
    loadComponent: () => import('./verify-email/verify-email.component').then(m => m.VerifyEmailComponent),
    title: 'Verify Email - EduCore'
  }
]; 