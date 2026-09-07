import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, PageHeader, useRequireRole } from "@/components/app-shell";
import { PATIENT_NAV } from "@/components/patient-nav";
import { StatusBadge, TypeBadge } from "@/components/status-badge";
import { NoDiagnosisNotice } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { useStore, ageFromDob } from "@/lib/store";

export const Route = createFileRoute("/patient/dashboard")({
  head: () => ({
    meta: [
      { title: "Patient Dashboard — AyuSetu" },
      {
        name: "description",
        content:
          "Your AyuSetu dashboard: start a new case, send a follow-up, view your medical history and your preferred doctor.",
      },
      { property: "og:title", content: "Patient Dashboard — AyuSetu" },
      {
        property: "og:description",
        content: "Cases, follow-ups, family profiles and medical history in one place.",
      },
    ],
  }),
  component: PatientDashboard,
});

const QUICK = [
  { to: "/patient/case/new", icon: "📝", label: "Start New Case", tone: "primary" },
  { to: "/patient/follow-up", icon: "🔄", label: "Follow-up", tone: "default" },
  { to: "/patient/history", icon: "🗂️", label: "Medical History", tone: "default" },
  { to: "/patient/family", icon: "👨‍👩‍👧", label: "Family Profiles", tone: "default" },
  { to: "/patient/doctor", icon: "🩺", label: "My Doctor", tone: "default" },
  { to: "/emergency", icon: "🚨", label: "Emergency Help", tone: "danger" },
] as const;

function PatientDashboard() {
  const account = useRequireRole("patient");
  const {
    activeProfile,
    myProfiles,
    setActiveProfile,
    cases,
    doctorById,
    hospitalById,
  } = useStore();

  if (!account) return null;

  const profileCases = cases.filter((c) => c.profileId === activeProfile?.id);
  const latest = profileCases[0];
  const doctor = doctorById(activeProfile?.preferredDoctorId);
  const hospital = hospitalById(activeProfile?.hospitalId);

  return (
    <AppShell role="patient" nav={PATIENT_NAV}>
      <PageHeader
        title={`Welcome back, ${activeProfile?.name.split(" ")[0] ?? account.name}`}
        description="Here is everything about this profile's care."
      />

      {myProfiles.length > 0 ? (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Viewing profile:</span>
          {myProfiles.map((p) => (
            <button
              key={p.id}
              onClick={() => setActiveProfile(p.id)}
              className={
                p.id === activeProfile?.id
                  ? "rounded-full bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground"
                  : "rounded-full border border-border px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted"
              }
            >
              {p.name} · {p.patientId}
            </button>
          ))}
          <Button asChild size="sm" variant="ghost">
            <Link to="/patient/family">+ Add family member</Link>
          </Button>
        </div>
      ) : (
        <div className="surface-card mb-6 p-6">
          <p className="text-sm text-muted-foreground">
            You don't have a patient profile yet.
          </p>
          <Button asChild className="mt-3">
            <Link to="/patient/family">Create your profile</Link>
          </Button>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <section className="surface-card p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Quick actions
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {QUICK.map((q) => (
                <Link
                  key={q.label}
                  to={q.to}
                  className={
                    q.tone === "primary"
                      ? "rounded-xl bg-primary p-4 text-primary-foreground transition-shadow hover:shadow-lift"
                      : q.tone === "danger"
                        ? "rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-destructive transition-colors hover:bg-destructive/10"
                        : "rounded-xl border border-border p-4 transition-colors hover:bg-muted"
                  }
                >
                  <span className="text-xl" aria-hidden="true">
                    {q.icon}
                  </span>
                  <p className="mt-2 text-sm font-medium">{q.label}</p>
                </Link>
              ))}
            </div>
          </section>

          <section className="surface-card p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Recent cases
              </h2>
              <Link to="/patient/history" className="text-sm text-primary hover:underline">
                View all
              </Link>
            </div>
            {profileCases.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">
                No cases yet. Start a new case whenever you need to see a doctor.
              </p>
            ) : (
              <ul className="mt-4 divide-y divide-border">
                {profileCases.slice(0, 4).map((c) => (
                  <li key={c.id} className="flex flex-wrap items-center gap-3 py-3">
                    <div className="min-w-40 flex-1">
                      <p className="font-medium text-foreground">
                        {c.chiefComplaint}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {c.caseId} ·{" "}
                        {new Date(c.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <TypeBadge type={c.type} />
                    <StatusBadge status={c.status} />
                  </li>
                ))}
              </ul>
            )}
            {latest && latest.status === "reviewed" ? (
              <div className="mt-4 rounded-xl border border-accent/30 bg-accent-soft p-4 text-sm text-foreground">
                Your case has been reviewed by {doctorById(latest.doctorId)?.name}.
                Please visit the hospital for your consultation.
              </div>
            ) : null}
          </section>
        </div>

        <aside className="space-y-6">
          <section className="surface-card p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              My Doctor
            </h2>
            {doctor ? (
              <div className="mt-3">
                <p className="text-lg font-semibold text-foreground">{doctor.name}</p>
                <p className="text-sm text-muted-foreground">{hospital?.name}</p>
                <p className="text-sm text-muted-foreground">{doctor.department}</p>
                <span
                  className={
                    doctor.available
                      ? "mt-3 inline-flex rounded-full bg-success/15 px-2.5 py-1 text-xs font-medium"
                      : "mt-3 inline-flex rounded-full bg-warning/20 px-2.5 py-1 text-xs font-medium"
                  }
                >
                  {doctor.available ? "Available" : "Currently unavailable"}
                </span>
                <Button asChild variant="outline" size="sm" className="mt-4 w-full">
                  <Link to="/patient/doctor">Change doctor</Link>
                </Button>
              </div>
            ) : (
              <div className="mt-3">
                <p className="text-sm text-muted-foreground">
                  No preferred doctor selected yet.
                </p>
                <Button asChild size="sm" className="mt-3 w-full">
                  <Link to="/patient/doctor">Choose hospital & doctor</Link>
                </Button>
              </div>
            )}
          </section>

          {activeProfile ? (
            <section className="surface-card p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Current profile
              </h2>
              <dl className="mt-3 space-y-2 text-sm">
                <Row label="Patient ID" value={activeProfile.patientId} />
                <Row label="Age" value={`${ageFromDob(activeProfile.dob)} years`} />
                <Row label="Gender" value={activeProfile.gender} />
                <Row label="Blood group" value={activeProfile.bloodGroup ?? "—"} />
                <Row label="Allergies" value={activeProfile.allergies || "Not provided"} />
              </dl>
              <Button asChild variant="ghost" size="sm" className="mt-3 w-full">
                <Link to="/patient/profile">Edit profile</Link>
              </Button>
            </section>
          ) : null}

          <NoDiagnosisNotice />
        </aside>
      </div>
    </AppShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium text-foreground">{value}</dd>
    </div>
  );
}
