import { Link } from "@tanstack/react-router";
import { StatusBadge, TypeBadge } from "./status-badge";
import { useStore } from "@/lib/store";
import type { CaseRecord } from "@/lib/types";

export function CaseTable({ cases }: { cases: CaseRecord[] }) {
  const { profileById } = useStore();

  if (cases.length === 0) {
    return (
      <div className="surface-card p-6 text-sm text-muted-foreground">
        No cases here right now.
      </div>
    );
  }

  return (
    <div className="surface-card overflow-x-auto">
      <table className="w-full min-w-3xl text-left text-sm">
        <thead className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-5 py-3 font-medium">Patient</th>
            <th className="px-5 py-3 font-medium">Patient ID</th>
            <th className="px-5 py-3 font-medium">Complaint</th>
            <th className="px-5 py-3 font-medium">Type</th>
            <th className="px-5 py-3 font-medium">Status</th>
            <th className="px-5 py-3 font-medium">Date</th>
            <th className="px-5 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {cases.map((c) => {
            const p = profileById(c.profileId);
            return (
              <tr key={c.id} className="hover:bg-muted/50">
                <td className="px-5 py-3 font-medium text-foreground">
                  {p?.name ?? "—"}
                </td>
                <td className="px-5 py-3 text-muted-foreground">
                  {p?.patientId ?? "—"}
                </td>
                <td className="px-5 py-3 text-foreground">{c.chiefComplaint}</td>
                <td className="px-5 py-3">
                  <TypeBadge type={c.type} />
                </td>
                <td className="px-5 py-3">
                  <StatusBadge status={c.status} />
                </td>
                <td className="px-5 py-3 text-muted-foreground">
                  {new Date(c.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="px-5 py-3 text-right">
                  <Link
                    to="/doctor/case/$id"
                    params={{ id: c.id }}
                    className="font-medium text-primary hover:underline"
                  >
                    Open
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
