using System.ComponentModel.DataAnnotations;
using TomasDanceSite.Domain.Enums;

namespace TomasDanceSite.Application.DTOs
{
    public class CreateServiceOfferingDto
    {
        [Required]
        [StringLength(100, MinimumLength = 2)]
        public string Name { get; set; } = null!;

        [StringLength(500)]
        public string? Description { get; set; }

        [Required]
        public ServiceType ServiceType { get; set; }

        [Range(0, 20000, ErrorMessage = "Price must be between 0 and 20,000 SEK.")]
        public decimal? BasePriceSek { get; set; }

        [Range(10, 300, ErrorMessage = "Duration must be between 10 and 300 minutes.")]
        public int? DurationMinutes { get; set; }
    }
}
