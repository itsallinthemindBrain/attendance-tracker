using AttendanceTracker.Core.Enums;

namespace AttendanceTracker.Core.Entities;

public class TrainingActivity
{
    public int Id { get; set; }
    public int EmployeeId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? ProofImagePath { get; set; }
    public TrainingStatus Status { get; set; }
    public DateTime SubmittedAt { get; set; }
    public DateTime? ReviewedAt { get; set; }
    public string? ReviewerNotes { get; set; }

    public Employee Employee { get; set; } = null!;
}
