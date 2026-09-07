import { createFileRoute } from "@tanstack/react-router";
import { AuthForm } from "@/components/auth-form";

export const Route = createFileRoute("/management/login")({
  head: () => ({
    meta: [
      { title: "Hospital Management Login — AyuSetu" },
      {
        name: "description",
        content:
          "Hospital administrators sign in to manage doctors, departments, availability and case workflows.",
      },
      { property: "og:title", content: "Hospital Management Login — AyuSetu" },
      {
        property: "og:description",
        content: "Manage doctors, departments and hospital case statistics.",
      },
    ],
  }),
  component: () => (
    <AuthForm
      role="management"
      title="Hospital management sign in"
      subtitle="Manage doctors, departments and case workflows."
      redirectTo="/management/dashboard"
      demoHint="admin@sunrise.in"
      allowSignup={false}
    />
  ),
});
