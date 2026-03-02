import supabase from '@/supabase-client';
import { apiFetch } from '@/utils/apiFetch';
import { debugLog } from '@/utils/logger';

// --- MODULE LEVEL CACHE ---
// This persists across component renders to prevent redundant API calls
let cachedJwt = null;
let initPromise = null;

/**
 * Ensures the user is authenticated (anonymously if needed),
 * initializes their backend profile, and returns the Authorization headers.
 * @param {string} actionName - The noun for the error message (e.g., "review", "comment")
 * @returns {Promise<Object>} The HTTP headers containing the JWT
 */
export async function getAuthenticatedHeaders(actionName = 'submission') {
  // 1. Get Supabase Session/JWT
  const {
    data: { session },
    error: authError,
  } = await supabase.auth.getSession();

  let jwt;
  if (authError || !session) {
    debugLog('No active session, attempting anonymous sign-in...');
    const { data: anonData, error: anonError } = await supabase.auth.signInAnonymously();
    if (anonError) throw anonError;
    jwt = anonData.session.access_token;
  } else {
    jwt = session.access_token;
  }

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${jwt}`,
  };

  // 2. Initialize Profile (Cached per JWT)
  try {
    // If the JWT is new (e.g., first load, or user logged in/out), trigger a new init
    if (jwt !== cachedJwt) {
      cachedJwt = jwt;

      // Store the PROMISE, not just the result.
      // This prevents race conditions if multiple components call this simultaneously.
      initPromise = apiFetch('/profiles/init', {
        method: 'POST',
        headers: headers,
      });
    }

    // Wait for the initialization to finish.
    // If it's already finished from a previous click, this resolves instantly
    const profileData = await initPromise;

    // BROADCAST THE EVENT: If the backend returns a pseudonym, tell the app!
    if (profileData && profileData.pseudonym) {
      window.dispatchEvent(new CustomEvent('profileInitialized', { detail: profileData.pseudonym }));
    }
  } catch (initError) {
    // If initialization fails, wipe the cache so the app can try again next time
    cachedJwt = null;
    initPromise = null;

    console.error('Profile init error:', initError);
    throw new Error(
      `We couldn't set up your profile, so your ${actionName} can't be submitted right now. Please try again.`,
    );
  }

  return headers;
}
