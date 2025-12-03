import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createEventRequest,
  type CreateEventRequestPayload,
} from "../../lib/api/eventRequestsApi";
import { SuccessModal } from "../SuccessModal";

const eventRequestSchema = z
  .object({
    organizerName: z.string().min(1, "Please enter the organizer or company."),
    email: z
      .string()
      .min(1, "Please enter an email.")
      .email("Please enter a valid email."),
    phone: z.string().optional(),
    eventName: z.string().min(1, "Please enter the event name."),
    city: z.string().min(1, "City is required."),
    country: z.string().min(1, "Country is required."),
    eventStartDate: z.string().min(1, "Please choose a start date."),
    eventEndDate: z.string().optional(),
    requestType: z.string().min(1, "Please select a request type."),
    numberOfWorkshops: z
      .preprocess(
        (value) => {
          if (value === "" || value === undefined || value === null) {
            return undefined;
          }
          if (typeof value === "string") {
            return Number(value);
          }
          return value;
        },
        z
          .number({
            invalid_type_error: "Enter a valid number.",
          })
          .int("Please enter a whole number.")
          .positive("Must be greater than 0.")
      )
      .optional(),
    budget: z.string().optional(),
    message: z.string().optional(),
  })
  .refine(
    (values) => {
      if (!values.eventEndDate) return true;
      const start = new Date(values.eventStartDate);
      const end = new Date(values.eventEndDate);
      return end >= start;
    },
    {
      message: "End date cannot be before start date.",
      path: ["eventEndDate"],
    }
  );

type EventRequestFormValues = z.infer<typeof eventRequestSchema>;

export function EventRequestForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EventRequestFormValues>({
    resolver: zodResolver(eventRequestSchema),
    defaultValues: {
      organizerName: "",
      email: "",
      phone: "",
      eventName: "",
      city: "",
      country: "",
      eventStartDate: "",
      eventEndDate: "",
      requestType: "",
      numberOfWorkshops: undefined,
      budget: "",
      message: "",
    },
  });

  const onSubmit = async (values: EventRequestFormValues) => {
    setIsSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError(null);
    try {
      const payload: CreateEventRequestPayload = {
        organizerName: values.organizerName,
        email: values.email,
        phone: values.phone || undefined,
        eventName: values.eventName,
        city: values.city,
        country: values.country,
        eventStartDate: values.eventStartDate,
        eventEndDate: values.eventEndDate || undefined,
        requestType: values.requestType,
        numberOfWorkshops: values.numberOfWorkshops,
        budget: values.budget || undefined,
        message: values.message || undefined,
      };

      await createEventRequest(payload);
      setSubmitSuccess(true);
      setShowSuccess(true);
      reset();
    } catch (error) {
      console.error("Failed to submit event request:", error);
      setSubmitError(
        "Something went wrong while sending your event request. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-6">
      <header className="space-y-1">
        <h2 className="text-xl font-semibold text-slate-100">
          Request Tomas for your event
        </h2>
        <p className="text-sm text-slate-400">
          Share your event details and desired collaboration. Tomas will review
          and respond with availability and next steps.
        </p>
      </header>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 text-sm text-slate-100"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">
              Organizer / Company
            </label>
            <input
              type="text"
              className="w-full rounded border border-slate-700 bg-slate-950/70 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              {...register("organizerName")}
            />
            {errors.organizerName && (
              <p className="text-xs text-red-400 mt-1">
                {errors.organizerName.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full rounded border border-slate-700 bg-slate-950/70 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-red-400 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">
              Phone (optional)
            </label>
            <input
              type="tel"
              className="w-full rounded border border-slate-700 bg-slate-950/70 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              {...register("phone")}
            />
            {errors.phone && (
              <p className="text-xs text-red-400 mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">
              Event name
            </label>
            <input
              type="text"
              className="w-full rounded border border-slate-700 bg-slate-950/70 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              {...register("eventName")}
            />
            {errors.eventName && (
              <p className="text-xs text-red-400 mt-1">
                {errors.eventName.message}
              </p>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">
                City
              </label>
              <input
                type="text"
                className="w-full rounded border border-slate-700 bg-slate-950/70 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                {...register("city")}
              />
              {errors.city && (
                <p className="text-xs text-red-400 mt-1">
                  {errors.city.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">
                Country
              </label>
              <input
                type="text"
                className="w-full rounded border border-slate-700 bg-slate-950/70 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                {...register("country")}
              />
              {errors.country && (
                <p className="text-xs text-red-400 mt-1">
                  {errors.country.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">
              Event start date
            </label>
            <input
              type="date"
              className="w-full rounded border border-slate-700 bg-slate-950/70 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              {...register("eventStartDate")}
            />
            {errors.eventStartDate && (
              <p className="text-xs text-red-400 mt-1">
                {errors.eventStartDate.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">
              Event end date (optional)
            </label>
            <input
              type="date"
              className="w-full rounded border border-slate-700 bg-slate-950/70 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              {...register("eventEndDate")}
            />
            {errors.eventEndDate && (
              <p className="text-xs text-red-400 mt-1">
                {errors.eventEndDate.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">
              Request type
            </label>
            <select
              className="w-full rounded border border-slate-700 bg-slate-950/70 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              {...register("requestType")}
            >
              <option value="">Select a request</option>
              <option value="workshops">Workshops</option>
              <option value="bootcamp">Bootcamp</option>
              <option value="show">Show / Demo</option>
              <option value="judging">Judging / Competition</option>
              <option value="private-day">Private Day / Coaching</option>
              <option value="other">Other</option>
            </select>
            {errors.requestType && (
              <p className="text-xs text-red-400 mt-1">
                {errors.requestType.message}
              </p>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">
                Approx. workshops
              </label>
              <input
                type="number"
                min={1}
                className="w-full rounded border border-slate-700 bg-slate-950/70 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                {...register("numberOfWorkshops")}
              />
              {errors.numberOfWorkshops && (
                <p className="text-xs text-red-400 mt-1">
                  {errors.numberOfWorkshops.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">
                Budget (optional)
              </label>
              <input
                type="text"
                placeholder="e.g. 10 000 SEK"
                className="w-full rounded border border-slate-700 bg-slate-950/70 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                {...register("budget")}
              />
              {errors.budget && (
                <p className="text-xs text-red-400 mt-1">
                  {errors.budget.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">
            Message / Extra information
          </label>
          <textarea
            rows={4}
            className="w-full rounded border border-slate-700 bg-slate-950/70 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Share any additional context, schedule ideas, or travel details."
            {...register("message")}
          />
          {errors.message && (
            <p className="text-xs text-red-400 mt-1">
              {errors.message.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-60"
          >
            {isSubmitting ? "Sending..." : "Submit event request"}
          </button>
          {submitSuccess && (
            <p className="text-xs text-emerald-300">
              Thank you! Your event request has been sent.
            </p>
          )}
          {submitError && (
            <p className="text-xs text-red-400">{submitError}</p>
          )}
        </div>
      </form>

      <SuccessModal
        isOpen={showSuccess}
        title="Request Sent!"
        message="Thank you! I will review your event request and get back to you soon."
        onClose={() => setShowSuccess(false)}
      />
    </section>
 );
}
