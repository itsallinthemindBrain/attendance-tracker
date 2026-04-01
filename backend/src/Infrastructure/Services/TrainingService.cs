using AttendanceTracker.Core.DTOs;
using AttendanceTracker.Core.Entities;
using AttendanceTracker.Core.Enums;
using AttendanceTracker.Core.Interfaces;
using AttendanceTracker.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AttendanceTracker.Infrastructure.Services;

public class TrainingService(AppDbContext db) : ITrainingService
{
    public async Task<TrainingActivityResponse> CreateAsync(CreateTrainingRequest request)
    {
        var activity = new TrainingActivity
        {
            EmployeeId = request.EmployeeId,
            Title = request.Title,
            Description = request.Description,
            Status = TrainingStatus.Pending,
            SubmittedAt = DateTime.UtcNow
        };
        db.TrainingActivities.Add(activity);
        await db.SaveChangesAsync();
        return ToResponse(activity);
    }

    public async Task<IReadOnlyList<TrainingActivityResponse>> GetActivitiesAsync(int? employeeId, TrainingStatus? status)
    {
        var query = db.TrainingActivities.AsNoTracking();
        if (employeeId.HasValue) query = query.Where(a => a.EmployeeId == employeeId);
        if (status.HasValue) query = query.Where(a => a.Status == status);
        return await query
            .Select(a => new TrainingActivityResponse(
                a.Id, a.EmployeeId, a.Title, a.Description, a.ProofImagePath,
                a.Status, a.SubmittedAt, a.ReviewedAt, a.ReviewerNotes))
            .ToListAsync();
    }

    public async Task<TrainingActivityResponse?> SubmitAsync(int id, SubmitTrainingRequest request)
    {
        var activity = await db.TrainingActivities.FindAsync(id);
        if (activity is null) return null;
        activity.Status = TrainingStatus.Submitted;
        activity.ProofImagePath = request.ProofImagePath;
        await db.SaveChangesAsync();
        return ToResponse(activity);
    }

    public async Task<TrainingActivityResponse?> ReviewAsync(int id, ReviewTrainingRequest request)
    {
        var activity = await db.TrainingActivities.FindAsync(id);
        if (activity is null) return null;
        activity.Status = request.Approved ? TrainingStatus.Approved : TrainingStatus.Rejected;
        activity.ReviewedAt = DateTime.UtcNow;
        activity.ReviewerNotes = request.ReviewerNotes;
        await db.SaveChangesAsync();
        return ToResponse(activity);
    }

    private static TrainingActivityResponse ToResponse(TrainingActivity a) =>
        new(a.Id, a.EmployeeId, a.Title, a.Description, a.ProofImagePath,
            a.Status, a.SubmittedAt, a.ReviewedAt, a.ReviewerNotes);
}
