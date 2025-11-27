using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TomasDanceSite.Domain.Enums;

namespace TomasDanceSite.Domain.Entities;

public class Booking
{
    public int Id { get; set; }

    public int ClientId { get; set; }

    public int ServiceOfferingId { get; set; }

    public DateTime? PreferredDateTime { get; set; }

    public LocationType LocationType { get; set; }

    public BookingStatus Status { get; set; } = BookingStatus.Pending;

    public string? LocationDetails { get; set; }

    public string? Message { get; set; }

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public Client Client { get; set; } = null!;

    public ServiceOffering ServiceOffering { get; set; } = null!;
}
