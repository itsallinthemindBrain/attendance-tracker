using AttendanceTracker.Core.DTOs;
using AttendanceTracker.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AttendanceTracker.API.Controllers;

[ApiController]
[Route("api/attendance")]
[Authorize]
public class AttendanceController(IAttendanceService attendance) : ControllerBase
{
    [HttpPost("clock-in")]
    public async Task<IActionResult> ClockIn([FromBody] ClockInRequest request)
    {
        var result = await attendance.ClockInAsync(request);
        return Created($"/api/attendance/{result.Id}", result);
    }

    [HttpPost("clock-out/{id}")]
    public async Task<IActionResult> ClockOut(int id)
    {
        var result = await attendance.ClockOutAsync(id);
        return result is null ? NotFound() : Ok(result);
    }

    [HttpGet]
    public async Task<IActionResult> GetRecords([FromQuery] int? employeeId, [FromQuery] DateOnly? date)
    {
        var result = await attendance.GetRecordsAsync(employeeId, date);
        return Ok(result);
    }
}
