import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Wordmark, NoDiagnosisNotice } from "./brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStore } from "@/lib/store";
import type { Role } from "@/lib/types";

export function AuthForm({
  role,
  title,
  subtitle,
  redirectTo,
  demoHint,
  allowSignup = true,
}: {
  role: Role;
  title: string;
  subtitle: string;
  redirectTo: string;
  demoHint: string;
  allowSignup?: boolean;
}) {
  const { signIn, signUp } = useStore();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState(demoHint);
  const [password, setPassword] = useState("demo1234");
  const [error, setError] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (mode === "signup") {
      if (!name.trim() || !email.trim()) {
        setError("Please enter your name and email address.");
        return;
      }
      signUp(name.trim(), email.trim(), role);
      navigate({ to: redirectTo as "/" });
      return;
    }
    const acc = signIn(email, role);
    if (!acc) {
      setError("We could not find an account for these details.");
      return;
    }
    navigate({ to: redirectTo as "/" });
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-primary p-10 text-primary-foreground lg:flex">
        <Wordmark className="[&_span:last-child]:text-primary-foreground" />
        <div className="max-w-md">
          <h2 className="text-3xl font-semibold text-primary-foreground">
            Your Health Story, Clearly Understood.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-primary-foreground/80">
            AyuSetu helps patients share their health information in their own
            language and helps doctors prepare for a better in-person
            consultation.
          </p>
        </div>
        <p className="text-xs text-primary-foreground/60">
          No online diagnosis. No online prescriptions. Consultation happens with
          your doctor, in person.
        </p>
      </div>

      <div className="flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden">
            <Wordmark />
          </div>
          <h1 className="mt-6 text-2xl font-semibold text-foreground">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            {mode === "signup" ? (
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                />
              </div>
            ) : null}
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error ? (
              <p className="text-sm text-destructive">{error}</p>
            ) : null}
            <Button type="submit" className="w-full" size="lg">
              {mode === "login" ? "Log in" : "Create account"}
            </Button>
          </form>

          {allowSignup ? (
            <p className="mt-4 text-sm text-muted-foreground">
              {mode === "login" ? "New to AyuSetu?" : "Already registered?"}{" "}
              <button
                type="button"
                className="font-medium text-primary underline-offset-4 hover:underline"
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
              >
                {mode === "login" ? "Create an account" : "Log in instead"}
              </button>
            </p>
          ) : null}

          <p className="mt-6 rounded-lg bg-accent-soft px-3 py-2 text-xs text-accent-foreground">
            Demo login: <strong>{demoHint}</strong> with any password.
          </p>
          <NoDiagnosisNotice className="mt-3" />
          <p className="mt-6 text-sm">
            <Link to="/get-started" className="text-muted-foreground hover:text-foreground">
              ← Choose a different role
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
