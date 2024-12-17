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
    <section className="bg-white py-20 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            What Our Students Say
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
            Join thousands of satisfied students who have transformed their
            learning journey
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="rounded-xl bg-slate-50 p-6 shadow-lg dark:bg-slate-800"
            >
              <div className="mb-6 flex items-center">
                <img
                  src={testimonial.image}
                  alt={testimonial.author}
                  className="h-12 w-12 rounded-full object-cover"
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
              <p className="italic text-slate-600 dark:text-slate-300">
                "{testimonial.quote}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
