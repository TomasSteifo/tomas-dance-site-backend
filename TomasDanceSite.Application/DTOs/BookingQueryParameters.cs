using System;
using TomasDanceSite.Domain.Enums;

namespace TomasDanceSite.Application.DTOs;

public class BookingQueryParameters
{
    /// <summary>
    /// Filter by booking status (Pending, Confirmed, Cancelled, Completed). Optional.
    /// </summary>
    public BookingStatus? Status { get; set; }

    /// <summary>
    /// Filter by client id. Optional.
    /// </summary>
    public int? ClientId { get; set; }

    /// <summary>
    /// Filter by service offering id. Optional.
    /// </summary>
    public int? ServiceOfferingId { get; set; }

    /// <summary>
    /// Only include bookings with PreferredDateTime on or after this date/time (UTC).
    /// Optional.
    /// </summary>
    public DateTime? FromDate { get; set; }

    /// <summary>
    /// Only include bookings with PreferredDateTime on or before this date/time (UTC).
    /// Optional.
    /// </summary>
    public DateTime? ToDate { get; set; }

    /// <summary>
    /// Name of the field to sort by. Supported: "date", "created", "status".
    /// Default is "date".
    /// </summary>
    public string? SortBy { get; set; }

    /// <summary>
    /// If true, sort in descending order. Default is false (ascending).
    /// </summary>
    public bool Descending { get; set; }
}
