using AttendanceTracker.Core.DTOs;

namespace AttendanceTracker.Core.Interfaces;

public interface IAttendanceService
{
    Task<AttendanceRecordResponse> ClockInAsync(string userId, string? notes);
    Task<AttendanceRecordResponse?> ClockOutAsync(int id);
    Task<IReadOnlyList<AttendanceRecordResponse>> GetRecordsAsync(string userId, DateOnly? date);
}
