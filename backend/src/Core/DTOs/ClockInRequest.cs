namespace AttendanceTracker.Core.DTOs;

public record ClockInRequest(int EmployeeId, string? Notes);
