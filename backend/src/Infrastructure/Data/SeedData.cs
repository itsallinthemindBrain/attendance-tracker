using AttendanceTracker.Core.Entities;
using Microsoft.AspNetCore.Identity;

namespace AttendanceTracker.Infrastructure.Data;

public static class SeedData
{
    public static readonly string[] Roles = ["Employee", "Manager", "Admin"];

    public static async Task SeedAsync(
        RoleManager<IdentityRole> roleManager,
        UserManager<ApplicationUser> userManager)
    {
        foreach (var role in Roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
                await roleManager.CreateAsync(new IdentityRole(role));
        }

        const string adminEmail = "admin@attendance.local";
        if (await userManager.FindByEmailAsync(adminEmail) is null)
        {
            var admin = new ApplicationUser
            {
                UserName = adminEmail,
                Email = adminEmail,
                FullName = "System Administrator",
                EmployeeCode = "ADMIN001",
                Department = "IT",
                EmailConfirmed = true,
            };
            var result = await userManager.CreateAsync(admin, "Admin123!");
            if (result.Succeeded)
                await userManager.AddToRoleAsync(admin, "Admin");
        }
    }
}
