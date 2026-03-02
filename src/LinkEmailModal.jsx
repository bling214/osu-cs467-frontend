import { useState } from 'react';
import supabase from '@/supabase-client';

const LinkEmailModal = ({ isOpen, onClose, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      // CRITICAL: We use updateUser to attach credentials to the current anonymous session
      const { error: updateError } = await supabase.auth.updateUser({
        email: email,
        password: password,
      });

      if (updateError) throw updateError;

      // Note: Supabase usually sends a confirmation email by default.
      // The user won't technically be fully "linked" until they click the link in their email.
      setMessage('Success! Please check your email for a confirmation link to finalize your account.');

      // Auto-close after a few seconds
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 4000);
    } catch (err) {
      console.error('Link Email Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h3 className="text-2xl font-bold mb-2">Link Your Email</h3>
        <p className="text-sm text-gray-600 mb-6">
          Link an email to log in from any device, keep your specific pseudonym, and retain the ability to edit or
          delete your past reviews.
        </p>

        {error && <p className="text-red-500 text-sm mb-4 bg-red-50 p-2 rounded">{error}</p>}
        {message && <p className="text-green-600 text-sm mb-4 bg-green-50 p-2 rounded">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              required
              minLength={6}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Linking...' : 'Link Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LinkEmailModal;
