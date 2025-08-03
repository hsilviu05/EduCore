using Microsoft.AspNetCore.Mvc;
using ELearningAPI.Models;

namespace ELearningAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        [HttpGet("learning-stats")]
        public IActionResult GetLearningStats()
        {
            var stats = new
            {
                totalCoursesEnrolled = 12,
                totalCoursesCompleted = 8,
                totalPoints = 2450,
                averageScore = 85,
                certificatesEarned = 5,
                learningStreak = 15
            };

            return Ok(stats);
        }

        [HttpGet("profile")]
        public IActionResult GetCurrentUserProfile()
        {
            var profile = new
            {
                user = new
                {
                    id = 1,
                    username = "john_doe",
                    email = "john@example.com",
                    firstName = "John",
                    lastName = "Doe",
                    role = "student",
                    avatar = "https://picsum.photos/150/150",
                    dateJoined = DateTime.Now.AddDays(-30),
                    lastLogin = DateTime.Now,
                    isActive = true
                },
                enrolledCourses = 12,
                completedCourses = 8,
                totalPoints = 2450,
                achievements = new[]
                {
                    new
                    {
                        id = 1,
                        name = "First Course",
                        description = "Completed your first course",
                        icon = "🎯",
                        earnedAt = DateTime.Now.AddDays(-25),
                        points = 25
                    },
                    new
                    {
                        id = 2,
                        name = "Streak Master",
                        description = "Maintained 10-day learning streak",
                        icon = "🔥",
                        earnedAt = DateTime.Now.AddDays(-10),
                        points = 50
                    }
                }
            };

            return Ok(profile);
        }

        [HttpGet("achievements")]
        public IActionResult GetUserAchievements()
        {
            var achievements = new[]
            {
                new
                {
                    id = 1,
                    name = "First Course",
                    description = "Completed your first course",
                    icon = "🎯",
                    earnedAt = DateTime.Now.AddDays(-25),
                    points = 25
                },
                new
                {
                    id = 2,
                    name = "Streak Master",
                    description = "Maintained 10-day learning streak",
                    icon = "🔥",
                    earnedAt = DateTime.Now.AddDays(-10),
                    points = 50
                },
                new
                {
                    id = 3,
                    name = "Quick Learner",
                    description = "Completed 5 courses in a month",
                    icon = "⚡",
                    earnedAt = DateTime.Now.AddDays(-5),
                    points = 100
                }
            };

            return Ok(achievements);
        }

        [HttpGet("certificates")]
        public IActionResult GetUserCertificates()
        {
            var certificates = new[]
            {
                new
                {
                    id = 1,
                    courseName = "JavaScript Fundamentals",
                    issuedAt = DateTime.Now.AddDays(-20),
                    grade = "A",
                    certificateUrl = "https://example.com/cert1.pdf"
                },
                new
                {
                    id = 2,
                    courseName = "React Basics",
                    issuedAt = DateTime.Now.AddDays(-15),
                    grade = "A+",
                    certificateUrl = "https://example.com/cert2.pdf"
                }
            };

            return Ok(certificates);
        }

        [HttpGet("activity-history")]
        public IActionResult GetUserActivityHistory()
        {
            var activities = new[]
            {
                new
                {
                    id = 1,
                    type = "course_completed",
                    title = "Completed JavaScript Fundamentals",
                    description = "You successfully completed the JavaScript Fundamentals course",
                    timestamp = DateTime.Now.AddHours(-2),
                    icon = "✅"
                },
                new
                {
                    id = 2,
                    type = "course_enrolled",
                    title = "Enrolled in React Advanced",
                    description = "You enrolled in the React Advanced course",
                    timestamp = DateTime.Now.AddDays(-1),
                    icon = "📚"
                },
                new
                {
                    id = 3,
                    type = "achievement_earned",
                    title = "Earned Quick Learner Badge",
                    description = "You earned the Quick Learner achievement",
                    timestamp = DateTime.Now.AddDays(-3),
                    icon = "🏆"
                }
            };

            return Ok(activities);
        }

        [HttpPut("profile")]
        public IActionResult UpdateProfile([FromBody] object profileData)
        {
            // Mock update - in real app, this would update the database
            return Ok(new { message = "Profile updated successfully" });
        }
    }
} 