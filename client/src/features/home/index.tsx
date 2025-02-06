import { useState } from 'react';
import { FileText, Brain, Clock } from 'lucide-react';

import { colors } from '@/styles/theme';

import FeatureCard from './components/feature-card';
import TabButton from './components/tab-button';
import TabContent from './components/tab-content';
import Navbar from './components/navbar';

export default function Index() {
  const [activeTab, setActiveTab] = useState('create');

  return (
    <div
      className={`min-h-screen ${colors.background.main} flex flex-col`}
    >
      <Navbar />
      <main className="flex-grow">
        <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-5xl text-center">
            <h1
              className={`text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl ${colors.text.primary} mb-6`}
            >
              AI-Powered Exam & Question Generation
            </h1>
            <p
              className={`text-xl ${colors.text.secondary} mx-auto mb-10 max-w-2xl`}
            >
              Create question sets, generate AI-powered questions, and run
              real-time exams with WebSockets.
            </p>
            <div className="flex flex-col justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <a
                className={`rounded-lg px-8 py-4 text-lg font-semibold ${colors.text.primary} ${colors.primary.main} shadow-lg transition duration-150 ease-in-out hover:shadow-xl`}
              >
                Get Started
              </a>
              <a
                className={`rounded-lg px-8 py-4 text-lg font-semibold ${colors.text.primary} border-2 bg-transparent ${colors.border} transition duration-150 ease-in-out hover:bg-slate-800`}
              >
                Watch Demo
              </a>
            </div>
          </div>
        </section>
        <section
          id="features"
          className="bg-gradient-to-b from-slate-900 to-slate-800 px-4 py-16 sm:px-6 lg:px-8"
        >
          <div className="mx-auto max-w-7xl">
            <h2
              className={`text-3xl font-bold sm:text-4xl ${colors.text.primary} mb-16 text-center`}
            >
              Key Features
            </h2>
            <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                title="Create Question Sets"
                description="Easily create structured question sets tailored to your specific needs and requirements."
                icon={<FileText size={48} />}
              />
              <FeatureCard
                title="AI-Powered Generation"
                description="Leverage cutting-edge AI to generate unique and relevant questions instantly, saving you time and effort."
                icon={<Brain size={48} />}
              />
              <FeatureCard
                title="Real-Time Exams"
                description="Conduct seamless, real-time exams with advanced monitoring capabilities using WebSockets technology."
                icon={<Clock size={48} />}
              />
            </div>
          </div>
        </section>
        <section
          id="how-it-works"
          className={`px-4 py-20 sm:px-6 lg:px-8 ${colors.background.secondary}`}
        >
          <div className="mx-auto max-w-4xl">
            <h2
              className={`text-3xl font-bold sm:text-4xl ${colors.text.primary} mb-16 text-center`}
            >
              How It Works
            </h2>
            <div className="mb-10 flex justify-center">
              <TabButton
                active={activeTab === 'create'}
                onClick={() => setActiveTab('create')}
              >
                Create
              </TabButton>
              <TabButton
                active={activeTab === 'generate'}
                onClick={() => setActiveTab('generate')}
              >
                Generate
              </TabButton>
              <TabButton
                active={activeTab === 'conduct'}
                onClick={() => setActiveTab('conduct')}
              >
                Conduct
              </TabButton>
            </div>
            <div
              className={`rounded-2xl p-8 ${colors.background.tertiary} ${colors.border} border shadow-lg`}
            >
              {activeTab === 'create' && (
                <TabContent
                  title="Create Custom Question Sets"
                  description="Define categories, difficulty levels, and question types with our intuitive interface. Easily organize and structure your exam content to meet your specific requirements."
                />
              )}
              {activeTab === 'generate' && (
                <TabContent
                  title="AI-Powered Question Generation"
                  description="Harness the power of AI to instantly create unique and relevant questions based on your specified parameters. Save time and ensure diverse, high-quality question sets."
                />
              )}
              {activeTab === 'conduct' && (
                <TabContent
                  title="Launch Real-Time Exams"
                  description="Utilize our WebSocket-enabled platform to conduct seamless, real-time exams. Monitor student progress, provide instant feedback, and ensure a smooth examination experience for all participants."
                />
              )}
            </div>
          </div>
        </section>
        <section className="bg-gradient-to-b from-slate-800 to-slate-900 px-4 py-20 text-center sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2
              className={`text-3xl font-bold sm:text-4xl ${colors.text.primary} mb-6`}
            >
              Ready to revolutionize your exam process?
            </h2>
            <p className={`${colors.text.secondary} mb-10 text-xl`}>
              Join thousands of educators and institutions already using
              our platform to create, generate, and conduct exams with
              ease.
            </p>
            <a
              href="#signup"
              className={`rounded-lg px-8 py-4 text-lg font-semibold ${colors.text.primary} ${colors.primary.main} shadow-lg transition duration-150 ease-in-out hover:shadow-xl`}
            >
              Sign Up Now
            </a>
          </div>
        </section>
      </main>
      <footer
        className={`px-4 py-8 sm:px-6 lg:px-8 ${colors.background.main} border-t ${colors.border}`}
      >
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between sm:flex-row">
          <div className={`${colors.text.secondary} mb-4 text-sm sm:mb-0`}>
            ©{new Date().getFullYear()} ExamiaAI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
