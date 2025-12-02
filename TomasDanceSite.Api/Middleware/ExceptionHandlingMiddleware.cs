using System.Net;
using System.Text.Json;
using TomasDanceSite.Application.Exceptions;


namespace TomasDanceSite.Api.Middleware
{
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionHandlingMiddleware> _logger;

        public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unhandled exception occurred.");

                context.Response.ContentType = "application/json";

                var statusCode = ex switch
                {
                    ValidationException => (int)HttpStatusCode.BadRequest,      // 400
                    BusinessRuleException => (int)HttpStatusCode.Conflict,      // 409
                    NotFoundException => (int)HttpStatusCode.NotFound,          // 404
                    ArgumentException => (int)HttpStatusCode.BadRequest,        // 400 (legacy / fallback)
                    _ => (int)HttpStatusCode.InternalServerError                // 500
                };

                context.Response.StatusCode = statusCode;

                var errorResponse = new
                {
                    StatusCode = statusCode,
                    Message = ex.Message,              // now show the real business/validation message
                    ExceptionType = ex.GetType().FullName,
                    TraceId = context.TraceIdentifier
                    // You *can* keep Error = ex.ToString() in dev if you want, but it’s noisy:
                    // Error = ex.ToString()
                };

                var json = JsonSerializer.Serialize(errorResponse);

                await context.Response.WriteAsync(json);
            }
        }
    }
}
