import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest, res: NextResponse) {
    //get query params
    const searchParams = req.nextUrl.searchParams;
    const showToast = searchParams.get('showToast') === 'true';
    const userType = searchParams.get('userType') ?? 'buyer';

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/098409a4-79d1-497e-aef5-5cf4170f450b', {
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
    }).catch(() => {});
    // #endregion

    cookies().delete('access_token');

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/098409a4-79d1-497e-aef5-5cf4170f450b', {
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
    }).catch(() => {});
    // #endregion

    if (showToast) {
        return NextResponse.redirect(
            new URL(`/?showToast=true&userType=${userType}`, req.url)
        );
    }
    return NextResponse.redirect(new URL(`/?userType=${userType}`, req.url));
}
