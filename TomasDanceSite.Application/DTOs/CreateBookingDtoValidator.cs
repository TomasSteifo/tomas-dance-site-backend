using System;
using FluentValidation;

namespace TomasDanceSite.Application.DTOs;

public class CreateBookingDtoValidator : AbstractValidator<CreateBookingDto>
{
    public CreateBookingDtoValidator()
    {
        // ClientId must be > 0
        RuleFor(x => x.ClientId)
            .GreaterThan(0)
            .WithMessage("ClientId must be greater than 0.");

        // ServiceOfferingId must be > 0
        RuleFor(x => x.ServiceOfferingId)
            .GreaterThan(0)
            .WithMessage("ServiceOfferingId must be greater than 0.");

        // PreferredDateTime: cannot be default
        RuleFor(x => x.PreferredDateTime)
            .NotEqual(default(DateTime))
            .WithMessage("PreferredDateTime is required.");

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
