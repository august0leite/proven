"use client";

import Link from "next/link";
import { translations, useStoredLocale } from "./i18n/client";

export default function Home() {
  const { locale, setLocale } = useStoredLocale("en");
  const t = translations[locale].landing;

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#111111]">
      <header className="sticky top-0 z-20 border-b border-black/10 bg-[#F7F6F2]/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="text-lg font-semibold tracking-tight">PROVEN</div>
          </div>

          <nav className="hidden items-center gap-8 text-sm text-[#111111]/70 md:flex">
            <a href="#problem" className="transition hover:text-[#111111]">
              {t.nav.problem}
            </a>
            <a href="#solution" className="transition hover:text-[#111111]">
              {t.nav.solution}
            </a>
            <a href="#oracle" className="transition hover:text-[#111111]">
              {t.nav.oracle}
            </a>
            <a href="#architecture" className="transition hover:text-[#111111]">
              {t.nav.architecture}
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <div className="inline-flex rounded-full border border-[#111111]/15 bg-white p-1">
              {(["en", "pt"] as const).map((code) => {
                const isActive = locale === code;

                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setLocale(code)}
                    aria-pressed={isActive}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                      isActive
                        ? "bg-[#111111] text-white"
                        : "text-[#111111]/65 hover:text-[#111111]"
                    }`}
                  >
                    {code.toUpperCase()}
                  </button>
                );
              })}
            </div>
            <a
              href="#architecture"
              className="hidden rounded-full border border-[#111111]/15 bg-white px-4 py-2 text-sm font-medium transition hover:border-[#111111]/30 md:inline-flex"
            >
              {t.actions.secondary}
            </a>
            <Link
              href="/sign-in"
              className="rounded-full bg-[#2F6B5A] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#244d42]"
            >
              {t.actions.primary}
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section id="hero" className="mx-auto max-w-7xl px-6 pb-20 pt-16 lg:px-8 lg:pt-20">
          <div className="grid items-center gap-12 lg:grid-cols-[1.08fr_0.92fr]">
            <div>
              <div className="mb-6 inline-flex items-center rounded-full border border-black/10 bg-white px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.22em] text-[#111111]/70">
                {t.hero.badge}
              </div>

              <h1 className="max-w-[720px] text-5xl font-semibold leading-[0.96] tracking-[-0.06em] text-[#111111] md:text-6xl lg:text-7xl">
                {t.hero.title}
                <span className="mt-2 block text-[#2F6B5A]">{t.hero.titleAccent}</span>
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-[#111111]/70">{t.hero.description}</p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/sign-in"
                  className="rounded-full bg-[#111111] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#2F6B5A]"
                >
                  {t.actions.primary}
                </Link>
                <a
                  href="#architecture"
                  className="rounded-full border border-[#111111]/15 bg-white px-6 py-3 text-sm font-medium text-[#111111] transition hover:border-[#111111]/30"
                >
                  {t.actions.secondary}
                </a>
              </div>

              <div className="mt-10 grid max-w-xl grid-cols-3 gap-4 text-left">
                {t.hero.stats.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-black/10 bg-white p-4">
                    <div className="text-[10px] uppercase tracking-[0.22em] text-[#111111]/55">{item.label}</div>
                    <div className="mt-3 text-2xl font-semibold tracking-[-0.05em]">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-8 -z-10 rounded-[2.5rem] border border-[#111111]/10 bg-white/60" />
              <div className="relative rounded-[2rem] border border-[#111111]/10 bg-white p-5 shadow-[0_24px_90px_rgba(17,17,17,0.08)]">
                <div className="rounded-[1.5rem] border border-[#111111]/10 bg-[#F7F6F2] p-4">
                  <div className="flex items-center justify-between border-b border-black/10 pb-4">
                    <div>
                      <div className="text-[10px] font-medium uppercase tracking-[0.24em] text-[#111111]/55">{t.hero.visual.badge}</div>
                      <div className="mt-1 text-lg font-semibold tracking-[-0.04em]">{t.hero.visual.title}</div>
                    </div>
                    <div className="rounded-full border border-[#2F6B5A]/20 bg-[#2F6B5A]/8 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[#2F6B5A]">
                      {t.hero.visual.status}
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-[1fr_auto] items-start gap-3">
                    <div className="space-y-3">
                      {t.contractConditions.map((condition) => (
                        <div key={condition} className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-[#111111]/75">
                          {condition}
                        </div>
                      ))}
                    </div>
                    <div className="space-y-3 text-center text-[#111111]/35">
                      {t.contractConditions.map((condition) => (
                        <div key={`${condition}-arrow`}>↓</div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 rounded-xl border border-[#2F6B5A]/20 bg-[#2F6B5A]/5 px-3 py-3 text-sm font-medium text-[#2F6B5A]">
                    {t.hero.visual.state}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="problem" className="border-y border-black/10 bg-white/60">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <div className="text-xs font-medium uppercase tracking-[0.24em] text-[#111111]/55">{t.problem.eyebrow}</div>
                <h2 className="mt-4 text-4xl font-semibold tracking-[-0.06em] md:text-5xl">{t.problem.title}</h2>
                <p className="mt-6 text-lg leading-8 text-[#111111]/70">{t.problem.body1}</p>
                <p className="mt-6 text-lg leading-8 text-[#111111]/70">{t.problem.body2}</p>
              </div>

              <div className="rounded-[2rem] border border-black/10 bg-[#F7F6F2] p-6">
                <div className="text-[10px] uppercase tracking-[0.24em] text-[#111111]/55">{t.problem.cardTitle}</div>
                <div className="mt-4 space-y-4 text-lg leading-7 text-[#111111]/75">
                  {t.problem.questions.map((question, index) => (
                    <p key={question} className={index === 1 ? "font-medium text-[#111111]" : undefined}>
                      {question}
                    </p>
                  ))}
                </div>
                <p className="mt-6 text-sm leading-6 text-[#111111]/60">{t.problem.note}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <div className="text-xs font-medium uppercase tracking-[0.24em] text-[#111111]/55">{t.friction.eyebrow}</div>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.06em] md:text-5xl">{t.friction.title}</h2>
          </div>

          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[2rem] border border-black/10 bg-white p-6">
              <div className="text-[10px] uppercase tracking-[0.24em] text-[#111111]/55">{t.friction.infraTitle}</div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {t.friction.fragmentedTrust.map((item) => (
                  <div key={item} className="rounded-xl border border-black/10 bg-[#F7F6F2] px-4 py-3 text-sm text-[#111111]/75">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-black/10 bg-[#111111] p-6 text-white">
              <div className="text-[10px] uppercase tracking-[0.24em] text-white/60">{t.friction.costEyebrow}</div>
              <h3 className="mt-4 text-3xl font-semibold tracking-[-0.05em]">{t.friction.costTitle}</h3>
              <div className="mt-6 grid gap-3">
                {t.friction.verificationCosts.map((item) => (
                  <div key={item} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/75">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-black/10 bg-white/60">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr]">
              <div>
                <div className="text-xs font-medium uppercase tracking-[0.24em] text-[#111111]/55">{t.evidenceProblem.eyebrow}</div>
                <h2 className="mt-4 text-4xl font-semibold tracking-[-0.06em] md:text-5xl">{t.evidenceProblem.title}</h2>
                <p className="mt-6 text-lg leading-8 text-[#111111]/70">{t.evidenceProblem.body}</p>
              </div>

              <div className="rounded-[2rem] border border-black/10 bg-[#F7F6F2] p-6">
                <div className="grid gap-3 sm:grid-cols-2">
                  {t.evidenceProblem.evidenceSources.map((source) => (
                    <div key={source} className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-[#111111]/75">
                      {source}
                    </div>
                  ))}
                </div>
                <div className="mt-6 rounded-xl border border-black/10 bg-white p-4">
                  <div className="space-y-2 text-sm text-[#111111]/70">
                    {t.evidenceProblem.chain.map((item, index) => (
                      <div key={item}>
                        <div>{item}</div>
                        {index < t.evidenceProblem.chain.length - 1 ? <div>↓</div> : null}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="solution" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="text-xs font-medium uppercase tracking-[0.24em] text-[#111111]/55">{t.solution.eyebrow}</div>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.06em] md:text-5xl">{t.solution.title}</h2>
            <p className="mt-6 text-lg leading-8 text-[#111111]/70">{t.solution.body}</p>
          </div>

          <div className="mt-12 rounded-[2rem] border border-black/10 bg-white p-6 md:p-8">
            <div className="grid gap-4 md:grid-cols-5">
              {t.solution.flow.map((item, index) => {
                const isProven = index === 2;

                return (
                  <div
                    key={item}
                    className={`rounded-2xl border p-5 text-center ${
                      isProven
                        ? "border-[#2F6B5A]/20 bg-[#2F6B5A]/5 text-[#2F6B5A]"
                        : "border-black/10 bg-[#F7F6F2] text-[#111111]/80"
                    }`}
                  >
                    <div className={`text-[10px] uppercase tracking-[0.2em] ${isProven ? "text-[#2F6B5A]" : "text-[#111111]/50"}`}>
                      {item}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="border-y border-black/10 bg-white/60">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
              <div>
                <div className="text-xs font-medium uppercase tracking-[0.24em] text-[#111111]/55">{t.technicalGap.eyebrow}</div>
                <h2 className="mt-4 text-4xl font-semibold tracking-[-0.06em] md:text-5xl">{t.technicalGap.title}</h2>
                <p className="mt-6 text-lg leading-8 text-[#111111]/70">{t.technicalGap.body}</p>
              </div>

              <div className="rounded-[2rem] border border-black/10 bg-white p-6">
                <div className="space-y-3 text-center text-lg font-medium tracking-[-0.03em] text-[#111111]/80">
                  <div>{t.technicalGap.diagram[0]}</div>
                  <div className="text-[#111111]/35">↓</div>
                  <div>{t.technicalGap.diagram[1]}</div>
                  <div className="text-[#B77D2B]">?</div>
                  <div>{t.technicalGap.diagram[2]}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="workflow" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="mb-12 max-w-3xl">
            <div className="text-xs font-medium uppercase tracking-[0.24em] text-[#111111]/55">{t.workflow.eyebrow}</div>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.06em] md:text-5xl">{t.workflow.title}</h2>
          </div>

          <div className="space-y-4">
            {t.workflow.steps.map((step, index) => (
              <div key={step.title} className="rounded-[1.75rem] border border-black/10 bg-white p-5 md:p-6">
                <div className="grid gap-4 md:grid-cols-[120px_1fr_1fr] md:items-center">
                  <div className="text-[10px] uppercase tracking-[0.24em] text-[#111111]/50">{String(index + 1).padStart(2, "0")}</div>
                  <div>
                    <div className="text-2xl font-semibold tracking-[-0.04em]">{step.title}</div>
                    <p className="mt-2 text-sm leading-6 text-[#111111]/65">{step.text}</p>
                  </div>
                  <div className="rounded-xl border border-black/10 bg-[#F7F6F2] px-4 py-3 text-sm text-[#111111]/70">{step.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#111111] py-20 text-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
              <div>
                <div className="text-xs font-medium uppercase tracking-[0.24em] text-white/60">{t.evidenceLayer.eyebrow}</div>
                <h2 className="mt-4 max-w-lg text-4xl font-semibold tracking-[-0.06em] md:text-5xl">{t.evidenceLayer.title}</h2>
                <p className="mt-6 max-w-lg text-lg leading-8 text-white/70">{t.evidenceLayer.body}</p>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-[0_30px_90px_rgba(0,0,0,0.3)]">
                <div className="rounded-[1.5rem] border border-white/10 bg-[#F7F6F2] p-5 text-[#111111]">
                  <div className="flex items-center justify-between border-b border-black/10 pb-4">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.22em] text-[#111111]/55">{t.evidenceLayer.card.condition}</div>
                      <div className="mt-1 text-2xl font-semibold tracking-[-0.05em]">{t.evidenceLayer.card.title}</div>
                    </div>
                    <div className="rounded-full bg-[#2F6B5A]/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[#2F6B5A]">
                      {t.evidenceLayer.card.status}
                    </div>
                  </div>

                  <div className="mt-5 space-y-4">
                    <div className="rounded-xl border border-black/10 bg-white p-3">
                      <div className="text-[10px] uppercase tracking-[0.18em] text-[#111111]/50">{t.evidenceLayer.card.required}</div>
                      <div className="mt-2 text-lg font-medium">{t.evidenceLayer.card.requiredValue}</div>
                    </div>
                    <div className="rounded-xl border border-black/10 bg-white p-3">
                      <div className="text-[10px] uppercase tracking-[0.18em] text-[#111111]/50">{t.evidenceLayer.card.issuers}</div>
                      <div className="mt-2 text-base">{t.evidenceLayer.card.issuersValue}</div>
                    </div>
                    <div className="rounded-xl border border-[#2F6B5A]/20 bg-[#2F6B5A]/5 p-3">
                      <div className="text-[10px] uppercase tracking-[0.18em] text-[#2F6B5A]">{t.evidenceLayer.card.statusLabel}</div>
                      <div className="mt-2 text-lg font-semibold text-[#2F6B5A]">{t.evidenceLayer.card.statusValue}</div>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-2 sm:grid-cols-2">
                    {t.evidenceLayer.proofItems.map((item) => (
                      <div key={item.label} className="rounded-xl border border-black/10 bg-white px-3 py-2">
                        <div className="text-[10px] uppercase tracking-[0.18em] text-[#111111]/45">{item.label}</div>
                        <div className="mt-1 font-mono text-xs text-[#111111]/80">{item.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <div className="text-xs font-medium uppercase tracking-[0.24em] text-[#111111]/55">{t.issuers.eyebrow}</div>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.06em] md:text-5xl">{t.issuers.title}</h2>
              <p className="mt-6 text-lg leading-8 text-[#111111]/70">{t.issuers.body}</p>
            </div>

            <div className="rounded-[2rem] border border-black/10 bg-[#F7F6F2] p-6">
              <div className="grid gap-3">
                {t.issuers.items.map((item) => (
                  <div key={item} className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-[#111111]/75">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-black/10 bg-white/60">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <div className="text-xs font-medium uppercase tracking-[0.24em] text-[#111111]/55">{t.attestations.eyebrow}</div>
                <h2 className="mt-4 text-4xl font-semibold tracking-[-0.06em] md:text-5xl">{t.attestations.title}</h2>
                <p className="mt-6 text-lg leading-8 text-[#111111]/70">{t.attestations.body}</p>
              </div>

              <div className="rounded-[2rem] border border-black/10 bg-white p-6">
                <div className="space-y-3 text-sm text-[#111111]/75">
                  {t.attestations.stack.map((item, index) => (
                    <div key={item}>
                      <div className={index === t.attestations.stack.length - 1 ? "font-medium text-[#111111]" : undefined}>{item}</div>
                      {index < t.attestations.stack.length - 1 ? <div className="text-[#111111]/35">+</div> : null}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="mb-12 max-w-2xl">
            <div className="text-xs font-medium uppercase tracking-[0.24em] text-[#111111]/55">{t.stateMachine.eyebrow}</div>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.06em] md:text-5xl">{t.stateMachine.title}</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
            {t.stateMachine.states.map((step, index) => (
              <div key={step} className="rounded-2xl border border-black/10 bg-white p-5 text-center">
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#111111]/50">{index + 1}</div>
                <div className="mt-4 text-sm font-semibold tracking-[0.08em] text-[#111111]/80">{step}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.5rem] border border-[#B77D2B]/25 bg-[#B77D2B]/10 p-5 text-[#6C4A17]">
              <div className="text-[10px] uppercase tracking-[0.2em]">{t.stateMachine.altBranch}</div>
              <div className="mt-3 text-lg font-semibold tracking-[-0.03em]">{t.stateMachine.failed}</div>
            </div>
            <div className="rounded-[1.5rem] border border-[#8E3636]/20 bg-[#8E3636]/8 p-5 text-[#8E3636]">
              <div className="text-[10px] uppercase tracking-[0.2em]">{t.stateMachine.altBranch}</div>
              <div className="mt-3 text-lg font-semibold tracking-[-0.03em]">{t.stateMachine.disputed}</div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <div className="text-xs font-medium uppercase tracking-[0.24em] text-[#111111]/55">{t.example.eyebrow}</div>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.06em] md:text-5xl">{t.example.title}</h2>
          </div>

          <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
            <div className="rounded-[2rem] border border-black/10 bg-white p-6">
              <div className="text-[10px] uppercase tracking-[0.24em] text-[#111111]/55">{t.example.contractLabel}</div>
              <div className="mt-3 text-2xl font-semibold tracking-[-0.05em]">{t.example.amount}</div>
              <div className="mt-6 rounded-xl border border-black/10 bg-[#F7F6F2] px-4 py-3 text-base">
                <span className="text-[#111111]/60">{t.example.buyer}</span>
                <div className="mt-1 text-lg font-medium">{t.example.buyerValue}</div>
              </div>
              <div className="mt-3 rounded-xl border border-black/10 bg-[#F7F6F2] px-4 py-3 text-base">
                <span className="text-[#111111]/60">{t.example.seller}</span>
                <div className="mt-1 text-lg font-medium">{t.example.sellerValue}</div>
              </div>
              <div className="mt-6 rounded-xl border border-black/10 bg-[#F7F6F2] p-4">
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#111111]/55">{t.example.requirements}</div>
                <div className="mt-3 grid gap-2">
                  {t.example.requirementItems.map((item) => (
                    <div key={item} className="text-sm text-[#111111]/75">{item}</div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-black/10 bg-[#F7F6F2] p-6 md:p-8">
              <div className="flex items-start justify-between gap-4 border-b border-black/10 pb-4">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.22em] text-[#111111]/55">{t.example.progress}</div>
                  <div className="mt-2 text-3xl font-semibold tracking-[-0.05em]">{t.example.progressValue}</div>
                  <div className="mt-2 text-base text-[#111111]/65">{t.example.pending}</div>
                </div>
                <div className="rounded-full border border-[#B77D2B]/30 bg-[#B77D2B]/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[#B77D2B]">
                  {t.example.pendingBadge}
                </div>
              </div>

              <div className="mt-6 grid gap-3 md:grid-cols-2">
                {t.example.conditions.map((condition, index) => {
                  const isComplete = index < 7;

                  return (
                    <div
                      key={condition}
                      className={`flex items-center justify-between rounded-xl border px-4 py-3 ${
                        isComplete
                          ? "border-[#2F6B5A]/20 bg-white text-[#2F6B5A]"
                          : "border-[#B77D2B]/25 bg-white text-[#B77D2B]"
                      }`}
                    >
                      <span className="text-sm font-medium">{condition}</span>
                      <span>{isComplete ? "✓" : "○"}</span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 rounded-[1.5rem] border border-[#2F6B5A]/20 bg-[#2F6B5A]/5 p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.22em] text-[#2F6B5A]">{t.example.newEvidence}</div>
                    <div className="mt-2 text-2xl font-semibold tracking-[-0.05em] text-[#111111]">{t.example.evidenceValue}</div>
                    <div className="mt-2 text-sm text-[#111111]/65">{t.example.evidenceIssuer}</div>
                  </div>
                  <div className="rounded-full bg-[#2F6B5A] px-4 py-2 text-sm font-medium text-white">{t.example.verificationReceived}</div>
                </div>

                <div className="mt-6 rounded-xl border border-[#2F6B5A]/20 bg-white p-4 text-center">
                  <div className="text-xs uppercase tracking-[0.22em] text-[#111111]/55">{t.example.contractState}</div>
                  <div className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-[#111111]">{t.example.successValue}</div>
                  <div className="mt-3 text-xl font-medium text-[#2F6B5A]">{t.example.successStatus}</div>
                  <div className="mt-4 text-sm text-[#111111]/65">{t.example.successNote}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-black/10 bg-white/60">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <div className="text-xs font-medium uppercase tracking-[0.24em] text-[#111111]/55">{t.settlement.eyebrow}</div>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.06em] md:text-5xl">{t.settlement.title}</h2>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-4">
              {t.settlement.steps.map((step, index) => {
                const isFinal = index === t.settlement.steps.length - 1;

                return (
                  <div
                    key={step}
                    className={`rounded-2xl border p-5 text-center ${
                      isFinal
                        ? "border-[#2F6B5A]/20 bg-[#2F6B5A]/5 text-[#2F6B5A]"
                        : "border-black/10 bg-[#F7F6F2] text-[#111111]"
                    }`}
                  >
                    <div className={`text-[10px] uppercase tracking-[0.2em] ${isFinal ? "text-[#2F6B5A]" : "text-[#111111]/50"}`}>
                      {index + 1}
                    </div>
                    <div className="mt-4 text-xl font-semibold tracking-[-0.04em]">{step}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="oracle" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="mb-12 max-w-2xl">
            <div className="text-xs font-medium uppercase tracking-[0.24em] text-[#111111]/55">{t.oracle.eyebrow}</div>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.06em] md:text-5xl">{t.oracle.title}</h2>
            <p className="mt-6 text-lg leading-8 text-[#111111]/70">{t.oracle.body}</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[1.75rem] border border-black/10 bg-white p-6">
              <div className="text-[10px] uppercase tracking-[0.22em] text-[#111111]/50">{t.oracle.traditional}</div>
              <div className="mt-4 space-y-3 text-sm text-[#111111]/70">
                {t.oracle.traditionalSteps.map((item, index) => (
                  <div key={item}>
                    <div>{item}</div>
                    {index < t.oracle.traditionalSteps.length - 1 ? <div>↓</div> : null}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-black/10 bg-[#111111] p-6 text-white">
              <div className="text-[10px] uppercase tracking-[0.22em] text-white/60">{t.oracle.proven}</div>
              <div className="mt-4 space-y-3 text-sm text-white/75">
                {t.oracle.provenSteps.map((item, index) => (
                  <div key={item}>
                    <div>{item}</div>
                    {index < t.oracle.provenSteps.length - 1 ? <div>↓</div> : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-black/10 bg-white/60">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
            <div className="mb-12 max-w-2xl">
              <div className="text-xs font-medium uppercase tracking-[0.24em] text-[#111111]/55">{t.trustStack.eyebrow}</div>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.06em] md:text-5xl">{t.trustStack.title}</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {t.trustStack.items.map((item, index) => (
                <div
                  key={`${item}-${index}`}
                  className={`rounded-[1.5rem] border p-5 ${
                    index % 2 === 0
                      ? "border-black/10 bg-white text-[#111111]"
                      : "border-[#2F6B5A]/15 bg-[#2F6B5A]/5 text-[#2F6B5A]"
                  }`}
                >
                  <div className="text-sm font-semibold tracking-[0.04em]">{item}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="architecture" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="text-xs font-medium uppercase tracking-[0.24em] text-[#111111]/55">{t.architecture.eyebrow}</div>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.06em] md:text-5xl">{t.architecture.title}</h2>
            <p className="mt-6 text-lg leading-8 text-[#111111]/70">{t.architecture.body}</p>
          </div>

          <div className="mt-12 rounded-[2rem] border border-black/10 bg-[#F7F6F2] p-6 md:p-8">
            <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-5">
              {t.architecture.cards.map((card) => (
                <div key={card.title} className="rounded-[1.5rem] border border-black/10 bg-white p-5">
                  <div className="text-lg font-semibold tracking-[-0.04em]">{card.title}</div>
                  <p className="mt-3 text-sm leading-6 text-[#111111]/65">{card.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <div className="text-xs font-medium uppercase tracking-[0.24em] text-[#111111]/55">{t.useCases.eyebrow}</div>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.06em] md:text-5xl">{t.useCases.title}</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {t.useCases.items.map((useCase) => (
              <div key={useCase} className="rounded-[1.5rem] border border-black/10 bg-white p-5">
                <div className="text-lg font-semibold tracking-[-0.04em]">{useCase}</div>
                <p className="mt-3 text-sm leading-6 text-[#111111]/65">{t.useCases.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#111111] py-20 text-white">
          <div className="mx-auto max-w-5xl px-6 text-center lg:px-8">
            <div className="text-xs font-medium uppercase tracking-[0.24em] text-white/60">{t.vision.eyebrow}</div>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.06em] md:text-6xl">{t.vision.title}</h2>
            <p className="mt-6 text-xl text-white/70">{t.vision.body}</p>

            <div className="mt-10 grid gap-4 sm:grid-cols-5">
              {t.vision.flow.map((item, index) => {
                const isFinal = index === t.vision.flow.length - 1;

                return (
                  <div
                    key={item}
                    className={`rounded-2xl border p-4 text-sm ${
                      isFinal
                        ? "border-[#B7D9CF]/30 bg-[#B7D9CF]/10 text-[#B7D9CF]"
                        : "border-white/10 bg-white/5 text-white/75"
                    }`}
                  >
                    {item}
                  </div>
                );
              })}
            </div>

            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/sign-in"
                className="rounded-full bg-white px-6 py-3 text-sm font-medium text-[#111111] transition hover:bg-[#EAE7DF]"
              >
                {t.actions.primary}
              </Link>
              <a
                href="#architecture"
                className="rounded-full border border-white/20 bg-transparent px-6 py-3 text-sm font-medium text-white transition hover:border-white/40 hover:bg-white/5"
              >
                {t.actions.secondary}
              </a>
            </div>
          </div>
        </section>

        <footer className="border-t border-black/10 bg-[#F7F6F2]">
          <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[1fr_auto] lg:px-8">
            <div>
              <div className="text-lg font-semibold tracking-tight">PROVEN</div>
              <p className="mt-2 max-w-md text-sm leading-6 text-[#111111]/65">{t.footer.body}</p>
            </div>

            <div className="grid gap-2 text-sm text-[#111111]/65">
              <a href="#solution" className="transition hover:text-[#111111]">{t.footer.links[0]}</a>
              <a href="#architecture" className="transition hover:text-[#111111]">{t.footer.links[1]}</a>
              <a href="#oracle" className="transition hover:text-[#111111]">{t.footer.links[2]}</a>
              <a href="#hero" className="transition hover:text-[#111111]">{t.footer.links[3]}</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
