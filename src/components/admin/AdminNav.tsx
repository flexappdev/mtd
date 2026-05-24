"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, FileText, Database, Cloud, LogOut, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { DEV_BYPASS_COOKIE } from "@/lib/app-config";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/cms", label: "CMS", icon: FileText },
  { href: "/admin/mongo", label: "Mongo", icon: Database },
  { href: "/admin/s3", label: "S3", icon: Cloud },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // ignore — dev bypass path doesn't have a session
    }
    document.cookie = `${DEV_BYPASS_COOKIE}=; path=/; max-age=0`;
    router.push("/");
    router.refresh();
  }

  return (
    <aside className="w-56 shrink-0 border-r border-border bg-muted/20 p-3">
      <Link
        href="/"
        className="mb-4 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3 w-3" /> Back to site
      </Link>
      <nav className="space-y-0.5">
        {NAV.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded px-2.5 py-1.5 text-sm transition-colors",
                active
                  ? "bg-foreground/10 text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-foreground/5",
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-6 border-t border-border pt-3">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-2 rounded px-2.5 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-foreground/5"
        >
          <LogOut className="h-3.5 w-3.5" /> Sign out
        </button>
      </div>
    </aside>
  );
}
