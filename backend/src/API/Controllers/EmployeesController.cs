using AttendanceTracker.Core.DTOs;
using AttendanceTracker.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AttendanceTracker.API.Controllers;

[ApiController]
[Route("api/employees")]
public class EmployeesController(IEmployeeService employees) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateEmployeeRequest request)
    {
        var result = await employees.CreateAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await employees.GetAllAsync();
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await employees.GetByIdAsync(id);
        return result is null ? NotFound() : Ok(result);
    }
}
