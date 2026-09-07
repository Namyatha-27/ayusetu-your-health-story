import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Wordmark } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/emergency")({
  head: () => ({
    meta: [
      { title: "Emergency Help — AyuSetu" },
      {
        name: "description",
        content:
          "In a medical emergency, seek immediate medical attention. Find emergency hospitals and contact numbers quickly.",
      },
      { property: "og:title", content: "Emergency Help — AyuSetu" },
      {
        property: "og:description",
        content:
          "Emergency contacts and nearby hospital details. Do not wait for digital case taking in an emergency.",
      },
    ],
  }),
  component: EmergencyPage,
});

function EmergencyPage() {
  const { hospitals, doctors, activeProfile, addCase } = useStore();
  const [complaint, setComplaint] = useState("");
  const [hospitalId, setHospitalId] = useState(hospitals[0]!.id);
  const [sent, setSent] = useState<string | null>(null);

  function alertHospital() {
    if (!activeProfile) {
      toast.error("Log in as a patient to alert the hospital.");
      return;
    }
    const doctor =
      doctors.find((d) => d.hospitalId === hospitalId && d.available) ??
      doctors[0]!;
    const record = addCase({
      profileId: activeProfile.id,
      hospitalId,
      doctorId: doctor.id,
      type: "emergency",
      language: "en",
      chiefComplaint: complaint || "Emergency assistance requested",
      duration: "Ongoing",
      symptoms: complaint,
      severity: "Severe",
      pastHistory: activeProfile.conditions ?? "Not provided",
      allergies: activeProfile.allergies ?? "Not provided",
      medications: activeProfile.medications ?? "Not provided",
      familyHistory: "Not provided",
      other: "Emergency alert raised from AyuSetu emergency mode.",
      aiSummary: `EMERGENCY ALERT: ${activeProfile.name} (${activeProfile.patientId}) reporting ${complaint || "an emergency"}. Flagged high priority.`,
    });
    setSent(record.caseId);
    toast.success("Emergency alert sent to the hospital.");
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Wordmark />
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
            Back to home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="rounded-3xl border border-destructive/30 bg-destructive/5 p-6 sm:p-8">
          <h1 className="text-3xl font-semibold text-destructive">🚨 EMERGENCY</h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-foreground">
            Do not wait for digital case taking in a medical emergency. Seek
            immediate medical attention.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg" variant="destructive">
              <a href="tel:108">📞 Call ambulance — 108</a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="tel:112">Emergency services — 112</a>
            </Button>
          </div>
        </div>

        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="surface-card p-6">
            <h2 className="text-lg font-semibold text-foreground">
              Find an emergency hospital
            </h2>
            <ul className="mt-4 space-y-3">
              {hospitals.map((h) => (
                <li key={h.id} className="rounded-xl border border-border p-4">
                  <p className="font-medium text-foreground">{h.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{h.address}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button asChild size="sm" variant="outline">
                      <a href={`tel:${h.emergencyPhone.replace(/\s/g, "")}`}>
                        Emergency line
                      </a>
                    </Button>
                    <Button asChild size="sm" variant="ghost">
                      <a
                        href={`https://www.google.com/maps/search/${encodeURIComponent(h.name + " " + h.city)}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Directions
                      </a>
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="surface-card p-6">
            <h2 className="text-lg font-semibold text-foreground">
              Alert a hospital while you travel
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Optional. This sends a high-priority alert — it never replaces
              calling for help.
            </p>
            {sent ? (
              <div className="mt-6 rounded-xl border border-destructive/30 bg-destructive/10 p-4">
                <p className="font-semibold text-destructive">
                  🚨 EMERGENCY — HIGH PRIORITY
                </p>
                <p className="mt-1 text-sm text-foreground">
                  Alert {sent} sent. Proceed to the hospital immediately.
                </p>
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="hospital">Hospital</Label>
                  <select
                    id="hospital"
                    value={hospitalId}
                    onChange={(e) => setHospitalId(e.target.value)}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    {hospitals.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.name} · {h.city}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="complaint">What is happening?</Label>
                  <Input
                    id="complaint"
                    value={complaint}
                    onChange={(e) => setComplaint(e.target.value)}
                    placeholder="e.g. severe chest pain and breathlessness"
                  />
                </div>
                <Button variant="destructive" className="w-full" onClick={alertHospital}>
                  Send high-priority alert
                </Button>
                {!activeProfile ? (
                  <p className="text-xs text-muted-foreground">
                    <Link to="/patient/login" className="underline">
                      Log in as a patient
                    </Link>{" "}
                    to attach your profile to the alert.
                  </p>
                ) : null}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
