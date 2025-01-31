import { colors } from '@/styles/theme';

export default function TabButton({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 text-lg font-medium ${
        active
          ? `${colors.primary.main} ${colors.text.primary}`
          : `bg-transparent ${colors.text.secondary}`
      } rounded-lg transition duration-150 ease-in-out`}
    >
      {children}
    </button>
  );
}
