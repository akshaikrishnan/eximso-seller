/**
 * Sanitizes and validates a redirect path to prevent open redirect vulnerabilities.
 * Only allows absolute paths starting with a single forward slash.
 * Rejects protocol-relative paths (//), backslashes, and non-path inputs.
 *
 * @param path - The path to validate and sanitize
 * @returns The sanitized path if valid, otherwise returns the default fallback ('/') 
 */
export function getSafeRedirect(path: string | null | undefined): string {
    if (!path) {
        return '/';
    }

    const trimmed = path.trim();

    // Only allow paths that:
    // 1. Start with a single forward slash '/'
    // 2. Do NOT start with double forward slash '//' (protocol-relative paths)
    // 3. Do NOT contain backslashes '\' (escape sequences or UNC paths)
    if (trimmed.startsWith('/') && !trimmed.startsWith('//') && !trimmed.includes('\\')) {
        return trimmed;
    }

    return '/';
}

/**
 * Alias for getSafeRedirect with a clearer name emphasizing the sanitization action.
 * Ensures that a path is safe for redirects by validating its format.
 * @deprecated Use getSafeRedirect directly for clarity, or use sanitizePath as the preferred alias
 */
export const isSafePath = getSafeRedirect;

/**
 * Preferred alias for getSafeRedirect.
 * Sanitizes and validates a path to ensure it is safe for redirects.
 */
export const sanitizePath = getSafeRedirect;
