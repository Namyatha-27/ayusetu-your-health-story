import { createFileRoute, Link } from "@tanstack/react-router";
import { Wordmark, NoDiagnosisNotice } from "@/components/brand";

export const Route = createFileRoute("/get-started")({
  head: () => ({
    meta: [
      { title: "Continue as Patient, Doctor or Hospital — AyuSetu" },
      {
        name: "description",
        content:
          "Choose how you would like to continue on AyuSetu: patient, doctor or hospital management.",
      },
      { property: "og:title", content: "Continue on AyuSetu" },
      {
        property: "og:description",
        content: "Pick your role to reach the right AyuSetu dashboard.",
      },
    ],
  }),
  component: GetStarted,
});

const ROLES = [
  {
    icon: "👤",
    title: "Patient",
    to: "/patient/login",
    text: "Share your symptoms, complete your digital case, manage follow-ups and access your medical history.",
  },
  {
    icon: "👨‍⚕️",
    title: "Doctor",
    to: "/doctor/login",
    text: "Review structured patient cases, previous history and follow-up information before consultation.",
  },
  {
    icon: "🏥",
    title: "Hospital Management",
    to: "/management/login",
    text: "Manage doctors, patients, hospital information and case workflows.",
  },
] as const;

function GetStarted() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Wordmark />
          <Link
            to="/emergency"
            className="rounded-lg border border-destructive/30 px-3 py-1.5 text-sm font-medium text-destructive hover:bg-destructive/10"
          >
            🚨 Emergency
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">
          How would you like to continue?
        </h1>
        <p className="mt-2 text-muted-foreground">
          Each role has its own secure sign-in and dashboard.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {ROLES.map((r) => (
            <Link
              key={r.title}
              to={r.to}
              className="surface-card group flex flex-col p-6 transition-shadow hover:shadow-lift"
            >
              <span className="text-3xl" aria-hidden="true">
                {r.icon}
              </span>
              <h2 className="mt-4 text-lg font-semibold text-foreground">
                {r.title}
              </h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {r.text}
              </p>
              <span className="mt-5 text-sm font-medium text-primary group-hover:underline">
                Continue →
              </span>
            </Link>
          ))}
        </div>

        <NoDiagnosisNotice className="mt-10 max-w-3xl" />
        <p className="mt-6 text-sm">
          <Link to="/" className="text-muted-foreground hover:text-foreground">
            ← Back to home
          </Link>
        </p>
      </main>
    </div>
  );
}
