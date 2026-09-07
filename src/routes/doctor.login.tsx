import { createFileRoute } from "@tanstack/react-router";
import { AuthForm } from "@/components/auth-form";

export const Route = createFileRoute("/doctor/login")({
  head: () => ({
    meta: [
      { title: "Doctor Login — AyuSetu" },
      {
        name: "description",
        content:
          "Doctors sign in to review structured patient cases, history and follow-ups before consultation.",
      },
      { property: "og:title", content: "Doctor Login — AyuSetu" },
      {
        property: "og:description",
        content: "Review prepared patient cases before your OPD consultations.",
      },
    ],
  }),
  component: () => (
    <AuthForm
      role="doctor"
      title="Doctor sign in"
      subtitle="Review prepared cases before your consultations."
      redirectTo="/doctor/dashboard"
      demoHint="ravi@demo.in"
      allowSignup={false}
    />
  ),
});
