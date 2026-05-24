import Link from "next/link";
import { APP } from "@/lib/app-config";

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold mb-2">Authentication error</h1>
        <p className="text-sm text-muted-foreground mb-4">
          {APP.name} admin is restricted to{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">mat@matsiems.com</code>. If you
          believe this is wrong, double-check the email you signed in with.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded text-white"
          style={{ backgroundColor: APP.accent }}
        >
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
