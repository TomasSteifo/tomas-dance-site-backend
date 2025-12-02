using AutoMapper;
using TomasDanceSite.Application.DTOs;
using TomasDanceSite.Domain.Entities;

namespace TomasDanceSite.Application.Mappings;

public class BookingProfile : Profile
{
    public BookingProfile()
    {
        // Entity -> DTO
        CreateMap<Booking, BookingDto>();

        // Create DTO -> Entity
        CreateMap<CreateBookingDto, Booking>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.Status, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAtUtc, opt => opt.Ignore());

        // Update DTO -> Entity (only map non-null values)
        CreateMap<UpdateBookingDto, Booking>()
            .ForAllMembers(opt =>
                opt.Condition((src, dest, srcMember) => srcMember != null));
    }
}