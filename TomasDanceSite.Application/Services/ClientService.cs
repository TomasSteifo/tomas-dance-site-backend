using AutoMapper;
using Microsoft.EntityFrameworkCore;
using TomasDanceSite.Application.DTOs;
using TomasDanceSite.Application.Interfaces;
using TomasDanceSite.Domain.Entities;
using TomasDanceSite.Infrastructure.Persistence;

namespace TomasDanceSite.Application.Services;

public class ClientService : IClientService
{
    private readonly ApplicationDbContext _dbContext;
    private readonly IMapper _mapper;

    public ClientService(ApplicationDbContext dbContext, IMapper mapper)
    {
        _dbContext = dbContext;
        _mapper = mapper;
    }

    public async Task<List<ClientDto>> GetAllAsync()
    {
        var entities = await _dbContext.Clients
            .AsNoTracking()
            .ToListAsync();

        return _mapper.Map<List<ClientDto>>(entities);
    }

    public async Task<ClientDto?> GetByIdAsync(int id)
    {
        var entity = await _dbContext.Clients
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == id);

        if (entity == null)
            return null;

        return _mapper.Map<ClientDto>(entity);
    }

    public async Task<ClientDto> CreateAsync(CreateClientDto dto)
    {
        var entity = _mapper.Map<Client>(dto);

        entity.CreatedAtUtc = DateTime.UtcNow;

        _dbContext.Clients.Add(entity);
        await _dbContext.SaveChangesAsync();

        return _mapper.Map<ClientDto>(entity);
    }

    public async Task<ClientDto?> UpdateAsync(int id, UpdateClientDto dto)
    {
        var entity = await _dbContext.Clients.FirstOrDefaultAsync(c => c.Id == id);

        if (entity == null)
            return null;

        _mapper.Map(dto, entity);

        await _dbContext.SaveChangesAsync();

        return _mapper.Map<ClientDto>(entity);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var entity = await _dbContext.Clients.FirstOrDefaultAsync(c => c.Id == id);

        if (entity == null)
            return false;

        _dbContext.Clients.Remove(entity);
        await _dbContext.SaveChangesAsync();

        return true;
    }
}
