using AttendanceTracker.Core.DTOs;
using AttendanceTracker.Core.Enums;
using AttendanceTracker.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AttendanceTracker.API.Controllers;

[ApiController]
[Route("api/training")]
public class TrainingController(ITrainingService training) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateTrainingRequest request)
    {
        var result = await training.CreateAsync(request);
        return Created($"/api/training/{result.Id}", result);
    }

    [HttpGet]
    public async Task<IActionResult> GetActivities([FromQuery] int? employeeId, [FromQuery] TrainingStatus? status)
    {
        var result = await training.GetActivitiesAsync(employeeId, status);
        return Ok(result);
    }

    [HttpPatch("{id}/submit")]
    public async Task<IActionResult> Submit(int id, [FromBody] SubmitTrainingRequest request)
    {
        var result = await training.SubmitAsync(id, request);
        return result is null ? NotFound() : Ok(result);
    }

    [HttpPatch("{id}/review")]
    public async Task<IActionResult> Review(int id, [FromBody] ReviewTrainingRequest request)
    {
        var result = await training.ReviewAsync(id, request);
        return result is null ? NotFound() : Ok(result);
    }
}
