import { useEffect, useState } from 'react';
import supabase from '@/supabase-client';
import { apiFetch } from '@/utils/apiFetch';
import { Link } from 'react-router-dom';
import LinkEmailModal from './LinkEmailModal.jsx';
import { ShieldCheck } from 'lucide-react';

const Header = () => {
  const [pseudonym, setPseudonym] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchUserIdentity() {
      // Check if the user has any kind of active session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session && session.user) {
        // Save the email (if it exists) so we can hide the 'Link Email' button later
        setUserEmail(session.user.email);

        try {
          // Fetch their generated pseudonym from Backend API
          const headers = { Authorization: `Bearer ${session.access_token}` };
          const profile = await apiFetch('/profiles/me', { headers });

          if (profile && profile.pseudonym) {
            setPseudonym(profile.pseudonym);
          }
        } catch (error) {
          console.error('Failed to fetch profile for header:', error);
        }
      } else {
        setPseudonym(null);
        setUserEmail(null);
      }
    }

    fetchUserIdentity();

    // Listen for auth changes so the header updates instantly if they log out
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        fetchUserIdentity();
      } else if (event === 'SIGNED_OUT') {
        setPseudonym(null);
        setUserEmail(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

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
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-300">Logged in as:</span>
              <span className="font-semibold text-blue-400">{pseudonym}</span>

              {/* Only show "Link Email" if they don't already have one. 
              A Verified Icon is shown if user has an email, otherwise the Link Email button is shown */}
              {userEmail ? (
                <div
                  className="flex items-center text-green-400 text-xs font-medium px-2 py-1 bg-gray-700 rounded-full"
                  title="Account secured with email"
                >
                  <ShieldCheck size={14} className="mr-1" />
                  Secured
                </div>
              ) : (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded transition-colors shadow-sm"
                >
                  Link Email
                </button>
              )}
            </div>
          ) : (
            <span className="text-sm text-gray-400 italic">Welcome, Guest</span>
          )}
        </div>
      </header>

      {/* Render the modal outside the header flow */}
      <LinkEmailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          // The auth listener handles the state, but we can close the modal smoothly on success. No need to fetch profile here since the listener will trigger fetchUserIdentity.
        }}
      />
    </>
  );
};

export default Header;
