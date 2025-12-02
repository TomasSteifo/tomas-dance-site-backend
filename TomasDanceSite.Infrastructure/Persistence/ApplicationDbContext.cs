using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Emit;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TomasDanceSite.Domain.Entities;

namespace TomasDanceSite.Infrastructure.Persistence;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Client> Clients => Set<Client>();
    public DbSet<ServiceOffering> ServiceOfferings => Set<ServiceOffering>();
    public DbSet<Booking> Bookings => Set<Booking>();
    public DbSet<Testimonial> Testimonials => Set<Testimonial>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Client - Booking: one-to-many
        modelBuilder.Entity<Client>()
            .HasMany(c => c.Bookings)
            .WithOne(b => b.Client)
            .HasForeignKey(b => b.ClientId)
            .OnDelete(DeleteBehavior.Cascade);

        // ServiceOffering - Booking: one-to-many
        modelBuilder.Entity<ServiceOffering>()
            .HasMany(s => s.Bookings)
            .WithOne(b => b.ServiceOffering)
            .HasForeignKey(b => b.ServiceOfferingId)
            .OnDelete(DeleteBehavior.Cascade);

        // Testimonial: enkel konfiguration
        modelBuilder.Entity<Testimonial>()
            .Property(t => t.Rating)
            .IsRequired();
    }
}
