namespace AttendanceTracker.Core.DTOs;

public record CreateEmployeeRequest(
    string EmployeeCode,
    string FullName,
    string Email,
    string Department);
