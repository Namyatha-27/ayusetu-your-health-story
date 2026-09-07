import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell, PageHeader, useRequireRole } from "@/components/app-shell";
import { PATIENT_NAV } from "@/components/patient-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStore, ageFromDob } from "@/lib/store";

export const Route = createFileRoute("/patient/profile")({
  head: () => ({
    meta: [
      { title: "My Profile — AyuSetu" },
      {
        name: "description",
        content:
          "Update your personal details, contact information and basic medical information on AyuSetu.",
      },
      { property: "og:title", content: "My Profile — AyuSetu" },
      {
        property: "og:description",
        content: "Keep your basic medical information current for better consultations.",
      },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const account = useRequireRole("patient");
  const { activeProfile, updateProfile, hospitalById, doctorById } = useStore();
  const [draft, setDraft] = useState<Record<string, string>>({});

  if (!account) return null;
  if (!activeProfile)
    return (
      <AppShell role="patient" nav={PATIENT_NAV}>
        <PageHeader title="My Profile" />
        <p className="text-sm text-muted-foreground">
          Add a profile from the Family Profiles page first.
        </p>
      </AppShell>
    );

  const p = activeProfile;
  const val = (k: string, fallback: string) => draft[k] ?? fallback;

  function save() {
    updateProfile(p.id, draft as never);
    setDraft({});
    toast.success("Profile updated.");
  }

  return (
    <AppShell role="patient" nav={PATIENT_NAV}>
      <PageHeader
        title="My Profile"
        description={`${p.name} · ${p.patientId} · ${ageFromDob(p.dob)} years`}
        action={
          <Button onClick={save} disabled={Object.keys(draft).length === 0}>
            Save changes
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="surface-card p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Personal & contact information
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <F label="Full name">
              <Input
                value={val("name", p.name)}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              />
            </F>
            <F label="Date of birth">
              <Input
                type="date"
                value={val("dob", p.dob)}
                onChange={(e) => setDraft({ ...draft, dob: e.target.value })}
              />
            </F>
            <F label="Gender">
              <select
                value={val("gender", p.gender)}
                onChange={(e) => setDraft({ ...draft, gender: e.target.value })}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option>Female</option>
                <option>Male</option>
                <option>Other</option>
              </select>
            </F>
            <F label="Contact number">
              <Input
                value={val("phone", p.phone)}
                onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
              />
            </F>
            <F label="Email">
              <Input
                value={val("email", p.email ?? "")}
                onChange={(e) => setDraft({ ...draft, email: e.target.value })}
              />
            </F>
            <F label="Blood group">
              <Input
                value={val("bloodGroup", p.bloodGroup ?? "")}
                onChange={(e) => setDraft({ ...draft, bloodGroup: e.target.value })}
              />
            </F>
          </div>

          <h2 className="mt-8 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Basic medical information
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <F label="Known allergies">
              <Input
                value={val("allergies", p.allergies ?? "")}
                onChange={(e) => setDraft({ ...draft, allergies: e.target.value })}
                placeholder="None known"
              />
            </F>
            <F label="Current medicines">
              <Input
                value={val("medications", p.medications ?? "")}
                onChange={(e) => setDraft({ ...draft, medications: e.target.value })}
                placeholder="None"
              />
            </F>
            <F label="Ongoing conditions">
              <Input
                value={val("conditions", p.conditions ?? "")}
                onChange={(e) => setDraft({ ...draft, conditions: e.target.value })}
                placeholder="Diabetes, blood pressure…"
              />
            </F>
          </div>
        </div>

        <aside className="surface-card h-fit p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Care team
          </h2>
          <p className="mt-3 font-medium text-foreground">
            {doctorById(p.preferredDoctorId)?.name ?? "No doctor selected"}
          </p>
          <p className="text-sm text-muted-foreground">
            {hospitalById(p.hospitalId)?.name ?? "—"}
          </p>
          <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
            Your information is shared only with your preferred doctor and the
            hospital you choose, and only when you submit a case.
          </p>
        </aside>
      </div>
    </AppShell>
  );
}

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
