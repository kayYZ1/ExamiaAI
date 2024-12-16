import Navbar from "./components/navbar";
import Hero from "./components/hero";
import { useToggleTheme } from "./hooks/useToggleTheme";

export default function App() {
  const { darkMode, toggleDarkMode } = useToggleTheme();

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 transition-colors duration-200">
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Hero />
        </div>
      </main>
    </div>
  );
}
