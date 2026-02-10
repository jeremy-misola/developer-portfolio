import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Handle Admin Authentication
    // Check if it's an admin or admin API route (with or without locale)
    const isAdminRoute = pathname.match(/^\/(?:en|fr|zh)\/admin(?:\/|$)/) || pathname.startsWith('/admin');
    const isAdminApiRoute = pathname.startsWith('/api/admin');

    if (isAdminRoute || isAdminApiRoute) {
        // Allow access to auth endpoints and login page without authentication
        const isAuthEndpoint = pathname.includes('/api/admin/auth') ||
            pathname.match(/^\/(?:en|fr|zh)\/admin\/login(?:\/|$)/) ||
            pathname === '/admin/login';

        // Also allow cluster-state API
        const isPublicApi = pathname === '/api/cluster-state';

        if (!isAuthEndpoint && !isPublicApi) {
            const sessionToken = request.cookies.get('admin_session');

            if (!sessionToken) {
                // Redirect to localized login page if unauthenticated
                if (isAdminRoute) {
                    // Extract locale or default to 'en'
                    const locale = pathname.split('/')[1];
                    const supportedLocales = ['en', 'fr', 'zh'];
                    const targetLocale = supportedLocales.includes(locale) ? locale : 'en';

                    return NextResponse.redirect(new URL(`/${targetLocale}/admin/login`, request.url));
                }

                // Return 401 for API endpoints
                return NextResponse.json(
                    { error: 'Authentication required' },
                    { status: 401 }
                );
            }
        }
    }

    // 2. Handle Localization
    return intlMiddleware(request);
}

export const config = {
    // Match internationalized pathnames and admin routes
    matcher: ['/', '/(fr|en|zh)/:path*', '/admin/:path*', '/api/admin/:path*']
};
