import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FaqSection() {
  const faqs = [
    {
      question: "How does worker registration work?",
      answer: "Workers register independently through our public onboarding form. Once submitted, their profile enters 'Pending Verification' until reviewed by platform administrators. Once verified, they can be matched directly or assigned via agencies."
    },
    {
      question: "Can staffing agencies bring their existing talent pool?",
      answer: "Yes! Staffing agencies register an Agency Account and can manage their proprietary worker supply, fulfill client job orders, and handle weekly payouts seamless through our dashboard."
    },
    {
      question: "How is shift attendance verified to prevent time theft?",
      answer: "Attendance is captured via geofenced mobile check-ins and on-site biometric scanners. If a worker checks in outside the designated GPS radius or shift window, the entry is flagged for supervisor verification before payroll approval."
    },
    {
      question: "Is there approval required for Client accounts?",
      answer: "No. Enterprise Clients can sign up and immediately start publishing job requirements and browsing available agency partners."
    }
  ];

  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="py-20 bg-gray-50/70 border-t border-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-base text-gray-600">
            Everything you need to know about the ELIMINATE platform.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <button
                onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
                className="w-full px-6 py-5 text-left flex justify-between items-center font-semibold text-gray-900 hover:text-blue-600 transition-colors"
              >
                <span>{faq.question}</span>
                <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${openIndex === idx ? "transform rotate-180 text-blue-600" : ""}`} />
              </button>
              {openIndex === idx && (
                <div className="px-6 pb-6 text-sm text-gray-600 leading-relaxed border-t border-gray-50 pt-4">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
