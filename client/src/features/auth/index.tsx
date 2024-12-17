import { useState, FormEvent } from 'react';
import { colors } from '../../styles/theme';

export default function Index() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSignIn = (e: FormEvent) => {
    e.preventDefault();
    if (email) {
      setMessage('A magic link has been sent to your email!');
      console.log('Send magic link to:', email);
    } else {
      setMessage('Please enter a valid email address.');
    }
  };

  return (
    <div
      className={`${colors.background.main} ${colors.text.primary} min-h-screen flex items-center justify-center p-4`}
    >
      <div
        className={`${colors.background.secondary} ${colors.border} border rounded-lg shadow-md p-6 max-w-md w-full`}
      >
        <h1 className="text-2xl font-semibold text-center mb-4">
          Sign In with Magic Link
        </h1>
        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className={`block text-sm font-medium ${colors.text.secondary}`}
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={`w-full px-3 py-2 mt-1 ${colors.background.tertiary} ${colors.text.primary} ${colors.border} border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            />
          </div>
          <button
            type="submit"
            className={`w-full py-2 ${colors.primary.main} text-white font-semibold rounded-lg transition hover:shadow-lg`}
          >
            Send Magic Link
          </button>
        </form>
        {message && (
          <p className={`mt-4 text-sm ${colors.text.secondary} text-center`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};
