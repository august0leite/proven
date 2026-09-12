"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AppShell } from "@/components/workspace/app-shell";
import { StatusBadge } from "@/components/workspace/status-badge";
import { WizardStepper } from "@/components/workspace/wizard-stepper";
import { translations, useStoredLocale } from "@/app/i18n/client";
import { draftConditionTemplates } from "@/data/conditions/mockConditions";
import { contractsNeedingAttention } from "@/data/contracts/mockContracts";
import type { Condition } from "@/data/types";
import { mockUser } from "@/data/users/mockUser";
import { createProvenContractWithConditions } from "@/lib/blockchain/contracts";
import { requestWalletConnection } from "@/lib/blockchain/wallet";
import type { Address } from "viem";

type DraftContract = {
  name: string;
  description: string;
  value: string;
  currency: string;
  reference: string;
  buyerName: string;
  buyerIdentifier: string;
  sellerName: string;
  sellerIdentifier: string;
};

const initialDraft: DraftContract = {
  name: "Medical Supply Agreement",
  description: "Cross-border medical supply agreement with delivery and cold-chain verification.",
  value: "40000",
  currency: "USD",
  reference: "MSA-2026-014",
  buyerName: "ACME Medical",
  buyerIdentifier: "BR-ACM-204",
  sellerName: "Global Pharma Ltd.",
  sellerIdentifier: "UK-GPL-119",
};

