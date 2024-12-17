const testimonials = [
  {
    quote:
      'EXAMIA transformed the way I prepare for my certifications. The AI-powered learning paths are incredibly effective.',
    author: 'Sarah Johnson',
    role: 'Software Engineer',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150',
  },
  {
    quote:
      'The analytics dashboard helped me identify and improve my weak areas. My test scores improved significantly.',
    author: 'Michael Chen',
    role: 'Medical Student',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150',
  },
  {
    quote:
      "The collaborative features make learning more engaging. It's like having a study group available 24/7.",
    author: 'Emily Rodriguez',
    role: 'Graduate Student',
    image:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150',
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            What Our Students Say
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
            Join thousands of satisfied students who have transformed their
            learning journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="p-6 rounded-xl bg-slate-50 dark:bg-slate-800 shadow-lg"
            >
              <div className="flex items-center mb-6">
                <img
                  src={testimonial.image}
                  alt={testimonial.author}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="ml-4">
                  <div className="font-semibold text-slate-900 dark:text-slate-100">
                    {testimonial.author}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    {testimonial.role}
                  </div>
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-300 italic">
                "{testimonial.quote}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
