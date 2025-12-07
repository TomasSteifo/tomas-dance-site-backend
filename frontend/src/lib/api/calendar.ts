// ============= Calendar Integration Utilities =============
// TODO: Integrate with backend Google Calendar API when available

/**
 * Generates a Google Calendar event URL that users can click to add the event
 * This is a client-side solution that works without backend integration
 */
export function generateGoogleCalendarUrl(params: {
  title: string;
  description?: string;
  location?: string;
  startDateTime: string; // ISO 8601 format
  durationMinutes: number;
}): string {
  const { title, description, location, startDateTime, durationMinutes } = params;
  
  const startDate = new Date(startDateTime);
  const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
  
  // Format dates for Google Calendar (YYYYMMDDTHHmmssZ)
  const formatDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };
  
  const baseUrl = 'https://calendar.google.com/calendar/render';
  const queryParams = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${formatDate(startDate)}/${formatDate(endDate)}`,
    ...(description && { details: description }),
    ...(location && { location }),
  });
  
  return `${baseUrl}?${queryParams.toString()}`;
}

/**
 * Check if backend calendar integration is available
 * TODO: Implement when backend supports calendar sync
 */
export function isCalendarIntegrationEnabled(): boolean {
  // TODO: Check environment variable or feature flag
  // return import.meta.env.VITE_CALENDAR_INTEGRATION_ENABLED === 'true';
  return false;
}

/**
 * Add booking to user's calendar via backend
 * TODO: Implement when backend Google Calendar integration is ready
 */
export async function addToCalendarViaBackend(bookingId: number): Promise<void> {
  // TODO: Implement when backend is ready
  // Expected endpoint: POST /api/Calendar/add-booking/{bookingId}
  console.log('Calendar integration not yet available for booking:', bookingId);
  throw new Error('Calendar integration is not yet available');
}
