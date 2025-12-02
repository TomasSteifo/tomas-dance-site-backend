using System;
using TomasDanceSite.Domain.Enums;

namespace TomasDanceSite.Application.DTOs;

public class UpdateBookingDto
{
    /// <summary>
    /// New preferred date/time, if changed.
    /// </summary>
    public DateTime? PreferredDateTime { get; set; }

    /// <summary>
    /// New location details, if changed.
    /// </summary>
    public string? LocationDetails { get; set; }

    /// <summary>
    /// New message, if changed.
    /// </summary>
    public string? Message { get; set; }

    /// <summary>
    /// New booking status, if changed.
    /// </summary>
    public BookingStatus? Status { get; set; }
}
