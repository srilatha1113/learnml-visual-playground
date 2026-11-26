import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/Page";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { SITE_NAME } from "@/lib/site";

const title = `Set a new password — ${SITE_NAME}`;

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: "Choose a new password for your account." },
      { property: "og:title", content: title },
      { property: "og:description", content: "Choose a new password for your account." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPasswordPage,
});

const inputClass =
  "mt-1.5 h-11 w-full rounded-md border-[1.5px] border-ink bg-card px-3 outline-none focus-visible:ring-2 focus-visible:ring-ring";

function ResetPasswordPage() {
  const { user, ready } = useAuth();
  const navigate = useNavigate();
  const [recovery, setRecovery] = useState(false);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // The emailed link carries type=recovery; remember it before the URL is cleaned up.
  useEffect(() => {
    if (window.location.hash.includes("type=recovery") || window.location.search.includes("type=recovery"))
      setRecovery(true);
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) setError(error.message);
    else navigate({ to: "/dashboard", replace: true });
  };

  const canReset = ready && !!user;

  return (
    <Container className="max-w-md py-14">
      <div className="panel p-7">
        <h1 className="text-3xl font-semibold">Set a new password</h1>
        {!ready ? (
          <p className="mt-3 text-muted-foreground">Checking your link…</p>
        ) : !canReset ? (
          <>
            <p className="mt-3 text-muted-foreground">
              {recovery
                ? "This link has expired or was already used."
                : "Open this page from the link in your password reset email."}{" "}
              You can ask for a new one.
            </p>
            <Button asChild className="mt-5" variant="outline">
              <Link to="/auth">Back to sign in</Link>
            </Button>
          </>
        ) : (
          <form onSubmit={submit} className="mt-5 space-y-4">
            <label className="block">
              <span className="label-mono text-muted-foreground">New password</span>
              <input
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
              />
            </label>
            {error ? (
              <p role="alert" className="rounded-sm border-[1.5px] border-destructive px-3 py-2 text-sm">
                {error}
              </p>
            ) : null}
            <Button type="submit" size="lg" className="w-full" disabled={busy}>
              {busy ? "Saving…" : "Save new password"}
            </Button>
          </form>
        )}
      </div>
    </Container>
  );
}
