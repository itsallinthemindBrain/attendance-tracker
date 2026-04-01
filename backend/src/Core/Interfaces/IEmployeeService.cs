using AttendanceTracker.Core.DTOs;

namespace AttendanceTracker.Core.Interfaces;

public interface IEmployeeService
{
    Task<EmployeeResponse> CreateAsync(CreateEmployeeRequest request);
    Task<IReadOnlyList<EmployeeResponse>> GetAllAsync();
    Task<EmployeeResponse?> GetByIdAsync(int id);
}
