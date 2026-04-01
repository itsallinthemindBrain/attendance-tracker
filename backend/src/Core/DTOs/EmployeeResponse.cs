namespace AttendanceTracker.Core.DTOs;

public record EmployeeResponse(
    int Id,
    string EmployeeCode,
    string FullName,
    string Email,
    string Department,
    DateTime CreatedAt);
