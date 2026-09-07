import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell, PageHeader, useRequireRole } from "@/components/app-shell";
import { DOCTOR_NAV } from "@/components/patient-nav";
import {
  ConsultationProgress,
  StatusBadge,
  TypeBadge,
} from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useStore, ageFromDob } from "@/lib/store";
import { CASE_FIELDS } from "@/lib/case-engine";
import type { CaseRecord } from "@/lib/types";

export const Route = createFileRoute("/doctor/case/$id")({
  head: () => ({
    meta: [
      { title: "Case Review — AyuSetu" },
      {
        name: "description",
        content:
          "Review the structured case, verify or correct the AI summary, add clinical notes and mark the case reviewed.",
      },
      { property: "og:title", content: "Case Review — AyuSetu" },
      {
        property: "og:description",
        content: "Verify and correct a prepared patient case before consultation.",
      },
    ],
  }),
  component: DoctorCaseView,
});

const EDITABLE: { field: keyof CaseRecord; label: string }[] = [
  { field: "chiefComplaint", label: "Chief complaint" },
  { field: "duration", label: "Duration" },
  { field: "symptoms", label: "Symptoms" },
  { field: "severity", label: "Severity" },
  { field: "pastHistory", label: "Past medical history" },
  { field: "allergies", label: "Allergies" },
  { field: "medications", label: "Current medications" },
  { field: "familyHistory", label: "Family history" },
  { field: "other", label: "Other relevant information" },
];

