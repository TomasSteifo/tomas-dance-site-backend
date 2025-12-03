using Microsoft.EntityFrameworkCore;
using TomasDanceSite.Infrastructure.Persistence;
using TomasDanceSite.Application.Interfaces;
using TomasDanceSite.Application.Services;
using TomasDanceSite.Api.Middleware;
using TomasDanceSite.Application.Mappings;
using Microsoft.Extensions.DependencyInjection;
using FluentValidation;
using FluentValidation.AspNetCore;
using TomasDanceSite.Application.DTOs; 




var builder = WebApplication.CreateBuilder(args);

// Connection string
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString));

// Add services to the container.
builder.Services
    .AddControllers()
    .AddFluentValidation(fv =>
    {
        // We let FluentValidation handle model validation instead of DataAnnotations
        fv.DisableDataAnnotationsValidation = true;
    });

builder.Services.AddValidatorsFromAssemblyContaining<CreateBookingDto>();

// Swagger/OpenAPI support for .NET 8
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddAutoMapper(cfg =>
{
    cfg.AddProfile<ServiceOfferingProfile>();
    cfg.AddProfile<ClientProfile>();
    cfg.AddProfile<BookingProfile>(); 
});

// Register application services
builder.Services.AddScoped<IServiceOfferingService, ServiceOfferingService>();
builder.Services.AddScoped<IClientService, ClientService>();
builder.Services.AddScoped<IBookingService, BookingService>();



var app = builder.Build();

// Global error handling
app.UseExceptionHandlingMiddleware();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapGet("/", () => Results.Redirect("/swagger"));

app.Run();

public partial class Program { }