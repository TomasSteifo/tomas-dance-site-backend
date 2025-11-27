using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TomasDanceSite.Domain.Entities;

public class Testimonial
{
    public int Id { get; set; }

    public string ClientName { get; set; } = null!;

    public string? Role { get; set; }   // ex: "Student", "Organizer"

    public string Text { get; set; } = null!;

    public int Rating { get; set; }     // 1–5

    public bool IsApproved { get; set; } = false;

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
}
