import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell, PageHeader, useRequireRole } from "@/components/app-shell";
import { PATIENT_NAV } from "@/components/patient-nav";
import { NoDiagnosisNotice } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useStore } from "@/lib/store";
import { generateFollowUpSummary } from "@/lib/case-engine";
import type { FollowUpAnswers } from "@/lib/types";

export const Route = createFileRoute("/patient/follow-up")({
  head: () => ({
    meta: [
      { title: "Follow-up — AyuSetu" },
      {
        name: "description",
        content:
          "Send a short follow-up to the same doctor without filling your whole case again.",
      },
      { property: "og:title", content: "Follow-up — AyuSetu" },
      {
        property: "og:description",
        content: "Care continuity: update your doctor on what changed since last visit.",
      },
    ],
  }),
  component: FollowUpPage,
});

const QUESTIONS: { key: keyof FollowUpAnswers; label: string; placeholder: string }[] = [
  {
    key: "improved",
    label: "Has your condition improved?",
    placeholder: "Improved / Same / Worse — and how much",
  },
  {
    key: "previousSymptomsPresent",
    label: "Are your previous symptoms still present?",
    placeholder: "Which symptoms remain?",
  },
  {
    key: "newSymptoms",
    label: "Have you developed any new symptoms?",
    placeholder: "New symptoms since your last visit",
  },
  {
    key: "changes",
    label: "Have there been any changes?",
    placeholder: "Diet, activity, medicines, tests done…",
  },
  {
    key: "concerns",
    label: "Any concerns since your previous consultation?",
    placeholder: "Anything worrying you",
  },
];

function FollowUpPage() {
  const account = useRequireRole("patient");
  const { cases, activeProfile, addCase, doctorById, hospitalById } = useStore();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<FollowUpAnswers>({
    improved: "",
    previousSymptomsPresent: "",
    newSymptoms: "",
    changes: "",
    concerns: "",
  });

  if (!account) return null;

  const previous = cases
    .filter((c) => c.profileId === activeProfile?.id)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))[0];

  if (!activeProfile || !previous) {
    return (
      <AppShell role="patient" nav={PATIENT_NAV}>
        <PageHeader title="Follow-up" />
        <div className="surface-card p-8">
          <p className="text-sm text-muted-foreground">
            There is no previous case for this profile yet.
          </p>
          <Button asChild className="mt-4">
            <Link to="/patient/case/new">Start New Case</Link>
          </Button>
        </div>
      </AppShell>
    );
  }

  const doctor = doctorById(previous.doctorId);
  const summary = generateFollowUpSummary(activeProfile, previous, answers);

  function submit() {
    if (!activeProfile || !previous) return;
    const created = addCase({
      profileId: activeProfile.id,
      hospitalId: previous.hospitalId,
      doctorId: previous.doctorId,
      type: "follow-up",
      language: previous.language,
      parentCaseId: previous.id,
      chiefComplaint: `Follow-up: ${previous.chiefComplaint}`,
      duration: "Since last consultation",
      symptoms: answers.previousSymptomsPresent || previous.symptoms,
      severity: answers.improved || "Not provided",
      pastHistory: previous.chiefComplaint,
      allergies: previous.allergies,
      medications: previous.medications,
      familyHistory: previous.familyHistory,
      other: answers.concerns,
      aiSummary: summary,
      followUp: answers,
    });
    toast.success("Follow-up sent to your doctor.");
    navigate({ to: "/patient/case/summary", search: { case: created.caseId } });
  }

  return (
    <AppShell role="patient" nav={PATIENT_NAV}>
      <PageHeader
        title={`Welcome back, ${activeProfile.name.split(" ")[0]}`}
        description="A quick follow-up — no need to fill your whole case again."
        action={
          <Button asChild variant="outline">
            <Link to="/patient/case/new">➕ New Case instead</Link>
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <section className="surface-card p-6">
          <div className="rounded-xl bg-muted/70 p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Previous case
            </p>
            <p className="mt-1 font-medium text-foreground">
              {previous.chiefComplaint} · {previous.caseId}
            </p>
            <p className="text-sm text-muted-foreground">
              {new Date(previous.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}{" "}
              · {doctor?.name}
            </p>
          </div>

          <div className="mt-6 space-y-5">
            {QUESTIONS.map((q) => (
              <div key={q.key}>
                <label className="text-sm font-medium text-foreground">
                  {q.label}
                </label>
                <Textarea
                  className="mt-1.5 min-h-16"
                  value={answers[q.key]}
                  onChange={(e) =>
                    setAnswers({ ...answers, [q.key]: e.target.value })
                  }
                  placeholder={q.placeholder}
                />
              </div>
            ))}
          </div>

          <Button className="mt-6" size="lg" onClick={submit}>
            Send follow-up to {doctor?.name ?? "my doctor"}
          </Button>
        </section>

        <aside className="space-y-6">
          <section className="surface-card border-accent/30 p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-accent-foreground">
              Follow-up summary — requires doctor verification
            </p>
            <p className="mt-2 text-sm leading-relaxed text-foreground">{summary}</p>
          </section>
          <section className="surface-card p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Going to
            </h2>
            <p className="mt-2 font-medium text-foreground">{doctor?.name}</p>
            <p className="text-sm text-muted-foreground">
              {hospitalById(previous.hospitalId)?.name}
            </p>
          </section>
          <NoDiagnosisNotice />
        </aside>
      </div>
    </AppShell>
  );
}
