import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { ALLOWED_EMAILS } from "@/lib/supabase/middleware";
import { DEV_BYPASS_COOKIE } from "@/lib/app-config";
import { AdminNav } from "@/components/admin/AdminNav";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Defence in depth: middleware already gates /admin/*, but we re-check here
  // so a misconfigured middleware doesn't accidentally leak the admin shell.
  const cookieStore = await cookies();
  const devBypass =
    process.env.NODE_ENV === "development" &&
    cookieStore.get(DEV_BYPASS_COOKIE)?.value === "1";

  if (!devBypass) {
    const hasSupabase =
      !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!hasSupabase) {
      redirect("/login?error=auth");
    }
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    const email = data.user?.email ?? "";
    if (!email || !ALLOWED_EMAILS.includes(email)) {
      redirect("/login?next=/admin");
    }
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <AdminNav />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
