import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell, PageHeader, useRequireRole } from "@/components/app-shell";
import { PATIENT_NAV } from "@/components/patient-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/patient/doctor")({
  head: () => ({
    meta: [
      { title: "My Doctor & Hospital — AyuSetu" },
      {
        name: "description",
        content:
          "Search hospitals, choose a preferred doctor and change your doctor when they are unavailable.",
      },
      { property: "og:title", content: "My Doctor & Hospital — AyuSetu" },
      {
        property: "og:description",
        content: "Save a preferred doctor so you never have to pick again.",
      },
    ],
  }),
  component: DoctorPage,
});

function DoctorPage() {
  const account = useRequireRole("patient");
  const { hospitals, doctors, activeProfile, updateProfile, hospitalById, doctorById } =
    useStore();
  const [query, setQuery] = useState("");
  const [selectedHospital, setSelectedHospital] = useState(
    activeProfile?.hospitalId ?? hospitals[0]!.id,
  );

  if (!account) return null;

  const filtered = hospitals.filter((h) =>
    (h.name + h.city).toLowerCase().includes(query.toLowerCase()),
  );
  const list = doctors.filter((d) => d.hospitalId === selectedHospital);
  const current = doctorById(activeProfile?.preferredDoctorId);

  return (
    <AppShell role="patient" nav={PATIENT_NAV}>
      <PageHeader
        title="My Doctor"
        description="Your preferred doctor is used automatically for every new case and follow-up."
      />

      {current ? (
        <div className="surface-card mb-6 flex flex-wrap items-center justify-between gap-4 p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Current preferred doctor
            </p>
            <p className="mt-1 text-lg font-semibold text-foreground">
              {current.name}
            </p>
            <p className="text-sm text-muted-foreground">
              {hospitalById(current.hospitalId)?.name} · {current.department}
            </p>
          </div>
          {!current.available ? (
            <p className="rounded-lg bg-warning/15 px-3 py-2 text-sm">
              This doctor is currently unavailable — you can choose another
              available doctor below.
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <section className="surface-card h-fit p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Search hospitals
          </h2>
          <Input
            className="mt-3"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Hospital or city"
          />
          <ul className="mt-4 space-y-2">
            {filtered.map((h) => (
              <li key={h.id}>
                <button
                  onClick={() => setSelectedHospital(h.id)}
                  className={
                    h.id === selectedHospital
                      ? "w-full rounded-xl bg-primary p-3 text-left text-primary-foreground"
                      : "w-full rounded-xl border border-border p-3 text-left hover:bg-muted"
                  }
                >
                  <p className="text-sm font-medium">{h.name}</p>
                  <p className="text-xs opacity-80">{h.city}</p>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          {list.map((d) => (
            <div key={d.id} className="surface-card flex flex-col p-5">
              <p className="text-lg font-semibold text-foreground">{d.name}</p>
              <p className="text-sm text-muted-foreground">{d.department}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {d.qualification} · {d.experienceYears} years
              </p>
              <span
                className={
                  d.available
                    ? "mt-3 inline-flex w-fit rounded-full bg-success/15 px-2.5 py-1 text-xs font-medium"
                    : "mt-3 inline-flex w-fit rounded-full bg-warning/20 px-2.5 py-1 text-xs font-medium"
                }
              >
                {d.available ? "Available" : "Unavailable"}
              </span>
              <Button
                className="mt-4"
                size="sm"
                disabled={!d.available || !activeProfile}
                onClick={() => {
                  if (!activeProfile) return;
                  updateProfile(activeProfile.id, {
                    hospitalId: d.hospitalId,
                    preferredDoctorId: d.id,
                  });
                  toast.success(`${d.name} saved as your preferred doctor.`);
                }}
              >
                {activeProfile?.preferredDoctorId === d.id
                  ? "Preferred doctor"
                  : "Save as my doctor"}
              </Button>
            </div>
          ))}
        </section>
      </div>
    </AppShell>
  );
}
