using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TomasDanceSite.Domain.Enums;

namespace TomasDanceSite.Domain.Entities;

public class ServiceOffering
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public ServiceType ServiceType { get; set; }

    public decimal? BasePriceSek { get; set; }

    public int? DurationMinutes { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
}
