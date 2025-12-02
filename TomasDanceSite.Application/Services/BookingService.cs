using AutoMapper;
using Microsoft.EntityFrameworkCore;
using TomasDanceSite.Application.DTOs;
using TomasDanceSite.Application.Exceptions;
using TomasDanceSite.Application.Interfaces;
using TomasDanceSite.Domain.Entities;
using TomasDanceSite.Domain.Enums;
using TomasDanceSite.Infrastructure.Persistence;

namespace TomasDanceSite.Application.Services;

public class BookingService : IBookingService
{
    private readonly ApplicationDbContext _dbContext;
    private readonly IMapper _mapper;

    public BookingService(ApplicationDbContext dbContext, IMapper mapper)
    {
        _dbContext = dbContext;
        _mapper = mapper;
    }

    // ---------------------------------------------------------
    // Get all
    // ---------------------------------------------------------
    public async Task<List<BookingDto>> GetAllAsync()
    {
        var entities = await _dbContext.Bookings
            .AsNoTracking()
            .ToListAsync();

        return _mapper.Map<List<BookingDto>>(entities);
    }

    // ---------------------------------------------------------
    // Search with filtering + sorting
    // ---------------------------------------------------------
    public async Task<List<BookingDto>> SearchAsync(BookingQueryParameters query)
    {
        // 1️⃣ Start with base query
        var bookingsQuery = _dbContext.Bookings
            .AsNoTracking()
            .AsQueryable();

        // 2️⃣ Apply filters if provided

        // Status filter
        if (query.Status.HasValue)
        {
            bookingsQuery = bookingsQuery
                .Where(b => b.Status == query.Status.Value);
        }

        // Client filter
        if (query.ClientId.HasValue)
        {
            bookingsQuery = bookingsQuery
                .Where(b => b.ClientId == query.ClientId.Value);
        }

        // ServiceOffering filter
        if (query.ServiceOfferingId.HasValue)
        {
            bookingsQuery = bookingsQuery
                .Where(b => b.ServiceOfferingId == query.ServiceOfferingId.Value);
        }

        // Date range filters (PreferredDateTime)
        if (query.FromDate.HasValue)
        {
            bookingsQuery = bookingsQuery
                .Where(b => b.PreferredDateTime >= query.FromDate.Value);
        }

        if (query.ToDate.HasValue)
        {
            bookingsQuery = bookingsQuery
                .Where(b => b.PreferredDateTime <= query.ToDate.Value);
        }

        // 3️⃣ Sorting
        var sortBy = (query.SortBy ?? "date").ToLowerInvariant();
        var descending = query.Descending;

        bookingsQuery = (sortBy, descending) switch
        {
            // Sort by PreferredDateTime
            ("date", false) => bookingsQuery.OrderBy(b => b.PreferredDateTime),
            ("date", true) => bookingsQuery.OrderByDescending(b => b.PreferredDateTime),

            // Sort by CreatedAtUtc
            ("created", false) => bookingsQuery.OrderBy(b => b.CreatedAtUtc),
            ("created", true) => bookingsQuery.OrderByDescending(b => b.CreatedAtUtc),

            // Sort by Status (enum)
            ("status", false) => bookingsQuery.OrderBy(b => b.Status),
            ("status", true) => bookingsQuery.OrderByDescending(b => b.Status),

            // Default fallback: sort by PreferredDateTime
            (_, false) => bookingsQuery.OrderBy(b => b.PreferredDateTime),
            (_, true) => bookingsQuery.OrderByDescending(b => b.PreferredDateTime)
        };

        // 4️⃣ Execute query
        var entities = await bookingsQuery.ToListAsync();

        // 5️⃣ Map to DTOs
        return _mapper.Map<List<BookingDto>>(entities);
    }


    // ---------------------------------------------------------
    // Get by id
    // ---------------------------------------------------------
    public async Task<BookingDto?> GetByIdAsync(int id)
    {
        var entity = await _dbContext.Bookings
            .AsNoTracking()
            .FirstOrDefaultAsync(b => b.Id == id);

        if (entity == null)
            return null;

        return _mapper.Map<BookingDto>(entity);
    }

