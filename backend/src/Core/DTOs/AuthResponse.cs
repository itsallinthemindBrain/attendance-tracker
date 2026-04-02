namespace AttendanceTracker.Core.DTOs;

public record AuthResponse(
    string Id,
    string Email,
    string FullName,
    string EmployeeCode,
    string Department,
    IList<string> Roles
);
