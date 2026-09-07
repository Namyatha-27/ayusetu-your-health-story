import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, PageHeader, useRequireRole } from "@/components/app-shell";
import { PATIENT_NAV } from "@/components/patient-nav";
import { StatusBadge, TypeBadge, ConsultationProgress } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/patient/history")({
  head: () => ({
    meta: [
      { title: "Medical History — AyuSetu" },
      {
        name: "description",
        content:
          "A clear timeline of your cases, doctor reviews and completed consultations on AyuSetu.",
      },
      { property: "og:title", content: "Medical History — AyuSetu" },
      {
        property: "og:description",
        content: "Your visits, complaints and consultation outcomes in one timeline.",
      },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const account = useRequireRole("patient");
  const { cases, activeProfile, doctorById, hospitalById } = useStore();
  if (!account) return null;

  const list = cases
    .filter((c) => c.profileId === activeProfile?.id)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  return (
    <AppShell role="patient" nav={PATIENT_NAV}>
      <PageHeader
        title="Medical History"
        description={
          activeProfile
            ? `${activeProfile.name} · ${activeProfile.patientId}. Records are kept separate for every family member.`
            : undefined
        }
        action={
          <Button asChild>
            <Link to="/patient/case/new">Start New Case</Link>
          </Button>
        }
      />

      {list.length === 0 ? (
        <div className="surface-card p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No visits recorded for this profile yet.
          </p>
        </div>
      ) : (
        <ol className="relative space-y-6 border-l border-border pl-6">
          {list.map((c) => (
            <li key={c.id} className="relative">
              <span className="absolute -left-[31px] top-2 size-3 rounded-full border-2 border-background bg-primary" />
              <div className="surface-card p-5">
                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {new Date(c.createdAt).toLocaleDateString("en-IN", {
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <TypeBadge type={c.type} />
                  <StatusBadge status={c.status} />
                </div>
                <h3 className="mt-2 text-lg font-semibold text-foreground">
                  {c.chiefComplaint}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {doctorById(c.doctorId)?.name} · {hospitalById(c.hospitalId)?.name}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-foreground">
                  {c.aiSummary}
                </p>
                <div className="mt-4 border-t border-border pt-4">
                  <ConsultationProgress status={c.status} />
                </div>
                {c.notes.length > 0 ? (
                  <div className="mt-4 space-y-2">
                    {c.notes.map((n) => (
                      <p
                        key={n.id}
                        className="rounded-lg bg-muted/70 px-3 py-2 text-sm text-foreground"
                      >
                        <span className="font-medium">{n.author}:</span> {n.text}
                      </p>
                    ))}
                  </div>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      )}
    </AppShell>
  );
}
