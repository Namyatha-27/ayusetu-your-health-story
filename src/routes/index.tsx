import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Wordmark, SectionTitle } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { hospitals, doctors } from "@/lib/demo-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AyuSetu — Your Health Story, Clearly Understood." },
      {
        name: "description",
        content:
          "AyuSetu is an AI-assisted patient case taking platform. Patients share their health story; doctors get a structured case before an in-person consultation.",
      },
      {
        property: "og:title",
        content: "AyuSetu — Your Health Story, Clearly Understood.",
      },
      {
        property: "og:description",
        content:
          "AI-assisted patient case taking and care continuity for patients, doctors and hospitals.",
      },
    ],
  }),
  component: Landing,
});

const NAV = [
  { label: "Home", href: "#home" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "About", href: "#about" },
];

const ROLES = [
  {
    icon: "👤",
    title: "Patient",
    text: "Share your symptoms, complete your digital case, manage follow-ups and access your medical history.",
  },
  {
    icon: "👨‍⚕️",
    title: "Doctor",
    text: "Review structured patient cases, previous history and follow-up information before consultation.",
  },
  {
    icon: "🏥",
    title: "Hospital Management",
    text: "Manage doctors, patients, hospital information and case workflows.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Tell us what brings you in",
    text: "Type or speak your problem in English, Telugu or Hindi. No long forms.",
  },
  {
    n: "02",
    title: "Answer a few adaptive questions",
    text: "AyuSetu asks only what is relevant — duration, severity, history, allergies, medicines.",
  },
  {
    n: "03",
    title: "Your case reaches your doctor",
    text: "A structured case with a clearly labelled AI summary is sent to your preferred doctor.",
  },
  {
    n: "04",
    title: "You meet your doctor in person",
    text: "Examination, diagnosis and treatment happen at the hospital, with your doctor.",
  },
];

const FEATURES = [
  {
    title: "Adaptive case taking",
    text: "Questions respond to what you have already said instead of a giant static questionnaire.",
  },
  {
    title: "Multilingual by design",
    text: "English, Telugu and Hindi today, with room for more Indian languages later.",
  },
  {
    title: "Voice-first input",
    text: "Speak your symptoms when typing is difficult, and review the transcript before sending.",
  },
  {
    title: "Family profiles",
    text: "Manage parents, grandparents and children with completely separate patient IDs and records.",
  },
  {
    title: "Follow-up continuity",
    text: "Returning patients answer a few short questions instead of repeating the whole case.",
  },
  {
    title: "Care history timeline",
    text: "Every case, review and completed consultation in one clear medical timeline.",
  },
];

