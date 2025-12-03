import { Routes, Route } from "react-router-dom";
import { HomePage } from "../pages/HomePage";
import { ServicesPage } from "../pages/ServicesPage";
import { BookLessonPage } from "../pages/BookLessonPage";
import { AdminPage } from "../pages/AdminPage";
import { OrganizersPage } from "../pages/OrganizersPage";
import { TestimonialsPage } from "../pages/TestimonialsPage";
import { ThankYouPage } from "../pages/ThankYouPage";
import { NotFoundPage } from "../pages/NotFoundPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/book-lesson" element={<BookLessonPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/organizers" element={<OrganizersPage />} />
      <Route path="/testimonials" element={<TestimonialsPage />} />
      <Route path="/thank-you" element={<ThankYouPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
