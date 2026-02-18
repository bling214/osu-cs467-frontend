/**
 * Log messages to the console only when debug mode is enabled.
 * * This utility checks the `VITE_DEBUG` environment variable. If set to "true",
 * it outputs the provided arguments with a distinct [DEBUG] prefix.
 * * @param {...any} args - Any number of values to be logged (strings, objects, arrays, etc.).
 * * @example
 * // In .env: VITE_DEBUG=true
 * debugLog("API Request started", { url: "/reviews", method: "POST" });
 * // Output: [DEBUG]: API Request started { url: "/reviews", method: "POST" }
 */
export const debugLog = (...args) => {
    if (import.meta.env.VITE_DEBUG === "true") {
        console.log("[DEBUG]:", ...args);
    }
};
