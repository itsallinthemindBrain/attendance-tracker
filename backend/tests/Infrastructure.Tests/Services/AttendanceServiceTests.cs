using AttendanceTracker.Infrastructure.Data;
using AttendanceTracker.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;

namespace AttendanceTracker.Infrastructure.Tests.Services;

public class AttendanceServiceTests : IDisposable
{
    private readonly AppDbContext _db;
    private readonly AttendanceService _sut;

    public AttendanceServiceTests()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        _db = new AppDbContext(options);
        _sut = new AttendanceService(_db);
    }

    public void Dispose() => _db.Dispose();

    [Fact]
    public async Task ClockIn_CreatesRecord_WithCorrectUserId()
    {
        var result = await _sut.ClockInAsync("user-1", null);

        Assert.Equal("user-1", result.UserId);
    }

    [Fact]
    public async Task ClockIn_SetsDate_ToToday()
    {
        var result = await _sut.ClockInAsync("user-1", null);

        Assert.Equal(DateOnly.FromDateTime(DateTime.UtcNow), result.Date);
    }

    [Fact]
    public async Task ClockIn_StoresNotes_WhenProvided()
    {
        var result = await _sut.ClockInAsync("user-1", "feeling great");

        Assert.Equal("feeling great", result.Notes);
    }

    [Fact]
    public async Task ClockIn_LeavesClockOut_Null()
    {
        var result = await _sut.ClockInAsync("user-1", null);

        Assert.Null(result.ClockOut);
    }

    [Fact]
    public async Task ClockOut_SetsClockOut_OnExistingRecord()
    {
        var record = await _sut.ClockInAsync("user-1", null);

        var result = await _sut.ClockOutAsync(record.Id);

        Assert.NotNull(result?.ClockOut);
    }

    [Fact]
    public async Task ClockOut_ReturnsNull_WhenRecordNotFound()
    {
        var result = await _sut.ClockOutAsync(999);

        Assert.Null(result);
    }

    [Fact]
    public async Task GetRecords_ReturnsOnlyCurrentUserRecords()
    {
        await _sut.ClockInAsync("user-1", null);
        await _sut.ClockInAsync("user-2", null);

        var results = await _sut.GetRecordsAsync("user-1", null);

        Assert.All(results, r => Assert.Equal("user-1", r.UserId));
    }

    [Fact]
    public async Task GetRecords_ReturnsEmpty_WhenUserHasNoRecords()
    {
        var results = await _sut.GetRecordsAsync("user-1", null);

        Assert.Empty(results);
    }

    [Fact]
    public async Task GetRecords_FiltersByDate_ReturnsEmpty_WhenNoMatch()
    {
        await _sut.ClockInAsync("user-1", null);
        var yesterday = DateOnly.FromDateTime(DateTime.UtcNow).AddDays(-1);

        var results = await _sut.GetRecordsAsync("user-1", yesterday);

        Assert.Empty(results);
    }

    [Fact]
    public async Task GetRecords_FiltersByDate_ReturnsRecord_WhenDateMatches()
    {
        await _sut.ClockInAsync("user-1", null);
        var today = DateOnly.FromDateTime(DateTime.UtcNow);

        var results = await _sut.GetRecordsAsync("user-1", today);

        Assert.Single(results);
    }
}
