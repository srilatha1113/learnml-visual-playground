import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { SITE_NAME } from "@/lib/site";

const NAV = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/modules", label: "Modules" },
  { to: "/visualizer", label: "Visualizer" },
  { to: "/playground", label: "Playground" },
  { to: "/datasets", label: "Datasets" },
  { to: "/quiz", label: "Quiz" },
] as const;

export function Logo() {
  return (
    <Link to="/" className="flex shrink-0 items-center gap-2.5">
      <svg viewBox="0 0 28 28" className="size-7" aria-hidden="true">
        <rect x="1" y="1" width="26" height="26" rx="4" className="fill-ink" />
        <path
          d="M5 8c4 0 5 12 9 12s4-8 9-13"
          className="fill-none stroke-ink-foreground"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="14" cy="20" r="2.6" className="fill-primary" />
      </svg>
      <span className="font-display text-xl font-semibold tracking-tight">{SITE_NAME}</span>
    </Link>
  );
}

function AccountButton() {
  const { user, ready } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  if (!ready) return <span className="h-8 w-20" aria-hidden="true" />;
  if (!user)
    return (
      <Button asChild size="sm" variant="ink">
        <Link to="/auth">Sign in</Link>
      </Button>
    );

  const signOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  };

  return (
    <div className="flex items-center gap-2">
      <span className="hidden max-w-40 truncate text-sm text-muted-foreground lg:inline">
        {user.email}
      </span>
      <Button size="sm" variant="outline" onClick={signOut}>
        <LogOut />
        Sign out
      </Button>
    </div>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b-[1.5px] border-ink bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-3 md:flex-row md:items-center md:justify-between md:px-6">
        <div className="flex items-center justify-between gap-3 md:contents">
          <Logo />
          <div className="md:order-last">
            <AccountButton />
          </div>
        </div>
        <nav className="-mx-4 flex gap-1 overflow-x-auto px-4 md:mx-0 md:px-0" aria-label="Main">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="label-mono shrink-0 rounded-sm px-2.5 py-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "bg-ink text-ink-foreground hover:bg-ink hover:text-ink-foreground" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t-[1.5px] border-ink">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between md:px-6">
        <span className="font-display text-base text-foreground">{SITE_NAME}</span>
        <span className="label-mono">Models train right in your browser</span>
      </div>
    </footer>
  );
}
