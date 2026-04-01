using AttendanceTracker.Core.DTOs;

namespace AttendanceTracker.Core.Interfaces;

public interface IAttendanceService
{
    Task<AttendanceRecordResponse> ClockInAsync(ClockInRequest request);
    Task<AttendanceRecordResponse?> ClockOutAsync(int id);
    Task<IReadOnlyList<AttendanceRecordResponse>> GetRecordsAsync(int? employeeId, DateOnly? date);
}
