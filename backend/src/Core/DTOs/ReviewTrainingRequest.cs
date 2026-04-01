namespace AttendanceTracker.Core.DTOs;

public record ReviewTrainingRequest(bool Approved, string? ReviewerNotes);
