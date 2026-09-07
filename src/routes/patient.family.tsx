import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell, PageHeader, useRequireRole } from "@/components/app-shell";
import { PATIENT_NAV } from "@/components/patient-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStore, ageFromDob } from "@/lib/store";

export const Route = createFileRoute("/patient/family")({
  head: () => ({
    meta: [
      { title: "Family Profiles — AyuSetu" },
      {
        name: "description",
        content:
          "Manage family member profiles. Every family member gets a separate Patient ID and a separate medical history.",
      },
      { property: "og:title", content: "Family Profiles — AyuSetu" },
      {
        property: "og:description",
        content: "Separate patient IDs and records for every family member.",
      },
    ],
  }),
  component: FamilyPage,
});

function FamilyPage() {
  const account = useRequireRole("patient");
  const { myProfiles, addProfile, setActiveProfile, activeProfile, hospitals, doctors } =
    useStore();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    relation: "Family member",
    dob: "",
    gender: "Female" as "Male" | "Female" | "Other",
    phone: "",
    bloodGroup: "",
    allergies: "",
    medications: "",
    conditions: "",
    hospitalId: hospitals[0]!.id,
    preferredDoctorId: "",
  });

  if (!account) return null;

  const hospitalDoctors = doctors.filter((d) => d.hospitalId === form.hospitalId);

  function save() {
    if (!form.name.trim() || !form.dob) {
      toast.error("Please enter a name and date of birth.");
      return;
    }
    const created = addProfile({
      name: form.name.trim(),
      relation: form.relation,
      dob: form.dob,
      gender: form.gender,
      phone: form.phone,
      bloodGroup: form.bloodGroup,
      allergies: form.allergies,
      medications: form.medications,
      conditions: form.conditions,
      hospitalId: form.hospitalId,
      preferredDoctorId: form.preferredDoctorId || hospitalDoctors[0]?.id || "",
    });
    setActiveProfile(created.id);
    setOpen(false);
    toast.success(`${created.name} added as ${created.patientId}`);
  }

  return (
    <AppShell role="patient" nav={PATIENT_NAV}>
      <PageHeader
        title="My Profiles"
        description="Each family member has a completely separate Patient ID and medical history."
        action={
          <Button onClick={() => setOpen((v) => !v)}>
            {open ? "Cancel" : "+ Add Family Member"}
          </Button>
        }
      />

      {open ? (
        <section className="surface-card mb-6 p-6">
          <h2 className="text-lg font-semibold text-foreground">
            New family member
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Full name">
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Venkat Rao"
              />
            </Field>
            <Field label="Relation">
              <Input
                value={form.relation}
                onChange={(e) => setForm({ ...form, relation: e.target.value })}
                placeholder="Grandfather, Daughter…"
              />
            </Field>
            <Field label="Date of birth">
              <Input
                type="date"
                value={form.dob}
                onChange={(e) => setForm({ ...form, dob: e.target.value })}
              />
            </Field>
            <Field label="Gender">
              <select
                value={form.gender}
                onChange={(e) =>
                  setForm({ ...form, gender: e.target.value as typeof form.gender })
                }
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option>Female</option>
                <option>Male</option>
                <option>Other</option>
              </select>
            </Field>
            <Field label="Contact number">
              <Input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+91"
              />
            </Field>
            <Field label="Blood group">
              <Input
                value={form.bloodGroup}
                onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
                placeholder="O+"
              />
            </Field>
            <Field label="Known allergies">
              <Input
                value={form.allergies}
                onChange={(e) => setForm({ ...form, allergies: e.target.value })}
                placeholder="None known"
              />
            </Field>
            <Field label="Current medicines">
              <Input
                value={form.medications}
                onChange={(e) => setForm({ ...form, medications: e.target.value })}
                placeholder="None"
              />
            </Field>
            <Field label="Hospital">
              <select
                value={form.hospitalId}
                onChange={(e) =>
                  setForm({ ...form, hospitalId: e.target.value, preferredDoctorId: "" })
                }
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                {hospitals.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Preferred doctor">
              <select
                value={form.preferredDoctorId}
                onChange={(e) =>
                  setForm({ ...form, preferredDoctorId: e.target.value })
                }
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">Select a doctor</option>
                {hospitalDoctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} · {d.department}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <Button className="mt-5" onClick={save}>
            Save profile
          </Button>
        </section>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {myProfiles.map((p) => (
          <div
            key={p.id}
            className={
              p.id === activeProfile?.id
                ? "surface-card border-primary/40 p-5 ring-2 ring-primary/20"
                : "surface-card p-5"
            }
          >
            <p className="text-lg font-semibold text-foreground">{p.name}</p>
            <p className="text-sm text-muted-foreground">
              {p.relation} · {p.patientId}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {ageFromDob(p.dob)} years · {p.gender}
            </p>
            <div className="mt-4 flex gap-2">
              <Button
                size="sm"
                variant={p.id === activeProfile?.id ? "secondary" : "default"}
                onClick={() => {
                  setActiveProfile(p.id);
                  toast.success(`Switched to ${p.name}`);
                }}
              >
                {p.id === activeProfile?.id ? "Active profile" : "Switch to this"}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setActiveProfile(p.id);
                  navigate({ to: "/patient/history" });
                }}
              >
                History
              </Button>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
