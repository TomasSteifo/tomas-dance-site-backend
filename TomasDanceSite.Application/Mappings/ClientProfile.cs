using AutoMapper;
using TomasDanceSite.Domain.Entities;
using TomasDanceSite.Application.DTOs;

namespace TomasDanceSite.Application.Mappings
{
    public class ClientProfile : Profile
    {
        public ClientProfile()
        {
            // Entity -> DTO
            CreateMap<Client, ClientDto>()
                .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.Name));

            // Create DTO -> Entity
            CreateMap<CreateClientDto, Client>()
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.FullName));

            // Update DTO -> Entity
            CreateMap<UpdateClientDto, Client>()
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.FullName));
        }
    }
}
