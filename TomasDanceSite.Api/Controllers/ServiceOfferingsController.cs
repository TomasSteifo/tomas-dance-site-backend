using Microsoft.AspNetCore.Mvc;
using TomasDanceSite.Application.Interfaces;
using TomasDanceSite.Application.DTOs; // Adjust if your DTO namespace is different
using System.Collections.Generic;
using System.Threading.Tasks;

namespace TomasDanceSite.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ServiceOfferingsController : ControllerBase
    {
        private readonly IServiceOfferingService _serviceOfferingService;

        public ServiceOfferingsController(IServiceOfferingService serviceOfferingService)
        {
            _serviceOfferingService = serviceOfferingService;
        }

        // GET: api/ServiceOfferings
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ServiceOfferingDto>>> GetAll()
        {
            var offerings = await _serviceOfferingService.GetAllAsync();
            return Ok(offerings);
        }

        // GET: api/ServiceOfferings/5
        // If your ID is Guid, change int to Guid everywhere needed
        [HttpGet("{id:int}")]
        public async Task<ActionResult<ServiceOfferingDto>> GetById(int id)
        {
            var offering = await _serviceOfferingService.GetByIdAsync(id);

            if (offering == null)
            {
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
                return BadRequest(ModelState);
            }

            var created = await _serviceOfferingService.CreateAsync(dto);

            // Assumes created has an Id property
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
                return BadRequest(ModelState);
            }

            var updated = await _serviceOfferingService.UpdateAsync(id, dto);

            if (updated == null)
            {
                return NotFound();
            }

            return Ok(updated);
        }

        // DELETE: api/ServiceOfferings/5
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _serviceOfferingService.DeleteAsync(id);

            if (!deleted)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
