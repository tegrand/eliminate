export default function HowItWorksSection() {
  const steps = [
    {
      step: "01",
      title: "Post Job Requirement",
      description: "Clients publish detailed labor requirements with required skills, shift hours, locations, and pay rates."
    },
    {
      step: "02",
      title: "Automated Worker Matching",
      description: "The platform dispatches requirements to approved agencies or directly alerts verified independent workers."
    },
    {
      step: "03",
      title: "Track Shift Attendance",
      description: "Workers check in via geofenced biometric verification. Supervisors monitor live shift attendance on site."
    },
    {
      step: "04",
      title: "One-Click Settlement",
      description: "Verified attendance automatically generates client billing invoices and calculates worker payroll instantly."
    }
  ];

  return (
    <section id="how-it-works" className="py-12 bg-gray-50/70 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            How The Platform Works
          </h2>
          <p className="mt-4 text-base text-gray-600">
            A seamless four-step pipeline connecting demand with supply.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, idx) => (
            <div key={idx} className="relative bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
              <span className="text-3xl font-extrabold text-blue-600/30">{item.step}</span>
              <h3 className="text-lg font-semibold text-gray-900 mt-2 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
