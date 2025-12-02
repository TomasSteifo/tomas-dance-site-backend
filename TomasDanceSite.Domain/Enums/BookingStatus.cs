namespace TomasDanceSite.Domain.Enums;

public enum BookingStatus
{
    /// <summary>
    /// Booking has been created but not yet confirmed.
    /// </summary>
    Pending = 0,

    /// <summary>
    /// Booking is confirmed and will happen.
    /// </summary>
    Confirmed = 1,

    /// <summary>
    /// Booking has been cancelled.
    /// </summary>
    Cancelled = 2,

    /// <summary>
    /// Booking has taken place and is completed.
    /// </summary>
    Completed = 3
}
