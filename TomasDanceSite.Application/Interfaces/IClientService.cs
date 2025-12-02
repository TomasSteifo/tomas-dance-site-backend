using TomasDanceSite.Application.DTOs;

namespace TomasDanceSite.Application.Interfaces;

public interface IClientService
{
    Task<List<ClientDto>> GetAllAsync();
    Task<ClientDto?> GetByIdAsync(int id);
    Task<ClientDto> CreateAsync(CreateClientDto dto);
    Task<ClientDto?> UpdateAsync(int id, UpdateClientDto dto);
    Task<bool> DeleteAsync(int id);
}
