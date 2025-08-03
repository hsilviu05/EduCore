using Microsoft.AspNetCore.Mvc;
using ELearningAPI.Models;

namespace ELearningAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CoursesController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetCourses([FromQuery] string? search, [FromQuery] string? category, [FromQuery] string? level, [FromQuery] int page = 1)
        {
            var courses = new[]
            {
                new
                {
                    id = 1,
                    title = "JavaScript Fundamentals",
                    description = "Learn the basics of JavaScript programming",
                    shortDescription = "Master JavaScript fundamentals",
                    instructor = new
                    {
                        id = 1,
                        firstName = "John",
                        lastName = "Doe",
                        username = "john_doe"
                    },
                    category = "programming",
                    level = "beginner",
                    duration = 360,
                    price = 49.99,
                    isFree = false,
                    thumbnail = "/assets/images/programming-js.svg",
                    rating = 4.8,
                    totalRatings = 1250,
                    enrolledStudents = 5000,
                    isPublished = true,
                    createdAt = DateTime.Now.AddDays(-30),
                    updatedAt = DateTime.Now.AddDays(-5),
                    lessons = new[]
                    {
                        new { id = 1, title = "Introduction to JavaScript", duration = 15 },
                        new { id = 2, title = "Variables and Data Types", duration = 20 },
                        new { id = 3, title = "Functions and Scope", duration = 25 }
                    },
                    requirements = new[] { "Basic computer knowledge", "No programming experience required" },
                    learningOutcomes = new[] { "Understand JavaScript syntax", "Write basic programs", "Debug code effectively" },
                    tags = new[] { "javascript", "programming", "beginner" }
                },
                new
                {
                    id = 2,
                    title = "React Fundamentals",
                    description = "Build modern web applications with React",
                    shortDescription = "Master React development",
                    instructor = new
                    {
                        id = 2,
                        firstName = "Jane",
                        lastName = "Smith",
                        username = "jane_smith"
                    },
                    category = "programming",
                    level = "intermediate",
                    duration = 480,
                    price = 79.99,
                    isFree = false,
                    thumbnail = "/assets/images/programming-react.svg",
                    rating = 4.9,
                    totalRatings = 890,
                    enrolledStudents = 3200,
                    isPublished = true,
                    createdAt = DateTime.Now.AddDays(-25),
                    updatedAt = DateTime.Now.AddDays(-3),
                    lessons = new[]
                    {
                        new { id = 4, title = "Introduction to React", duration = 20 },
                        new { id = 5, title = "Components and Props", duration = 25 },
                        new { id = 6, title = "State and Lifecycle", duration = 30 }
                    },
                    requirements = new[] { "JavaScript knowledge", "Basic HTML/CSS" },
                    learningOutcomes = new[] { "Build React components", "Manage component state", "Create interactive UIs" },
                    tags = new[] { "react", "javascript", "frontend" }
                },
                new
                {
                    id = 3,
                    title = "Node.js Backend Development",
                    description = "Create robust backend APIs with Node.js",
                    shortDescription = "Master Node.js backend development",
                    instructor = new
                    {
                        id = 3,
                        firstName = "Mike",
                        lastName = "Johnson",
                        username = "mike_johnson"
                    },
                    category = "programming",
                    level = "advanced",
                    duration = 600,
                    price = 99.99,
                    isFree = false,
                    thumbnail = "/assets/images/programming-node.svg",
                    rating = 4.7,
                    totalRatings = 650,
                    enrolledStudents = 1800,
                    isPublished = true,
                    createdAt = DateTime.Now.AddDays(-20),
                    updatedAt = DateTime.Now.AddDays(-1),
                    lessons = new[]
                    {
                        new { id = 7, title = "Introduction to Node.js", duration = 25 },
                        new { id = 8, title = "Express.js Framework", duration = 30 },
                        new { id = 9, title = "Database Integration", duration = 35 }
                    },
                    requirements = new[] { "JavaScript knowledge", "Basic understanding of APIs" },
                    learningOutcomes = new[] { "Build RESTful APIs", "Integrate databases", "Deploy applications" },
                    tags = new[] { "nodejs", "backend", "api" }
                }
            };

            var response = new
            {
                courses = courses,
                total = courses.Length,
                page = page,
                totalPages = 1
            };

            return Ok(response);
        }

        [HttpGet("enrolled")]
        public IActionResult GetEnrolledCourses()
        {
            var enrolledCourses = new[]
            {
                new
                {
                    id = 1,
                    title = "JavaScript Fundamentals",
                    instructor = new
                    {
                        id = 1,
                        firstName = "John",
                        lastName = "Doe"
                    },
                    progress = 65,
                    thumbnail = "/assets/images/programming-js.svg",
                    duration = 360,
                    lessons = new[]
                    {
                        new { id = 1, title = "Introduction to JavaScript", isCompleted = true },
                        new { id = 2, title = "Variables and Data Types", isCompleted = true },
                        new { id = 3, title = "Functions and Scope", isCompleted = false }
                    }
                },
                new
                {
                    id = 2,
                    title = "React Fundamentals",
                    instructor = new
                    {
                        id = 2,
                        firstName = "Jane",
                        lastName = "Smith"
                    },
                    progress = 30,
                    thumbnail = "/assets/images/programming-react.svg",
                    duration = 480,
                    lessons = new[]
                    {
                        new { id = 4, title = "Introduction to React", isCompleted = true },
                        new { id = 5, title = "Components and Props", isCompleted = false },
                        new { id = 6, title = "State and Lifecycle", isCompleted = false }
                    }
                },
                new
                {
                    id = 3,
                    title = "Node.js Backend Development",
                    instructor = new
                    {
                        id = 3,
                        firstName = "Mike",
                        lastName = "Johnson"
                    },
                    progress = 85,
                    thumbnail = "/assets/images/programming-node.svg",
                    duration = 600,
                    lessons = new[]
                    {
                        new { id = 7, title = "Introduction to Node.js", isCompleted = true },
                        new { id = 8, title = "Express.js Framework", isCompleted = true },
                        new { id = 9, title = "Database Integration", isCompleted = true }
                    }
                }
            };

            return Ok(enrolledCourses);
        }

        [HttpGet("categories")]
        public IActionResult GetCourseCategories()
        {
            var categories = new[]
            {
                new { id = "programming", name = "Programming", count = 150 },
                new { id = "design", name = "Design", count = 89 },
                new { id = "business", name = "Business", count = 120 },
                new { id = "marketing", name = "Marketing", count = 95 },
                new { id = "languages", name = "Languages", count = 67 },
                new { id = "music", name = "Music", count = 45 }
            };

            return Ok(categories);
        }

        [HttpGet("featured")]
        public IActionResult GetFeaturedCourses()
        {
            var featuredCourses = new[]
            {
                new
                {
                    id = 1,
                    title = "JavaScript Fundamentals",
                    instructor = new { firstName = "John", lastName = "Doe" },
                    thumbnail = "/assets/images/programming-js.svg",
                    rating = 4.8,
                    duration = 6,
                    level = "beginner"
                },
                new
                {
                    id = 2,
                    title = "Vue.js Mastery",
                    instructor = new { firstName = "Jane", lastName = "Smith" },
                    thumbnail = "/assets/images/programming-vue.svg",
                    rating = 4.9,
                    duration = 8,
                    level = "intermediate"
                }
            };

            return Ok(featuredCourses);
        }

        [HttpGet("popular")]
        public IActionResult GetPopularCourses()
        {
            var popularCourses = new[]
            {
                new
                {
                    id = 1,
                    title = "JavaScript Fundamentals",
                    instructor = new { firstName = "John", lastName = "Doe" },
                    thumbnail = "https://picsum.photos/300/200",
                    rating = 4.8,
                    duration = 6,
                    level = "beginner"
                },
                new
                {
                    id = 2,
                    title = "React Fundamentals",
                    instructor = new { firstName = "Jane", lastName = "Smith" },
                    thumbnail = "https://picsum.photos/300/200",
                    rating = 4.9,
                    duration = 8,
                    level = "intermediate"
                }
            };

            return Ok(popularCourses);
        }

        [HttpGet("{id}")]
        public IActionResult GetCourseById(int id)
        {
            var course = new
            {
                id = id,
                title = "JavaScript Fundamentals",
                description = "Learn the basics of JavaScript programming",
                shortDescription = "Master JavaScript fundamentals",
                instructor = new
                {
                    id = 1,
                    firstName = "John",
                    lastName = "Doe",
                    username = "john_doe"
                },
                category = "programming",
                level = "beginner",
                duration = 360,
                price = 49.99,
                isFree = false,
                thumbnail = "https://picsum.photos/300/200",
                rating = 4.8,
                totalRatings = 1250,
                enrolledStudents = 5000,
                isPublished = true,
                createdAt = DateTime.Now.AddDays(-30),
                updatedAt = DateTime.Now.AddDays(-5),
                lessons = new[]
                {
                    new { id = 1, title = "Introduction to JavaScript", duration = 15, isCompleted = false },
                    new { id = 2, title = "Variables and Data Types", duration = 20, isCompleted = false },
                    new { id = 3, title = "Functions and Scope", duration = 25, isCompleted = false }
                },
                requirements = new[] { "Basic computer knowledge", "No programming experience required" },
                learningOutcomes = new[] { "Understand JavaScript syntax", "Write basic programs", "Debug code effectively" },
                tags = new[] { "javascript", "programming", "beginner" }
            };

            return Ok(course);
        }

        [HttpPost("{id}/enroll")]
        public IActionResult EnrollInCourse(int id)
        {
            var enrollment = new
            {
                id = 1,
                userId = 1,
                courseId = id,
                enrolledAt = DateTime.Now,
                progress = 0
            };

            return Ok(enrollment);
        }

        [HttpDelete("{id}/enroll")]
        public IActionResult UnenrollFromCourse(int id)
        {
            return Ok(new { message = "Successfully unenrolled from course" });
        }

        [HttpGet("{id}/progress")]
        public IActionResult GetCourseProgress(int id)
        {
            var progress = new
            {
                progress = 65,
                completedLessons = 2,
                totalLessons = 3
            };

            return Ok(progress);
        }
    }
} 