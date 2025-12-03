using System;
using FluentValidation;

namespace TomasDanceSite.Application.DTOs;

public class UpdateBookingDtoValidator : AbstractValidator<UpdateBookingDto>
{
    public UpdateBookingDtoValidator()
    {
        // PreferredDateTime is optional, but if provided, must not be default
        RuleFor(x => x.PreferredDateTime)
            .Must(dt => dt == null || dt.Value != default(DateTime))
            .WithMessage("PreferredDateTime, if provided, must be a valid date.");

        // LocationDetails: optional, but max length 200
        RuleFor(x => x.LocationDetails)
            .MaximumLength(200)
            .WithMessage("LocationDetails cannot exceed 200 characters.");

        // Message: optional, but max length 500
        RuleFor(x => x.Message)
            .MaximumLength(500)
            .WithMessage("Message cannot exceed 500 characters.");
    }
}
