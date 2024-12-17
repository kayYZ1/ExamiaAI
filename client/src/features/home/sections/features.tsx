import {
  BookOpen,
  Users,
  Award,
  BarChart3,
  Brain,
  Clock,
} from 'lucide-react';

import { colors } from '../../../styles/theme';
import { FeatureCard } from '../components/feature-card';

const features = [
  {
    icon: BookOpen,
    title: 'Smart Curriculum',
    description:
      'Adaptive learning paths that evolve with student progress and understanding.',
  },
  {
    icon: Users,
    title: 'Collaborative Learning',
    description:
      'Interactive study groups and peer-to-peer learning opportunities.',
  },
  {
    icon: Award,
    title: 'Certification Ready',
    description:
      'Prepare for professional certifications with targeted exam preparation.',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description:
      'Comprehensive insights into performance and learning patterns.',
  },
  {
    icon: Brain,
    title: 'AI-Powered Learning',
    description:
      'Personalized learning experiences powered by advanced AI algorithms.',
  },
  {
    icon: Clock,
    title: 'Flexible Scheduling',
    description:
      'Learn at your own pace with customizable study schedules.',
  },
];

export default function Features() {
  return (
    <section className={`py-20 ${colors.background.tertiary}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className={`text-3xl font-bold ${colors.text.primary}`}>
            Transform Your Learning Experience
          </h2>
          <p className={`mt-4 text-lg ${colors.text.secondary}`}>
            Discover the features that make EXAMIA the leading choice for
            modern education
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
