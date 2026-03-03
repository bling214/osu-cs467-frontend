import { useState } from 'react';
import supabase from '@/supabase-client';
import { Eye, EyeOff } from 'lucide-react';

const LoginModal = ({ isOpen, onClose }) => {
  // State to hold the user's input
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // State to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);

  // State for UI feedback during the network request
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // If the modal is toggled off, don't render anything in the DOM
  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Clear any previous errors before trying again

    try {
      // Authenticate with Supabase using the provided credentials
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) throw loginError;

      // Clear inputs on successful login
      setEmail('');
      setPassword('');
      setShowPassword(false);
      onClose();
    } catch (err) {
      // If Supabase rejects the login (e.g., wrong password), show the error to the user
      setError(err.message);
    } finally {
      // Always reset the loading state, whether it succeeded or failed
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h3 className="text-2xl font-bold mb-4">Login</h3>

        {/* Display any error messages from the login attempt */}
        {error && <p className="text-red-500 text-sm mb-4 bg-red-50 p-2 rounded">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-black focus:ring focus:ring-blue-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            {/* Wrap the input in a relative div so we can position the icon inside it */}
            <div className="relative mt-1">
              <input
                // Toggle between password (bullets) and text (plaintext)
                type={showPassword ? 'text' : 'password'}
                required
                // Add extra padding on the right (pr-10) so the text doesn't hide behind the icon
                className="block w-full border border-gray-300 rounded-md p-2 pr-10 text-black focus:ring focus:ring-blue-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {/* The toggle button */}
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => {
                // Reset states when cancelling
                setError(null);
                setShowPassword(false);
                onClose();
              }}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
