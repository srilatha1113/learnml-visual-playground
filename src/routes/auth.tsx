import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container, Segmented } from "@/components/Page";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { SITE_NAME } from "@/lib/site";

const title = `Sign in — ${SITE_NAME}`;
const description = `Sign in or create a free ${SITE_NAME} account to keep your progress on every device.`;

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: AuthPage,
});

type Mode = "signin" | "signup" | "forgot";
const MODES: { id: Mode; name: string }[] = [
  { id: "signin", name: "Sign in" },
  { id: "signup", name: "Create account" },
];
const inputClass =
  "mt-1.5 h-11 w-full rounded-md border-[1.5px] border-ink bg-card px-3 outline-none focus-visible:ring-2 focus-visible:ring-ring";

function AuthPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState<string | null>(null);

  useEffect(() => {
    if (user) navigate({ to: "/dashboard", replace: true });
  }, [user, navigate]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        if (!data.session)
          setSent(`We sent a confirmation link to ${email}. Open it to finish creating your account.`);
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        setSent(`If ${email} has an account, a link to set a new password is on its way.`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Container className="max-w-md py-14">
      <div className="panel p-7">
        {sent ? (
          <div className="text-center">
            <MailCheck className="mx-auto size-10 text-accent" />
            <h1 className="mt-4 text-2xl font-semibold">Check your email</h1>
            <p className="mt-2 text-muted-foreground">{sent}</p>
            <Button
              className="mt-6"
              variant="outline"
              onClick={() => {
                setSent(null);
                setMode("signin");
              }}
            >
              Back to sign in
            </Button>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-semibold">
              {mode === "forgot" ? "Reset your password" : "Save your progress"}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {mode === "forgot"
                ? "Enter your email and we will send you a link."
                : "Your lessons and quiz scores will follow you to any device."}
            </p>
            {mode !== "forgot" ? (
              <div className="mt-5">
                <Segmented
                  label="Sign in or create account"
                  options={MODES}
                  value={mode}
                  onChange={(m) => {
                    setMode(m);
                    setError(null);
                  }}
                />
              </div>
            ) : null}

            <form onSubmit={submit} className="mt-5 space-y-4">
              <label className="block">
                <span className="label-mono text-muted-foreground">Email</span>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                />
              </label>
              {mode !== "forgot" ? (
                <label className="block">
                  <span className="label-mono text-muted-foreground">Password</span>
                  <input
                    type="password"
                    required
                    minLength={6}
                    autoComplete={mode === "signup" ? "new-password" : "current-password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={inputClass}
                  />
                </label>
              ) : null}

              {error ? (
                <p role="alert" className="rounded-sm border-[1.5px] border-destructive px-3 py-2 text-sm">
                  {error}
                </p>
              ) : null}

              <Button type="submit" size="lg" className="w-full" disabled={busy}>
                {busy
                  ? "One moment…"
                  : mode === "signin"
                    ? "Sign in"
                    : mode === "signup"
                      ? "Create account"
                      : "Send reset link"}
              </Button>
            </form>

            <button
              type="button"
              className="mt-4 cursor-pointer text-sm text-accent hover:underline"
              onClick={() => {
                setMode(mode === "forgot" ? "signin" : "forgot");
                setError(null);
              }}
            >
              {mode === "forgot" ? "Back to sign in" : "Forgot your password?"}
            </button>
          </>
        )}
      </div>
    </Container>
  );
}
