export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  dateJoined: Date;
  lastLogin?: Date;
  isActive: boolean;
  preferences?: UserPreferences;
}

export enum UserRole {
  STUDENT = 'student',
  INSTRUCTOR = 'instructor',
  ADMIN = 'admin'
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  language: string;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  courseUpdates: boolean;
  quizReminders: boolean;
  achievementAlerts: boolean;
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'friends';
  showProgress: boolean;
  showAchievements: boolean;
}

export interface UserProfile {
  user: User;
  enrolledCourses: number;
  completedCourses: number;
  totalPoints: number;
  achievements: Achievement[];
}

export interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
} 