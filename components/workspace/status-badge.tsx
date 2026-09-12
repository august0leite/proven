import type { WorkspaceStatus } from "@/data/types";

type StatusBadgeProps = {
  status: WorkspaceStatus;
  label: string;
};

const statusStyles: Record<WorkspaceStatus, string> = {
  pending: "border-[#B77D2B]/25 bg-[#B77D2B]/10 text-[#7D5A24]",
  verified: "border-[#2F6B5A]/20 bg-[#2F6B5A]/10 text-[#244D42]",
  failed: "border-[#8E3636]/20 bg-[#8E3636]/8 text-[#6F2929]",
  revoked: "border-[#111111]/15 bg-[#111111]/5 text-[#111111]/70",
  expired: "border-[#8B6B2A]/20 bg-[#8B6B2A]/10 text-[#6D531E]",
  disputed: "border-[#5C4B7A]/20 bg-[#5C4B7A]/10 text-[#4B3A67]",
  ready: "border-[#2F6B5A]/20 bg-[#2F6B5A]/10 text-[#244D42]",
  settled: "border-[#111111]/15 bg-[#111111] text-white",
};

export function StatusBadge({ status, label }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${statusStyles[status]}`}>
      <span aria-hidden="true">●</span>
      {label}
    </span>
  );
}
