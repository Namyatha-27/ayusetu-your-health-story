import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import * as demo from "./demo-data";
import type {
  Account,
  CaseRecord,
  CaseStatus,
  ClinicalNote,
  Doctor,
  Hospital,
  PatientProfile,
  Role,
} from "./types";

const STORAGE_KEY = "ayusetu.state.v1";

interface AppState {
  accounts: Account[];
  profiles: PatientProfile[];
  cases: CaseRecord[];
  sessionAccountId: string | null;
  activeProfileId: string | null;
}

const initialState: AppState = {
  accounts: demo.accounts,
  profiles: demo.profiles,
  cases: demo.cases,
  sessionAccountId: null,
  activeProfileId: null,
};

interface StoreValue extends AppState {
  hospitals: Hospital[];
  doctors: Doctor[];
  account: Account | null;
  activeProfile: PatientProfile | null;
  ready: boolean;
  hospitalById: (id?: string) => Hospital | undefined;
  doctorById: (id?: string) => Doctor | undefined;
  profileById: (id?: string) => PatientProfile | undefined;
  caseById: (id?: string) => CaseRecord | undefined;
  myProfiles: PatientProfile[];
  signIn: (email: string, role: Role) => Account | null;
  signUp: (name: string, email: string, role: Role) => Account;
  signOut: () => void;
  setActiveProfile: (id: string) => void;
  addProfile: (
    data: Omit<PatientProfile, "id" | "patientId" | "ownerAccountId">,
  ) => PatientProfile;
  updateProfile: (id: string, patch: Partial<PatientProfile>) => void;
  addCase: (
    data: Omit<CaseRecord, "id" | "caseId" | "createdAt" | "notes" | "status">,
  ) => CaseRecord;
  updateCase: (id: string, patch: Partial<CaseRecord>) => void;
  setCaseStatus: (id: string, status: CaseStatus) => void;
  addNote: (id: string, note: Omit<ClinicalNote, "id" | "createdAt">) => void;
}

const StoreContext = createContext<StoreValue | null>(null);

function nextPatientId(profiles: PatientProfile[]) {
  const nums = profiles
    .map((p) => Number(p.patientId.replace("PT-", "")))
    .filter((n) => !Number.isNaN(n));
  return `PT-${Math.max(10000, ...nums) + Math.floor(Math.random() * 90) + 7}`;
}

function nextCaseId(cases: CaseRecord[]) {
  const nums = cases
    .map((c) => Number(c.caseId.split("-")[2]))
    .filter((n) => !Number.isNaN(n));
  const next = Math.max(0, ...nums) + 1;
  return `CS-2026-${String(next).padStart(4, "0")}`;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...initialState, ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state, ready]);

  const account =
    state.accounts.find((a) => a.id === state.sessionAccountId) ?? null;

  const myProfiles = useMemo(
    () =>
      account ? state.profiles.filter((p) => p.ownerAccountId === account.id) : [],
    [account, state.profiles],
  );

  const activeProfile =
    state.profiles.find((p) => p.id === state.activeProfileId) ??
    myProfiles[0] ??
    null;

  const signIn = useCallback(
    (email: string, role: Role) => {
      const found =
        state.accounts.find(
          (a) => a.email.toLowerCase() === email.trim().toLowerCase() && a.role === role,
        ) ?? state.accounts.find((a) => a.role === role) ?? null;
      if (found) {
        const first = state.profiles.find((p) => p.ownerAccountId === found.id);
        setState((s) => ({
          ...s,
          sessionAccountId: found.id,
          activeProfileId: first?.id ?? null,
        }));
      }
      return found;
    },
    [state.accounts, state.profiles],
  );

  const signUp = useCallback((name: string, email: string, role: Role) => {
    const acc: Account = {
      id: `a${Date.now()}`,
      name,
      email,
      role,
    };
    setState((s) => ({
      ...s,
      accounts: [...s.accounts, acc],
      sessionAccountId: acc.id,
      activeProfileId: null,
    }));
    return acc;
  }, []);

  const signOut = useCallback(
    () =>
      setState((s) => ({ ...s, sessionAccountId: null, activeProfileId: null })),
    [],
  );

  const addProfile: StoreValue["addProfile"] = useCallback(
    (data) => {
      const profile: PatientProfile = {
        ...data,
        id: `p${Date.now()}`,
        patientId: nextPatientId(state.profiles),
        ownerAccountId: state.sessionAccountId ?? "a1",
      };
      setState((s) => ({ ...s, profiles: [...s.profiles, profile] }));
      return profile;
    },
    [state.profiles, state.sessionAccountId],
  );

  const value: StoreValue = {
    ...state,
    ready,
    hospitals: demo.hospitals,
    doctors: demo.doctors,
    account,
    activeProfile,
    myProfiles,
    hospitalById: (id) => demo.hospitals.find((h) => h.id === id),
    doctorById: (id) => demo.doctors.find((d) => d.id === id),
    profileById: (id) => state.profiles.find((p) => p.id === id),
    caseById: (id) => state.cases.find((c) => c.id === id || c.caseId === id),
    signIn,
    signUp,
    signOut,
    setActiveProfile: (id) => setState((s) => ({ ...s, activeProfileId: id })),
    addProfile,
    updateProfile: (id, patch) =>
      setState((s) => ({
        ...s,
        profiles: s.profiles.map((p) => (p.id === id ? { ...p, ...patch } : p)),
      })),
    addCase: (data) => {
      const record: CaseRecord = {
        ...data,
        id: `c${Date.now()}`,
        caseId: nextCaseId(state.cases),
        createdAt: new Date().toISOString(),
        status: "submitted",
        notes: [],
      };
      setState((s) => ({ ...s, cases: [record, ...s.cases] }));
      return record;
    },
    updateCase: (id, patch) =>
      setState((s) => ({
        ...s,
        cases: s.cases.map((c) => (c.id === id ? { ...c, ...patch } : c)),
      })),
    setCaseStatus: (id, status) =>
      setState((s) => ({
        ...s,
        cases: s.cases.map((c) =>
          c.id === id
            ? status === "reviewed"
              ? { ...c, status, reviewedAt: new Date().toISOString() }
              : { ...c, status }
            : c,
        ),
      })),
    addNote: (id, note) =>
      setState((s) => ({
        ...s,
        cases: s.cases.map((c) =>
          c.id === id
            ? {
                ...c,
                notes: [
                  ...c.notes,
                  { ...note, id: `n${Date.now()}`, createdAt: new Date().toISOString() },
                ],
              }
            : c,
        ),
      })),
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}

export function ageFromDob(dob: string) {
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return "—";
  const diff = Date.now() - d.getTime();
  return String(Math.floor(diff / (365.25 * 24 * 3600 * 1000)));
}
