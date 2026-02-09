import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest, res: NextResponse) {
    //get query params
    const searchParams = req.nextUrl.searchParams;
    const showToast = searchParams.get('showToast') === 'true';
    const userType = searchParams.get('userType') ?? 'buyer';

    // #region agent log (fire-and-forget with error handling)
    void fetch('http://127.0.0.1:7242/ingest/098409a4-79d1-497e-aef5-5cf4170f450b', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: `log_${Date.now()}_${Math.random().toString(16).slice(2)}`,
            runId: 'pre-fix',
            hypothesisId: 'H1',
            location: 'app/api/auth/logout/route.ts:GET',
            message: 'Logout GET before deleting cookie',
            data: { showToast, userType },
            timestamp: Date.now()
        })
    }).catch((err) => {
        console.error('[logout] Failed to send pre-delete log:', err);
    });
    // #endregion

    cookies().delete('access_token');

    // #region agent log (fire-and-forget with error handling)
    void fetch('http://127.0.0.1:7242/ingest/098409a4-79d1-497e-aef5-5cf4170f450b', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: `log_${Date.now()}_${Math.random().toString(16).slice(2)}`,
            runId: 'pre-fix',
            hypothesisId: 'H1',
            location: 'app/api/auth/logout/route.ts:GET',
            message: 'Logout GET after deleting cookie',
            data: { showToast, userType },
            timestamp: Date.now()
        })
    }).catch((err) => {
        console.error('[logout] Failed to send post-delete log:', err);
    });
    // #endregion

    if (showToast) {
        const response = NextResponse.redirect(
            new URL(`/?showToast=true&userType=${userType}`, req.url)
        );
        response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');
        return response;
    }

    const response = NextResponse.redirect(new URL(`/?userType=${userType}`, req.url));
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
}
