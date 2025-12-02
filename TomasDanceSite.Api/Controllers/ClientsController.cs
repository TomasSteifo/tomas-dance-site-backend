using Microsoft.AspNetCore.Mvc;
using TomasDanceSite.Application.DTOs;
using TomasDanceSite.Application.Interfaces;

namespace TomasDanceSite.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClientsController : ControllerBase
    {
        private readonly IClientService _clientService;
        private readonly ILogger<ClientsController> _logger;

        public ClientsController(IClientService clientService, ILogger<ClientsController> logger)
        {
            _clientService = clientService;
            _logger = logger;
        }

        // GET: api/Clients
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ClientDto>>> GetAll()
        {
            _logger.LogInformation("Fetching all clients");

            var clients = await _clientService.GetAllAsync();
            return Ok(clients);
        }

        // GET: api/Clients/5
        [HttpGet("{id:int}")]
        public async Task<ActionResult<ClientDto>> GetById(int id)
        {
            _logger.LogInformation("Fetching client with ID {Id}", id);

            var client = await _clientService.GetByIdAsync(id);

            if (client == null)
            {
                _logger.LogWarning("Client with ID {Id} not found", id);
                return NotFound();
            }

            return Ok(client);
        }

        // POST: api/Clients
        [HttpPost]
        public async Task<ActionResult<ClientDto>> Create([FromBody] CreateClientDto dto)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Invalid POST request for client creation");
                return BadRequest(ModelState);
            }

            _logger.LogInformation("Creating new client: {Name} ({Email})", dto.FullName, dto.Email);

            var created = await _clientService.CreateAsync(dto);

            return CreatedAtAction(
                nameof(GetById),
                new { id = created.Id },
                created);
        }

        // PUT: api/Clients/5
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateClientDto dto)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Invalid PUT request for client with ID {Id}", id);
                return BadRequest(ModelState);
            }

            _logger.LogInformation("Updating client with ID {Id}", id);

            var updated = await _clientService.UpdateAsync(id, dto);

            if (updated == null)
            {
                _logger.LogWarning("Update failed: client with ID {Id} not found", id);
                return NotFound();
            }

            return Ok(updated);
        }

        // DELETE: api/Clients/5
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            _logger.LogInformation("Deleting client with ID {Id}", id);

            var deleted = await _clientService.DeleteAsync(id);

            if (!deleted)
            {
                _logger.LogWarning("Delete failed: client with ID {Id} not found", id);
                return NotFound();
            }

            return NoContent();
        }
    }
}
