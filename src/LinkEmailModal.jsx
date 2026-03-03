import { useState, useEffect, useRef } from 'react';
import supabase from '@/supabase-client';
import { Eye, EyeOff } from 'lucide-react';

const LinkEmailModal = ({ isOpen, onClose, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  // Create a reference to store our timer ID so we can cancel it later
  const timerRef = useRef(null);

  // Clean up states every time the modal opens or closes
  useEffect(() => {
    if (!isOpen) {
      // Whenever the modal closes, wipe all state clean so nothing leaks
      setEmail('');
      setPassword('');
      setShowPassword(false);
      setError(null);
      setMessage(null);
      setLoading(false);

      // If there is a countdown running, kill it
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    }

    // Also clear the timer if the entire component unmounts from the DOM
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      // Use updateUser to attach credentials to the current anonymous session
      const { error: updateError } = await supabase.auth.updateUser({
        email: email,
        password: password,
      });

      if (updateError) throw updateError;

      // Note: Supabase usually sends a confirmation email by default.
      // The user won't technically be fully "linked" until they click the link in their email.
      setMessage('Success! Please check your email for a confirmation link to finalize your account.');

      // Save the timer ID to our ref
      timerRef.current = setTimeout(() => {
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

  // Create a boolean to check if we are in the "Success Countdown" phase
  const isSuccessDelay = message !== null;

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

        {/* 5. Disable the entire form if it's loading OR if we are waiting for the success timer */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <fieldset disabled={loading || isSuccessDelay} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-black focus:ring focus:ring-blue-200 disabled:opacity-50 disabled:bg-gray-100"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              {/* Wrap the input in a relative div so we can position the icon inside it */}
              <div className="relative mt-1">
                <input
                  // Dynamically toggle the input type
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  // Added pr-10 so long passwords don't hide behind the icon
                  className="block w-full border border-gray-300 rounded-md p-2 pr-10 text-black focus:ring focus:ring-blue-200 disabled:opacity-50 disabled:bg-gray-100"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {/* The toggle button */}
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  disabled={loading || isSuccessDelay}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 disabled:opacity-50"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                disabled={loading || isSuccessDelay}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || isSuccessDelay}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
              >
                {loading ? 'Linking...' : isSuccessDelay ? 'Success!' : 'Link Account'}
              </button>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  );
};

export default LinkEmailModal;
