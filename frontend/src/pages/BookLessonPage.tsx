import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getAllServiceOfferings } from "../lib/api/serviceOfferingsApi";
import { createBooking } from "../lib/api/bookingsApi";
import { createClient } from "../lib/api/clientsApi";
import { useNavigate } from "react-router-dom";
import type { ServiceOfferingDto } from "../types/serviceOffering";
import type { CreateBookingDto } from "../types/booking";
import type { CreateClientDto } from "../types/client";
import { Loader } from "../components/common/Loader";
import { SuccessModal } from "../components/SuccessModal";

// Zod schema for form validation
const bookingFormSchema = z.object({
  // Client info
  name: z.string().min(1, "Please enter your name."),
  email: z
    .string()
    .min(1, "Please enter your email.")
    .email("Please enter a valid email."),
  phone: z.string().optional(),

  // Booking info
  serviceOfferingId: z.number().int().positive("Please select a service."),

  preferredDate: z.string().min(1, "Please choose a date."),
  preferredTime: z.string().min(1, "Please choose a time."),

  locationDetails: z.string().optional(),
  message: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

export function BookLessonPage() {
  const [services, setServices] = useState<ServiceOfferingDto[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [serviceError, setServiceError] = useState<string | null>(null);

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      serviceOfferingId: 0,
      preferredDate: "",
      preferredTime: "",
      locationDetails: "",
      message: "",
    },
  });

  useEffect(() => {
    async function loadServices() {
      try {
        setLoadingServices(true);
        setServiceError(null);
        const data = await getAllServiceOfferings();
        setServices(data);
      } catch (err) {
        console.error(err);
        setServiceError("Failed to load services. Please try again later.");
      } finally {
        setLoadingServices(false);
      }
    }

    loadServices();
  }, []);

  const onSubmit = async (values: BookingFormValues) => {
    setSubmitError(null);
    setSubmitting(true);

    try {
      // 1) Create client
      const clientPayload: CreateClientDto = {
        name: values.name,
        email: values.email,
        phone: values.phone || undefined,
      };

      console.log("Creating client with payload:", clientPayload);
      const createdClient = await createClient(clientPayload);

      // 2) Combine date + time into a single ISO string
      const preferredDateTimeLocal = new Date(
        `${values.preferredDate}T${values.preferredTime}`
      );

      const bookingPayload: CreateBookingDto = {
        clientId: createdClient.id,
        serviceOfferingId: values.serviceOfferingId,
        preferredDateTime: preferredDateTimeLocal.toISOString(),
        locationDetails: values.locationDetails || undefined,
        message: values.message || undefined,
      };

      console.log("Creating booking with payload:", bookingPayload);
      const createdBooking = await createBooking(bookingPayload);
      console.log("Booking created:", createdBooking);

      reset({
        name: "",
        email: "",
        phone: "",
        serviceOfferingId: 0,
        preferredDate: "",
        preferredTime: "",
        locationDetails: "",
        message: "",
      });
      setShowSuccess(true);
    } catch (error: any) {
      console.error("Failed to create client or booking:", error);

      let message =
        "Something went wrong when sending your booking request. Please try again later.";

      if (error?.response?.status === 400) {
        message =
          "Your request was rejected due to validation. Please check your details and try again.";
      } else if (error?.response?.status === 500) {
        message =
          "Server error while processing your request. Please try again later.";
      }

      setSubmitError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Book a Private Lesson</h1>
      <p className="text-slate-300 mb-6 text-sm">
        Fill in your details and preferred time. Your request will be sent
        directly to the backend Booking API so Tomas can review and confirm.
      </p>

      <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
        {loadingServices && <Loader label="Loading services..." />}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 bg-slate-900/60 border border-slate-800 rounded-lg p-4"
        >
          {/* Status messages */}
          {submitError && (
            <div className="rounded-md border border-red-500/60 bg-red-500/10 px-3 py-2 text-xs text-red-300 mb-2">
              {submitError}
            </div>
          )}

          {/* Client info */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              placeholder="Your full name"
              className="w-full rounded-md border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-red-400 mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Email <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-md border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-red-400 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Phone (optional)
            </label>
            <input
              type="tel"
              placeholder="+46..."
              className="w-full rounded-md border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              {...register("phone")}
            />
          </div>

          {/* Service Offering */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Service type
            </label>
            <select
              className="w-full rounded-md border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              {...register("serviceOfferingId", {
                valueAsNumber: true,
              })}
              onChange={(e) =>
                setValue("serviceOfferingId", Number(e.target.value))
              }
            >
              <option value={0} disabled>
                {loadingServices
                  ? "Loading services..."
                  : "Select a service offering"}
              </option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
            {errors.serviceOfferingId && (
              <p className="text-xs text-red-400 mt-1">
                {errors.serviceOfferingId.message}
              </p>
            )}
            {serviceError && (
              <p className="text-xs text-yellow-400 mt-1">{serviceError}</p>
            )}
          </div>

          {/* Preferred date and time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Preferred date
              </label>
              <input
                type="date"
                className="w-full rounded-md border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                {...register("preferredDate")}
              />
              {errors.preferredDate && (
                <p className="text-xs text-red-400 mt-1">
                  {errors.preferredDate.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Preferred time
              </label>
              <input
                type="time"
                className="w-full rounded-md border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                {...register("preferredTime")}
              />
              {errors.preferredTime && (
                <p className="text-xs text-red-400 mt-1">
                  {errors.preferredTime.message}
                </p>
              )}
            </div>
          </div>

          {/* Location details */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Location details (optional)
            </label>
            <input
              type="text"
              placeholder="Studio, address, city, or online..."
              className="w-full rounded-md border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              {...register("locationDetails")}
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Message (optional)
            </label>
            <textarea
              rows={4}
              placeholder="Anything special you want to focus on, your level, partner info, etc."
              className="w-full rounded-md border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              {...register("message")}
            />
          </div>

          {/* Submit + status */}
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Sending..." : "Send booking request"}
            </button>
          </div>
        </form>

        {/* Side info panel */}
        <aside className="space-y-3 text-sm text-slate-300">
          <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4">
            <h2 className="text-sm font-semibold mb-2">How it works</h2>
            <ol className="list-decimal list-inside space-y-1 text-xs text-slate-300">
              <li>You fill in your contact details and preferences.</li>
              <li>
                The system creates a client profile and a booking request.
              </li>
              <li>
                Tomas will confirm availability and contact you with the next steps.
              </li>
            </ol>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4 text-xs text-slate-400">
            <p>
              Your contact details are only used to handle your booking request
              and communicate about lessons and events.
            </p>
          </div>
       </aside>
      </div>

      <SuccessModal
        isOpen={showSuccess}
        title="Booking Confirmed!"
        message="Thank you for your request. I will get back to you shortly to confirm the details."
        onClose={() => {
          setShowSuccess(false);
          navigate("/thank-you");
        }}
      />
    </section>
  );
}
