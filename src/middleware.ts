import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');

  const { pathname } = request.nextUrl;

  // Public routes that don't need auth checks
  if (pathname.startsWith('/invite/')) {
    return response;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();

  // Redirect /admin to /dashboard
  if (pathname.startsWith('/admin')) {
    const newPath = pathname.replace(/^\/admin/, '/dashboard');
    return NextResponse.redirect(new URL(newPath || '/dashboard', request.url));
  }

  // Protected routes: /dashboard, /onboarding
  if (pathname.startsWith('/dashboard')) {
    if (!user) {
      return response;
    }

    const userRole = (user.app_metadata?.user_role as string) || 'member';

    // Super admin-only routes
    if (pathname.startsWith('/dashboard/members') || pathname.startsWith('/dashboard/invites')) {
      if (userRole !== 'super_admin') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }

    // General admin routes require admin or super_admin
    const adminPaths = ['/dashboard/events', '/dashboard/partners', '/dashboard/content', '/dashboard/manage-perks'];
    if (adminPaths.some((p) => pathname.startsWith(p)) && userRole !== 'super_admin' && userRole !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  if (pathname === '/onboarding') {
    if (!user) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/onboarding', '/invite/:path*'],
};
