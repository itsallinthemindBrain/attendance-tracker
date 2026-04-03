using AttendanceTracker.Core.DTOs;
using AttendanceTracker.Core.Enums;
using AttendanceTracker.Infrastructure.Data;
using AttendanceTracker.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;

namespace AttendanceTracker.Infrastructure.Tests.Services;

public class TrainingServiceTests : IDisposable
{
    private readonly AppDbContext _db;
    private readonly TrainingService _sut;

    public TrainingServiceTests()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        _db = new AppDbContext(options);
        _sut = new TrainingService(_db);
    }

    public void Dispose() => _db.Dispose();

    [Fact]
    public async Task Create_SetsStatus_ToPending()
    {
        var result = await _sut.CreateAsync("user-1", "First Aid", null);

        Assert.Equal(TrainingStatus.Pending, result.Status);
    }

    [Fact]
    public async Task Create_StoresTitle_AndDescription()
    {
        var result = await _sut.CreateAsync("user-1", "First Aid", "Basic CPR course");

        Assert.Equal("First Aid", result.Title);
        Assert.Equal("Basic CPR course", result.Description);
    }

    [Fact]
    public async Task GetActivities_ReturnsOnlyCurrentUserActivities()
    {
        await _sut.CreateAsync("user-1", "First Aid", null);
        await _sut.CreateAsync("user-2", "Fire Safety", null);

        var results = await _sut.GetActivitiesAsync("user-1", null);

        Assert.Single(results);
        Assert.Equal("user-1", results[0].UserId);
    }

    [Fact]
    public async Task GetActivities_ReturnsEmpty_WhenUserHasNone()
    {
        var results = await _sut.GetActivitiesAsync("user-1", null);

        Assert.Empty(results);
    }

    [Fact]
    public async Task GetActivities_FiltersByStatus_ExcludesNonMatching()
    {
        var activity = await _sut.CreateAsync("user-1", "First Aid", null);
        await _sut.SubmitAsync(activity.Id, new SubmitTrainingRequest("/uploads/proof.jpg"));

        var pending = await _sut.GetActivitiesAsync("user-1", TrainingStatus.Pending);

        Assert.Empty(pending);
    }

    [Fact]
    public async Task GetActivities_FiltersByStatus_ReturnsMatching()
    {
        var activity = await _sut.CreateAsync("user-1", "First Aid", null);
        await _sut.SubmitAsync(activity.Id, new SubmitTrainingRequest("/uploads/proof.jpg"));

        var submitted = await _sut.GetActivitiesAsync("user-1", TrainingStatus.Submitted);

        Assert.Single(submitted);
    }

    [Fact]
    public async Task Submit_UpdatesStatus_ToSubmitted()
    {
        var activity = await _sut.CreateAsync("user-1", "First Aid", null);

        var result = await _sut.SubmitAsync(activity.Id, new SubmitTrainingRequest("/uploads/proof.jpg"));

        Assert.Equal(TrainingStatus.Submitted, result?.Status);
    }

    [Fact]
    public async Task Submit_StoresProofImagePath()
    {
        var activity = await _sut.CreateAsync("user-1", "First Aid", null);

        var result = await _sut.SubmitAsync(activity.Id, new SubmitTrainingRequest("/uploads/proof.jpg"));

        Assert.Equal("/uploads/proof.jpg", result?.ProofImagePath);
    }

    [Fact]
    public async Task Submit_ReturnsNull_WhenNotFound()
    {
        var result = await _sut.SubmitAsync(999, new SubmitTrainingRequest(null));

        Assert.Null(result);
    }

    [Fact]
    public async Task Review_Approve_SetsStatusToApproved()
    {
        var activity = await _sut.CreateAsync("user-1", "First Aid", null);

        var result = await _sut.ReviewAsync(activity.Id, new ReviewTrainingRequest(true, "Looks good"));

        Assert.Equal(TrainingStatus.Approved, result?.Status);
    }

    [Fact]
    public async Task Review_Approve_StoresReviewerNotes()
    {
        var activity = await _sut.CreateAsync("user-1", "First Aid", null);

        var result = await _sut.ReviewAsync(activity.Id, new ReviewTrainingRequest(true, "Looks good"));

        Assert.Equal("Looks good", result?.ReviewerNotes);
        Assert.NotNull(result?.ReviewedAt);
    }

    [Fact]
    public async Task Review_Reject_SetsStatusToRejected()
    {
        var activity = await _sut.CreateAsync("user-1", "First Aid", null);

        var result = await _sut.ReviewAsync(activity.Id, new ReviewTrainingRequest(false, "Needs more proof"));

        Assert.Equal(TrainingStatus.Rejected, result?.Status);
    }

    [Fact]
    public async Task Review_ReturnsNull_WhenNotFound()
    {
        var result = await _sut.ReviewAsync(999, new ReviewTrainingRequest(true, null));

        Assert.Null(result);
    }
}
