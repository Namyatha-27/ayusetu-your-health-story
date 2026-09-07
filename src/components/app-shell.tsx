import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Wordmark } from "./brand";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";
import type { Role } from "@/lib/types";

export interface NavItem {
  to: string;
  label: string;
}

const LOGIN_ROUTE: Record<Role, string> = {
  patient: "/patient/login",
  doctor: "/doctor/login",
  management: "/management/login",
};

/** Client-side role guard for demo authentication. */
export function useRequireRole(role: Role) {
  const { account, ready } = useStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (ready && (!account || account.role !== role)) {
      navigate({ to: LOGIN_ROUTE[role], replace: true });
    }
  }, [account, ready, role, navigate]);
  return account && account.role === role ? account : null;
}

export function AppShell({
  role,
  nav,
  children,
}: {
  role: Role;
  nav: NavItem[];
  children: ReactNode;
}) {
  const { account, signOut } = useStore();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const roleLabel =
    role === "patient" ? "Patient" : role === "doctor" ? "Doctor" : "Management";

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-card/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
          <Wordmark />
          <span className="hidden rounded-full bg-accent-soft px-2.5 py-1 text-xs font-semibold text-accent-foreground sm:inline">
            {roleLabel}
          </span>
          <div className="ml-auto flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="border-destructive/30 text-destructive hover:bg-destructive/10">
              <Link to="/emergency">🚨 Emergency</Link>
            </Button>
            <span className="hidden text-sm text-muted-foreground md:inline">
              {account?.name}
            </span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                signOut();
                navigate({ to: "/", replace: true });
              }}
            >
              Log out
            </Button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-2 pb-2 sm:px-4">
          {nav.map((item) => {
            const active =
              pathname === item.to || pathname.startsWith(item.to + "/");
            return (
              <Link
                key={item.to}
                to={item.to as "/"}
                className={cn(
                  "whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string | undefined;
  action?: ReactNode | undefined;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
