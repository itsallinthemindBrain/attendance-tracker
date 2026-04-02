using AttendanceTracker.Core.DTOs;
using AttendanceTracker.Core.Entities;
using AttendanceTracker.Core.Interfaces;
using AttendanceTracker.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AttendanceTracker.Infrastructure.Services;

public class AttendanceService(AppDbContext db) : IAttendanceService
{
    public async Task<AttendanceRecordResponse> ClockInAsync(string userId, string? notes)
    {
        var now = DateTime.UtcNow;
        var record = new AttendanceRecord
        {
            UserId = userId,
            ClockIn = now,
            Date = DateOnly.FromDateTime(now),
            Notes = notes,
        };
        db.AttendanceRecords.Add(record);
        await db.SaveChangesAsync();
        return ToResponse(record);
    }

    public async Task<AttendanceRecordResponse?> ClockOutAsync(int id)
    {
        var record = await db.AttendanceRecords.FindAsync(id);
        if (record is null) return null;
        record.ClockOut = DateTime.UtcNow;
        await db.SaveChangesAsync();
        return ToResponse(record);
    }

    public async Task<IReadOnlyList<AttendanceRecordResponse>> GetRecordsAsync(string userId, DateOnly? date)
    {
        var query = db.AttendanceRecords.AsNoTracking().Where(r => r.UserId == userId);
        if (date.HasValue) query = query.Where(r => r.Date == date);
        return await query
            .Select(r => new AttendanceRecordResponse(r.Id, r.UserId, r.ClockIn, r.ClockOut, r.Date, r.Notes))
            .ToListAsync();
    }

    private static AttendanceRecordResponse ToResponse(AttendanceRecord r) =>
        new(r.Id, r.UserId, r.ClockIn, r.ClockOut, r.Date, r.Notes);
}
