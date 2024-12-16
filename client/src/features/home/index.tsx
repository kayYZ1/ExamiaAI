import Navbar from './components/navbar';
import Hero from './components/hero';
import Features from './components/features';
import Stats from './components/stats';
import Testimonials from './components/testimonials';

import { colors } from '../../styles/theme';

export default function Index() {
  return (
    <div className={`min-h-screen ${colors.background.main}`}>
      <Navbar />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Hero />
        </div>
        <Features />
        <Stats />
        <Testimonials />
      </main>
    </div>
  );
}
