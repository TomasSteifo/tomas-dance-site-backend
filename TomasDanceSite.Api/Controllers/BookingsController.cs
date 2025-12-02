using Microsoft.AspNetCore.Mvc;
using TomasDanceSite.Application.DTOs;
using TomasDanceSite.Application.Interfaces;

namespace TomasDanceSite.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookingsController : ControllerBase
    {
        private readonly IBookingService _bookingService;
        private readonly ILogger<BookingsController> _logger;

        public BookingsController(IBookingService bookingService, ILogger<BookingsController> logger)
        {
            _bookingService = bookingService;
            _logger = logger;
        }

        // GET: api/Bookings
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BookingDto>>> GetAll()
        {
            _logger.LogInformation("Fetching all bookings");

            var bookings = await _bookingService.GetAllAsync();
            return Ok(bookings);
        }

        // GET: api/Bookings/search
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<BookingDto>>> Search([FromQuery] BookingQueryParameters query)
        {
            _logger.LogInformation(
                "Searching bookings with Status={Status}, ClientId={ClientId}, ServiceOfferingId={ServiceOfferingId}, FromDate={FromDate}, ToDate={ToDate}, SortBy={SortBy}, Descending={Descending}",
                query.Status,
                query.ClientId,
                query.ServiceOfferingId,
                query.FromDate,
                query.ToDate,
                query.SortBy,
                query.Descending);

            var results = await _bookingService.SearchAsync(query);
            return Ok(results);
        }


        // GET: api/Bookings/5
        [HttpGet("{id:int}")]
        public async Task<ActionResult<BookingDto>> GetById(int id)
        {
            _logger.LogInformation("Fetching booking with ID {Id}", id);

            var booking = await _bookingService.GetByIdAsync(id);

            if (booking == null)
            {
                _logger.LogWarning("Booking with ID {Id} not found", id);
                return NotFound();
            }

            return Ok(booking);
        }

        // POST: api/Bookings
        [HttpPost]
        public async Task<ActionResult<BookingDto>> Create([FromBody] CreateBookingDto dto)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Invalid POST request for booking creation");
                return BadRequest(ModelState);
            }

            _logger.LogInformation(
                "Creating new booking for ClientId {ClientId}, ServiceOfferingId {ServiceOfferingId}, StartTimeUtc {StartTimeUtc}",
                dto.ClientId,
                dto.ServiceOfferingId,
                dto.PreferredDateTime);

            var created = await _bookingService.CreateAsync(dto);

            return CreatedAtAction(
                nameof(GetById),
                new { id = created.Id },
                created);
        }

        // PUT: api/Bookings/5
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateBookingDto dto)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Invalid PUT request for booking with ID {Id}", id);
                return BadRequest(ModelState);
            }

            _logger.LogInformation("Updating booking with ID {Id}", id);

            var updated = await _bookingService.UpdateAsync(id, dto);

            if (updated == null)
            {
                _logger.LogWarning("Update failed: booking with ID {Id} not found", id);
                return NotFound();
            }

            return Ok(updated);
        }

        // DELETE: api/Bookings/5
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            _logger.LogInformation("Deleting booking with ID {Id}", id);

            var deleted = await _bookingService.DeleteAsync(id);

            if (!deleted)
            {
                _logger.LogWarning("Delete failed: booking with ID {Id} not found", id);
                return NotFound();
            }

            return NoContent();
        }
    }
}
