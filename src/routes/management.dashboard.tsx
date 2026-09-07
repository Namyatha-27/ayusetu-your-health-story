import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader, useRequireRole } from "@/components/app-shell";
import { MANAGEMENT_NAV } from "@/components/patient-nav";
import { StatusBadge, TypeBadge } from "@/components/status-badge";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/management/dashboard")({
  head: () => ({
    meta: [
      { title: "Hospital Management Dashboard — AyuSetu" },
      {
        name: "description",
        content:
          "Manage doctors, departments, availability, patients and case statistics for your hospital.",
      },
      { property: "og:title", content: "Hospital Management — AyuSetu" },
      {
        property: "og:description",
        content: "Doctors, departments, case statistics and emergency cases at a glance.",
      },
    ],
  }),
  component: ManagementDashboard,
});

function ManagementDashboard() {
  const account = useRequireRole("management");
  const { doctors, cases, profiles, hospitalById, profileById, doctorById } =
    useStore();
  if (!account) return null;

  const hospital = hospitalById(account.hospitalId);
  const hospitalDoctors = doctors.filter((d) => d.hospitalId === hospital?.id);
  const hospitalCases = cases.filter((c) => c.hospitalId === hospital?.id);
  const patientIds = new Set(hospitalCases.map((c) => c.profileId));
  const emergencies = hospitalCases.filter((c) => c.type === "emergency");

  const stats = [
    { label: "Doctors", value: hospitalDoctors.length },
    { label: "Patients", value: patientIds.size || profiles.length },
    { label: "Departments", value: hospital?.departments.length ?? 0 },
    { label: "Total cases", value: hospitalCases.length },
    { label: "Emergency cases", value: emergencies.length },
  ];

  return (
    <AppShell role="management" nav={MANAGEMENT_NAV}>
      <PageHeader
        title={hospital?.name ?? "Hospital management"}
        description={`${hospital?.address ?? ""} · ${hospital?.phone ?? ""}`}
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

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="surface-card p-6">
          <h2 className="text-lg font-semibold text-foreground">
            Doctors & availability
          </h2>
          <ul className="mt-4 divide-y divide-border">
            {hospitalDoctors.map((d) => (
              <li key={d.id} className="flex items-center justify-between gap-3 py-3">
                <div>
                  <p className="font-medium text-foreground">{d.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {d.department} · {d.experienceYears} years
                  </p>
                </div>
                <span
                  className={
                    d.available
                      ? "rounded-full bg-success/15 px-2.5 py-1 text-xs font-medium"
                      : "rounded-full bg-warning/20 px-2.5 py-1 text-xs font-medium"
                  }
                >
                  {d.available ? "Available" : "Unavailable"}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="surface-card p-6">
          <h2 className="text-lg font-semibold text-foreground">Departments</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {hospital?.departments.map((dep) => (
              <span
                key={dep}
                className="rounded-full border border-border px-3 py-1.5 text-sm text-muted-foreground"
              >
                {dep}
              </span>
            ))}
          </div>
          <h2 className="mt-8 text-lg font-semibold text-foreground">
            Hospital information
          </h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">City</dt>
              <dd className="font-medium text-foreground">{hospital?.city}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Reception</dt>
              <dd className="font-medium text-foreground">{hospital?.phone}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Emergency line</dt>
              <dd className="font-medium text-foreground">
                {hospital?.emergencyPhone}
              </dd>
            </div>
          </dl>
        </section>
      </div>

      <section className="mt-8 surface-card p-6">
        <h2 className="text-lg font-semibold text-foreground">Case workflow</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-3xl text-left text-sm">
            <thead className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="py-3 pr-4 font-medium">Case</th>
                <th className="py-3 pr-4 font-medium">Patient</th>
                <th className="py-3 pr-4 font-medium">Doctor</th>
                <th className="py-3 pr-4 font-medium">Type</th>
                <th className="py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {hospitalCases.map((c) => (
                <tr key={c.id}>
                  <td className="py-3 pr-4 font-medium text-foreground">
                    {c.caseId}
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground">
                    {profileById(c.profileId)?.name}
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground">
                    {doctorById(c.doctorId)?.name}
                  </td>
                  <td className="py-3 pr-4">
                    <TypeBadge type={c.type} />
                  </td>
                  <td className="py-3">
                    <StatusBadge status={c.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AppShell>
  );
}
