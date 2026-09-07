export type Role = "patient" | "doctor" | "management";

export type Language = "en" | "te" | "hi";

export interface Account {
  id: string;
  email: string;
  name: string;
  role: Role;
  /** doctor accounts link to a doctor record; management accounts link to a hospital */
  doctorId?: string;
  hospitalId?: string;
}

export interface Hospital {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  departments: string[];
  emergencyPhone: string;
}

export interface Doctor {
  id: string;
  name: string;
  hospitalId: string;
  department: string;
  qualification: string;
  experienceYears: number;
  available: boolean;
}

export interface PatientProfile {
  id: string;
  /** human readable unique id e.g. PT-10234 */
  patientId: string;
  ownerAccountId: string;
  name: string;
  relation: string; // "Self", "Grandfather", ...
  dob: string; // ISO date
  gender: "Male" | "Female" | "Other";
  phone: string;
  email?: string;
  bloodGroup?: string;
  allergies?: string;
  medications?: string;
  conditions?: string;
  hospitalId?: string;
  preferredDoctorId?: string;
}

export type CaseType = "new" | "follow-up" | "emergency";

export type CaseStatus =
  | "submitted"
  | "reviewed"
  | "consultation-pending"
  | "completed";

export interface ClinicalNote {
  id: string;
  author: string;
  text: string;
  createdAt: string;
  kind: "note" | "clarification";
}

export interface FollowUpAnswers {
  improved: string;
  previousSymptomsPresent: string;
  newSymptoms: string;
  changes: string;
  concerns: string;
}

export interface CaseRecord {
  id: string;
  caseId: string; // CS-2026-0012
  profileId: string;
  hospitalId: string;
  doctorId: string;
  type: CaseType;
  status: CaseStatus;
  language: Language;
  createdAt: string;
  reviewedAt?: string;
  parentCaseId?: string;
  chiefComplaint: string;
  duration: string;
  symptoms: string;
  severity: string;
  pastHistory: string;
  allergies: string;
  medications: string;
  familyHistory: string;
  other: string;
  aiSummary: string;
  followUp?: FollowUpAnswers;
  notes: ClinicalNote[];
}