function DoctorCaseView() {
  const account = useRequireRole("doctor");
  const { id } = Route.useParams();
  const {
    caseById,
    profileById,
    hospitalById,
    cases,
    updateCase,
    setCaseStatus,
    addNote,
  } = useStore();
  const [editing, setEditing] = useState(false);
  const [note, setNote] = useState("");
  const [clarify, setClarify] = useState("");
  const [summaryDraft, setSummaryDraft] = useState<string | null>(null);

  if (!account) return null;
  const record = caseById(id);
  if (!record) {
    return (
      <AppShell role="doctor" nav={DOCTOR_NAV}>
        <PageHeader title="Case not found" />
        <Button asChild className="mt-4">
          <Link to="/doctor/cases">Back to cases</Link>
        </Button>
      </AppShell>
    );
  }

  const profile = profileById(record.profileId);
  const history = cases
    .filter((c) => c.profileId === record.profileId && c.id !== record.id)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  const missing = CASE_FIELDS.filter(
    (f) => !String(record[f.field] ?? "").trim() || String(record[f.field]) === "Not provided",
  );

  return (
    <AppShell role="doctor" nav={DOCTOR_NAV}>
      <PageHeader
        title={`${profile?.name ?? "Patient"} — ${record.caseId}`}
        description={`${profile?.patientId} · ${profile ? ageFromDob(profile.dob) : "—"} years · ${profile?.gender} · ${hospitalById(record.hospitalId)?.name}`}
        action={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setEditing((v) => !v)}>
              {editing ? "Done editing" : "Edit information"}
            </Button>
            <Button
              onClick={() => {
                setCaseStatus(record.id, "reviewed");
                toast.success("Case marked as reviewed. Patient notified.");
              }}
              disabled={record.status !== "submitted"}
            >
              Mark Case Reviewed
            </Button>
          </div>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <TypeBadge type={record.type} />
        <StatusBadge status={record.status} />
        <span className="text-sm text-muted-foreground">
          Submitted {new Date(record.createdAt).toLocaleString("en-IN")}
        </span>
      </div>

      {record.type === "emergency" ? (
        <div className="mb-6 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 font-semibold text-destructive">
          🚨 EMERGENCY — HIGH PRIORITY
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <section className="surface-card border-accent/30 p-6">
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-accent-foreground">
                AI Summary — requires your verification
              </p>
              <button
                className="text-xs text-primary hover:underline"
                onClick={() =>
                  setSummaryDraft(summaryDraft === null ? record.aiSummary : null)
                }
              >
                {summaryDraft === null ? "Correct summary" : "Cancel"}
              </button>
            </div>
            {summaryDraft === null ? (
              <p className="mt-2 text-base leading-relaxed text-foreground">
                {record.aiSummary}
              </p>
            ) : (
              <div className="mt-2">
                <Textarea
                  value={summaryDraft}
                  onChange={(e) => setSummaryDraft(e.target.value)}
                  className="min-h-28"
                />
                <Button
                  size="sm"
                  className="mt-3"
                  onClick={() => {
                    updateCase(record.id, { aiSummary: summaryDraft });
                    setSummaryDraft(null);
                    toast.success("Summary corrected.");
                  }}
                >
                  Save corrected summary
                </Button>
              </div>
            )}
          </section>

          <section className="surface-card p-6">
            <h2 className="text-lg font-semibold text-foreground">Structured case</h2>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              {EDITABLE.map((f) => (
                <div key={String(f.field)}>
                  <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                    {f.label}
                  </dt>
                  {editing ? (
                    <Textarea
                      className="mt-1 min-h-16"
                      value={String(record[f.field] ?? "")}
                      onChange={(e) =>
                        updateCase(record.id, {
                          [f.field]: e.target.value,
                        } as Partial<CaseRecord>)
                      }
                    />
                  ) : (
                    <dd className="mt-1 text-sm font-medium leading-relaxed text-foreground">
                      {String(record[f.field] ?? "").trim() || "Not provided"}
                    </dd>
                  )}
                </div>
              ))}
            </dl>
          </section>

          {record.followUp ? (
            <section className="surface-card p-6">
              <h2 className="text-lg font-semibold text-foreground">
                Follow-up responses
              </h2>
              <dl className="mt-4 space-y-3 text-sm">
                <FU label="Condition improved?" value={record.followUp.improved} />
                <FU
                  label="Previous symptoms present?"
                  value={record.followUp.previousSymptomsPresent}
                />
                <FU label="New symptoms" value={record.followUp.newSymptoms} />
                <FU label="Changes" value={record.followUp.changes} />
                <FU label="Concerns" value={record.followUp.concerns} />
              </dl>
            </section>
          ) : null}

          <section className="surface-card p-6">
            <h2 className="text-lg font-semibold text-foreground">Clinical notes</h2>
            {record.notes.length > 0 ? (
              <ul className="mt-4 space-y-2">
                {record.notes.map((n) => (
                  <li key={n.id} className="rounded-xl bg-muted/70 p-3 text-sm">
                    <p className="text-foreground">{n.text}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {n.author} ·{" "}
                      {new Date(n.createdAt).toLocaleString("en-IN")} ·{" "}
                      {n.kind === "clarification" ? "Clarification request" : "Note"}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">No notes yet.</p>
            )}
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-foreground">
                  Add clinical note
                </label>
                <Textarea
                  className="mt-1.5 min-h-20"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Observations for the in-person consultation"
                />
                <Button
                  size="sm"
                  className="mt-2"
                  onClick={() => {
                    if (!note.trim()) return;
                    addNote(record.id, {
                      author: account.name,
                      text: note.trim(),
                      kind: "note",
                    });
                    setNote("");
                    toast.success("Note added.");
                  }}
                >
                  Add note
                </Button>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">
                  Request clarification from patient
                </label>
                <Textarea
                  className="mt-1.5 min-h-20"
                  value={clarify}
                  onChange={(e) => setClarify(e.target.value)}
                  placeholder="e.g. Please confirm any known drug allergies"
                />
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2"
                  onClick={() => {
                    if (!clarify.trim()) return;
                    addNote(record.id, {
                      author: account.name,
                      text: clarify.trim(),
                      kind: "clarification",
                    });
                    setClarify("");
                    toast.success("Clarification requested.");
                  }}
                >
                  Send request
                </Button>
              </div>
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="surface-card p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Missing information
            </h2>
            {missing.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">
                Nothing missing in this case.
              </p>
            ) : (
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {missing.map((m) => (
                  <li key={m.field}>⚠ {m.label} not provided</li>
                ))}
              </ul>
            )}
          </section>

          <section className="surface-card p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Consultation status
            </h2>
            <div className="mt-4">
              <ConsultationProgress status={record.status} />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setCaseStatus(record.id, "consultation-pending")}
              >
                Consultation pending
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setCaseStatus(record.id, "completed");
                  toast.success("Consultation marked completed.");
                }}
              >
                Consultation completed
              </Button>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Diagnosis, treatment and prescriptions happen in person. AyuSetu only
              records that the consultation took place.
            </p>
          </section>

          <section className="surface-card p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Previous cases
            </h2>
            {history.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">
                No earlier cases for this patient.
              </p>
            ) : (
              <ul className="mt-3 space-y-3">
                {history.map((h) => (
                  <li key={h.id} className="rounded-xl border border-border p-3">
                    <p className="text-sm font-medium text-foreground">
                      {h.chiefComplaint}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(h.createdAt).toLocaleDateString("en-IN", {
                        month: "short",
                        year: "numeric",
                      })}{" "}
                      · {h.caseId}
                    </p>
                    <Link
                      to="/doctor/case/$id"
                      params={{ id: h.id }}
                      className="mt-1 inline-block text-xs text-primary hover:underline"
                    >
                      Open case
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </aside>
      </div>
    </AppShell>
  );
}

function FU({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-0.5 text-foreground">{value || "Not provided"}</dd>
    </div>
  );
}
