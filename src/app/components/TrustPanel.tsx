"use client";

type Role = "Admin" | "HRBP" | "Manager" | "Recruiter";

type AuditLog = {
  id: string;
  ts: string;
  actorRole: Role;
  action: string;
  target: string;
};

type Props = {
  logs: AuditLog[];
};

function fmtTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function TrustPanel({ logs }: Props) {
  return (
    <div className="space-y-4">
      {/* RBAC */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-950/30 p-4">
        <div className="text-sm font-semibold">Role-Based Access Control</div>
        <div className="mt-1 text-xs text-neutral-400">
          Permissions enforced at read & action level.
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          {(["Admin", "HRBP", "Manager", "Recruiter"] as Role[]).map((role) => (
            <div
              key={role}
              className="rounded-xl border border-neutral-800 bg-neutral-900/30 p-3"
            >
              <div className="text-sm font-semibold">{role}</div>
              <div className="mt-1 text-xs text-neutral-400">
                {role === "Admin" && "Full system access"}
                {role === "HRBP" && "People + workflows"}
                {role === "Manager" && "Team-only visibility"}
                {role === "Recruiter" && "Hiring pipeline only"}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Audit logs */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-950/30 p-4">
        <div className="text-sm font-semibold">Audit Logs</div>
        <div className="mt-1 text-xs text-neutral-400">
          Every access is tracked for compliance.
        </div>

        <div className="mt-3 space-y-2">
          {logs.map((l) => (
            <div
              key={l.id}
              className="rounded-xl border border-neutral-800 bg-neutral-900/20 p-3"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="text-xs text-neutral-300">
                  <span className="font-semibold">{l.actorRole}</span>{" "}
                  {l.action}
                </div>
                <div className="text-[10px] text-neutral-500">
                  {fmtTime(l.ts)}
                </div>
              </div>
              <div className="mt-1 text-xs text-neutral-400">
                Target: <span className="text-neutral-200">{l.target}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data retention */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-950/30 p-4">
        <div className="text-sm font-semibold">Data Retention</div>
        <div className="mt-1 text-xs text-neutral-400">
          GDPR-aligned retention controls.
        </div>

        <div className="mt-3 rounded-xl border border-neutral-800 bg-neutral-900/20 p-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">PII & Chat Transcripts</div>
            <span className="rounded-full bg-lime-400/15 px-2 py-1 text-[10px] font-semibold text-lime-200 ring-1 ring-lime-400/25">
              Active
            </span>
          </div>

          <div className="mt-2 text-xs text-neutral-400">
            Retention period:{" "}
            <span className="text-neutral-200">180 days</span>
          </div>

          <div className="mt-1 text-xs text-neutral-500">
            Automatic deletion enforced after expiry.
          </div>
        </div>
      </div>
    </div>
  );
}
