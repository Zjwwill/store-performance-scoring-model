import { Locale, getTestimonials } from "@/lib/data";

export function Testimonials({ locale }: { locale: Locale }) {
  const testimonials = getTestimonials(locale);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {testimonials.map((testimonial) => (
        <div key={testimonial.name} className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
          <div className="text-lg leading-8 text-slate-100">“{testimonial.quote}”</div>
          <div className="mt-6">
            <div className="font-semibold text-white">{testimonial.name}</div>
            <div className="text-sm text-slate-400">{testimonial.role}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
