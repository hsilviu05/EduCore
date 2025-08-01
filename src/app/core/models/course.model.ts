import { User } from './user.model';

export interface Course {
  id: number;
  title: string;
  description: string;
  shortDescription: string;
  instructor: User;
  category: CourseCategory;
  level: CourseLevel;
  duration: number; // in minutes
  price: number;
  isFree: boolean;
  thumbnail: string;
  videoUrl?: string;
  rating: number;
  totalRatings: number;
  enrolledStudents: number;
  maxStudents?: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  lessons: Lesson[];
  requirements: string[];
  learningOutcomes: string[];
  tags: string[];
}

export enum CourseLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced'
}

export enum CourseCategory {
  PROGRAMMING = 'programming',
  DESIGN = 'design',
  BUSINESS = 'business',
  MARKETING = 'marketing',
  LANGUAGES = 'languages',
  SCIENCE = 'science',
  MUSIC = 'music',
  OTHER = 'other'
}

export interface Lesson {
  id: number;
  title: string;
  description: string;
  duration: number; // in minutes
  videoUrl?: string;
  content: string;
  order: number;
  isCompleted: boolean;
  quiz?: Quiz;
  attachments: Attachment[];
}

export interface Attachment {
  id: number;
  name: string;
  url: string;
  type: 'pdf' | 'doc' | 'image' | 'video' | 'other';
  size: number;
}

export interface CourseEnrollment {
  id: number;
  userId: number;
  courseId: number;
  enrolledAt: Date;
  completedAt?: Date;
  progress: number; // 0-100
  lastAccessedAt: Date;
  certificate?: Certificate;
}

export interface Certificate {
  id: number;
  courseId: number;
  userId: number;
  issuedAt: Date;
  certificateUrl: string;
  grade?: string;
}