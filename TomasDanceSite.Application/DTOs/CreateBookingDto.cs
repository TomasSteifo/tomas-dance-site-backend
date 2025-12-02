using System;

namespace TomasDanceSite.Application.DTOs;

public class CreateBookingDto
{
    public int ClientId { get; set; }

    public int ServiceOfferingId { get; set; }

    /// <summary>
    /// Preferred date and time for the booking (UTC).
    /// </summary>
    public DateTime PreferredDateTime { get; set; }

    /// <summary>
    /// Details about the location (optional).
    /// </summary>
    public string? LocationDetails { get; set; }

    /// <summary>
    /// Message from the client (optional).
    /// </summary>
    public string? Message { get; set; }
}
