using System;
using System.Linq;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.DependencyInjection;
using TomasDanceSite.Infrastructure.Persistence;
using TomasDanceSite.Domain.Entities;
using TomasDanceSite.Domain.Enums;

namespace TomasDanceSite.Tests.IntegrationTests
{
    public class CustomWebApplicationFactory : WebApplicationFactory<Program>
    {
        // 🔑 Shared in-memory database root so all contexts see the same data
        private static readonly InMemoryDatabaseRoot _databaseRoot = new();

        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.ConfigureServices(services =>
            {
                // 1) Remove the existing SQL Server DbContext registration
                var descriptor = services.SingleOrDefault(d =>
                    d.ServiceType == typeof(DbContextOptions<ApplicationDbContext>));

                if (descriptor != null)
                {
                    services.Remove(descriptor);
                }

                // 2) Register ApplicationDbContext with shared InMemory database
                services.AddDbContext<ApplicationDbContext>(options =>
                {
                    options.UseInMemoryDatabase("IntegrationTestsDb", _databaseRoot);
                });

                // 3) Build a provider and seed data into THIS in-memory store
                var sp = services.BuildServiceProvider();

                using (var scope = sp.CreateScope())
                {
                    var scopedServices = scope.ServiceProvider;
                    var db = scopedServices.GetRequiredService<ApplicationDbContext>();

                    db.Database.EnsureCreated();

                    SeedTestData(db);
                }
            });
        }

        private static void SeedTestData(ApplicationDbContext db)
        {
            if (!db.Clients.Any())
            {
                db.Clients.Add(new Client
                {
                    Id = 1,
                    Name = "Test Client",
                    Email = "testclient@example.com",
                    Phone = "+46123456789",
                    ClientType = ClientType.Student,
                    CreatedAtUtc = DateTime.UtcNow
                });
            }

            if (!db.ServiceOfferings.Any())
            {
                db.ServiceOfferings.Add(new ServiceOffering
                {
                    Id = 1,
                    Name = "Private class 60 min",
                    BasePriceSek = 800m
                });
            }

            db.SaveChanges();
        }
    }
}
