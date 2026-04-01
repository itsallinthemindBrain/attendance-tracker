namespace AttendanceTracker.Core.DTOs;

public record CreateTrainingRequest(int EmployeeId, string Title, string? Description);
