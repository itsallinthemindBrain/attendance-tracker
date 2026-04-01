namespace AttendanceTracker.Core.DTOs;

public record AttendanceRecordResponse(
    int Id,
    int EmployeeId,
    DateTime ClockIn,
    DateTime? ClockOut,
    DateOnly Date,
    string? Notes);
