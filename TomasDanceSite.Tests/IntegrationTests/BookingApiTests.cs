using System;
using System.Net;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using NUnit.Framework;
using NUnit.Framework.Legacy;
using TomasDanceSite.Application.DTOs;

namespace TomasDanceSite.Tests.IntegrationTests
{
    [TestFixture]
    public class BookingApiTests
    {
        private CustomWebApplicationFactory _factory = null!;
        private HttpClient _client = null!;

        [SetUp]
        public void SetUp()
        {
            _factory = new CustomWebApplicationFactory();
            _client = _factory.CreateClient();
        }

        [TearDown]
        public void TearDown()
        {
            _client?.Dispose();
            _factory?.Dispose();
        }

        // -------------------------------------------------------------
        // IT 1: POST /api/bookings with valid data returns 201 + BookingDto
        // -------------------------------------------------------------
        [Test]
        public async Task Post_Bookings_WithValidData_ReturnsCreatedBooking()
        {
            // ARRANGE
            var dto = new CreateBookingDto
            {
                ClientId = 1,            // finns i SeedTestData
                ServiceOfferingId = 1,   // finns i SeedTestData
                PreferredDateTime = DateTime.UtcNow.AddDays(2),
                LocationDetails = "Test Studio",
                Message = "Please help me with body movement."
            };

            // ACT
            var response = await _client.PostAsJsonAsync("/api/bookings", dto);

            // ASSERT – statuskod
            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.Created));

            // ASSERT – innehåll
            var created = await response.Content.ReadFromJsonAsync<BookingDto>();

            Assert.That(created, Is.Not.Null);
            Assert.That(created!.Id, Is.GreaterThan(0));
            Assert.That(created.ClientId, Is.EqualTo(dto.ClientId));
            Assert.That(created.ServiceOfferingId, Is.EqualTo(dto.ServiceOfferingId));
        }

        // -------------------------------------------------------------
        // IT 2: POST /api/bookings with past date returns 400 BadRequest
        // -------------------------------------------------------------
        [Test]
        public async Task Post_Bookings_WithPastDate_ReturnsBadRequest()
        {
            // ARRANGE
            var dto = new CreateBookingDto
            {
                ClientId = 1,            // Finns i seed
                ServiceOfferingId = 1,   // Finns i seed
                PreferredDateTime = DateTime.UtcNow.AddDays(-1), // ❌ förfluten tid
                LocationDetails = "Test Studio",
                Message = "This should fail due to past date."
            };

            // ACT
            var response = await _client.PostAsJsonAsync("/api/bookings", dto);

            // ASSERT – statuskod
            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));

            // (Valfritt) Kolla att felmeddelandet innehåller text om datumet
            var content = await response.Content.ReadAsStringAsync();
            StringAssert.Contains("PreferredDateTime must be in the future", content);
        }

        // -------------------------------------------------------------
        // IT 3: GET /api/bookings/{id} returns the created booking
        // -------------------------------------------------------------
        [Test]
        public async Task Get_Bookings_ById_ReturnsCreatedBooking()
        {
            // ARRANGE – skapa först en booking via API:et
            var createDto = new CreateBookingDto
            {
                ClientId = 1,
                ServiceOfferingId = 1,
                PreferredDateTime = DateTime.UtcNow.AddDays(3),
                LocationDetails = "Test Studio",
                Message = "Integration test booking."
            };

            var createResponse = await _client.PostAsJsonAsync("/api/bookings", createDto);
            Assert.That(createResponse.StatusCode, Is.EqualTo(HttpStatusCode.Created));

            var created = await createResponse.Content.ReadFromJsonAsync<BookingDto>();
            Assert.That(created, Is.Not.Null);
            var id = created!.Id;

            // ACT – hämta den skapade bokningen
            var getResponse = await _client.GetAsync($"/api/bookings/{id}");

            // ASSERT – statuskod
            Assert.That(getResponse.StatusCode, Is.EqualTo(HttpStatusCode.OK));

            // ASSERT – innehåll
            var fetched = await getResponse.Content.ReadFromJsonAsync<BookingDto>();
            Assert.That(fetched, Is.Not.Null);
            Assert.That(fetched!.Id, Is.EqualTo(id));
            Assert.That(fetched.ClientId, Is.EqualTo(createDto.ClientId));
            Assert.That(fetched.ServiceOfferingId, Is.EqualTo(createDto.ServiceOfferingId));
        }

    }
}
