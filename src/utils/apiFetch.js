import { debugLog } from '@/utils/logger';

/**
 * A wrapper around the native fetch API that standardizes error handling
 * and automatically prepends the backend API base URL.
 * @param {string} endpoint - The API endpoint (e.g., '/reviews/')
 * @param {object} options - Standard fetch options (method, headers, body)
 * @returns {Promise<any>} The parsed JSON or text data
 */
export async function apiFetch(endpoint, options = {}) {
    const API_URL = import.meta.env.VITE_API_BASE_URL;
    if (!API_URL) {
        const message = "API base URL is not configured. Please set VITE_API_BASE_URL in your environment.";
        console.error(message);
        throw new Error(message);
    }

    // Strip any accidental trailing slashes from the base URL
    // Ensure the endpoint starts with exactly one slash
    const cleanBaseUrl = API_URL.replace(/\/+$/, '');
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${cleanBaseUrl}${cleanEndpoint}`;

    try {
        const response = await fetch(url, options);

        let data = null;
        const contentType = response.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        if (!response.ok) {
            let errorMessage = "API request failed";
            
            // Extract FastAPI detail string or standard text
            if (data && typeof data === "object" && data.detail) {
                // Sometimes FastAPI validation errors return an array, so we stringify if needed
                errorMessage = typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail);
            } else if (typeof data === "string" && data.trim() !== "") {
                errorMessage = data;
            }

            throw new Error(`${errorMessage} (Status: ${response.status})`);
        }

        return data;
    } catch (error) {
        debugLog(`apiFetch error for ${endpoint}:`, error);
        throw error; // Re-throw so the component can catch and display it
    }
}
