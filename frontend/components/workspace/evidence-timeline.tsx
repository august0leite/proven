import { StatusBadge } from "@/components/workspace/status-badge";
import { formatDateTime, formatShortDate } from "@/lib/format";
import type { Evidence, Locale, WorkspaceStatus } from "@/data/types";

type EvidenceTimelineProps = {
  evidence: Evidence[];
  locale: Locale;
  title: string;
  statusLabel: string;
  issuedByLabel: string;
  issuedAtLabel: string;
  evidenceSourceLabel: string;
  attestationLabel: string;
  schemaLabel: string;
  proofLabel: string;
  verificationLabel: string;
  statusLabels: Record<WorkspaceStatus, string>;
};

export function EvidenceTimeline({
  evidence,
  locale,
  title,
  statusLabel,
  issuedByLabel,
  issuedAtLabel,
  evidenceSourceLabel,
  attestationLabel,
  schemaLabel,
  proofLabel,
  verificationLabel,
  statusLabels,
}: EvidenceTimelineProps) {
  const sortedEvidence = [...evidence].sort((left, right) => {
    return new Date(right.issuedAt).getTime() - new Date(left.issuedAt).getTime();
  });

  if (sortedEvidence.length === 0) {
    return (
      <section className="rounded-[1.75rem] border border-black/10 bg-white p-6">
        <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[#111111]">{title}</h2>
        <div className="mt-6 rounded-[1.25rem] border border-dashed border-black/15 bg-[#F7F6F2] p-6 text-sm text-[#111111]/60">
          Nenhuma evidência foi enviada para este contrato ainda.
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-[1.75rem] border border-black/10 bg-white p-6">
      <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[#111111]">{title}</h2>

      <div className="mt-6 space-y-4">
        {sortedEvidence.map((item) => (
          <div key={item.id} className="rounded-[1.25rem] border border-black/10 bg-[#F7F6F2] p-5">
            <div className="text-[10px] uppercase tracking-[0.2em] text-[#111111]/45">{formatShortDate(item.issuedAt, locale)}</div>
            <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="font-medium text-[#111111]">{item.title}</div>
                <div className="mt-1 text-sm text-[#111111]/60">
                  {issuedByLabel} {item.issuer}
                </div>
              </div>
              <StatusBadge status={item.status} label={statusLabels[item.status]} />
            </div>

            <div className="mt-5 grid gap-4 text-sm text-[#111111]/75 md:grid-cols-2">
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#111111]/45">{statusLabel}</div>
                <div className="mt-2 text-[#111111]">{statusLabels[item.status]}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#111111]/45">{issuedAtLabel}</div>
                <div className="mt-2 text-[#111111]">{formatDateTime(item.issuedAt, locale)}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#111111]/45">{evidenceSourceLabel}</div>
                <div className="mt-2 text-[#111111]">{item.source}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#111111]/45">{attestationLabel}</div>
                <div className="mt-2 text-[#111111]">{item.attestation}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#111111]/45">{schemaLabel}</div>
                <div className="mt-2 text-[#111111]">{item.schema}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#111111]/45">{verificationLabel}</div>
                <div className="mt-2 text-[#111111]">{item.verification}</div>
              </div>
              <div className="md:col-span-2">
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#111111]/45">{proofLabel}</div>
                <div className="mt-2 font-mono text-xs text-[#111111]">{item.proof}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
