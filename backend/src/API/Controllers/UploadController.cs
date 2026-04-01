using AttendanceTracker.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AttendanceTracker.API.Controllers;

[ApiController]
[Route("api/upload")]
public class UploadController(IFileStorageService fileStorage) : ControllerBase
{
    private static readonly HashSet<string> AllowedExtensions = [".jpg", ".jpeg", ".png"];
    private const long MaxFileSizeBytes = 5 * 1024 * 1024; // 5 MB

    [HttpPost]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> Upload(IFormFile file)
    {
        if (file is null || file.Length == 0)
            return BadRequest(new { error = "No file provided." });

        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!AllowedExtensions.Contains(ext))
            return BadRequest(new { error = "Only .jpg, .jpeg, and .png files are allowed." });

        if (file.Length > MaxFileSizeBytes)
            return BadRequest(new { error = "File size must not exceed 5 MB." });

        await using var stream = file.OpenReadStream();
        var path = await fileStorage.SaveAsync(stream, file.FileName);

        return Ok(new { path });
    }
}
