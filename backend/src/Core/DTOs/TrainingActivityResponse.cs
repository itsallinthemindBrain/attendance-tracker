using AttendanceTracker.Core.Enums;

namespace AttendanceTracker.Core.DTOs;

public record TrainingActivityResponse(
    int Id,
    string UserId,
    string Title,
    string? Description,
    string? ProofImagePath,
    TrainingStatus Status,
    DateTime SubmittedAt,
    DateTime? ReviewedAt,
    string? ReviewerNotes);
