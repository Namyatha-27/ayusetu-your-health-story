import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, PageHeader, useRequireRole } from "@/components/app-shell";
import { DOCTOR_NAV } from "@/components/patient-nav";
import { CaseTable } from "@/components/case-table";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/doctor/dashboard")({
  head: () => ({
    meta: [
      { title: "Doctor Dashboard — AyuSetu" },
      {
        name: "description",
        content:
          "New cases, pending reviews, today's visits and follow-ups prepared before your consultations.",
      },
      { property: "og:title", content: "Doctor Dashboard — AyuSetu" },
      {
        property: "og:description",
        content: "Structured patient cases ready for review before OPD.",
      },
    ],
  }),
  component: DoctorDashboard,
});

function DoctorDashboard() {
  const account = useRequireRole("doctor");
  const { cases } = useStore();
  if (!account) return null;

  const mine = cases.filter((c) => c.doctorId === account.doctorId);
  const today = new Date().toDateString();
  const stats = [
    { label: "New Cases", value: mine.filter((c) => c.status === "submitted" && c.type === "new").length },
    { label: "Pending Review", value: mine.filter((c) => c.status === "submitted").length },
    { label: "Reviewed Cases", value: mine.filter((c) => c.status !== "submitted").length },
    {
      label: "Today's Visits",
      value: mine.filter((c) => new Date(c.createdAt).toDateString() === today).length,
    },
    { label: "Follow-ups", value: mine.filter((c) => c.type === "follow-up").length },
  ];
  const emergencies = mine.filter((c) => c.type === "emergency");

  return (
    <AppShell role="doctor" nav={DOCTOR_NAV}>
      <PageHeader
        title={`Good day, ${account.name}`}
        description="Cases prepared by AyuSetu. Every AI summary needs your verification."
      />

      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((s) => (
          <div key={s.label} className="surface-card p-5">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="mt-1 font-display text-3xl font-semibold text-foreground">
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {emergencies.length > 0 ? (
        <div className="mt-6 rounded-2xl border border-destructive/30 bg-destructive/5 p-5">
          <p className="font-semibold text-destructive">
            🚨 {emergencies.length} emergency case(s) — high priority
          </p>
          <ul className="mt-2 space-y-1 text-sm">
            {emergencies.map((c) => (
              <li key={c.id}>
                <Link
                  to="/doctor/case/$id"
                  params={{ id: c.id }}
                  className="text-foreground underline-offset-4 hover:underline"
                >
                  {c.caseId} — {c.chiefComplaint}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <section className="mt-8">
        <h2 className="mb-3 text-lg font-semibold text-foreground">
          Cases awaiting review
        </h2>
        <CaseTable cases={mine.filter((c) => c.status === "submitted")} />
      </section>

      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Recently reviewed</h2>
          <Link to="/doctor/cases" className="text-sm text-primary hover:underline">
            View all cases
          </Link>
        </div>
        <CaseTable cases={mine.filter((c) => c.status !== "submitted")} />
      </section>
    </AppShell>
  );
}
