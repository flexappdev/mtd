"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { APP, DEV_BYPASS_COOKIE } from "@/lib/app-config";

const ERROR_LABELS: Record<string, string> = {
  unauthorized: "This account is not authorized.",
  auth: "Sign in failed. Please try again.",
};

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const initialError = ERROR_LABELS[params.get("error") ?? ""] ?? "";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(initialError);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }
      const next = params.get("next") ?? "/admin";
      router.push(next.startsWith("/") ? next : "/admin");
      router.refresh();
    } catch {
      setError("Unable to reach the auth service. Check your connection and try again.");
      setLoading(false);
    }
  }

  function handleDevLogin() {
    document.cookie = `${DEV_BYPASS_COOKIE}=1; path=/; max-age=86400`;
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-lg border border-border bg-card p-6 shadow-sm">
        <div className="text-center mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 mb-3 hover:opacity-80 transition-opacity"
            aria-label="Back to home"
          >
            <span
              className="inline-block w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: APP.accent }}
            />
            <span className="font-semibold">{APP.name}</span>
          </Link>
          <h1 className="text-xl font-semibold">Sign in</h1>
          <p className="text-xs text-muted-foreground mt-1">Admin only · {APP.long}</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full text-sm px-2.5 py-1.5 rounded border border-border bg-background placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1"
              style={{ ["--tw-ring-color" as string]: APP.accent }}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full text-sm px-2.5 py-1.5 rounded border border-border bg-background focus:outline-none focus:ring-1"
              style={{ ["--tw-ring-color" as string]: APP.accent }}
            />
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-1.5 text-sm px-3 py-2 rounded text-white transition-colors disabled:opacity-50"
            style={{ backgroundColor: APP.accent }}
          >
            {loading && <Loader2 className="h-3 w-3 animate-spin" />}
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
        {process.env.NODE_ENV === "development" && (
          <div className="mt-4 pt-3 border-t border-border">
            <button
              onClick={handleDevLogin}
              className="w-full text-xs text-muted-foreground hover:text-foreground py-1.5 rounded border border-dashed border-border hover:border-muted-foreground transition-colors"
            >
              Dev login (skip auth — local only)
            </button>
          </div>
        )}
        <div className="mt-4 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3 w-3" /> Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">
          Loading…
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
