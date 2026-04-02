using AttendanceTracker.Core.DTOs;
using AttendanceTracker.Core.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace AttendanceTracker.API.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(
    UserManager<ApplicationUser> userManager,
    SignInManager<ApplicationUser> signInManager) : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        var user = new ApplicationUser
        {
            UserName = request.Email,
            Email = request.Email,
            FullName = request.FullName,
            EmployeeCode = request.EmployeeCode,
            Department = request.Department,
            EmailConfirmed = true,
        };

        var result = await userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
            return BadRequest(new { errors = result.Errors.Select(e => e.Description) });

        await userManager.AddToRoleAsync(user, "Employee");
        await signInManager.SignInAsync(user, isPersistent: false);

        var roles = await userManager.GetRolesAsync(user);
        return Ok(ToResponse(user, roles));
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var result = await signInManager.PasswordSignInAsync(
            request.Email, request.Password,
            isPersistent: false, lockoutOnFailure: false);

        if (!result.Succeeded)
            return Unauthorized(new { error = "Invalid credentials." });

        var user = await userManager.FindByEmailAsync(request.Email);
        var roles = await userManager.GetRolesAsync(user!);
        return Ok(ToResponse(user!, roles));
    }

    [HttpPost("logout")]
    [Authorize]
    public async Task<IActionResult> Logout()
    {
        await signInManager.SignOutAsync();
        return NoContent();
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> Me()
    {
        var user = await userManager.GetUserAsync(User);
        if (user is null) return Unauthorized();
        var roles = await userManager.GetRolesAsync(user);
        return Ok(ToResponse(user, roles));
    }

    private static AuthResponse ToResponse(ApplicationUser user, IList<string> roles) =>
        new(user.Id, user.Email!, user.FullName, user.EmployeeCode, user.Department, roles);
}
