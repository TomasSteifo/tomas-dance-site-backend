using System;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using TomasDanceSite.Application.DTOs;
using TomasDanceSite.Application.Exceptions;
using TomasDanceSite.Application.Services;
using TomasDanceSite.Infrastructure.Persistence;
using TomasDanceSite.Domain.Entities;
using TomasDanceSite.Domain.Enums;
using Assert = NUnit.Framework.Assert;

namespace TomasDanceSite.Tests.Services
{
    [TestFixture]
    public class BookingServiceTests
    {
        private ApplicationDbContext _dbContext = null!;
        private IMapper _mapper = null!;
        private BookingService _service = null!;

        // -------------------------------------------------------------
        // Setup & Teardown
        // -------------------------------------------------------------
        [SetUp]
        public void SetUp()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _dbContext = new ApplicationDbContext(options);

            // For these tests, validation triggers before mapping,
            // so mapper can safely be null.
            _mapper = null!;

            _service = new BookingService(_dbContext, _mapper);
        }

        [TearDown]
        public void TearDown()
        {
            _dbContext.Database.EnsureDeleted();
            _dbContext.Dispose();
        }

        // -------------------------------------------------------------
        // TEST 1: Past PreferredDateTime should throw
        // -------------------------------------------------------------
        [Test]
        public void CreateAsync_WhenPreferredDateIsInThePast_ThrowsValidationException()
        {
            // ARRANGE
            var dto = new CreateBookingDto
            {
                ClientId = 1,
                ServiceOfferingId = 1,
                PreferredDateTime = DateTime.UtcNow.AddDays(-1), // Past date
                LocationDetails = "Somewhere",
                Message = "Test"
            };

            // ACT + ASSERT
            Assert.ThrowsAsync<ValidationException>(async () =>
            {
                await _service.CreateAsync(dto);
            });
        }

        // -------------------------------------------------------------
        // TEST 2: Missing client should throw
        // -------------------------------------------------------------
        [Test]
        public void CreateAsync_WhenClientDoesNotExist_ThrowsValidationException()
        {
            // ARRANGE
            var futureDate = DateTime.UtcNow.AddDays(1);
            var missingClientId = 123; // DB has no seeded clients

            var dto = new CreateBookingDto
            {
                ClientId = missingClientId,
                ServiceOfferingId = 1,
                PreferredDateTime = futureDate,
                LocationDetails = "Somewhere",
                Message = "Test"
            };

            // ACT
            var ex = Assert.ThrowsAsync<ValidationException>(async () =>
            {
                await _service.CreateAsync(dto);
            });

            // ASSERT
            Assert.That(ex!.Message, Is.EqualTo($"Client with ID {missingClientId} does not exist."));
        }

        // -------------------------------------------------------------
        // TEST 3: Missing service offering should throw
        // -------------------------------------------------------------
        [Test]
        public void CreateAsync_WhenServiceOfferingDoesNotExist_ThrowsValidationException()
        {
            // ARRANGE
            // 1) Seed a valid client so the client validation passes
            _dbContext.Clients.Add(new Client
            {
                Id = 1,
                Name = "Test Client",
                Email = "testclient@example.com",
                Phone = "+46123456789",
                ClientType = ClientType.Student,
                CreatedAtUtc = DateTime.UtcNow
            });
            _dbContext.SaveChanges();

            var futureDate = DateTime.UtcNow.AddDays(1);
            var missingServiceOfferingId = 999; // Not present in DB

            var dto = new CreateBookingDto
            {
                ClientId = 1,                                 // ✅ exists now
                ServiceOfferingId = missingServiceOfferingId, // ❌ does NOT exist
                PreferredDateTime = futureDate,
                LocationDetails = "Somewhere",
                Message = "Test"
            };

            // ACT
            var ex = Assert.ThrowsAsync<ValidationException>(async () =>
            {
                await _service.CreateAsync(dto);
            });

            // ASSERT
            Assert.That(ex, Is.Not.Null);
            Assert.That(
                ex!.Message,
                Is.EqualTo($"Service offering with ID {missingServiceOfferingId} does not exist.")
            );
        }

        // -------------------------------------------------------------
        // TEST 4: Changing status from Cancelled should throw
        // -------------------------------------------------------------
        [Test]
        public void UpdateAsync_WhenStatusChangesFromCancelled_ThrowsBusinessRuleException()
        {
            // ARRANGE
            // 1) Seed a booking that is already Cancelled
            var booking = new Booking
            {
                Id = 1,
                ClientId = 1,
                ServiceOfferingId = 1,
                PreferredDateTime = DateTime.UtcNow.AddDays(3),
                Status = BookingStatus.Cancelled,
                CreatedAtUtc = DateTime.UtcNow
            };

            _dbContext.Bookings.Add(booking);
            _dbContext.SaveChanges();

            // 2) Try to change status to Confirmed
            var dto = new UpdateBookingDto
            {
                Status = BookingStatus.Confirmed
            };

            // ACT
            var ex = Assert.ThrowsAsync<BusinessRuleException>(async () =>
            {
                await _service.UpdateAsync(1, dto);
            });

            // ASSERT
            Assert.That(ex, Is.Not.Null);
            Assert.That(
                ex!.Message,
                Is.EqualTo("Cannot change status once the booking is 'Cancelled'.")
            );
        }

