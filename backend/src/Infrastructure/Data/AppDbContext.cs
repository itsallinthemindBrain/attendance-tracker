using AttendanceTracker.Core.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace AttendanceTracker.Infrastructure.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options)
    : IdentityDbContext<ApplicationUser, IdentityRole, string>(options)
{
    public DbSet<Employee> Employees => Set<Employee>();
    public DbSet<AttendanceRecord> AttendanceRecords => Set<AttendanceRecord>();
    public DbSet<TrainingActivity> TrainingActivities => Set<TrainingActivity>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Employee>(e =>
        {
            e.HasIndex(x => x.EmployeeCode).IsUnique();
            e.Property(x => x.EmployeeCode).HasMaxLength(50);
            e.Property(x => x.FullName).HasMaxLength(200);
            e.Property(x => x.Email).HasMaxLength(200);
            e.Property(x => x.Department).HasMaxLength(100);
        });

        modelBuilder.Entity<AttendanceRecord>(e =>
        {
            e.Property(x => x.UserId).HasMaxLength(450);
            e.HasIndex(x => x.UserId);
        });

        modelBuilder.Entity<TrainingActivity>(e =>
        {
            e.Property(x => x.UserId).HasMaxLength(450);
            e.HasIndex(x => x.UserId);
            e.Property(x => x.Title).HasMaxLength(300);
            e.Property(x => x.Status).HasConversion<string>();
        });

        modelBuilder.Entity<ApplicationUser>(e =>
        {
            e.Property(x => x.FullName).HasMaxLength(200);
            e.Property(x => x.EmployeeCode).HasMaxLength(50);
            e.Property(x => x.Department).HasMaxLength(100);
            e.HasIndex(x => x.EmployeeCode).IsUnique();
        });
    }
}
