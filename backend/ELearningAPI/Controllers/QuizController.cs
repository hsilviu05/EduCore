using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ELearningAPI.Data;
using ELearningAPI.Models;
using System.Text.Json;

namespace ELearningAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuizController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public QuizController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/quiz
        [HttpGet]
        public async Task<ActionResult<IEnumerable<QuizDto>>> GetQuizzes()
        {
            var quizzes = await _context.Quizzes
                .Include(q => q.Questions)
                .ThenInclude(q => q.Options)
                .ToListAsync();

            var quizDtos = quizzes.Select(q => new QuizDto
            {
                Id = q.Id,
                Title = q.Title,
                Description = q.Description,
                CourseId = q.CourseId,
                LessonId = q.LessonId,
                TimeLimit = q.TimeLimit,
                PassingScore = q.PassingScore,
                MaxAttempts = q.MaxAttempts,
                IsActive = q.IsActive,
                CreatedAt = q.CreatedAt,
                UpdatedAt = q.UpdatedAt,
                Questions = q.Questions.Select(question => new QuestionDto
                {
                    Id = question.Id,
                    QuizId = question.QuizId,
                    Text = question.Text,
                    Type = question.Type,
                    Points = question.Points,
                    Order = question.Order,
                    CorrectAnswer = question.CorrectAnswer,
                    Explanation = question.Explanation,
                    Options = question.Options.Select(option => new QuestionOptionDto
                    {
                        Id = option.Id,
                        QuestionId = option.QuestionId,
                        Text = option.Text,
                        IsCorrect = option.IsCorrect,
                        Order = option.Order
                    }).ToList()
                }).ToList()
            }).ToList();

            return Ok(quizDtos);
        }

        // GET: api/quiz/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<QuizDto>> GetQuiz(int id)
        {
            var quiz = await _context.Quizzes
                .Include(q => q.Questions)
                .ThenInclude(q => q.Options)
                .FirstOrDefaultAsync(q => q.Id == id);

            if (quiz == null)
            {
                return NotFound();
            }

            var quizDto = new QuizDto
            {
                Id = quiz.Id,
                Title = quiz.Title,
                Description = quiz.Description,
                CourseId = quiz.CourseId,
                LessonId = quiz.LessonId,
                TimeLimit = quiz.TimeLimit,
                PassingScore = quiz.PassingScore,
                MaxAttempts = quiz.MaxAttempts,
                IsActive = quiz.IsActive,
                CreatedAt = quiz.CreatedAt,
                UpdatedAt = quiz.UpdatedAt,
                Questions = quiz.Questions.Select(question => new QuestionDto
                {
                    Id = question.Id,
                    QuizId = question.QuizId,
                    Text = question.Text,
                    Type = question.Type,
                    Points = question.Points,
                    Order = question.Order,
                    CorrectAnswer = question.CorrectAnswer,
                    Explanation = question.Explanation,
                    Options = question.Options.Select(option => new QuestionOptionDto
                    {
                        Id = option.Id,
                        QuestionId = option.QuestionId,
                        Text = option.Text,
                        IsCorrect = option.IsCorrect,
                        Order = option.Order
                    }).ToList()
                }).ToList()
            };

            return Ok(quizDto);
        }

        // GET: api/quiz/course/{courseId}
        [HttpGet("course/{courseId}")]
        public async Task<ActionResult<IEnumerable<QuizDto>>> GetCourseQuizzes(int courseId)
        {
            var quizzes = await _context.Quizzes
                .Include(q => q.Questions)
                .ThenInclude(q => q.Options)
                .Where(q => q.CourseId == courseId)
                .ToListAsync();

            var quizDtos = quizzes.Select(q => new QuizDto
            {
                Id = q.Id,
                Title = q.Title,
                Description = q.Description,
                CourseId = q.CourseId,
                LessonId = q.LessonId,
                TimeLimit = q.TimeLimit,
                PassingScore = q.PassingScore,
                MaxAttempts = q.MaxAttempts,
                IsActive = q.IsActive,
                CreatedAt = q.CreatedAt,
                UpdatedAt = q.UpdatedAt,
                Questions = q.Questions.Select(question => new QuestionDto
                {
                    Id = question.Id,
                    QuizId = question.QuizId,
                    Text = question.Text,
                    Type = question.Type,
                    Points = question.Points,
                    Order = question.Order,
                    CorrectAnswer = question.CorrectAnswer,
                    Explanation = question.Explanation,
                    Options = question.Options.Select(option => new QuestionOptionDto
                    {
                        Id = option.Id,
                        QuestionId = option.QuestionId,
                        Text = option.Text,
                        IsCorrect = option.IsCorrect,
                        Order = option.Order
                    }).ToList()
                }).ToList()
            }).ToList();

            return Ok(quizDtos);
        }

        // POST: api/quiz
        [HttpPost]
        public async Task<ActionResult<Quiz>> CreateQuiz(Quiz quiz)
        {
            _context.Quizzes.Add(quiz);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetQuiz), new { id = quiz.Id }, quiz);
        }

        // POST: api/quiz/initialize
        [HttpPost("initialize")]
        public async Task<ActionResult> InitializeQuizzes()
        {
            // Check if quizzes already exist
            if (await _context.Quizzes.AnyAsync())
            {
                return BadRequest("Quizzes already initialized");
            }

            var quizzes = new List<Quiz>
            {
                new Quiz
                {
                    Title = "JavaScript Fundamentals",
                    Description = "Test your knowledge of JavaScript basics including variables, functions, and control structures.",
                    CourseId = 1,
                    TimeLimit = 30,
                    PassingScore = 70,
                    MaxAttempts = 3,
                    IsActive = true,
                    Questions = new List<Question>
                    {
                        new Question
                        {
                            Text = "What is the correct way to declare a variable in JavaScript?",
                            Type = "single_choice",
                            Points = 10,
                            Order = 1,
                            Options = new List<QuestionOption>
                            {
                                new QuestionOption { Text = "var myVariable;", IsCorrect = true, Order = 1 },
                                new QuestionOption { Text = "variable myVariable;", IsCorrect = false, Order = 2 },
                                new QuestionOption { Text = "let myVariable;", IsCorrect = true, Order = 3 },
                                new QuestionOption { Text = "const myVariable;", IsCorrect = true, Order = 4 }
                            }
                        },
                        new Question
                        {
                            Text = "Which of the following are JavaScript data types?",
                            Type = "multiple_choice",
                            Points = 15,
                            Order = 2,
                            Options = new List<QuestionOption>
                            {
                                new QuestionOption { Text = "String", IsCorrect = true, Order = 1 },
                                new QuestionOption { Text = "Number", IsCorrect = true, Order = 2 },
                                new QuestionOption { Text = "Boolean", IsCorrect = true, Order = 3 },
                                new QuestionOption { Text = "Array", IsCorrect = true, Order = 4 },
                                new QuestionOption { Text = "Object", IsCorrect = true, Order = 5 }
                            }
                        },
                        new Question
                        {
                            Text = "JavaScript is a strongly typed language.",
                            Type = "true_false",
                            Points = 5,
                            Order = 3,
                            Options = new List<QuestionOption>
                            {
                                new QuestionOption { Text = "True", IsCorrect = false, Order = 1 },
                                new QuestionOption { Text = "False", IsCorrect = true, Order = 2 }
                            }
                        },
                        new Question
                        {
                            Text = "Complete the function: function add(a, b) { return _____; }",
                            Type = "fill_blank",
                            Points = 10,
                            Order = 4,
                            CorrectAnswer = "a + b"
                        }
                    }
                },
                new Quiz
                {
                    Title = "Python Basics",
                    Description = "Test your understanding of Python fundamentals including syntax, data structures, and basic operations.",
                    CourseId = 1,
                    TimeLimit = 25,
                    PassingScore = 75,
                    MaxAttempts = 3,
                    IsActive = true,
                    Questions = new List<Question>
                    {
                        new Question
                        {
                            Text = "What is the output of print(2 ** 3)?",
                            Type = "single_choice",
                            Points = 10,
                            Order = 1,
                            Options = new List<QuestionOption>
                            {
                                new QuestionOption { Text = "6", IsCorrect = false, Order = 1 },
                                new QuestionOption { Text = "8", IsCorrect = true, Order = 2 },
                                new QuestionOption { Text = "5", IsCorrect = false, Order = 3 },
                                new QuestionOption { Text = "Error", IsCorrect = false, Order = 4 }
                            }
                        },
                        new Question
                        {
                            Text = "Which of the following are valid Python data structures?",
                            Type = "multiple_choice",
                            Points = 15,
                            Order = 2,
                            Options = new List<QuestionOption>
                            {
                                new QuestionOption { Text = "List", IsCorrect = true, Order = 1 },
                                new QuestionOption { Text = "Tuple", IsCorrect = true, Order = 2 },
                                new QuestionOption { Text = "Dictionary", IsCorrect = true, Order = 3 },
                                new QuestionOption { Text = "Set", IsCorrect = true, Order = 4 }
                            }
                        },
                        new Question
                        {
                            Text = "Python uses indentation to define code blocks.",
                            Type = "true_false",
                            Points = 5,
                            Order = 3,
                            Options = new List<QuestionOption>
                            {
                                new QuestionOption { Text = "True", IsCorrect = true, Order = 1 },
                                new QuestionOption { Text = "False", IsCorrect = false, Order = 2 }
                            }
                        },
                        new Question
                        {
                            Text = "Write a function to calculate the factorial of a number: def factorial(n): _____",
                            Type = "fill_blank",
                            Points = 15,
                            Order = 4,
                            CorrectAnswer = "return 1 if n <= 1 else n * factorial(n-1)"
                        }
                    }
                },
                new Quiz
                {
                    Title = "Web Development Fundamentals",
                    Description = "Test your knowledge of HTML, CSS, and basic web development concepts.",
                    CourseId = 1,
                    TimeLimit = 20,
                    PassingScore = 70,
                    MaxAttempts = 3,
                    IsActive = true,
                    Questions = new List<Question>
                    {
                        new Question
                        {
                            Text = "What does HTML stand for?",
                            Type = "single_choice",
                            Points = 10,
                            Order = 1,
                            Options = new List<QuestionOption>
                            {
                                new QuestionOption { Text = "Hyper Text Markup Language", IsCorrect = true, Order = 1 },
                                new QuestionOption { Text = "High Tech Modern Language", IsCorrect = false, Order = 2 },
                                new QuestionOption { Text = "Home Tool Markup Language", IsCorrect = false, Order = 3 },
                                new QuestionOption { Text = "Hyperlink and Text Markup Language", IsCorrect = false, Order = 4 }
                            }
                        },
                        new Question
                        {
                            Text = "Which of the following are CSS selectors?",
                            Type = "multiple_choice",
                            Points = 15,
                            Order = 2,
                            Options = new List<QuestionOption>
                            {
                                new QuestionOption { Text = "Class selector (.class)", IsCorrect = true, Order = 1 },
                                new QuestionOption { Text = "ID selector (#id)", IsCorrect = true, Order = 2 },
                                new QuestionOption { Text = "Element selector (element)", IsCorrect = true, Order = 3 },
                                new QuestionOption { Text = "Attribute selector ([attr])", IsCorrect = true, Order = 4 }
                            }
                        },
                        new Question
                        {
                            Text = "CSS can only be written inline within HTML elements.",
                            Type = "true_false",
                            Points = 5,
                            Order = 3,
                            Options = new List<QuestionOption>
                            {
                                new QuestionOption { Text = "True", IsCorrect = false, Order = 1 },
                                new QuestionOption { Text = "False", IsCorrect = true, Order = 2 }
                            }
                        },
                        new Question
                        {
                            Text = "Explain the difference between GET and POST HTTP methods.",
                            Type = "essay",
                            Points = 20,
                            Order = 4
                        }
                    }
                },
                new Quiz
                {
                    Title = "Database Fundamentals",
                    Description = "Test your understanding of database concepts, SQL basics, and data modeling.",
                    CourseId = 1,
                    TimeLimit = 30,
                    PassingScore = 75,
                    MaxAttempts = 3,
                    IsActive = true,
                    Questions = new List<Question>
                    {
                        new Question
                        {
                            Text = "What does SQL stand for?",
                            Type = "single_choice",
                            Points = 10,
                            Order = 1,
                            Options = new List<QuestionOption>
                            {
                                new QuestionOption { Text = "Structured Query Language", IsCorrect = true, Order = 1 },
                                new QuestionOption { Text = "Simple Query Language", IsCorrect = false, Order = 2 },
                                new QuestionOption { Text = "Standard Query Language", IsCorrect = false, Order = 3 },
                                new QuestionOption { Text = "System Query Language", IsCorrect = false, Order = 4 }
                            }
                        },
                        new Question
                        {
                            Text = "Which of the following are SQL commands?",
                            Type = "multiple_choice",
                            Points = 15,
                            Order = 2,
                            Options = new List<QuestionOption>
                            {
                                new QuestionOption { Text = "SELECT", IsCorrect = true, Order = 1 },
                                new QuestionOption { Text = "INSERT", IsCorrect = true, Order = 2 },
                                new QuestionOption { Text = "UPDATE", IsCorrect = true, Order = 3 },
                                new QuestionOption { Text = "DELETE", IsCorrect = true, Order = 4 },
                                new QuestionOption { Text = "CREATE", IsCorrect = true, Order = 5 }
                            }
                        },
                        new Question
                        {
                            Text = "A primary key can have NULL values.",
                            Type = "true_false",
                            Points = 5,
                            Order = 3,
                            Options = new List<QuestionOption>
                            {
                                new QuestionOption { Text = "True", IsCorrect = false, Order = 1 },
                                new QuestionOption { Text = "False", IsCorrect = true, Order = 2 }
                            }
                        },
                        new Question
                        {
                            Text = "Write a SQL query to select all users from a table named 'users': _____",
                            Type = "fill_blank",
                            Points = 10,
                            Order = 4,
                            CorrectAnswer = "SELECT * FROM users"
                        }
                    }
                }
            };

            _context.Quizzes.AddRange(quizzes);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Quizzes initialized successfully", count = quizzes.Count });
        }

        // POST: api/quiz/{id}/start
        [HttpPost("{id}/start")]
        public async Task<ActionResult<QuizAttempt>> StartQuiz(int id)
        {
            var quiz = await _context.Quizzes.FindAsync(id);
            if (quiz == null)
            {
                return NotFound("Quiz not found");
            }

            // For demo purposes, we'll create a simple attempt
            var attempt = new QuizAttempt
            {
                QuizId = id,
                UserId = 1, // Demo user ID
                StartedAt = DateTime.UtcNow,
                Score = 0,
                MaxScore = quiz.Questions?.Sum(q => q.Points) ?? 0,
                Percentage = 0,
                IsPassed = false
            };

            _context.QuizAttempts.Add(attempt);
            await _context.SaveChangesAsync();

            return Ok(attempt);
        }

        // POST: api/quiz-attempts/{attemptId}/submit
        [HttpPost("attempts/{attemptId}/submit")]
        public async Task<ActionResult<QuizResult>> SubmitQuiz(int attemptId, [FromBody] SubmitQuizRequest request)
        {
            var attempt = await _context.QuizAttempts
                .Include(a => a.Quiz)
                .ThenInclude(q => q.Questions)
                .ThenInclude(q => q.Options)
                .FirstOrDefaultAsync(a => a.Id == attemptId);

            if (attempt == null)
            {
                return NotFound("Quiz attempt not found");
            }

            // Calculate score
            var totalScore = 0;
            var maxScore = attempt.Quiz.Questions.Sum(q => q.Points);
            var answers = new List<QuizAnswer>();

            foreach (var answer in request.Answers)
            {
                var question = attempt.Quiz.Questions.FirstOrDefault(q => q.Id == answer.QuestionId);
                if (question == null) continue;

                var isCorrect = false;
                var pointsEarned = 0;

                // Check if answer is correct
                if (question.Type == "single_choice" || question.Type == "true_false")
                {
                    var correctOption = question.Options.FirstOrDefault(o => o.IsCorrect);
                    isCorrect = correctOption != null && answer.Answer == correctOption.Text;
                }
                else if (question.Type == "multiple_choice")
                {
                    var correctOptions = question.Options.Where(o => o.IsCorrect).Select(o => o.Text).ToList();
                    var userAnswers = answer.Answer.Split(',').ToList();
                    isCorrect = correctOptions.Count == userAnswers.Count && 
                               correctOptions.All(o => userAnswers.Contains(o));
                }
                else if (question.Type == "fill_blank")
                {
                    isCorrect = answer.Answer.Trim().ToLower() == question.CorrectAnswer?.Trim().ToLower();
                }

                if (isCorrect)
                {
                    pointsEarned = question.Points;
                    totalScore += question.Points;
                }

                answers.Add(new QuizAnswer
                {
                    AttemptId = attemptId,
                    QuestionId = answer.QuestionId,
                    Answer = answer.Answer,
                    IsCorrect = isCorrect,
                    PointsEarned = pointsEarned,
                    TimeSpent = 0 // Demo value
                });
            }

            // Update attempt
            attempt.CompletedAt = DateTime.UtcNow;
            attempt.Score = totalScore;
            attempt.Percentage = (double)totalScore / maxScore * 100;
            attempt.IsPassed = attempt.Percentage >= attempt.Quiz.PassingScore;

            _context.QuizAnswers.AddRange(answers);
            await _context.SaveChangesAsync();

            var result = new QuizResult
            {
                Attempt = attempt,
                Questions = attempt.Quiz.Questions,
                Answers = answers,
                Feedback = attempt.IsPassed ? "Congratulations! You passed the quiz." : "Keep studying and try again."
            };

            return Ok(result);
        }
    }

    public class SubmitQuizRequest
    {
        public List<QuizAnswerRequest> Answers { get; set; } = new();
    }

    public class QuizAnswerRequest
    {
        public int QuestionId { get; set; }
        public string Answer { get; set; } = string.Empty;
    }
} 