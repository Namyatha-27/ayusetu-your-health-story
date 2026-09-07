import { createFileRoute } from "@tanstack/react-router";
import { AuthForm } from "@/components/auth-form";

export const Route = createFileRoute("/patient/login")({
  head: () => ({
    meta: [
      { title: "Patient Login — AyuSetu" },
      {
        name: "description",
        content:
          "Log in or sign up as a patient to share your health story, manage family profiles and follow-ups.",
      },
      { property: "og:title", content: "Patient Login — AyuSetu" },
      {
        property: "og:description",
        content: "Access your AyuSetu patient dashboard and medical history.",
      },
    ],
  }),
  component: () => (
    <AuthForm
      role="patient"
      title="Patient sign in"
      subtitle="Access your cases, family profiles and medical history."
      redirectTo="/patient/dashboard"
      demoHint="namyatha@demo.in"
    />
  ),
});
