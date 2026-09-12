"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/workspace/app-shell";
import { ContractList } from "@/components/workspace/contract-list";
import { EmptyState } from "@/components/workspace/empty-state";
import { translations, useStoredLocale } from "@/app/i18n/client";
import { mockContracts, contractsNeedingAttention } from "@/data/contracts/mockContracts";
import { mockUser } from "@/data/users/mockUser";

type FilterKey = "all" | "pending" | "ready" | "completed";

export default function ContractsPage() {
  const { locale, setLocale } = useStoredLocale("pt");
  const [filter, setFilter] = useState<FilterKey>("all");
  const t = translations[locale].contractsPage;
  const shellText = translations[locale].shell;
  const statusLabels = translations[locale].statuses;

  const filteredContracts = useMemo(() => {
    if (filter === "pending") {
      return mockContracts.filter((contract) => contract.status === "pending");
    }

    if (filter === "ready") {
      return mockContracts.filter((contract) => contract.status === "ready");
    }

    if (filter === "completed") {
      return mockContracts.filter(
        (contract) => contract.status === "verified" || contract.status === "settled",
      );
    }

    return mockContracts;
  }, [filter]);

  const filters: Array<{ key: FilterKey; label: string }> = [
    { key: "all", label: t.filters.all },
    { key: "pending", label: t.filters.pending },
    { key: "ready", label: t.filters.ready },
    { key: "completed", label: t.filters.completed },
  ];

  return (
    <AppShell
      locale={locale}
      setLocale={setLocale}
      currentSection="contracts"
      pageTitle={t.title}
      user={mockUser}
      attentionCount={contractsNeedingAttention.length}
      shellText={shellText}
    >
      <section className="flex flex-col gap-6">
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

        <div className="flex flex-wrap gap-3">
          {filters.map((item) => {
            const isActive = item.key === filter;

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setFilter(item.key)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? "border-[#111111] bg-[#111111] text-white"
                    : "border-black/10 bg-white text-[#111111]/70 hover:border-[#111111]/20 hover:text-[#111111]"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {filteredContracts.length === 0 ? (
          <EmptyState
            title={translations[locale].dashboard.empty.title}
            body={translations[locale].dashboard.empty.body}
            cta={translations[locale].dashboard.empty.cta}
            href="/contracts/new"
          />
        ) : (
          <ContractList
            contracts={filteredContracts}
            locale={locale}
            headers={t.table}
            statusLabels={statusLabels}
          />
        )}
      </section>
    </AppShell>
  );
}
