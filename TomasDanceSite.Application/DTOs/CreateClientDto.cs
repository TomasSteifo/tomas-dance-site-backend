using System.ComponentModel.DataAnnotations;

namespace TomasDanceSite.Application.DTOs
{
    public class CreateClientDto
    {
        [Required]
        [StringLength(100)]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [StringLength(200)]
        public string Email { get; set; } = string.Empty;

        [Phone]
        public string? Phone { get; set; }
    }
}
