import type { CaseRecord, Language, PatientProfile } from "./types";
import { ageFromDob } from "./store";

/**
 * Rule-based adaptive case-taking engine.
 * This stands in for a server-side AI assistant. It never diagnoses and never
 * suggests medicines — it only decides which information is still missing and
 * organises the patient's own words into a structured case.
 */

export type CaseField =
  | "chiefComplaint"
  | "duration"
  | "symptoms"
  | "severity"
  | "pastHistory"
  | "allergies"
  | "medications"
  | "familyHistory"
  | "other";

export interface Question {
  field: CaseField;
  prompt: Record<Language, string>;
  hint?: string;
  chips?: string[];
}

const BASE: Question[] = [
  {
    field: "chiefComplaint",
    prompt: {
      en: "What brings you here today?",
      te: "ఈ రోజు మీకు ఏ సమస్య ఉంది?",
      hi: "आज आपको क्या तकलीफ़ है?",
    },
    hint: "Describe the problem in your own words.",
  },
  {
    field: "duration",
    prompt: {
      en: "How long have you had this problem?",
      te: "ఈ సమస్య ఎంత కాలంగా ఉంది?",
      hi: "यह समस्या कब से है?",
    },
    chips: ["Today", "2–3 days", "About a week", "More than a month"],
  },
  {
    field: "symptoms",
    prompt: {
      en: "Are you experiencing anything else along with this?",
      te: "దీనితో పాటు ఇంకా ఏమైనా ఇబ్బందులు ఉన్నాయా?",
      hi: "इसके साथ और कोई परेशानी है?",
    },
    hint: "For example: headache, tiredness, nausea, cough.",
  },
  {
    field: "severity",
    prompt: {
      en: "How much is it affecting your daily activities?",
      te: "ఇది మీ రోజువారీ పనులను ఎంత ప్రభావితం చేస్తోంది?",
      hi: "यह आपके रोज़ के कामों को कितना प्रभावित कर रहा है?",
    },
    chips: ["Mild", "Moderate", "Severe"],
  },
  {
    field: "pastHistory",
    prompt: {
      en: "Have you had this problem or any other illness before?",
      te: "గతంలో ఈ సమస్య లేదా వేరే ఆరోగ్య సమస్యలు ఉన్నాయా?",
      hi: "क्या पहले भी यह या कोई और बीमारी रही है?",
    },
    chips: ["No past illness"],
  },
  {
    field: "allergies",
    prompt: {
      en: "Do you have any known allergies?",
      te: "మీకు ఏమైనా అలర్జీలు ఉన్నాయా?",
      hi: "क्या आपको किसी चीज़ से एलर्जी है?",
    },
    chips: ["No known allergies"],
  },
  {
    field: "medications",
    prompt: {
      en: "Are you taking any medicines at the moment?",
      te: "ప్రస్తుతం ఏమైనా మందులు వాడుతున్నారా?",
      hi: "क्या आप अभी कोई दवा ले रहे हैं?",
    },
    chips: ["Not taking any medicines"],
  },
  {
    field: "familyHistory",
    prompt: {
      en: "Does anyone in your family have a long-term health condition?",
      te: "మీ కుటుంబంలో ఎవరికైనా దీర్ఘకాలిక ఆరోగ్య సమస్యలు ఉన్నాయా?",
      hi: "क्या परिवार में किसी को कोई पुरानी बीमारी है?",
    },
    chips: ["Not known", "Diabetes", "Blood pressure", "Asthma"],
  },
  {
    field: "other",
    prompt: {
      en: "Anything else you would like your doctor to know?",
      te: "డాక్టర్‌కు తెలియజేయాలనుకుంటున్న మరేదైనా విషయం?",
      hi: "क्या डॉक्टर को कुछ और बताना चाहेंगे?",
    },
    chips: ["Nothing else"],
  },
];

/** Extra questions triggered by what the patient already said. */
const ADAPTIVE: { match: RegExp; question: Question }[] = [
  {
    match: /fever|జ్వర|बुखार/i,
    question: {
      field: "other",
      prompt: {
        en: "Is the fever continuous, or does it come and go? Any chills or vomiting?",
        te: "జ్వరం నిరంతరం ఉందా లేదా వస్తూ పోతుందా? చలి లేదా వాంతులు ఉన్నాయా?",
        hi: "बुखार लगातार है या आता-जाता है? ठंड लगना या उल्टी?",
      },
    },
  },
  {
    match: /cough|breath|chest|దగ్గు|खांसी|सांस/i,
    question: {
      field: "other",
      prompt: {
        en: "Is there any difficulty in breathing, or is the cough with phlegm?",
        te: "ఊపిరి తీసుకోవడంలో ఇబ్బంది ఉందా? దగ్గులో కఫం వస్తోందా?",
        hi: "सांस लेने में तकलीफ़ है या खांसी में बलगम आता है?",
      },
    },
  },
  {
    match: /pain|నొప్పి|दर्द/i,
    question: {
      field: "other",
      prompt: {
        en: "Where exactly is the pain, and does it move to any other area?",
        te: "నొప్పి ఎక్కడ ఉంది? ఇది వేరే ప్రాంతానికి వ్యాపిస్తోందా?",
        hi: "दर्द कहाँ है और क्या यह कहीं और फैलता है?",
      },
    },
  },
  {
    match: /stomach|loose|vomit|కడుపు|पेट|उल्टी/i,
    question: {
      field: "other",
      prompt: {
        en: "How many times a day, and are you able to keep fluids down?",
        te: "రోజుకు ఎన్నిసార్లు? ద్రవాలు తీసుకోగలుగుతున్నారా?",
        hi: "दिन में कितनी बार? क्या आप तरल पदार्थ ले पा रहे हैं?",
      },
    },
  },
];

