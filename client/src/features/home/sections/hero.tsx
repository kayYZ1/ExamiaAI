import Button from '../../../shared/components/ui/button';

export default function Hero() {
  return (
    <div className="text-center">
      <h1 className="mb-6 text-4xl font-bold text-slate-800 sm:text-5xl md:text-6xl dark:text-slate-100">
        Welcome to{' '}
        <span className="text-indigo-600 dark:text-indigo-400">
          EXAMIA
        </span>
      </h1>
      <p className="mx-auto max-w-2xl text-xl text-slate-600 dark:text-slate-300">
        Your comprehensive platform for modern education and assessment.
        Transform the way you learn and evaluate with our cutting-edge
        tools.
      </p>

      <div className="mt-10 flex justify-center gap-4">
        <Button variant="primary">Get Started</Button>
        <Button variant="secondary">Learn More</Button>
      </div>
    </div>
  );
}
