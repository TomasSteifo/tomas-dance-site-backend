using Microsoft.AspNetCore.Mvc;
using TomasDanceSite.Application.Interfaces;
using TomasDanceSite.Application.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace TomasDanceSite.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ServiceOfferingsController : ControllerBase
    {
        private readonly IServiceOfferingService _serviceOfferingService;
        private readonly ILogger<ServiceOfferingsController> _logger;

        public ServiceOfferingsController(
            IServiceOfferingService serviceOfferingService,
            ILogger<ServiceOfferingsController> logger)
        {
            _serviceOfferingService = serviceOfferingService;
            _logger = logger;
        }

        // GET: api/ServiceOfferings
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ServiceOfferingDto>>> GetAll()
        {
            _logger.LogInformation("Fetching all service offerings");

            var offerings = await _serviceOfferingService.GetAllAsync();
            return Ok(offerings);
        }

        // GET: api/ServiceOfferings/5
        [HttpGet("{id:int}")]
        public async Task<ActionResult<ServiceOfferingDto>> GetById(int id)
        {
            _logger.LogInformation("Fetching service offering with ID {Id}", id);

            var offering = await _serviceOfferingService.GetByIdAsync(id);

            if (offering == null)
            {
                _logger.LogWarning("Service offering with ID {Id} not found", id);
                return NotFound();
            }

            return Ok(offering);
        }

        // POST: api/ServiceOfferings
        [HttpPost]
        public async Task<ActionResult<ServiceOfferingDto>> Create([FromBody] CreateServiceOfferingDto dto)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Invalid POST request for service offering creation");
                return BadRequest(ModelState);
            }

            _logger.LogInformation("Creating new service offering: {Name}", dto.Name);

            var created = await _serviceOfferingService.CreateAsync(dto);

            return CreatedAtAction(
                nameof(GetById),
                new { id = created.Id },
                created);
        }

        // PUT: api/ServiceOfferings/5
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateServiceOfferingDto dto)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Invalid PUT request for service offering with ID {Id}", id);
                return BadRequest(ModelState);
            }

            _logger.LogInformation("Updating service offering with ID {Id}", id);

            var updated = await _serviceOfferingService.UpdateAsync(id, dto);

            if (updated == null)
            {
                _logger.LogWarning("Update failed: service offering with ID {Id} not found", id);
                return NotFound();
            }

            return Ok(updated);
        }

        // DELETE: api/ServiceOfferings/5
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            _logger.LogInformation("Deleting service offering with ID {Id}", id);

            var deleted = await _serviceOfferingService.DeleteAsync(id);

            if (!deleted)
            {
                _logger.LogWarning("Delete failed: service offering with ID {Id} not found", id);
                return NotFound();
            }

            return NoContent();
        }
    }
}