        // -------------------------------------------------------------
        // TEST 5: Message longer than 500 chars should throw
        // -------------------------------------------------------------
        [Test]
        public void CreateAsync_WhenMessageIsTooLong_ThrowsValidationException()
        {
            // ARRANGE
            var longMessage = new string('x', 501);

            var dto = new CreateBookingDto
            {
                ClientId = 1,
                ServiceOfferingId = 1,
                PreferredDateTime = DateTime.UtcNow.AddDays(1),
                LocationDetails = "Somewhere",
                Message = longMessage
            };

            _dbContext.Clients.Add(new Client
            {
                Id = 1,
                Name = "Test Client",
                Email = "testclient@example.com",
                Phone = "+46123456789",
                ClientType = ClientType.Student,
                CreatedAtUtc = DateTime.UtcNow
            });

            _dbContext.ServiceOfferings.Add(new ServiceOffering
            {
                Id = 1,
                Name = "Test Service"
            });

            _dbContext.SaveChanges();

            // ACT
            var ex = Assert.ThrowsAsync<ValidationException>(async () =>
            {
                await _service.CreateAsync(dto);
            });

            // ASSERT
            Assert.That(ex, Is.Not.Null);
            Assert.That(ex!.Message, Is.EqualTo("Message cannot exceed 500 characters."));
        }

        // -------------------------------------------------------------
        // TEST 6: LocationDetails longer than 200 chars should throw
        // -------------------------------------------------------------
        [Test]
        public void CreateAsync_WhenLocationDetailsIsTooLong_ThrowsValidationException()
        {
            // ARRANGE
            var longLocation = new string('x', 201);

            var dto = new CreateBookingDto
            {
                ClientId = 1,
                ServiceOfferingId = 1,
                PreferredDateTime = DateTime.UtcNow.AddDays(1),
                LocationDetails = longLocation,
                Message = "Test"
            };

            _dbContext.Clients.Add(new Client
            {
                Id = 1,
                Name = "Test Client",
                Email = "testclient@example.com",
                Phone = "+46123456789",
                ClientType = ClientType.Student,
                CreatedAtUtc = DateTime.UtcNow
            });

            _dbContext.ServiceOfferings.Add(new ServiceOffering
            {
                Id = 1,
                Name = "Test Service"
            });

            _dbContext.SaveChanges();

            // ACT
            var ex = Assert.ThrowsAsync<ValidationException>(async () =>
            {
                await _service.CreateAsync(dto);
            });

            // ASSERT
            Assert.That(ex, Is.Not.Null);
            Assert.That(ex!.Message, Is.EqualTo("LocationDetails cannot exceed 200 characters."));
        }

        // -------------------------------------------------------------
        // TEST 7: Updating PreferredDateTime to a past date should throw
        // -------------------------------------------------------------
        [Test]
        public void UpdateAsync_WhenUpdatingPreferredDateToPast_ThrowsValidationException()
        {
            // ARRANGE
            _dbContext.Bookings.Add(new Booking
            {
                Id = 1,
                ClientId = 1,
                ServiceOfferingId = 1,
                PreferredDateTime = DateTime.UtcNow.AddDays(5),
                Status = BookingStatus.Pending,
                CreatedAtUtc = DateTime.UtcNow
            });

            _dbContext.SaveChanges();

            var dto = new UpdateBookingDto
            {
                PreferredDateTime = DateTime.UtcNow.AddDays(-1)
            };

            // ACT
            var ex = Assert.ThrowsAsync<ValidationException>(async () =>
            {
                await _service.UpdateAsync(1, dto);
            });

            // ASSERT
            Assert.That(ex, Is.Not.Null);
            Assert.That(ex!.Message, Is.EqualTo("PreferredDateTime must be in the future."));
        }

        // -------------------------------------------------------------
        // TEST 8: Invalid status transition Pending -> Completed should throw
        // -------------------------------------------------------------
        [Test]
        public void UpdateAsync_PendingToCompleted_ThrowsBusinessRuleException()
        {
            // ARRANGE
            _dbContext.Bookings.Add(new Booking
            {
                Id = 1,
                ClientId = 1,
                ServiceOfferingId = 1,
                PreferredDateTime = DateTime.UtcNow.AddDays(5),
                Status = BookingStatus.Pending,
                CreatedAtUtc = DateTime.UtcNow
            });

            _dbContext.SaveChanges();

            var dto = new UpdateBookingDto
            {
                Status = BookingStatus.Completed
            };

            // ACT
            var ex = Assert.ThrowsAsync<BusinessRuleException>(async () =>
            {
                await _service.UpdateAsync(1, dto);
            });

            // ASSERT
            Assert.That(ex, Is.Not.Null);
            Assert.That(
                ex!.Message,
                Is.EqualTo("Booking status change from 'Pending' to 'Completed' is not allowed.")
            );
        }

    }
}
