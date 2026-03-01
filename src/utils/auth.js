import supabase from '@/supabase-client';
import { apiFetch } from '@/utils/apiFetch';
import { debugLog } from '@/utils/logger';

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

  // 2. Initialize Profile (Strict Error Handling)
  try {
    await apiFetch('/profiles/init', {
      method: 'POST',
      headers: headers,
    });
  } catch (initError) {
    console.error('Profile init error:', initError);
    throw new Error(
      `We couldn't set up your profile, so your ${actionName} can't be submitted right now. Please try again.`,
    );
  }

  return headers;
}
