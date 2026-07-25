import { Star } from "lucide-react";

export default function TestimonialsSection() {
  const testimonials = [
    {
      quote: "ELIMINATE cut our shift fill times from 48 hours to under 30 minutes. The automated attendance verification alone saves our ops team 15 hours every week.",
      author: "Rajesh Menon",
      role: "VP of Operations",
      company: "LogiTech Global"
    },
    {
      quote: "As a staffing agency supplying 500+ industrial workers, managing compliance and weekly payouts was a nightmare. This platform automated our entire billing workflow.",
      author: "Anita Sharma",
      role: "Managing Director",
      company: "Apex Staffing Solutions"
    },
    {
      quote: "Registering was super simple. I get job notifications directly on my phone and get paid right on time after every shift. Highly recommended!",
      author: "Santhosh Kumar",
      role: "Certified Warehouse Specialist",
      company: "Independent Worker"
    }
  ];

  return (
    <section className="py-20 bg-gray-50/70 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Trusted by Operations Leaders & Workers
          </h2>
          <p className="mt-4 text-base text-gray-600">
            See how enterprise leaders and workers achieve operational excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div key={idx} className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-gray-700 leading-relaxed italic mb-6">"{t.quote}"</p>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <p className="text-sm font-bold text-gray-900">{t.author}</p>
                <p className="text-xs text-gray-500">{t.role} • <span className="text-gray-700">{t.company}</span></p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
