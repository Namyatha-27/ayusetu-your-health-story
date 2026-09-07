import { cn } from "@/lib/utils";
import type { CaseStatus, CaseType } from "@/lib/types";

const STATUS_LABEL: Record<CaseStatus, string> = {
  submitted: "Case submitted",
  reviewed: "Doctor reviewed",
  "consultation-pending": "Consultation pending",
  completed: "Consultation completed",
};

const STATUS_CLASS: Record<CaseStatus, string> = {
  submitted: "bg-secondary text-secondary-foreground",
  reviewed: "bg-accent-soft text-accent-foreground",
  "consultation-pending": "bg-warning/15 text-foreground",
  completed: "bg-success/15 text-foreground",
};

export function StatusBadge({
  status,
  className,
}: {
  status: CaseStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        STATUS_CLASS[status],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current opacity-70" />
      {STATUS_LABEL[status]}
    </span>
  );
}

export function TypeBadge({ type }: { type: CaseType }) {
  const label =
    type === "emergency" ? "EMERGENCY" : type === "follow-up" ? "Follow-up" : "New";
  return (
    <span
      className={cn(
        "inline-flex rounded-md border px-2 py-0.5 text-xs font-semibold",
        type === "emergency"
          ? "border-destructive/30 bg-destructive/10 text-destructive"
          : type === "follow-up"
            ? "border-accent/40 bg-accent-soft text-accent-foreground"
            : "border-border bg-muted text-muted-foreground",
      )}
    >
      {label}
    </span>
  );
}

export const CONSULTATION_STEPS: CaseStatus[] = [
  "submitted",
  "reviewed",
  "consultation-pending",
  "completed",
];

export function ConsultationProgress({
  status,
  vertical = false,
}: {
  status: CaseStatus;
  vertical?: boolean;
}) {
  const idx = CONSULTATION_STEPS.indexOf(status);
  return (
    <ol className={cn("grid gap-3", vertical ? "grid-cols-1" : "sm:grid-cols-4")}>

      {CONSULTATION_STEPS.map((step, i) => (
        <li key={step} className="flex items-start gap-2">
          <span
            className={cn(
              "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full text-[10px] font-bold",
              i <= idx
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground",
            )}
          >
            {i + 1}
          </span>
          <span
            className={cn(
              "text-sm",
              i <= idx ? "font-medium text-foreground" : "text-muted-foreground",
            )}
          >
            {STATUS_LABEL[step]}
          </span>
        </li>
      ))}
    </ol>
  );
}
