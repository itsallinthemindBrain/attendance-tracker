using AttendanceTracker.Core.DTOs;
using AttendanceTracker.Core.Enums;

namespace AttendanceTracker.Core.Interfaces;

public interface ITrainingService
{
    Task<TrainingActivityResponse> CreateAsync(string userId, string title, string? description);
    Task<IReadOnlyList<TrainingActivityResponse>> GetActivitiesAsync(string userId, TrainingStatus? status);
    Task<TrainingActivityResponse?> SubmitAsync(int id, SubmitTrainingRequest request);
    Task<TrainingActivityResponse?> ReviewAsync(int id, ReviewTrainingRequest request);
}
