import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { tryGetSupabaseConfig } from "@/lib/env";

const PROTECTED_PREFIXES = ["/dashboard", "/results", "/scheduler"];

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

function redirectToLogin(request: NextRequest, pathname: string) {
  const url = request.nextUrl.clone();
  url.pathname = "/login";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const config = tryGetSupabaseConfig();

  // Missing/invalid env must not crash Edge middleware (Vercel MIDDLEWARE_INVOCATION_FAILED).
  if (!config) {
    console.error(
      "[middleware] Missing or invalid NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY. Set them in Vercel → Project Settings → Environment Variables and redeploy.",
    );
    if (isProtectedPath(pathname)) {
      return redirectToLogin(request, pathname);
    }
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  try {
    const supabase = createServerClient(config.url, config.anonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (isProtectedPath(pathname) && !user) {
      return redirectToLogin(request, pathname);
    }

    if ((pathname === "/login" || pathname === "/signup") && user) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      url.search = "";
      return NextResponse.redirect(url);
    }

    return supabaseResponse;
  } catch (err) {
    console.error("[middleware] Supabase session update failed:", err);
    if (isProtectedPath(pathname)) {
      return redirectToLogin(request, pathname);
    }
    return NextResponse.next({ request });
  }
}
