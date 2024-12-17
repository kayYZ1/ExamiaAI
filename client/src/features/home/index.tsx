import Navbar from './components/navbar';
import Hero from './sections/hero';
import Features from './sections/features';
import Stats from './sections/stats';
import Testimonials from './sections/testimonials';
import Footer from './sections/footer';
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
        <Footer />
      </main>
    </div>
  );
}
