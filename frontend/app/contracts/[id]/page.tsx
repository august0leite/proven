"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/workspace/app-shell";
import { ConditionList } from "@/components/workspace/condition-list";
import { EvidenceTimeline } from "@/components/workspace/evidence-timeline";
import { StatusBadge } from "@/components/workspace/status-badge";
import { translations, useStoredLocale } from "@/app/i18n/client";
import type { ContractDetail } from "@/data/types";
import { mockUser } from "@/data/users/mockUser";
import { fetchProvenContractDetail } from "@/lib/blockchain/contracts";
import { formatCurrency } from "@/lib/format";

export default function ContractDetailPage() {
  const params = useParams<{ id: string }>();
  const contractId = Array.isArray(params.id) ? params.id[0] : params.id;
  const { locale, setLocale } = useStoredLocale("pt");
  const t = translations[locale].contractDetail;
  const shellText = translations[locale].shell;
  const statusLabels = translations[locale].statuses;
  const [contract, setContract] = useState<ContractDetail | null>(null);
  const [isSettlementOpen, setIsSettlementOpen] = useState(false);

  useEffect(() => {
    if (!contractId) {
      return;
    }

    let active = true;

    fetchProvenContractDetail(contractId)
      .then((nextContract) => {
        if (active) {
          setContract(nextContract);
        }
      })
      .catch(() => {
        if (active) {
          setContract(null);
        }
      });

    return () => {
      active = false;
    };
  }, [contractId]);

  const currentFlowIndex = useMemo(() => {
    if (!contract) {
      return 0;
    }

    if (contract.status === "ready" || contract.status === "settled") {
      return 5;
    }

    if (contract.totalConditions === 0) {
      return 0;
    }

    if (contract.verifiedConditions === contract.totalConditions) {
      return 4;
    }

    if (contract.verifiedConditions > 0) {
      return 3;
    }

    if (contract.conditions.length > 0 || contract.evidence.length > 0) {
      return 2;
    }

    return 1;
  }, [contract]);

  if (!contract) {
    return (
      <AppShell
        locale={locale}
        setLocale={setLocale}
        currentSection="contracts"
        pageTitle={translations[locale].contractsPage.title}
        user={mockUser}
        attentionCount={0}
        shellText={shellText}
      >
        <div className="rounded-[1.75rem] border border-black/10 bg-white p-8 text-center">
          <p className="text-base text-[#111111]/70">{t.notFound}</p>
          <Link
            href="/contracts"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-[#111111] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#2F6B5A]"
          >
            {t.back}
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      locale={locale}
      setLocale={setLocale}
      currentSection="contracts"
      pageTitle={contract.name}
      user={mockUser}
      attentionCount={0}
      shellText={shellText}
    >
      <section className="space-y-8 pb-16 lg:pb-0">
        <Link href="/contracts" className="inline-flex items-center text-sm font-medium text-[#111111]/65 transition hover:text-[#111111]">
          ← {t.back}
        </Link>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[1.75rem] border border-black/10 bg-white p-6 md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 className="text-4xl font-semibold tracking-[-0.05em] text-[#111111]">{contract.name}</h2>
                <p className="mt-3 max-w-2xl text-base leading-7 text-[#111111]/65">{contract.description}</p>
              </div>
              <StatusBadge status={contract.status} label={statusLabels[contract.status]} />
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-[1.25rem] border border-black/10 bg-[#F7F6F2] p-5">
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#111111]/45">{translations[locale].contractCreate.form.contractValue}</div>
                <div className="mt-2 text-lg font-semibold text-[#111111]">{formatCurrency(contract.value, contract.currency, locale)}</div>
              </div>
              <div className="rounded-[1.25rem] border border-black/10 bg-[#F7F6F2] p-5">
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#111111]/45">{translations[locale].contractCreate.form.buyer}</div>
                <div className="mt-2 text-lg font-semibold text-[#111111]">{contract.buyer.name}</div>
              </div>
              <div className="rounded-[1.25rem] border border-black/10 bg-[#F7F6F2] p-5">
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#111111]/45">{translations[locale].contractCreate.form.seller}</div>
                <div className="mt-2 text-lg font-semibold text-[#111111]">{contract.seller.name}</div>
              </div>
            </div>

            <div className="mt-8 rounded-[1.5rem] border border-black/10 bg-[#F7F6F2] p-5">
              <div className="text-[10px] uppercase tracking-[0.2em] text-[#111111]/45">{t.contractState}</div>
              <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <div className="text-2xl font-semibold tracking-[-0.04em] text-[#111111]">{statusLabels[contract.status]}</div>
                  <p className="mt-2 text-sm text-[#111111]/65">
                    {contract.verifiedConditions} {translations[locale].common.of} {contract.totalConditions} {t.conditionsProgress}
                  </p>
                </div>
                <StatusBadge status={contract.status} label={statusLabels[contract.status]} />
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {t.stateFlow.map((item, index) => {
                  const isActive = index <= currentFlowIndex;

                  return (
                    <div
                      key={item}
                      className={`min-w-[120px] flex-1 rounded-2xl border px-3 py-3 text-center text-[11px] font-medium leading-4 ${
                        isActive
                          ? "border-[#111111] bg-white text-[#111111] shadow-sm"
                          : "border-black/10 bg-transparent text-[#111111]/45"
                      }`}
                    >
                      <div className="mb-2 inline-flex size-6 items-center justify-center rounded-full border border-current text-[10px]">
                        {index + 1}
                      </div>
                      <div>{item}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-black/10 bg-white p-6 md:p-8">
            {contract.status === "ready" || contract.status === "settled" ? (
              <>
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#111111]/45">{statusLabels.ready}</div>
                <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[#111111]">{statusLabels.ready}</h3>
                <p className="mt-3 text-base leading-7 text-[#111111]/65">{t.allConditionsVerified}</p>
                <button
                  type="button"
                  onClick={() => setIsSettlementOpen(true)}
                  className="mt-6 inline-flex items-center justify-center rounded-full bg-[#111111] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#2F6B5A]"
                >
                  {t.proceedSettlement}
                </button>
              </>
            ) : (
              <>
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#111111]/45">{t.contractState}</div>
                <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[#111111]">
                  {contract.totalConditions === 0 ? t.stateFlow[0] : t.stateFlow[Math.max(currentFlowIndex, 0)]}
                </h3>
                <p className="mt-3 text-base leading-7 text-[#111111]/65">
                  {contract.totalConditions === 0
                    ? "Este contrato foi criado na blockchain, mas ainda não possui condições registradas."
                    : `${contract.verifiedConditions} de ${contract.totalConditions} condições já foram validadas.`}
                </p>
              </>
            )}
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <ConditionList
            conditions={contract.conditions}
            evidence={contract.evidence}
            locale={locale}
            title={t.conditions}
            ofLabel={translations[locale].common.of}
            progressLabel={t.conditionsProgress}
            statusLabel={t.status}
            evidenceLabel={t.evidence}
            issuedByLabel={t.issuedBy}
            attestationLabel={t.attestation}
            proofLabel={t.proof}
            verifiedAtLabel={t.verifiedAt}
            pendingLabel={t.pendingProof}
            statusLabels={statusLabels}
          />

          <EvidenceTimeline
            evidence={contract.evidence}
            locale={locale}
            title={t.evidence}
            statusLabel={t.status}
            issuedByLabel={`${t.issuedBy} `}
            issuedAtLabel={t.issuedAt}
            evidenceSourceLabel={t.evidenceSource}
            attestationLabel={t.attestation}
            schemaLabel={t.schema}
            proofLabel={t.proof}
            verificationLabel={t.verification}
            statusLabels={statusLabels}
          />
        </div>

        {isSettlementOpen ? (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#111111]/35 px-4">
            <div className="w-full max-w-lg rounded-[1.75rem] border border-black/10 bg-white p-6 shadow-[0_24px_80px_rgba(17,17,17,0.15)]">
              <h3 className="text-2xl font-semibold tracking-[-0.04em] text-[#111111]">{t.settlementTitle}</h3>
              <p className="mt-3 text-base leading-7 text-[#111111]/65">{t.settlementBody}</p>
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsSettlementOpen(false)}
                  className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-medium text-[#111111] transition hover:border-[#111111]/20"
                >
                  {t.close}
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </section>
    </AppShell>
  );
}
