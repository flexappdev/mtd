import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export const ALLOWED_EMAILS = ["mat@matsiems.com"];

export const DEV_BYPASS_COOKIE = "mtd-dev-bypass";

const PROTECTED_PREFIXES = ["/admin", "/api/admin"];

function isProtected(path: string): boolean {
  return PROTECTED_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`));
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Graceful degradation: if Supabase isn't configured (e.g. Vercel env vars
  // not yet synced), keep the public site working but block protected routes
  // with a 503 instead of 500-ing the whole site.
  if (!supabaseUrl || !supabaseKey) {
    if (isProtected(request.nextUrl.pathname)) {
      return new NextResponse(
        "Auth not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel and redeploy.",
        { status: 503, headers: { "content-type": "text/plain" } },
      );
    }
    return supabaseResponse;
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  const devBypass =
    process.env.NODE_ENV === "development" &&
    request.cookies.get(DEV_BYPASS_COOKIE)?.value === "1";

  let user: { id: string; email?: string | null } | null = null;
  if (!devBypass) {
    try {
      const { data } = await supabase.auth.getSession();
      user = data.session?.user ?? null;
    } catch {
      user = null;
    }
  }

  const path = request.nextUrl.pathname;
  const protectedRoute = isProtected(path);

  if (devBypass) {
    if (path === "/login") {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  if (user && !ALLOWED_EMAILS.includes(user.email ?? "")) {
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = "?error=unauthorized";
    return NextResponse.redirect(url);
  }

  if (!user && protectedRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  if (user && path === "/login") {
    const next = request.nextUrl.searchParams.get("next");
    const url = request.nextUrl.clone();
    url.pathname = next && next.startsWith("/") ? next : "/admin";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
