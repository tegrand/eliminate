export default function StatsSection() {
  const stats = [
    { value: "15,000+", label: "Workers Deployed" },
    { value: "99.8%", label: "Shift Fulfillment Rate" },
    { value: "450+", label: "Enterprise Clients" },
    { value: "$12M+", label: "Automated Payroll Settled" },
  ];

  return (
    <section className="py-12 bg-gray-900 text-white border-y border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, idx) => (
            <div key={idx} className="p-4">
              <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{stat.value}</p>
              <p className="mt-2 text-sm font-medium text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
