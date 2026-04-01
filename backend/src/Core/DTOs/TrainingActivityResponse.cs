using AttendanceTracker.Core.Enums;

namespace AttendanceTracker.Core.DTOs;

public record TrainingActivityResponse(
    int Id,
    int EmployeeId,
    string Title,
    string? Description,
    string? ProofImagePath,
    TrainingStatus Status,
    DateTime SubmittedAt,
    DateTime? ReviewedAt,
    string? ReviewerNotes);
