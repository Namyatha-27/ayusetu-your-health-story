import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AppShell, PageHeader, useRequireRole } from "@/components/app-shell";
import { PATIENT_NAV } from "@/components/patient-nav";
import { NoDiagnosisNotice } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useStore } from "@/lib/store";
import {
  LANGUAGES,
  assessCompleteness,
  buildQuestionFlow,
  generateSummary,
  type CaseField,
} from "@/lib/case-engine";
import type { Language } from "@/lib/types";

export const Route = createFileRoute("/patient/case/new")({
  head: () => ({
    meta: [
      { title: "Start a New Case — AyuSetu" },
      {
        name: "description",
        content:
          "Tell AyuSetu what brings you in today, by typing or speaking, in English, Telugu or Hindi. Adaptive questions build a structured case for your doctor.",
      },
      { property: "og:title", content: "Start a New Case — AyuSetu" },
      {
        property: "og:description",
        content: "Adaptive, multilingual case taking that prepares your doctor.",
      },
    ],
  }),
  component: NewCasePage,
});

function NewCasePage() {
  const account = useRequireRole("patient");
  const { activeProfile, doctorById, hospitalById, addCase } = useStore();
  const navigate = useNavigate();

  const [language, setLanguage] = useState<Language>("en");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<Record<CaseField, string>>>({});
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [consent, setConsent] = useState(false);
  const [phase, setPhase] = useState<"chat" | "review">("chat");

  const flow = useMemo(
    () => buildQuestionFlow(answers.chiefComplaint ?? ""),
    [answers.chiefComplaint],
  );

  if (!account) return null;

  const doctor = doctorById(activeProfile?.preferredDoctorId);
  const hospital = hospitalById(activeProfile?.hospitalId);
  const question = flow[step];
  const { percent, missing } = assessCompleteness(answers);

  function record(value: string) {
    if (!question) return;
    const trimmed = value.trim();
    if (!trimmed) {
      toast.error("Please add an answer, or use a suggestion below.");
      return;
    }
    setAnswers((a) => ({
      ...a,
      [question.field]: a[question.field]
        ? `${a[question.field]} ${trimmed}`
        : trimmed,
    }));
    setInput("");
    if (step + 1 >= flow.length) setPhase("review");
    else setStep(step + 1);
  }

  function submit() {
    if (!activeProfile || !doctor || !hospital) {
      toast.error("Please choose a hospital and doctor first.");
      return;
    }
    if (!consent) {
      toast.error("Please give consent to share this case with your doctor.");
      return;
    }
    const created = addCase({
      profileId: activeProfile.id,
      hospitalId: hospital.id,
      doctorId: doctor.id,
      type: "new",
      language,
      chiefComplaint: answers.chiefComplaint ?? "",
      duration: answers.duration ?? "",
      symptoms: answers.symptoms ?? "",
      severity: answers.severity ?? "",
      pastHistory: answers.pastHistory ?? "",
      allergies: answers.allergies ?? "",
      medications: answers.medications ?? "",
      familyHistory: answers.familyHistory ?? "",
      other: answers.other ?? "",
      aiSummary: generateSummary(activeProfile, answers),
    });
    toast.success("Case submitted successfully.");
    navigate({ to: "/patient/case/summary", search: { case: created.caseId } });
  }

  if (!activeProfile) {
    return (
      <AppShell role="patient" nav={PATIENT_NAV}>
        <PageHeader title="Start New Case" />
        <p className="text-sm text-muted-foreground">
          Add a patient profile before starting a case.
        </p>
        <Button asChild className="mt-4">
          <Link to="/patient/family">Add a profile</Link>
        </Button>
      </AppShell>
    );
  }

  return (
    <AppShell role="patient" nav={PATIENT_NAV}>
      <PageHeader
        title="Start New Case"
        description={`${activeProfile.name} · ${activeProfile.patientId}`}
        action={
          <div className="flex gap-1 rounded-full border border-border p-1">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => setLanguage(l.code)}
                className={
                  language === l.code
                    ? "rounded-full bg-primary px-3 py-1 text-sm text-primary-foreground"
                    : "rounded-full px-3 py-1 text-sm text-muted-foreground hover:bg-muted"
                }
              >
                {l.label}
              </button>
            ))}
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          {phase === "chat" && question ? (
            <section className="surface-card p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Question {step + 1} of {flow.length}
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-foreground">
                {question.prompt[language]}
              </h2>
              {question.hint ? (
                <p className="mt-2 text-sm text-muted-foreground">{question.hint}</p>
              ) : null}

              <Textarea
                className="mt-5 min-h-28"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your answer in your own words…"
              />

              {question.chips ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {question.chips.map((chip) => (
                    <button
                      key={chip}
                      onClick={() => setInput(chip)}
                      className="rounded-full border border-border px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              ) : null}

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Button onClick={() => record(input)}>
                  {step + 1 >= flow.length ? "Finish" : "Next"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    // Voice input placeholder — connect speech-to-text here later.
                    setListening((v) => !v);
                    if (!listening)
                      toast.info(
                        "Voice input is a preview in this prototype. Speech-to-text connects here.",
                      );
                  }}
                >
                  🎤 {listening ? "Listening…" : "Speak your symptoms"}
                </Button>
                {step > 0 ? (
                  <Button variant="ghost" onClick={() => setStep(step - 1)}>
                    Back
                  </Button>
                ) : null}
                {step > 0 ? (
                  <Button variant="ghost" onClick={() => setPhase("review")}>
                    Skip to review
                  </Button>
                ) : null}
              </div>
              {listening ? (
                <div className="mt-4 flex items-center gap-2 rounded-xl bg-accent-soft px-4 py-3 text-sm text-accent-foreground">
                  <span className="flex gap-1">
                    <span className="h-4 w-1 animate-pulse rounded bg-accent" />
                    <span className="h-4 w-1 animate-pulse rounded bg-accent [animation-delay:120ms]" />
                    <span className="h-4 w-1 animate-pulse rounded bg-accent [animation-delay:240ms]" />
                  </span>
                  Listening… your words will appear in the box above.
                </div>
              ) : null}
            </section>
          ) : (
            <ReviewCard
              answers={answers}
              onEdit={(field) => {
                const idx = flow.findIndex((q) => q.field === field);
                setStep(idx >= 0 ? idx : 0);
                setPhase("chat");
              }}
              onChange={(field, value) =>
                setAnswers((a) => ({ ...a, [field]: value }))
              }
              summary={generateSummary(activeProfile, answers)}
            />
          )}
        </div>

        <aside className="space-y-6">
          <section className="surface-card p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Case completeness
            </h2>
            <p className="mt-2 text-3xl font-semibold text-foreground">{percent}%</p>
            <Progress value={percent} className="mt-3" />
            {missing.length > 0 ? (
              <ul className="mt-4 space-y-2 text-sm">
                {missing.map((m) => (
                  <li key={m.field} className="text-muted-foreground">
                    ⚠ {m.label} not provided
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">
                All sections have information.
              </p>
            )}
          </section>

          <section className="surface-card p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Sending to
            </h2>
            <p className="mt-2 font-medium text-foreground">
              {doctor?.name ?? "No doctor selected"}
            </p>
            <p className="text-sm text-muted-foreground">{hospital?.name ?? "—"}</p>
            <label className="mt-4 flex items-start gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1"
              />
              I consent to share this case information with my doctor and hospital.
            </label>
            <Button className="mt-4 w-full" size="lg" onClick={submit}>
              Send Case to Doctor
            </Button>
            {phase === "chat" ? (
              <p className="mt-2 text-xs text-muted-foreground">
                You can submit at any point — missing details can be added later.
              </p>
            ) : null}
          </section>

          <NoDiagnosisNotice />
        </aside>
      </div>
    </AppShell>
  );
}

function ReviewCard({
  answers,
  onEdit,
  onChange,
  summary,
}: {
  answers: Partial<Record<CaseField, string>>;
  onEdit: (field: CaseField) => void;
  onChange: (field: CaseField, value: string) => void;
  summary: string;
}) {
  const FIELDS: { field: CaseField; label: string }[] = [
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
  return (
    <section className="surface-card p-6">
      <h2 className="text-xl font-semibold text-foreground">
        Review your case before sending
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Add anything that is missing. Your doctor can also correct details later.
      </p>

      <div className="mt-5 rounded-xl border border-accent/30 bg-accent-soft p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-accent-foreground">
          AI summary — requires doctor verification
        </p>
        <p className="mt-2 text-sm leading-relaxed text-foreground">{summary}</p>
      </div>

      <div className="mt-6 space-y-4">
        {FIELDS.map((f) => (
          <div key={f.field}>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">{f.label}</label>
              <button
                onClick={() => onEdit(f.field)}
                className="text-xs text-primary hover:underline"
              >
                Ask again
              </button>
            </div>
            <Textarea
              className="mt-1.5 min-h-16"
              value={answers[f.field] ?? ""}
              onChange={(e) => onChange(f.field, e.target.value)}
              placeholder="Not provided"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
