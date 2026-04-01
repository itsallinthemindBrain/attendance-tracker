using AttendanceTracker.Core.Interfaces;

namespace AttendanceTracker.Infrastructure.Services;

public class LocalFileStorageService(string uploadsPath) : IFileStorageService
{
    public async Task<string> SaveAsync(Stream fileStream, string originalFileName)
    {
        Directory.CreateDirectory(uploadsPath);

        var fileName = $"{Guid.NewGuid()}.jpg";
        var fullPath = Path.Combine(uploadsPath, fileName);

        await using var destination = File.Create(fullPath);
        await fileStream.CopyToAsync(destination);

        return $"/uploads/{fileName}";
    }
}
