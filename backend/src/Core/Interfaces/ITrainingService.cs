using AttendanceTracker.Core.DTOs;
using AttendanceTracker.Core.Enums;

namespace AttendanceTracker.Core.Interfaces;

public interface ITrainingService
{
    Task<TrainingActivityResponse> CreateAsync(CreateTrainingRequest request);
    Task<IReadOnlyList<TrainingActivityResponse>> GetActivitiesAsync(int? employeeId, TrainingStatus? status);
    Task<TrainingActivityResponse?> SubmitAsync(int id, SubmitTrainingRequest request);
    Task<TrainingActivityResponse?> ReviewAsync(int id, ReviewTrainingRequest request);
}
