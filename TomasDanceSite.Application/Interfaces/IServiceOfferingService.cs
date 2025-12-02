using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TomasDanceSite.Application.DTOs;

namespace TomasDanceSite.Application.Interfaces;

public interface IServiceOfferingService
{
    Task<List<ServiceOfferingDto>> GetAllAsync();

    Task<ServiceOfferingDto?> GetByIdAsync(int id);

    Task<ServiceOfferingDto> CreateAsync(CreateServiceOfferingDto dto);

    Task<ServiceOfferingDto?> UpdateAsync(int id, UpdateServiceOfferingDto dto);

    Task<bool> DeleteAsync(int id);
}