function Landing() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background" id="home">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4 sm:px-6">
          <Wordmark />
          <nav className="ml-4 hidden items-center gap-6 md:flex">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {n.label}
              </a>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link to="/get-started">Login</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/get-started">Get Started</Link>
            </Button>
            <button
              className="rounded-lg p-2 text-muted-foreground md:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle navigation"
            >
              ☰
            </button>
          </div>
        </div>
        {open ? (
          <nav className="border-t border-border bg-card px-4 py-3 md:hidden">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-2 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                {n.label}
              </a>
            ))}
          </nav>
        ) : null}
      </header>

      {/* Hero */}
      <section className="section-pad">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent-foreground">
                AI-assisted case taking · Doctor-verified
              </span>
              <h1 className="mt-5 text-4xl font-semibold leading-[1.08] text-foreground sm:text-5xl lg:text-6xl">
                Your Health Story,
                <br />
                <span className="text-primary">Clearly Understood.</span>
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
                AI-assisted patient case taking that helps patients share their
                health information and helps doctors prepare for better
                consultations.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link to="/get-started">Get Started</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a href="#how-it-works">How It Works</a>
                </Button>
              </div>
              <p className="mt-6 max-w-xl text-sm text-muted-foreground">
                AyuSetu does not diagnose conditions and does not give
                prescriptions. Your doctor examines you in person and makes every
                medical decision.
              </p>
            </div>

            <div className="surface-card p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Case preview for the doctor
              </p>
              <div className="mt-4 space-y-3 text-sm">
                <div className="rounded-xl bg-muted/70 p-3">
                  <p className="text-xs font-medium text-muted-foreground">
                    Chief complaint
                  </p>
                  <p className="mt-1 font-medium text-foreground">
                    Fever with body pain
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-muted/70 p-3">
                    <p className="text-xs text-muted-foreground">Duration</p>
                    <p className="mt-1 font-medium text-foreground">3 days</p>
                  </div>
                  <div className="rounded-xl bg-muted/70 p-3">
                    <p className="text-xs text-muted-foreground">Severity</p>
                    <p className="mt-1 font-medium text-foreground">Moderate</p>
                  </div>
                </div>
                <div className="rounded-xl border border-accent/30 bg-accent-soft p-3">
                  <p className="text-xs font-semibold text-accent-foreground">
                    AI summary — requires doctor verification
                  </p>
                  <p className="mt-1 leading-relaxed text-foreground">
                    21-year-old patient presenting with fever for three days
                    associated with body pain. No vomiting reported.
                  </p>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-muted/70 p-3">
                  <span className="text-xs text-muted-foreground">
                    Case completeness
                  </span>
                  <span className="font-semibold text-foreground">85%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="border-y border-border bg-card/60 section-pad">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionTitle
            eyebrow="Built for everyone in the visit"
            title="One platform, three clear roles"
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {ROLES.map((r) => (
              <div key={r.title} className="surface-card p-6 transition-shadow hover:shadow-lift">
                <span className="text-2xl" aria-hidden="true">
                  {r.icon}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  {r.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {r.text}
                </p>
                <Link
                  to="/get-started"
                  className="mt-4 inline-flex text-sm font-medium text-primary hover:underline"
                >
                  Continue as {r.title} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="section-pad">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionTitle
            eyebrow="How it works"
            title="From your words to a structured case"
            subtitle="Four simple steps that end where care belongs — face to face with your doctor."
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <div key={s.n} className="surface-card p-6">
                <span className="font-display text-sm font-bold text-accent">
                  {s.n}
                </span>
                <h3 className="mt-3 text-base font-semibold text-foreground">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {s.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-y border-border bg-card/60 section-pad">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionTitle eyebrow="Features" title="Thoughtful, clinical, calm" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="surface-card p-6">
                <h3 className="text-base font-semibold text-foreground">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {f.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency */}
      <section className="section-pad">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="rounded-3xl border border-destructive/25 bg-destructive/5 p-8 sm:p-10">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="max-w-2xl">
                <h2 className="text-2xl font-semibold text-foreground">
                  🚨 Emergency Help
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  For medical emergencies, seek immediate medical attention.
                  Emergency cases should not be delayed by digital case taking.
                </p>
              </div>
              <Button asChild size="lg" variant="destructive">
                <Link to="/emergency">Open emergency help</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="border-t border-border bg-card/60 section-pad">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-2">
          <SectionTitle
            eyebrow="About AyuSetu"
            title="A bridge between the patient's story and the doctor's time"
            subtitle="AyuSetu is patient case taking, doctor preparation, medical history and follow-up continuity. It is not a diagnostic tool, not a replacement for doctors, not an online pharmacy and not a prescription platform."
          />
          <div className="grid gap-4 sm:grid-cols-3 lg:self-center">
            <div className="surface-card p-5">
              <p className="font-display text-2xl font-semibold text-primary">
                {hospitals.length}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Partner hospitals in demo
              </p>
            </div>
            <div className="surface-card p-5">
              <p className="font-display text-2xl font-semibold text-primary">
                {doctors.length}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Doctors onboarded
              </p>
            </div>
            <div className="surface-card p-5">
              <p className="font-display text-2xl font-semibold text-primary">3</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Languages supported
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-background py-10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 sm:px-6">
          <Wordmark />
          <p className="text-xs text-muted-foreground">
            © 2026 AyuSetu · Prototype for demonstration. Not for clinical use.
          </p>
        </div>
      </footer>
    </div>
  );
}
