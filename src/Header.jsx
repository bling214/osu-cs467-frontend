import { useEffect, useState } from 'react';
import supabase from '@/supabase-client';
import { apiFetch } from '@/utils/apiFetch';
import { Link } from 'react-router-dom';
import LinkEmailModal from './LinkEmailModal.jsx';
import LoginModal from './LoginModal.jsx';
import { ShieldCheck, LogOut } from 'lucide-react';

const Header = () => {
  // User Data State
  const [pseudonym, setPseudonym] = useState(null);
  const [userEmail, setUserEmail] = useState(null);

  // Modal Control State
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Set up Supabase Auth Listeners on component mount
  useEffect(() => {
    // Core function to check if a user is logged in and fetch their details
    async function fetchUserIdentity() {
      // Check Supabase for an active session (either anonymous or linked)
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session && session.user) {
        // Save the email if they have one (anonymous users won't)
        setUserEmail(session.user.email);

        try {
          // Fetch their specific pseudonym from our Backend API using their secure JWT
          const headers = { Authorization: `Bearer ${session.access_token}` };
          const profile = await apiFetch('/profiles/me', { headers });
          if (profile?.pseudonym) setPseudonym(profile.pseudonym);
        } catch (error) {
          console.error('Failed to fetch profile:', error);
        }
      } else {
        // If no session exists, ensure the UI resets to guest mode
        setPseudonym(null);
        setUserEmail(null);
      }
    }

    // Fetch identity immediately on load
    fetchUserIdentity();

    // Listen for background auth changes (like logging in via the modal, or session expiry)
    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        fetchUserIdentity(); // Re-fetch their profile data if they sign in
      } else if (event === 'SIGNED_OUT') {
        setPseudonym(null); // Clear local state immediately on sign out
        setUserEmail(null);
      }
    });

    // Cleanup the listener when the component unmounts
    return () => authListener.subscription.unsubscribe();
  }, []);

  // Listen for custom "profile initialized" events (e.g., when a guest votes for the first time)
  useEffect(() => {
    const handleProfileInit = (event) => setPseudonym(event.detail);
    window.addEventListener('profileInitialized', handleProfileInit);
    return () => window.removeEventListener('profileInitialized', handleProfileInit);
  }, []);

  // Handler for logging out
  const handleLogout = async () => {
    await supabase.auth.signOut(); // This triggers the 'SIGNED_OUT' event in our listener above
  };

  return (
    <>
      <header className="bg-gray-800 text-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold">
          <Link to="/" className="hover:text-blue-300 transition-colors">
            OSU Capstone Project Reviews
          </Link>
        </h1>

        <div className="flex items-center space-x-4">
          {pseudonym ? (
            // --- LOGGED IN VIEW (Anonymous or Linked) ---
            <div className="flex items-center space-x-4">
              <div className="flex flex-col items-end">
                <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Logged in as</span>
                <span className="font-semibold text-blue-400">{pseudonym}</span>
              </div>

              {/* Conditional Email Badge/Button */}
              {userEmail ? (
                // If they have an email, show the secure badge
                <div
                  className="flex items-center text-green-400 text-xs font-medium px-2 py-1 bg-gray-700 rounded-full"
                  title="Account secured with email"
                >
                  <ShieldCheck size={14} className="mr-1" />
                  Secured
                </div>
              ) : (
                // If they are anonymous, show the prompt to link an email
                <button
                  onClick={() => setIsLinkModalOpen(true)}
                  className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded transition-colors shadow-sm"
                >
                  Link Email
                </button>
              )}

              {/* Logout Button (Available to all logged-in users) */}
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                title="Log Out"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            // --- GUEST VIEW ---
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-400 italic">Welcome, Guest</span>
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded transition-colors shadow-sm"
              >
                Login
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Render the modals outside the header flow */}
      <LinkEmailModal
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        onSuccess={() => {
          // The auth listener handles the state, but we can close the modal smoothly on success.
          // No need to fetch profile here since the listener will trigger fetchUserIdentity.
        }}
      />

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  );
};

export default Header;
