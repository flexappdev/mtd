import { BrowserRouter, Route, Routes } from "react-router-dom";
import V1Page from "@/pages/V1";
import Index from "@/pages/Index";
import Account from "@/pages/Account";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";
import V2Page from "@/pages/V2";
import { ThemeProvider } from "@/hooks/useTheme";
import { Toaster } from "@/components/ui/toaster";

const basename = (import.meta.env.BASE_URL ?? "/").replace(/\/$/, "") || "/";

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter basename={basename}>
        <Routes>
          <Route path="/" element={<V2Page />} />
          <Route path="/v1" element={<V1Page />} />
          <Route path="/v2" element={<V2Page />} />
          <Route path="/index" element={<Index />} />
          <Route path="/account" element={<Account />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </ThemeProvider>
  );
}
