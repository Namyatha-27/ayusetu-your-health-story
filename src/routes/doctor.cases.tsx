import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, PageHeader, useRequireRole } from "@/components/app-shell";
import { DOCTOR_NAV } from "@/components/patient-nav";
import { CaseTable } from "@/components/case-table";
import { Input } from "@/components/ui/input";
import { useStore } from "@/lib/store";
import type { CaseStatus } from "@/lib/types";

export const Route = createFileRoute("/doctor/cases")({
  head: () => ({
    meta: [
      { title: "Patient Cases — AyuSetu" },
      {
        name: "description",
        content:
          "Search and filter all patient cases assigned to you: new, follow-up, emergency and reviewed.",
      },
      { property: "og:title", content: "Patient Cases — AyuSetu" },
      {
        property: "og:description",
        content: "All cases assigned to you, filterable by status.",
      },
    ],
  }),
  component: DoctorCases,
});

const FILTERS: { key: CaseStatus | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "submitted", label: "Pending review" },
  { key: "reviewed", label: "Reviewed" },
  { key: "consultation-pending", label: "Consultation pending" },
  { key: "completed", label: "Completed" },
];

function DoctorCases() {
  const account = useRequireRole("doctor");
  const { cases, profileById } = useStore();
  const [filter, setFilter] = useState<CaseStatus | "all">("all");
  const [query, setQuery] = useState("");

  if (!account) return null;

  const list = cases
    .filter((c) => c.doctorId === account.doctorId)
    .filter((c) => (filter === "all" ? true : c.status === filter))
    .filter((c) => {
      const p = profileById(c.profileId);
      const hay = `${p?.name} ${p?.patientId} ${c.chiefComplaint} ${c.caseId}`;
      return hay.toLowerCase().includes(query.toLowerCase());
    });

  return (
    <AppShell role="doctor" nav={DOCTOR_NAV}>
      <PageHeader title="Patient cases" description="Filter and open any case." />
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={
              filter === f.key
                ? "rounded-full bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground"
                : "rounded-full border border-border px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted"
            }
          >
            {f.label}
          </button>
        ))}
        <Input
          className="ml-auto w-full sm:w-64"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search patient, ID or complaint"
        />
      </div>
      <CaseTable cases={list} />
    </AppShell>
  );
}
