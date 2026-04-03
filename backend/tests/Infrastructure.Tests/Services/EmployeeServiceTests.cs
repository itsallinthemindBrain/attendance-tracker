using AttendanceTracker.Core.DTOs;
using AttendanceTracker.Infrastructure.Data;
using AttendanceTracker.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;

namespace AttendanceTracker.Infrastructure.Tests.Services;

public class EmployeeServiceTests : IDisposable
{
    private readonly AppDbContext _db;
    private readonly EmployeeService _sut;

    public EmployeeServiceTests()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        _db = new AppDbContext(options);
        _sut = new EmployeeService(_db);
    }

    public void Dispose() => _db.Dispose();

    [Fact]
    public async Task Create_PersistsEmployee_AndReturnsResponse()
    {
        var request = new CreateEmployeeRequest("EMP001", "Jane Doe", "jane@example.com", "IT");

        var result = await _sut.CreateAsync(request);

        Assert.Equal("EMP001", result.EmployeeCode);
        Assert.Equal("Jane Doe", result.FullName);
        Assert.Equal("IT", result.Department);
    }

    [Fact]
    public async Task Create_AssignsId_OnPersist()
    {
        var request = new CreateEmployeeRequest("EMP001", "Jane Doe", "jane@example.com", "IT");

        var result = await _sut.CreateAsync(request);

        Assert.True(result.Id > 0);
    }

    [Fact]
    public async Task GetAll_ReturnsAllEmployees()
    {
        await _sut.CreateAsync(new CreateEmployeeRequest("EMP001", "Jane Doe", "jane@example.com", "IT"));
        await _sut.CreateAsync(new CreateEmployeeRequest("EMP002", "John Doe", "john@example.com", "HR"));

        var results = await _sut.GetAllAsync();

        Assert.Equal(2, results.Count);
    }

    [Fact]
    public async Task GetAll_ReturnsEmpty_WhenNoEmployees()
    {
        var results = await _sut.GetAllAsync();

        Assert.Empty(results);
    }

    [Fact]
    public async Task GetById_ReturnsEmployee_WhenFound()
    {
        var created = await _sut.CreateAsync(new CreateEmployeeRequest("EMP001", "Jane Doe", "jane@example.com", "IT"));

        var result = await _sut.GetByIdAsync(created.Id);

        Assert.NotNull(result);
        Assert.Equal(created.Id, result.Id);
        Assert.Equal("EMP001", result.EmployeeCode);
    }

    [Fact]
    public async Task GetById_ReturnsNull_WhenNotFound()
    {
        var result = await _sut.GetByIdAsync(999);

        Assert.Null(result);
    }
}
