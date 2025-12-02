using System;
using TomasDanceSite.Domain.Enums;

namespace TomasDanceSite.Application.DTOs;

public class BookingDto
{
    public int Id { get; set; }

    public int ClientId { get; set; }

    public int ServiceOfferingId { get; set; }

    /// <summary>
    /// When the client prefers the booking to happen (UTC).
    /// Matches DB column PreferredDateTime.
    /// </summary>
    public DateTime PreferredDateTime { get; set; }

    /// <summary>
    /// Extra info about the location (e.g. studio name, address, event hall).
    /// Matches DB column LocationDetails.
    /// </summary>
    public string? LocationDetails { get; set; }

    /// <summary>
    /// Message from the client (e.g. "We are beginners", "We want show + workshop").
    /// Matches DB column Message.
    /// </summary>
    public string? Message { get; set; }

    public BookingStatus Status { get; set; }

    public DateTime CreatedAtUtc { get; set; }
}
