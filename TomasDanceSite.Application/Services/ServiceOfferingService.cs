using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using TomasDanceSite.Application.DTOs;
using TomasDanceSite.Application.Interfaces;
using TomasDanceSite.Domain.Entities;
using TomasDanceSite.Infrastructure.Persistence;

namespace TomasDanceSite.Application.Services
{
    public class ServiceOfferingService : IServiceOfferingService
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly IMapper _mapper;

        public ServiceOfferingService(ApplicationDbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }

        public async Task<List<ServiceOfferingDto>> GetAllAsync()
        {
            var entities = await _dbContext.ServiceOfferings
                .AsNoTracking()
                .ToListAsync();

            return _mapper.Map<List<ServiceOfferingDto>>(entities);
        }

        public async Task<ServiceOfferingDto?> GetByIdAsync(int id)
        {
            var entity = await _dbContext.ServiceOfferings
                .AsNoTracking()
                .FirstOrDefaultAsync(s => s.Id == id);

            if (entity == null)
                return null;

            return _mapper.Map<ServiceOfferingDto>(entity);
        }

        public async Task<ServiceOfferingDto> CreateAsync(CreateServiceOfferingDto dto)
        {
            var entity = _mapper.Map<ServiceOffering>(dto);

            entity.IsActive = true;
            entity.CreatedAtUtc = DateTime.UtcNow;

            _dbContext.ServiceOfferings.Add(entity);
            await _dbContext.SaveChangesAsync();

            return _mapper.Map<ServiceOfferingDto>(entity);
        }

        public async Task<ServiceOfferingDto?> UpdateAsync(int id, UpdateServiceOfferingDto dto)
        {
            var entity = await _dbContext.ServiceOfferings.FirstOrDefaultAsync(s => s.Id == id);

            if (entity == null)
                return null;

            _mapper.Map(dto, entity);

            await _dbContext.SaveChangesAsync();

            return _mapper.Map<ServiceOfferingDto>(entity);
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
}
