using System.ComponentModel.DataAnnotations;

namespace TomasDanceSite.Application.DTOs
{
    public class ClientDto
    {
        public int Id { get; set; }

        public string FullName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string? Phone { get; set; }

        public DateTime CreatedAtUtc { get; set; }
    }
}
