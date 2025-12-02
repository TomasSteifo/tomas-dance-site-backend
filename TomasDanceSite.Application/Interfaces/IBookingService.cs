using TomasDanceSite.Application.DTOs;

namespace TomasDanceSite.Application.Interfaces;

public interface IBookingService
{
    Task<List<BookingDto>> GetAllAsync();
    Task<BookingDto?> GetByIdAsync(int id);
    Task<BookingDto> CreateAsync(CreateBookingDto dto);
    Task<BookingDto?> UpdateAsync(int id, UpdateBookingDto dto);
    Task<bool> DeleteAsync(int id);
}
