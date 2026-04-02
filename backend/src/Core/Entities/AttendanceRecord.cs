namespace AttendanceTracker.Core.Entities;

public class AttendanceRecord
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public DateTime ClockIn { get; set; }
    public DateTime? ClockOut { get; set; }
    public DateOnly Date { get; set; }
    public string? Notes { get; set; }
}