export function buildQuestionFlow(firstAnswer: string): Question[] {
  const extras = ADAPTIVE.filter((a) => a.match.test(firstAnswer)).map(
    (a) => a.question,
  );
  const [first, ...rest] = BASE;
  return [first!, ...extras.slice(0, 2), ...rest];
}

export const CASE_FIELDS: { field: CaseField; label: string; critical: boolean }[] = [
  { field: "chiefComplaint", label: "Chief complaint", critical: true },
  { field: "duration", label: "Duration", critical: true },
  { field: "symptoms", label: "Symptoms", critical: true },
  { field: "severity", label: "Severity", critical: false },
  { field: "pastHistory", label: "Past medical history", critical: false },
  { field: "allergies", label: "Allergy information", critical: false },
  { field: "medications", label: "Current medication information", critical: false },
  { field: "familyHistory", label: "Family history", critical: false },
  { field: "other", label: "Other relevant information", critical: false },
];

export function assessCompleteness(answers: Partial<Record<CaseField, string>>) {
  const filled = CASE_FIELDS.filter((f) => (answers[f.field] ?? "").trim().length > 1);
  const missing = CASE_FIELDS.filter(
    (f) => (answers[f.field] ?? "").trim().length <= 1,
  );
  const percent = Math.round((filled.length / CASE_FIELDS.length) * 100);
  return { percent, missing };
}

/** Composes a short, doctor-facing summary. Never diagnostic, never prescriptive. */
export function generateSummary(
  profile: PatientProfile,
  answers: Partial<Record<CaseField, string>>,
): string {
  const age = ageFromDob(profile.dob);
  const parts: string[] = [];
  parts.push(
    `${age}-year-old ${profile.gender.toLowerCase()} patient presenting with ${
      answers.chiefComplaint?.trim() || "an unspecified complaint"
    }${answers.duration ? ` for ${answers.duration.trim().toLowerCase()}` : ""}.`,
  );
  if (answers.symptoms?.trim())
    parts.push(`Associated complaints: ${answers.symptoms.trim()}.`);
  if (answers.severity?.trim())
    parts.push(`Reported severity: ${answers.severity.trim()}.`);
  if (answers.pastHistory?.trim())
    parts.push(`Past history: ${answers.pastHistory.trim()}.`);
  if (answers.allergies?.trim()) parts.push(`Allergies: ${answers.allergies.trim()}.`);
  if (answers.medications?.trim())
    parts.push(`Current medication: ${answers.medications.trim()}.`);
  if (answers.familyHistory?.trim())
    parts.push(`Family history: ${answers.familyHistory.trim()}.`);
  if (answers.other?.trim()) parts.push(`Additional notes: ${answers.other.trim()}.`);
  return parts.join(" ");
}

export function generateFollowUpSummary(
  profile: PatientProfile,
  previous: CaseRecord,
  fu: {
    improved: string;
    previousSymptomsPresent: string;
    newSymptoms: string;
    changes: string;
    concerns: string;
  },
): string {
  const age = ageFromDob(profile.dob);
  return [
    `${age}-year-old patient on follow-up for ${previous.chiefComplaint.toLowerCase()} (case ${previous.caseId}).`,
    fu.improved ? `Overall status: ${fu.improved}.` : "",
    fu.previousSymptomsPresent
      ? `Previous symptoms: ${fu.previousSymptomsPresent}.`
      : "",
    fu.newSymptoms ? `New symptoms reported: ${fu.newSymptoms}.` : "",
    fu.changes ? `Changes since last visit: ${fu.changes}.` : "",
    fu.concerns ? `Patient concerns: ${fu.concerns}.` : "",
  ]
    .filter(Boolean)
    .join(" ");
}

export const LANGUAGES: { code: Language; label: string }[] = [
  { code: "en", label: "English" },
  { code: "te", label: "తెలుగు" },
  { code: "hi", label: "हिंदी" },
];
