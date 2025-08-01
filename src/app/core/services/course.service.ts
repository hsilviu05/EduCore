import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course, CourseEnrollment, CourseCategory, CourseLevel } from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  constructor(private http: HttpClient) {}

  // Get all courses with optional filtering
  getCourses(filters?: {
    category?: CourseCategory;
    level?: CourseLevel;
    search?: string;
    instructorId?: number;
    isFree?: boolean;
    page?: number;
    limit?: number;
  }): Observable<{ courses: Course[]; total: number; page: number; totalPages: number }> {
    let params = new HttpParams();
    
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key as keyof typeof filters] !== undefined) {
          params = params.set(key, filters[key as keyof typeof filters]!.toString());
        }
      });
    }

    return this.http.get<{ courses: Course[]; total: number; page: number; totalPages: number }>('/api/courses', { params });
  }

  // Get course by ID
  getCourseById(id: number): Observable<Course> {
    return this.http.get<Course>(`/api/courses/${id}`);
  }

  // Get user's enrolled courses
  getEnrolledCourses(): Observable<CourseEnrollment[]> {
    return this.http.get<CourseEnrollment[]>('/api/courses/enrolled');
  }

  // Enroll in a course
  enrollInCourse(courseId: number): Observable<CourseEnrollment> {
    return this.http.post<CourseEnrollment>(`/api/courses/${courseId}/enroll`, {});
  }

  // Unenroll from a course
  unenrollFromCourse(courseId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`/api/courses/${courseId}/enroll`);
  }

  // Get course progress
  getCourseProgress(courseId: number): Observable<{ progress: number; completedLessons: number; totalLessons: number }> {
    return this.http.get<{ progress: number; completedLessons: number; totalLessons: number }>(`/api/courses/${courseId}/progress`);
  }

  // Mark lesson as completed
  markLessonCompleted(courseId: number, lessonId: number): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`/api/courses/${courseId}/lessons/${lessonId}/complete`, {});
  }

  // Get course categories
  getCourseCategories(): Observable<{ id: string; name: string; count: number }[]> {
    return this.http.get<{ id: string; name: string; count: number }[]>('/api/courses/categories');
  }

  // Get featured courses
  getFeaturedCourses(): Observable<Course[]> {
    return this.http.get<Course[]>('/api/courses/featured');
  }

  // Get popular courses
  getPopularCourses(): Observable<Course[]> {
    return this.http.get<Course[]>('/api/courses/popular');
  }

  // Rate a course
  rateCourse(courseId: number, rating: number, review?: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`/api/courses/${courseId}/rate`, { rating, review });
  }

  // Get course ratings
  getCourseRatings(courseId: number): Observable<{ rating: number; totalRatings: number; reviews: any[] }> {
    return this.http.get<{ rating: number; totalRatings: number; reviews: any[] }>(`/api/courses/${courseId}/ratings`);
  }

  // Search courses
  searchCourses(query: string): Observable<Course[]> {
    return this.http.get<Course[]>(`/api/courses/search?q=${encodeURIComponent(query)}`);
  }

  // Get instructor courses
  getInstructorCourses(instructorId: number): Observable<Course[]> {
    return this.http.get<Course[]>(`/api/instructors/${instructorId}/courses`);
  }

  // Create new course (for instructors)
  createCourse(courseData: Partial<Course>): Observable<Course> {
    return this.http.post<Course>('/api/courses', courseData);
  }

  // Update course (for instructors)
  updateCourse(courseId: number, courseData: Partial<Course>): Observable<Course> {
    return this.http.put<Course>(`/api/courses/${courseId}`, courseData);
  }

  // Delete course (for instructors)
  deleteCourse(courseId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`/api/courses/${courseId}`);
  }
}