// ============= Contact API =============
// TODO: Integrate with backend endpoint when available
// Expected endpoint: POST /api/Contact

import { apiClient } from './client';

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
}

export const ContactApi = {
  /**
   * Submit a contact form inquiry
   * TODO: Replace with actual API call when backend endpoint is ready
   * Expected endpoint: POST /api/Contact
   */
  async submit(data: ContactFormData): Promise<ContactResponse> {
    // TODO: Uncomment when backend is ready
    // return apiClient.post<ContactResponse>('/api/Contact', data);

    // Simulate API call for now
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    console.log('Contact form submitted (simulated):', data);
    
    return {
      success: true,
      message: 'Thanks for reaching out! I\'ll get back to you soon.',
    };
  },
};