    // ---------------------------------------------------------
    // Create
    // ---------------------------------------------------------
    public async Task<BookingDto> CreateAsync(CreateBookingDto dto)
    {
        // 1️⃣ PreferredDateTime must be in the future
        if (dto.PreferredDateTime < DateTime.UtcNow)
            throw new ValidationException("PreferredDateTime must be in the future.");

        // 2️⃣ Client must exist
        bool clientExists = await _dbContext.Clients
            .AnyAsync(c => c.Id == dto.ClientId);

        if (!clientExists)
            throw new ValidationException($"Client with ID {dto.ClientId} does not exist.");

        // 3️⃣ ServiceOffering must exist
        bool serviceExists = await _dbContext.ServiceOfferings
            .AnyAsync(s => s.Id == dto.ServiceOfferingId);

        if (!serviceExists)
            throw new ValidationException($"Service offering with ID {dto.ServiceOfferingId} does not exist.");

        // 4️⃣ Basic length checks
        if (dto.LocationDetails?.Length > 200)
            throw new ValidationException("LocationDetails cannot exceed 200 characters.");

        if (dto.Message?.Length > 500)
            throw new ValidationException("Message cannot exceed 500 characters.");

        // 5️⃣ Map DTO -> Entity
        var entity = _mapper.Map<Booking>(dto);

        // 6️⃣ Server-controlled fields
        entity.CreatedAtUtc = DateTime.UtcNow;
        entity.Status = BookingStatus.Pending;
        entity.LocationType = (int)LocationType.OnSite; // no magic number

        // 7️⃣ Save to database
        _dbContext.Bookings.Add(entity);
        await _dbContext.SaveChangesAsync();

        // 8️⃣ Return DTO
        return _mapper.Map<BookingDto>(entity);
    }

    // ---------------------------------------------------------
    // Update
    // ---------------------------------------------------------
    public async Task<BookingDto?> UpdateAsync(int id, UpdateBookingDto dto)
    {
        var entity = await _dbContext.Bookings
            .FirstOrDefaultAsync(b => b.Id == id);

        if (entity == null)
            return null;

        // 1️⃣ PreferredDateTime: if provided, must be in the future
        if (dto.PreferredDateTime.HasValue &&
            dto.PreferredDateTime.Value < DateTime.UtcNow)
        {
            throw new ValidationException("PreferredDateTime must be in the future.");
        }

        // 2️⃣ Length checks for strings
        if (dto.LocationDetails?.Length > 200)
            throw new ValidationException("LocationDetails cannot exceed 200 characters.");

        if (dto.Message?.Length > 500)
            throw new ValidationException("Message cannot exceed 500 characters.");

        // 3️⃣ Status change rules (only if Status is provided in the DTO)
        if (dto.Status.HasValue)
        {
            var newStatus = dto.Status.Value;
            var currentStatus = entity.Status;

            ValidateStatusChange(currentStatus, newStatus);
        }

        // 4️⃣ Apply changes via AutoMapper (only non-null properties, per your profile)
        _mapper.Map(dto, entity);

        // 5️⃣ Save to database
        await _dbContext.SaveChangesAsync();

        return _mapper.Map<BookingDto>(entity);
    }

    // ---------------------------------------------------------
    // Delete
    // ---------------------------------------------------------
    public async Task<bool> DeleteAsync(int id)
    {
        var entity = await _dbContext.Bookings
            .FirstOrDefaultAsync(b => b.Id == id);

        if (entity == null)
            return false;

        _dbContext.Bookings.Remove(entity);
        await _dbContext.SaveChangesAsync();

        return true;
    }

    // ---------------------------------------------------------
    // Private helpers
    // ---------------------------------------------------------
    private static void ValidateStatusChange(BookingStatus current, BookingStatus next)
    {
        // 🔒 Rule 1: If already Cancelled or Completed – lock it
        if (current == BookingStatus.Cancelled || current == BookingStatus.Completed)
        {
            throw new BusinessRuleException(
                $"Cannot change status once the booking is '{current}'.");
        }

        // ✅ Rule 2: Allowed transitions

        // Pending -> Confirmed / Cancelled
        if (current == BookingStatus.Pending &&
            (next == BookingStatus.Confirmed || next == BookingStatus.Cancelled))
        {
            return;
        }

        // Confirmed -> Completed / Cancelled
        if (current == BookingStatus.Confirmed &&
            (next == BookingStatus.Completed || next == BookingStatus.Cancelled))
        {
            return;
        }

        // ✅ Same -> Same is ok
        if (current == next)
        {
            return;
        }

        // ❌ Everything else is not allowed
        throw new BusinessRuleException(
            $"Booking status change from '{current}' to '{next}' is not allowed.");
    }
}
