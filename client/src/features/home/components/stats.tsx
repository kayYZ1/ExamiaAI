const stats = [
  { number: '50K+', label: 'Active Students' },
  { number: '1000+', label: 'Course Materials' },
  { number: '95%', label: 'Success Rate' },
  { number: '24/7', label: 'Support Available' },
];

export default function Stats() {
  return (
    <section className="py-16 bg-indigo-600 dark:bg-indigo-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold text-white mb-2">
                {stat.number}
              </div>
              <div className="text-indigo-100">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
