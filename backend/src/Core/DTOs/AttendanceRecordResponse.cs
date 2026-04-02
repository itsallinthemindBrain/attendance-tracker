namespace AttendanceTracker.Core.DTOs;

public record AttendanceRecordResponse(
    int Id,
    string UserId,
    DateTime ClockIn,
    DateTime? ClockOut,
    DateOnly Date,
    string? Notes);