export default function NewContractPage() {
  const router = useRouter();
  const { locale, setLocale } = useStoredLocale("pt");
  const t = translations[locale].contractCreate;
  const shellText = translations[locale].shell;
  const statusLabels = translations[locale].statuses;
  const [step, setStep] = useState(0);
  const [isCreating, setIsCreating] = useState(false);
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);
  const [walletAddress, setWalletAddress] = useState<Address | null>(null);
  const [walletError, setWalletError] = useState<string | null>(null);
  const [draft, setDraft] = useState<DraftContract>(initialDraft);
  const [conditions, setConditions] = useState<Condition[]>(draftConditionTemplates.slice(0, 4));

  const steps = [
    t.steps.contract,
    t.steps.parties,
    t.steps.conditions,
    t.steps.review,
    t.steps.create,
  ];

  const addCondition = () => {
    const template = draftConditionTemplates[conditions.length % draftConditionTemplates.length];
    setConditions((current) => [
      ...current,
      {
        ...template,
        id: `${template.id}-${current.length + 1}`,
      },
    ]);
  };

  const goNext = () => setStep((current) => Math.min(current + 1, steps.length - 1));
  const goBack = () => setStep((current) => Math.max(current - 1, 0));

  const handleConnectWallet = async () => {
    setIsConnectingWallet(true);
    setWalletError(null);

    try {
      const connected = await requestWalletConnection();
      setWalletAddress(connected.address);
      return connected.address;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to connect wallet.";
      setWalletError(message);
      return null;
    } finally {
      setIsConnectingWallet(false);
    }
  };

  const handleCreate = async () => {
    let connectedAddress = walletAddress;

    if (!connectedAddress) {
      connectedAddress = await handleConnectWallet();
    }

    if (!connectedAddress) {
      return;
    }

    setIsCreating(true);
    setWalletError(null);

    try {
      const amount = (draft.value ?? "0").trim();
      const value = Number.parseFloat(amount);

      if (!Number.isFinite(value) || value <= 0) {
        throw new Error("Contract value must be greater than zero.");
      }

      await createProvenContractWithConditions({
        buyer: connectedAddress,
        seller: connectedAddress,
        value: amount,
        currency: draft.currency,
        metadataLabel: `${draft.name} — ${draft.reference}`,
        creatorAddress: connectedAddress,
        conditions: conditions.map((condition) => ({
          title: condition.title,
          description: condition.description,
          requiredEvidence: condition.requiredEvidence,
          authorizedIssuer: condition.authorizedIssuer,
          verificationMethod: condition.verificationMethod,
        })),
      });

      router.push("/contracts?created=1");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Transaction failed.";
      setWalletError(message);
    } finally {
      setIsCreating(false);
    }
  };

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
      <section className="space-y-8">
        <div>
          <h2 className="text-4xl font-semibold tracking-[-0.05em] text-[#111111]">{t.title}</h2>
          <p className="mt-3 text-base leading-7 text-[#111111]/65">{t.subtitle}</p>
        </div>

        <WizardStepper steps={steps} currentStep={step} />

        <div className="rounded-[1.75rem] border border-black/10 bg-white p-6 md:p-8">
          <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-[#2F6B5A]/15 bg-[#2F6B5A]/5 p-4 text-sm text-[#244D42] md:flex-row md:items-center md:justify-between">
            <div>
              <div className="font-medium">Wallet status</div>
              <div className="mt-1 text-[#244D42]/80">
                {walletAddress ? `Connected: ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : "Not connected yet"}
              </div>
            </div>
            <button
              type="button"
              onClick={handleConnectWallet}
              disabled={isConnectingWallet || isCreating}
              className="inline-flex items-center justify-center rounded-full bg-[#111111] px-4 py-2 text-xs font-medium text-white transition hover:bg-[#2F6B5A] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isConnectingWallet ? "Connecting..." : walletAddress ? "Reconnect wallet" : "Connect wallet"}
            </button>
          </div>

          {walletError ? (
            <div className="mb-6 rounded-xl border border-[#8E3636]/20 bg-[#8E3636]/8 px-4 py-3 text-sm text-[#6F2929]">
              {walletError}
            </div>
          ) : null}

          {step === 0 ? (
            <div className="grid gap-5 md:grid-cols-2">
              <label className="block md:col-span-2">
                <span className="mb-2 block text-sm font-medium text-[#111111]/75">{t.form.contractName}</span>
                <input
                  value={draft.name}
                  onChange={(event) => setDraft({ ...draft, name: event.target.value })}
                  className="w-full rounded-2xl border border-black/10 bg-[#F7F6F2] px-4 py-3 text-sm outline-none transition focus:border-[#2F6B5A]"
                  placeholder={t.form.contractName}
                />
              </label>
              <label className="block md:col-span-2">
                <span className="mb-2 block text-sm font-medium text-[#111111]/75">{t.form.description}</span>
                <textarea
                  value={draft.description}
                  onChange={(event) => setDraft({ ...draft, description: event.target.value })}
                  rows={4}
                  className="w-full rounded-2xl border border-black/10 bg-[#F7F6F2] px-4 py-3 text-sm outline-none transition focus:border-[#2F6B5A]"
                  placeholder={t.form.description}
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#111111]/75">{t.form.contractValue}</span>
                <input
                  value={draft.value}
                  onChange={(event) => setDraft({ ...draft, value: event.target.value })}
                  className="w-full rounded-2xl border border-black/10 bg-[#F7F6F2] px-4 py-3 text-sm outline-none transition focus:border-[#2F6B5A]"
                  placeholder={t.form.contractValue}
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#111111]/75">{t.form.currency}</span>
                <input
                  value={draft.currency}
                  onChange={(event) => setDraft({ ...draft, currency: event.target.value })}
                  className="w-full rounded-2xl border border-black/10 bg-[#F7F6F2] px-4 py-3 text-sm outline-none transition focus:border-[#2F6B5A]"
                  placeholder={t.form.currency}
                />
              </label>
              <label className="block md:col-span-2">
                <span className="mb-2 block text-sm font-medium text-[#111111]/75">{t.form.reference}</span>
                <input
                  value={draft.reference}
                  onChange={(event) => setDraft({ ...draft, reference: event.target.value })}
                  className="w-full rounded-2xl border border-black/10 bg-[#F7F6F2] px-4 py-3 text-sm outline-none transition focus:border-[#2F6B5A]"
                  placeholder={t.form.reference}
                />
              </label>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="grid gap-6 lg:grid-cols-2">
              {[
                {
                  title: t.form.buyer,
                  name: draft.buyerName,
                  identifier: draft.buyerIdentifier,
                  verified: true,
                  onNameChange: (value: string) => setDraft({ ...draft, buyerName: value }),
                  onIdentifierChange: (value: string) => setDraft({ ...draft, buyerIdentifier: value }),
                },
                {
                  title: t.form.seller,
                  name: draft.sellerName,
                  identifier: draft.sellerIdentifier,
                  verified: false,
                  onNameChange: (value: string) => setDraft({ ...draft, sellerName: value }),
                  onIdentifierChange: (value: string) => setDraft({ ...draft, sellerIdentifier: value }),
                },
              ].map((party) => (
                <div key={party.title} className="rounded-[1.5rem] border border-black/10 bg-[#F7F6F2] p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-lg font-semibold tracking-[-0.04em] text-[#111111]">{party.title}</div>
                      <div className="mt-2 text-[11px] uppercase tracking-[0.2em] text-[#111111]/45">
                        {t.form.verificationStatus}
                      </div>
                    </div>
                    <StatusBadge
                      status={party.verified ? "verified" : "pending"}
                      label={party.verified ? t.form.verified : t.form.pendingVerification}
                    />
                  </div>

                  <div className="mt-5 grid gap-4">
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-[#111111]/75">{t.form.organization}</span>
                      <input
                        value={party.name}
                        onChange={(event) => party.onNameChange(event.target.value)}
                        className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#2F6B5A]"
                        placeholder={t.form.organization}
                      />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-[#111111]/75">{t.form.identifier}</span>
                      <input
                        value={party.identifier}
                        onChange={(event) => party.onIdentifierChange(event.target.value)}
                        className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#2F6B5A]"
                        placeholder={t.form.identifier}
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {step === 2 ? (
            <div>
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <h3 className="text-2xl font-semibold tracking-[-0.04em] text-[#111111]">{t.form.conditionsTitle}</h3>
                  <p className="mt-2 text-base leading-7 text-[#111111]/65">{t.form.conditionsBody}</p>
                </div>
                <button
                  type="button"
                  onClick={addCondition}
                  className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-[#111111] transition hover:border-[#111111]/20"
                >
                  + {t.form.addCondition}
                </button>
              </div>

              <div className="mt-6 grid gap-4">
                {conditions.map((condition) => (
                  <div key={condition.id} className="rounded-[1.25rem] border border-black/10 bg-[#F7F6F2] p-5">
                    <div className="font-medium text-[#111111]">{condition.title}</div>
                    <div className="mt-2 text-sm leading-6 text-[#111111]/65">{condition.description}</div>
                    <div className="mt-4 grid gap-4 text-sm text-[#111111]/70 md:grid-cols-3">
                      <div>
                        <div className="text-[10px] uppercase tracking-[0.2em] text-[#111111]/45">{t.form.requiredEvidence}</div>
                        <div className="mt-2">{condition.requiredEvidence}</div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase tracking-[0.2em] text-[#111111]/45">{t.form.authorizedIssuer}</div>
                        <div className="mt-2">{condition.authorizedIssuer}</div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase tracking-[0.2em] text-[#111111]/45">{t.form.verificationMethod}</div>
                        <div className="mt-2">{condition.verificationMethod}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold tracking-[-0.04em] text-[#111111]">{t.form.reviewTitle}</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  { label: t.form.contractName, value: draft.name },
                  { label: t.form.contractValue, value: `${draft.currency} ${draft.value}` },
                  { label: t.form.buyer, value: draft.buyerName },
                  { label: t.form.seller, value: draft.sellerName },
                  { label: t.form.reference, value: draft.reference || "-" },
                  { label: t.form.conditionsTitle, value: String(conditions.length) },
                ].map((item) => (
                  <div key={item.label} className="rounded-[1.25rem] border border-black/10 bg-[#F7F6F2] p-5">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-[#111111]/45">{item.label}</div>
                    <div className="mt-2 font-medium text-[#111111]">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {step === 4 ? (
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold tracking-[-0.04em] text-[#111111]">{t.form.reviewTitle}</h3>
              <div className="rounded-[1.5rem] border border-black/10 bg-[#F7F6F2] p-6">
                <div className="font-medium text-[#111111]">{draft.name}</div>
                <div className="mt-2 text-sm leading-6 text-[#111111]/65">{draft.description}</div>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-[#111111]/45">{t.form.buyer}</div>
                    <div className="mt-2 text-[#111111]">{draft.buyerName}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-[#111111]/45">{t.form.seller}</div>
                    <div className="mt-2 text-[#111111]">{draft.sellerName}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-[#111111]/45">{t.form.contractValue}</div>
                    <div className="mt-2 text-[#111111]">{draft.currency} {draft.value}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-[#111111]/45">{t.form.conditionsTitle}</div>
                    <div className="mt-2 text-[#111111]">{conditions.length}</div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 0 || isCreating}
            className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-medium text-[#111111]/70 transition hover:border-[#111111]/20 hover:text-[#111111] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t.form.back}
          </button>

          {step < steps.length - 1 ? (
            <button
              type="button"
              onClick={goNext}
              className="inline-flex items-center justify-center rounded-full bg-[#111111] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#2F6B5A]"
            >
              {t.form.next}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleCreate}
              disabled={isCreating}
              className="inline-flex items-center justify-center rounded-full bg-[#111111] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#2F6B5A] disabled:cursor-not-allowed disabled:opacity-80"
            >
              {isCreating ? t.form.creating : t.form.createContract}
            </button>
          )}
        </div>
      </section>
    </AppShell>
  );
}
