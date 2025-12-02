using System;
using TomasDanceSite.Domain.Enums;

namespace TomasDanceSite.Domain.Entities;

public class Booking
{
    public int Id { get; set; }

    public int ClientId { get; set; }
    public Client Client { get; set; } = null!;

    public int ServiceOfferingId { get; set; }
    public ServiceOffering ServiceOffering { get; set; } = null!;

    public DateTime PreferredDateTime { get; set; }

    // 👇 NY PROPERTY – matchar DB-kolumnen LocationType (NOT NULL)
    public int LocationType { get; set; } = 1; // t.ex. 1 = Studio som default

    public string? LocationDetails { get; set; }

    public string? Message { get; set; }

    public BookingStatus Status { get; set; } = BookingStatus.Pending;

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
}
