using AttendanceTracker.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace AttendanceTracker.Infrastructure.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Employee> Employees => Set<Employee>();
    public DbSet<AttendanceRecord> AttendanceRecords => Set<AttendanceRecord>();
    public DbSet<TrainingActivity> TrainingActivities => Set<TrainingActivity>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
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
            e.HasOne(x => x.Employee)
                .WithMany(x => x.AttendanceRecords)
                .HasForeignKey(x => x.EmployeeId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<TrainingActivity>(e =>
        {
            e.HasOne(x => x.Employee)
                .WithMany(x => x.TrainingActivities)
                .HasForeignKey(x => x.EmployeeId)
                .OnDelete(DeleteBehavior.Cascade);

            e.Property(x => x.Title).HasMaxLength(300);
            e.Property(x => x.Status).HasConversion<string>();
        });
    }
}
