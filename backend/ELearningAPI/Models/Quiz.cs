using System.ComponentModel.DataAnnotations;

namespace ELearningAPI.Models
{
    public class Quiz
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;
        
        [MaxLength(1000)]
        public string Description { get; set; } = string.Empty;
        
        public int CourseId { get; set; }
        public int? LessonId { get; set; }
        public int TimeLimit { get; set; } // in minutes
        public int PassingScore { get; set; } // percentage
        public int MaxAttempts { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        [System.Text.Json.Serialization.JsonIgnore]
        public virtual ICollection<Question> Questions { get; set; } = new List<Question>();
        [System.Text.Json.Serialization.JsonIgnore]
        public virtual ICollection<QuizAttempt> Attempts { get; set; } = new List<QuizAttempt>();
    }

    public class Question
    {
        public int Id { get; set; }
        public int QuizId { get; set; }
        
        [Required]
        [MaxLength(1000)]
        public string Text { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(50)]
        public string Type { get; set; } = string.Empty; // single_choice, multiple_choice, true_false, fill_blank, essay
        
        public int Points { get; set; }
        public int Order { get; set; }
        
        [MaxLength(500)]
        public string? CorrectAnswer { get; set; }
        
        [MaxLength(1000)]
        public string? Explanation { get; set; }
        
        // Navigation properties
        [System.Text.Json.Serialization.JsonIgnore]
        public virtual Quiz Quiz { get; set; } = null!;
        [System.Text.Json.Serialization.JsonIgnore]
        public virtual ICollection<QuestionOption> Options { get; set; } = new List<QuestionOption>();
    }

    public class QuestionOption
    {
        public int Id { get; set; }
        public int QuestionId { get; set; }
        
        [Required]
        [MaxLength(500)]
        public string Text { get; set; } = string.Empty;
        
        public bool IsCorrect { get; set; }
        public int Order { get; set; }
        
        // Navigation properties
        [System.Text.Json.Serialization.JsonIgnore]
        public virtual Question Question { get; set; } = null!;
    }

    public class QuizAttempt
    {
        public int Id { get; set; }
        public int QuizId { get; set; }
        public int UserId { get; set; }
        public DateTime StartedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
        public int Score { get; set; }
        public int MaxScore { get; set; }
        public double Percentage { get; set; }
        public bool IsPassed { get; set; }
        public int TimeSpent { get; set; } // in seconds
        
        // Navigation properties
        [System.Text.Json.Serialization.JsonIgnore]
        public virtual Quiz Quiz { get; set; } = null!;
        [System.Text.Json.Serialization.JsonIgnore]
        public virtual ICollection<QuizAnswer> Answers { get; set; } = new List<QuizAnswer>();
    }

    public class QuizAnswer
    {
        public int Id { get; set; }
        public int AttemptId { get; set; }
        public int QuestionId { get; set; }
        
        [MaxLength(1000)]
        public string Answer { get; set; } = string.Empty;
        
        public bool IsCorrect { get; set; }
        public int PointsEarned { get; set; }
        public int TimeSpent { get; set; } // in seconds
        
        // Navigation properties
        [System.Text.Json.Serialization.JsonIgnore]
        public virtual QuizAttempt Attempt { get; set; } = null!;
    }

    public class QuizResult
    {
        public QuizAttempt Attempt { get; set; } = null!;
        public ICollection<Question> Questions { get; set; } = new List<Question>();
        public ICollection<QuizAnswer> Answers { get; set; } = new List<QuizAnswer>();
        public string Feedback { get; set; } = string.Empty;
    }
} 