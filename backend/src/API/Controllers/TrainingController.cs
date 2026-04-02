using System.Security.Claims;
using AttendanceTracker.Core.DTOs;
using AttendanceTracker.Core.Enums;
using AttendanceTracker.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AttendanceTracker.API.Controllers;

[ApiController]
[Route("api/training")]
[Authorize]
public class TrainingController(ITrainingService training) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateTrainingRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var result = await training.CreateAsync(userId, request.Title, request.Description);
        return Created($"/api/training/{result.Id}", result);
    }

    [HttpGet]
    public async Task<IActionResult> GetActivities([FromQuery] TrainingStatus? status)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var result = await training.GetActivitiesAsync(userId, status);
        return Ok(result);
    }

    [HttpPatch("{id}/submit")]
    public async Task<IActionResult> Submit(int id, [FromBody] SubmitTrainingRequest request)
    {
        var result = await training.SubmitAsync(id, request);
        return result is null ? NotFound() : Ok(result);
    }

    [HttpPatch("{id}/review")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Review(int id, [FromBody] ReviewTrainingRequest request)
    {
        var result = await training.ReviewAsync(id, request);
        return result is null ? NotFound() : Ok(result);
    }
}
