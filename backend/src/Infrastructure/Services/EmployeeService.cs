using AttendanceTracker.Core.DTOs;
using AttendanceTracker.Core.Entities;
using AttendanceTracker.Core.Interfaces;
using AttendanceTracker.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AttendanceTracker.Infrastructure.Services;

public class EmployeeService(AppDbContext db) : IEmployeeService
{
    public async Task<EmployeeResponse> CreateAsync(CreateEmployeeRequest request)
    {
        var employee = new Employee
        {
            EmployeeCode = request.EmployeeCode,
            FullName = request.FullName,
            Email = request.Email,
            Department = request.Department,
            CreatedAt = DateTime.UtcNow
        };
        db.Employees.Add(employee);
        await db.SaveChangesAsync();
        return ToResponse(employee);
    }

    public async Task<IReadOnlyList<EmployeeResponse>> GetAllAsync() =>
        await db.Employees
            .AsNoTracking()
            .Select(e => new EmployeeResponse(e.Id, e.EmployeeCode, e.FullName, e.Email, e.Department, e.CreatedAt))
            .ToListAsync();

    public async Task<EmployeeResponse?> GetByIdAsync(int id)
    {
        var employee = await db.Employees.FindAsync(id);
        return employee is null ? null : ToResponse(employee);
    }

    private static EmployeeResponse ToResponse(Employee e) =>
        new(e.Id, e.EmployeeCode, e.FullName, e.Email, e.Department, e.CreatedAt);
}
