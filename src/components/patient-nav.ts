import type { NavItem } from "./app-shell";

export const PATIENT_NAV: NavItem[] = [
  { to: "/patient/dashboard", label: "Dashboard" },
  { to: "/patient/case/new", label: "New Case" },
  { to: "/patient/follow-up", label: "Follow-up" },
  { to: "/patient/history", label: "Medical History" },
  { to: "/patient/family", label: "Family Profiles" },
  { to: "/patient/doctor", label: "My Doctor" },
  { to: "/patient/profile", label: "Profile" },
];

export const DOCTOR_NAV: NavItem[] = [
  { to: "/doctor/dashboard", label: "Dashboard" },
  { to: "/doctor/cases", label: "All Cases" },
];

export const MANAGEMENT_NAV: NavItem[] = [
  { to: "/management/dashboard", label: "Dashboard" },
];
