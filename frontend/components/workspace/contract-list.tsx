import Link from "next/link";
import { formatCurrency, formatRelativeTime } from "@/lib/format";
import { StatusBadge } from "@/components/workspace/status-badge";
import type { ContractSummary, Locale, WorkspaceStatus } from "@/data/types";

type ContractListProps = {
  contracts: ContractSummary[];
  locale: Locale;
  headers: {
    name: string;
    counterparty: string;
    value: string;
    progress: string;
    status: string;
    updated: string;
  };
  statusLabels: Record<WorkspaceStatus, string>;
};

export function ContractList({ contracts, locale, headers, statusLabels }: ContractListProps) {
  return (
    <>
      <div className="hidden rounded-[1.75rem] border border-black/10 bg-white md:block">
        <div className="grid grid-cols-[2.2fr_1.4fr_1fr_1fr_1.2fr_1fr] gap-4 border-b border-black/10 px-6 py-4 text-[11px] font-medium uppercase tracking-[0.2em] text-[#111111]/45">
          <div>{headers.name}</div>
          <div>{headers.counterparty}</div>
          <div>{headers.value}</div>
          <div>{headers.progress}</div>
          <div>{headers.status}</div>
          <div>{headers.updated}</div>
        </div>

        <div className="divide-y divide-black/10">
          {contracts.map((contract) => (
            <Link
              key={contract.id}
              href={`/contracts/${contract.id}`}
              className="grid grid-cols-[2.2fr_1.4fr_1fr_1fr_1.2fr_1fr] gap-4 px-6 py-5 transition hover:bg-[#F7F6F2]"
            >
              <div>
                <div className="font-medium text-[#111111]">{contract.name}</div>
                <div className="mt-1 text-sm text-[#111111]/60">{contract.description}</div>
              </div>
              <div className="text-sm text-[#111111]/70">{contract.counterparty}</div>
              <div className="text-sm text-[#111111]/70">{formatCurrency(contract.value, contract.currency, locale)}</div>
              <div className="text-sm text-[#111111]/70">{contract.verifiedConditions}/{contract.totalConditions}</div>
              <div>
                <StatusBadge status={contract.status} label={statusLabels[contract.status]} />
              </div>
              <div className="text-sm text-[#111111]/60">{formatRelativeTime(contract.updatedAt, locale)}</div>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:hidden">
        {contracts.map((contract) => (
          <Link
            key={contract.id}
            href={`/contracts/${contract.id}`}
            className="rounded-[1.5rem] border border-black/10 bg-white p-5 transition hover:bg-[#F7F6F2]"
          >
            <div className="font-medium text-[#111111]">{contract.name}</div>
            <div className="mt-2 text-sm text-[#111111]/60">{formatCurrency(contract.value, contract.currency, locale)}</div>
            <div className="mt-3 text-sm text-[#111111]/60">
              {contract.verifiedConditions}/{contract.totalConditions}
            </div>
            <div className="mt-4">
              <StatusBadge status={contract.status} label={statusLabels[contract.status]} />
            </div>
            <div className="mt-4 text-sm text-[#111111]/50">{formatRelativeTime(contract.updatedAt, locale)}</div>
          </Link>
        ))}
      </div>
    </>
  );
}
