import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, UserProfile, UserPreferences } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {}

  // Get current user profile
  getCurrentUserProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>('/api/users/profile');
  }

  // Get user by ID
  getUserById(userId: number): Observable<User> {
    return this.http.get<User>(`/api/users/${userId}`);
  }

  // Update user profile
  updateProfile(profileData: Partial<User>): Observable<User> {
    return this.http.put<User>('/api/users/profile', profileData);
  }

  // Update user preferences
  updatePreferences(preferences: Partial<UserPreferences>): Observable<UserPreferences> {
    return this.http.put<UserPreferences>('/api/users/preferences', preferences);
  }

  // Get user preferences
  getUserPreferences(): Observable<UserPreferences> {
    return this.http.get<UserPreferences>('/api/users/preferences');
  }

  // Upload profile picture
  uploadProfilePicture(file: File): Observable<{ avatarUrl: string }> {
    const formData = new FormData();
    formData.append('avatar', file);
    return this.http.post<{ avatarUrl: string }>('/api/users/avatar', formData);
  }

  // Get user achievements
  getUserAchievements(): Observable<any[]> {
    return this.http.get<any[]>('/api/users/achievements');
  }

  // Get user learning statistics
  getUserLearningStats(): Observable<{
    totalCoursesEnrolled: number;
    totalCoursesCompleted: number;
    totalPoints: number;
    averageScore: number;
    certificatesEarned: number;
    learningStreak: number;
  }> {
    return this.http.get<any>('/api/users/learning-stats');
  }

  // Get user activity history
  getUserActivityHistory(): Observable<any[]> {
    return this.http.get<any[]>('/api/users/activity-history');
  }

  // Get user certificates
  getUserCertificates(): Observable<any[]> {
    return this.http.get<any[]>('/api/users/certificates');
  }

  // Delete user account
  deleteAccount(): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>('/api/users/account');
  }

  // Get all users (admin only)
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>('/api/users');
  }

  // Update user role (admin only)
  updateUserRole(userId: number, role: string): Observable<User> {
    return this.http.put<User>(`/api/users/${userId}/role`, { role });
  }

  // Deactivate user (admin only)
  deactivateUser(userId: number): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`/api/users/${userId}/deactivate`, {});
  }

  // Reactivate user (admin only)
  reactivateUser(userId: number): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`/api/users/${userId}/reactivate`, {});
  }

  // Get user search suggestions
  searchUsers(query: string): Observable<User[]> {
    return this.http.get<User[]>(`/api/users/search?q=${encodeURIComponent(query)}`);
  }

  // Get user notifications
  getUserNotifications(): Observable<any[]> {
    return this.http.get<any[]>('/api/users/notifications');
  }

  // Mark notification as read
  markNotificationAsRead(notificationId: number): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`/api/users/notifications/${notificationId}/read`, {});
  }

  // Mark all notifications as read
  markAllNotificationsAsRead(): Observable<{ message: string }> {
    return this.http.put<{ message: string }>('/api/users/notifications/read-all', {});
  }
}