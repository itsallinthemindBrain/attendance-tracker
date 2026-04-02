namespace AttendanceTracker.Core.DTOs;

public record RegisterRequest(
    string EmployeeCode,
    string FullName,
    string Email,
    string Password,
    string Department
);
