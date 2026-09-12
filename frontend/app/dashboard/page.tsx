"use client";

import Link from "next/link";
import { AppShell } from "@/components/workspace/app-shell";
import { ContractList } from "@/components/workspace/contract-list";
import { EmptyState } from "@/components/workspace/empty-state";
import { StatusBadge } from "@/components/workspace/status-badge";
import { translations, useStoredLocale } from "@/app/i18n/client";
import { contractsNeedingAttention, mockContracts } from "@/data/contracts/mockContracts";
import { mockUser } from "@/data/users/mockUser";

export default function DashboardPage() {
  const { locale, setLocale } = useStoredLocale("pt");
  const t = translations[locale].dashboard;
  const shellText = translations[locale].shell;
  const statusLabels = translations[locale].statuses;
  const recentContracts = [...mockContracts]
    .sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime())
    .slice(0, 4);
  const completedCount = mockContracts.filter(
    (contract) => contract.status === "verified" || contract.status === "settled",
  ).length;

  return (
    <AppShell
      locale={locale}
      setLocale={setLocale}
      currentSection="dashboard"
      pageTitle={t.title}
      user={mockUser}
      attentionCount={contractsNeedingAttention.length}
      shellText={shellText}
    >
      <section className="space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-4xl font-semibold tracking-[-0.05em] text-[#111111]">{t.title}</h2>
            <p className="mt-3 text-base leading-7 text-[#111111]/65">{t.subtitle}</p>
          </div>

          <Link
            href="/contracts/new"
            className="inline-flex items-center justify-center rounded-full bg-[#111111] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#2F6B5A]"
          >
            + {t.createContract}
          </Link>
        </div>

        {mockContracts.length === 0 ? (
          <EmptyState
            title={t.empty.title}
            body={t.empty.body}
            cta={t.empty.cta}
            href="/contracts/new"
          />
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { label: t.summary.total, value: mockContracts.length },
                {
                  label: t.summary.pending,
                  value: mockContracts.filter((contract) => contract.status === "pending").length,
                },
                {
                  label: t.summary.ready,
                  value: mockContracts.filter((contract) => contract.status === "ready").length,
                },
                { label: t.summary.completed, value: completedCount },
              ].map((item) => (
                <div key={item.label} className="rounded-[1.5rem] border border-black/10 bg-white p-5">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-[#111111]/45">{item.label}</div>
                  <div className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-[#111111]">{item.value}</div>
                </div>
              ))}
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
              <section className="space-y-4">
                <h3 className="text-2xl font-semibold tracking-[-0.04em] text-[#111111]">{t.recentContracts}</h3>
                <ContractList
                  contracts={recentContracts}
                  locale={locale}
                  headers={translations[locale].contractsPage.table}
                  statusLabels={statusLabels}
                />
              </section>

              <section className="rounded-[1.75rem] border border-black/10 bg-white p-6">
                <h3 className="text-2xl font-semibold tracking-[-0.04em] text-[#111111]">{t.attention}</h3>
                <div className="mt-5 space-y-3">
                  {contractsNeedingAttention.slice(0, 4).map((contract) => (
                    <Link
                      key={contract.id}
                      href={`/contracts/${contract.id}`}
                      className="block rounded-[1.25rem] border border-black/10 bg-[#F7F6F2] p-4 transition hover:bg-white"
                    >
                      <div className="font-medium text-[#111111]">{contract.name}</div>
                      <div className="mt-1 text-sm text-[#111111]/60">
                        {contract.verifiedConditions}/{contract.totalConditions}
                      </div>
                      <div className="mt-3">
                        <StatusBadge status={contract.status} label={statusLabels[contract.status]} />
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            </div>
          </>
        )}
      </section>
    </AppShell>
  );
}
