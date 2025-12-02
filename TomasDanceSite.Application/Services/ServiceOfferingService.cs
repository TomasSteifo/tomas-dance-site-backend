using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TomasDanceSite.Application.DTOs;
using TomasDanceSite.Application.Interfaces;
using TomasDanceSite.Domain.Entities;
using TomasDanceSite.Infrastructure.Persistence;

namespace TomasDanceSite.Application.Services;

public class ServiceOfferingService : IServiceOfferingService
{
    private readonly ApplicationDbContext _dbContext;

    public ServiceOfferingService(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<ServiceOfferingDto>> GetAllAsync()
    {
        return await _dbContext.ServiceOfferings
            .AsNoTracking()
            .Select(s => new ServiceOfferingDto
            {
                Id = s.Id,
                Name = s.Name,
                Description = s.Description,
                ServiceType = s.ServiceType,
                BasePriceSek = s.BasePriceSek,
                DurationMinutes = s.DurationMinutes,
                IsActive = s.IsActive
            })
            .ToListAsync();
    }

    public async Task<ServiceOfferingDto?> GetByIdAsync(int id)
    {
        var entity = await _dbContext.ServiceOfferings
            .AsNoTracking()
            .FirstOrDefaultAsync(s => s.Id == id);

        if (entity == null)
            return null;

        return new ServiceOfferingDto
        {
            Id = entity.Id,
            Name = entity.Name,
            Description = entity.Description,
            ServiceType = entity.ServiceType,
            BasePriceSek = entity.BasePriceSek,
            DurationMinutes = entity.DurationMinutes,
            IsActive = entity.IsActive
        };
    }

    public async Task<ServiceOfferingDto> CreateAsync(CreateServiceOfferingDto dto)
    {
        var entity = new ServiceOffering
        {
            Name = dto.Name,
            Description = dto.Description,
            ServiceType = dto.ServiceType,
            BasePriceSek = dto.BasePriceSek,
            DurationMinutes = dto.DurationMinutes,
            IsActive = true,
            CreatedAtUtc = DateTime.UtcNow
        };

        _dbContext.ServiceOfferings.Add(entity);
        await _dbContext.SaveChangesAsync();

        return new ServiceOfferingDto
        {
            Id = entity.Id,
            Name = entity.Name,
            Description = entity.Description,
            ServiceType = entity.ServiceType,
            BasePriceSek = entity.BasePriceSek,
            DurationMinutes = entity.DurationMinutes,
            IsActive = entity.IsActive
        };
    }

    public async Task<ServiceOfferingDto?> UpdateAsync(int id, UpdateServiceOfferingDto dto)
    {
        var entity = await _dbContext.ServiceOfferings.FirstOrDefaultAsync(s => s.Id == id);

        if (entity == null)
            return null;

        entity.Name = dto.Name;
        entity.Description = dto.Description;
        entity.ServiceType = dto.ServiceType;
        entity.BasePriceSek = dto.BasePriceSek;
        entity.DurationMinutes = dto.DurationMinutes;
        entity.IsActive = dto.IsActive;

        await _dbContext.SaveChangesAsync();

        return new ServiceOfferingDto
        {
            Id = entity.Id,
            Name = entity.Name,
            Description = entity.Description,
            ServiceType = entity.ServiceType,
            BasePriceSek = entity.BasePriceSek,
            DurationMinutes = entity.DurationMinutes,
            IsActive = entity.IsActive
        };
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var entity = await _dbContext.ServiceOfferings.FirstOrDefaultAsync(s => s.Id == id);

        if (entity == null)
            return false;

        _dbContext.ServiceOfferings.Remove(entity);
        await _dbContext.SaveChangesAsync();

        return true;
    }
}
