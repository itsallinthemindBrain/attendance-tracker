using System.Text.Json.Serialization;
using Microsoft.Extensions.FileProviders;
using AttendanceTracker.Core.Interfaces;
using AttendanceTracker.Infrastructure.Data;
using AttendanceTracker.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()));

builder.Services.AddControllers()
    .AddJsonOptions(opts =>
        opts.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IEmployeeService, EmployeeService>();
builder.Services.AddScoped<IAttendanceService, AttendanceService>();
builder.Services.AddScoped<ITrainingService, TrainingService>();

var uploadsPath = Path.Combine(builder.Environment.ContentRootPath, "wwwroot", "uploads");
builder.Services.AddSingleton<IFileStorageService>(_ => new LocalFileStorageService(uploadsPath));

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();
app.UseHttpsRedirection();

// Serve uploaded images from /uploads/
app.UseStaticFiles();

// Serve React SPA assets from wwwroot/dist/ at the root path (production build only)
var distPath = Path.Combine(app.Environment.ContentRootPath, "wwwroot", "dist");
if (Directory.Exists(distPath))
{
    app.UseStaticFiles(new StaticFileOptions
    {
        FileProvider = new PhysicalFileProvider(distPath),
        RequestPath = ""
    });
}

app.MapControllers();

// SPA fallback: any unmatched route serves index.html so React Router handles navigation
if (Directory.Exists(distPath))
{
    app.MapFallbackToFile("dist/index.html");
}

app.Run();
