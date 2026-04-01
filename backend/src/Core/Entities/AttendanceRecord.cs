namespace AttendanceTracker.Core.Entities;

public class AttendanceRecord
{
    public int Id { get; set; }
    public int EmployeeId { get; set; }
    public DateTime ClockIn { get; set; }
    public DateTime? ClockOut { get; set; }
    public DateOnly Date { get; set; }
    public string? Notes { get; set; }

    public Employee Employee { get; set; } = null!;
}
