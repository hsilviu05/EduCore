import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CourseService } from '../../core/services/course.service';
import { Course, CourseCategory, CourseLevel } from '../../core/models/course.model';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="courses-container">
      <!-- Header Section -->
      <div class="courses-header">
        <div class="header-content">
          <h1>Explore Courses</h1>
          <p>Discover thousands of courses from top instructors worldwide</p>
        </div>
        <div class="header-actions">
          <button class="btn-primary" routerLink="/courses/create">
            <span>➕</span>
            Create Course
          </button>
        </div>
      </div>

      <!-- Search and Filters -->
      <div class="filters-section">
        <div class="search-box">
          <input
            type="text"
            placeholder="Search courses..."
            [(ngModel)]="searchQuery"
            (input)="onSearchChange()"
            class="search-input"
          />
          <button class="search-btn">🔍</button>
        </div>

        <div class="filter-controls">
          <div class="filter-group">
            <label>Category:</label>
            <select [(ngModel)]="selectedCategory" (change)="applyFilters()">
              <option value="">All Categories</option>
              <option *ngFor="let category of categories" [value]="category.id">
                {{ category.name }} ({{ category.count }})
              </option>
            </select>
          </div>
          
          <div class="filter-group">
            <label>Level:</label>
            <select [(ngModel)]="selectedLevel" (change)="applyFilters()">
              <option value="">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label>Price:</label>
            <select [(ngModel)]="selectedPrice" (change)="applyFilters()">
              <option value="">All Prices</option>
              <option value="free">Free</option>
              <option value="paid">Paid</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label>Sort by:</label>
            <select [(ngModel)]="sortBy" (change)="applyFilters()">
              <option value="popular">Most Popular</option>
              <option value="newest">Newest</option>
              <option value="rating">Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Course Grid -->
      <div class="courses-content">
        <div class="courses-stats">
          <p>{{ filteredCourses.length }} courses found</p>
          <div class="view-toggle">
            <button
              class="view-btn"
              [class.active]="viewMode === 'grid'"
              (click)="setViewMode('grid')"
            >
              📱
            </button>
            <button
              class="view-btn"
              [class.active]="viewMode === 'list'"
              (click)="setViewMode('list')"
            >
              📋
            </button>
          </div>
        </div>

        <div class="courses-grid" [class.list-view]="viewMode === 'list'">
          <div
            class="course-card"
            *ngFor="let course of filteredCourses"
            [routerLink]="['/courses', course.id]"
          >
            <div class="course-image">
              <img [src]="course.thumbnail" [alt]="course.title">
              <div class="course-overlay">
                <button class="btn-play">▶️</button>
              </div>
              <div class="course-badges">
                <span class="badge-new" *ngIf="course.isNew">NEW</span>
                <span class="badge-popular" *ngIf="course.isPopular">🔥</span>
                <span class="badge-free" *ngIf="course.isFree">FREE</span>
              </div>
            </div>

            <div class="course-content">
              <div class="course-category">
                <span class="category-tag">{{ course.category }}</span>
                <span class="level-tag">{{ course.level }}</span>
              </div>

              <h3 class="course-title">{{ course.title }}</h3>
              <p class="course-description">{{ course.shortDescription }}</p>

              <div class="course-instructor">
                <img [src]="course.instructor.avatar || '/assets/images/placeholder-30x30.svg'">
                <span>{{ course.instructor.firstName }} {{ course.instructor.lastName }}</span>
              </div>

              <div class="course-meta">
                <div class="meta-item">
                  <span class="meta-icon">⏱️</span>
                  <span>{{ course.duration }} min</span>
                </div>
                <div class="meta-item">
                  <span class="meta-icon">👥</span>
                  <span>{{ course.enrolledStudents }} students</span>
                </div>
                <div class="meta-item">
                  <span class="meta-icon">⭐</span>
                  <span>{{ course.rating }} ({{ course.totalRatings }})</span>
                </div>
              </div>

              <div class="course-footer">
                <div class="course-price">
                  <span class="price" *ngIf="!course.isFree">{{ course.price }}</span>
                  <span class="price-free" *ngIf="course.isFree">Free</span>
                </div>
                <button class="btn-enroll" (click)="$event.stopPropagation()">
                  {{ course.isFree ? 'Enroll Free' : 'Enroll Now' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div class="pagination" *ngIf="totalPages > 1">
          <button
            class="page-btn"
            [disabled]="currentPage === 1"
            (click)="changePage(currentPage - 1)"
          >
            ← Previous
          </button>

          <div class="page-numbers">
            <button
              class="page-btn"
              *ngFor="let page of getPageNumbers()"
              [class.active]="page === currentPage"
              (click)="changePage(page)"
            >
              {{ page }}
            </button>
          </div>

          <button
            class="page-btn"
            [disabled]="currentPage === totalPages"
            (click)="changePage(currentPage + 1)"
          >
            Next →
          </button>
        </div>
      </div>

      <!-- Featured Categories -->
      <div class="featured-categories">
        <h2>Popular Categories</h2>
        <div class="categories-grid">
          <div
            class="category-card"
            *ngFor="let category of featuredCategories"
            (click)="selectCategory(category.id)"
          >
            <div class="category-icon">{{ category.icon }}</div>
            <h3>{{ category.name }}</h3>
            <p>{{ category.count }} courses</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .courses-container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .courses-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 2rem;
      border-radius: 12px;
      margin-bottom: 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header-content h1 {
      margin: 0 0 0.5rem 0;
      font-size: 2rem;
    }

    .header-content p {
      margin: 0;
      opacity: 0.9;
    }

    .btn-primary {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.3);
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.3s ease;
    }

    .btn-primary:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    .filters-section {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      margin-bottom: 2rem;
    }

    .search-box {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
    }

    .search-input {
      flex: 1;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 1rem;
    }

    .search-btn {
      padding: 0.75rem;
      border: 1px solid #ddd;
      background: white;
      border-radius: 8px;
      cursor: pointer;
    }

    .filter-controls {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .filter-group label {
      font-weight: 600;
      color: #333;
    }

    .filter-group select {
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 8px;
      background: white;
    }

    .courses-content {
      margin-bottom: 3rem;
    }

    .courses-stats {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .view-toggle {
      display: flex;
      gap: 0.5rem;
    }

    .view-btn {
      padding: 0.5rem;
      border: 1px solid #ddd;
      background: white;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .view-btn.active {
      background: #667eea;
      color: white;
      border-color: #667eea;
    }

    .courses-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 2rem;
    }

    .courses-grid.list-view {
      grid-template-columns: 1fr;
    }

    .course-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      transition: transform 0.3s ease;
      cursor: pointer;
    }

    .course-card:hover {
      transform: translateY(-4px);
    }

    .course-image {
      position: relative;
      height: 200px;
      overflow: hidden;
    }

    .course-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .course-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .course-card:hover .course-overlay {
      opacity: 1;
    }

    .btn-play {
      background: white;
      border: none;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      cursor: pointer;
      font-size: 1.5rem;
    }

    .course-badges {
      position: absolute;
      top: 1rem;
      left: 1rem;
      display: flex;
      gap: 0.5rem;
    }

    .badge-new, .badge-popular, .badge-free {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .badge-new { background: #4caf50; color: white; }
    .badge-popular { background: #ff9800; color: white; }
    .badge-free { background: #2196f3; color: white; }

    .course-content {
      padding: 1.5rem;
    }

    .course-category {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .category-tag, .level-tag {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .category-tag { background: #e3f2fd; color: #2196f3; }
    .level-tag { background: #e8f5e8; color: #4caf50; }

    .course-title {
      margin: 0 0 0.5rem 0;
      font-size: 1.25rem;
      color: #333;
      line-height: 1.3;
    }

    .course-description {
      margin: 0 0 1rem 0;
      color: #666;
      line-height: 1.5;
    }

    .course-instructor {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .course-instructor img {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      object-fit: cover;
    }

    .course-instructor span {
      font-size: 0.9rem;
      color: #666;
    }

    .course-meta {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
      font-size: 0.85rem;
      color: #999;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .course-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 1rem;
      border-top: 1px solid #eee;
    }

    .course-price {
      font-weight: 600;
    }

    .price {
      color: #667eea;
      font-size: 1.1rem;
    }

    .price-free {
      color: #4caf50;
      font-size: 1.1rem;
    }

    .btn-enroll {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 6px;
      background: #667eea;
      color: white;
      cursor: pointer;
      font-weight: 600;
      transition: background 0.3s ease;
    }

    .btn-enroll:hover {
      background: #5a6fd8;
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      margin-top: 2rem;
    }

    .page-btn {
      padding: 0.5rem 1rem;
      border: 1px solid #ddd;
      background: white;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .page-btn:hover:not(:disabled) {
      background: #667eea;
      color: white;
      border-color: #667eea;
    }

    .page-btn.active {
      background: #667eea;
      color: white;
      border-color: #667eea;
    }

    .page-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .page-numbers {
      display: flex;
      gap: 0.5rem;
    }

    .featured-categories {
      margin-top: 3rem;
    }

    .featured-categories h2 {
      margin: 0 0 1.5rem 0;
      color: #333;
      font-size: 1.5rem;
    }

    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
    }

    .category-card {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      text-align: center;
      cursor: pointer;
      transition: transform 0.3s ease;
    }

    .category-card:hover {
      transform: translateY(-4px);
    }

    .category-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .category-card h3 {
      margin: 0 0 0.5rem 0;
      color: #333;
    }

    .category-card p {
      margin: 0;
      color: #666;
      font-size: 0.9rem;
    }

    @media (max-width: 768px) {
      .courses-container {
        padding: 1rem;
      }

      .courses-header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }

      .filter-controls {
        grid-template-columns: 1fr;
      }

      .courses-grid {
        grid-template-columns: 1fr;
      }

      .courses-stats {
        flex-direction: column;
        gap: 1rem;
      }

      .pagination {
        flex-wrap: wrap;
      }
    }
  `]
})
export class CoursesComponent implements OnInit {
  searchQuery = '';
  selectedCategory = '';
  selectedLevel = '';
  selectedPrice = '';
  sortBy = 'popular';
  viewMode = 'grid';
  currentPage = 1;
  totalPages = 1;
  filteredCourses: Course[] = [];
  categories: any[] = [];
  featuredCategories = [
    { id: 1, name: 'Programming', icon: '💻', count: 150 },
    { id: 2, name: 'Design', icon: '🎨', count: 89 },
    { id: 3, name: 'Business', icon: '💼', count: 120 },
    { id: 4, name: 'Marketing', icon: '📈', count: 95 },
    { id: 5, name: 'Languages', icon: '🌍', count: 67 },
    { id: 6, name: 'Music', icon: '🎵', count: 45 }
  ];

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.loadCourses();
    this.loadCategories();
  }

  loadCourses(): void {
    const filters = {
      search: this.searchQuery,
      category: this.selectedCategory as any,
      level: this.selectedLevel as any,
      page: this.currentPage
    };

    this.courseService.getCourses(filters).subscribe({
      next: (response) => {
        this.filteredCourses = response.courses;
        this.totalPages = response.totalPages;
      },
      error: (error) => {
        console.error('Error loading courses:', error);
      }
    });
  }

  loadCategories(): void {
    this.courseService.getCourseCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  onSearchChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.loadCourses();
  }

  setViewMode(mode: string): void {
    this.viewMode = mode;
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.loadCourses();
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(this.totalPages, this.currentPage + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

  selectCategory(categoryId: number): void {
    this.selectedCategory = categoryId.toString();
    this.applyFilters();
  }
} 