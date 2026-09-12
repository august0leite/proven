"use client";

import { useState } from "react";
import { StatusBadge } from "@/components/workspace/status-badge";
import { formatDateTime } from "@/lib/format";
import type { Condition, Evidence, Locale, WorkspaceStatus } from "@/data/types";

type ConditionListProps = {
  conditions: Condition[];
  evidence: Evidence[];
  locale: Locale;
  title: string;
  ofLabel: string;
  progressLabel: string;
  statusLabel: string;
  evidenceLabel: string;
  issuedByLabel: string;
  attestationLabel: string;
  proofLabel: string;
  verifiedAtLabel: string;
  pendingLabel: string;
  statusLabels: Record<WorkspaceStatus, string>;
};

export function ConditionList({
  conditions,
  evidence,
  locale,
  title,
  ofLabel,
  progressLabel,
  statusLabel,
  evidenceLabel,
  issuedByLabel,
  attestationLabel,
  proofLabel,
  verifiedAtLabel,
  pendingLabel,
  statusLabels,
}: ConditionListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(conditions[0]?.id ?? null);
  const verifiedCount = conditions.filter((condition) => condition.status === "verified").length;

  return (
    <section className="rounded-[1.75rem] border border-black/10 bg-white p-6">
      <div className="flex flex-col gap-3 border-b border-black/10 pb-5 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[#111111]">{title}</h2>
          <p className="mt-2 text-sm text-[#111111]/60">
            {verifiedCount} {ofLabel} {conditions.length} {progressLabel}
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {conditions.map((condition) => {
          const linkedEvidence = evidence.find((item) => item.id === condition.evidenceId);
          const isExpanded = expandedId === condition.id;

          return (
            <div key={condition.id} className="rounded-[1.25rem] border border-black/10 bg-[#F7F6F2]">
              <button
                type="button"
                onClick={() => setExpandedId(isExpanded ? null : condition.id)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <div>
                  <div className="font-medium text-[#111111]">{condition.title}</div>
                  <div className="mt-1 text-sm text-[#111111]/60">{condition.description}</div>
                </div>
                <StatusBadge status={condition.status} label={statusLabels[condition.status]} />
              </button>

              {isExpanded ? (
                <div className="border-t border-black/10 px-5 py-4 text-sm text-[#111111]/75">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.2em] text-[#111111]/45">{statusLabel}</div>
                      <div className="mt-2 font-medium text-[#111111]">{statusLabels[condition.status]}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.2em] text-[#111111]/45">{evidenceLabel}</div>
                      <div className="mt-2 text-[#111111]">{condition.requiredEvidence}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.2em] text-[#111111]/45">{issuedByLabel}</div>
                      <div className="mt-2 text-[#111111]">{linkedEvidence?.issuer ?? condition.authorizedIssuer}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.2em] text-[#111111]/45">{attestationLabel}</div>
                      <div className="mt-2 text-[#111111]">{linkedEvidence?.attestation ?? condition.verificationMethod}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.2em] text-[#111111]/45">{proofLabel}</div>
                      <div className="mt-2 font-mono text-xs text-[#111111]">{linkedEvidence?.proof ?? pendingLabel}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.2em] text-[#111111]/45">{verifiedAtLabel}</div>
                      <div className="mt-2 text-[#111111]">
                        {condition.verifiedAt ? formatDateTime(condition.verifiedAt, locale) : pendingLabel}
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
