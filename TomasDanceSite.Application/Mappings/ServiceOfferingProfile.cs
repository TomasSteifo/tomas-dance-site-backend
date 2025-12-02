using AutoMapper;
using TomasDanceSite.Domain.Entities;
using TomasDanceSite.Application.DTOs;

namespace TomasDanceSite.Application.Mappings
{
    public class ServiceOfferingProfile : Profile
    {
        public ServiceOfferingProfile()
        {
            // Entity -> DTO
            CreateMap<ServiceOffering, ServiceOfferingDto>();

            // Create DTO -> Entity
            CreateMap<CreateServiceOfferingDto, ServiceOffering>();

            // Update DTO -> Entity
            CreateMap<UpdateServiceOfferingDto, ServiceOffering>();
        }
    }
}
