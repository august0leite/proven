"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { translations, useStoredLocale } from "../i18n/client";

export default function OnboardingPage() {
  const { locale } = useStoredLocale("pt");
  const [selected, setSelected] = useState<"create" | "join" | null>(null);
  const router = useRouter();

  const t = translations[locale].onboarding;

  return (
    <main className="min-h-screen bg-[#F7F6F2] px-6 py-12 text-[#111111] lg:px-8">
      <div className="mx-auto w-full max-w-xl rounded-[2rem] border border-black/10 bg-white p-8 shadow-[0_24px_64px_rgba(17,17,17,0.08)] md:p-10">
        <h1 className="text-4xl font-semibold tracking-[-0.05em] md:text-5xl">{t.heading}</h1>
        <p className="mt-4 text-base leading-7 text-[#111111]/70">{t.subheading}</p>

        <div className="mt-8 space-y-3">
          <button
            type="button"
            onClick={() => setSelected("create")}
            className={`inline-flex w-full items-center justify-center rounded-full border px-6 py-3 text-sm font-medium transition ${
              selected === "create"
                ? "border-[#2F6B5A] bg-[#2F6B5A]/10 text-[#244d42]"
                : "border-[#111111]/15 bg-white text-[#111111] hover:border-[#111111]/30"
            }`}
          >
            {t.createOrg}
          </button>

          <button
            type="button"
            onClick={() => setSelected("join")}
            className={`inline-flex w-full items-center justify-center rounded-full border px-6 py-3 text-sm font-medium transition ${
              selected === "join"
                ? "border-[#2F6B5A] bg-[#2F6B5A]/10 text-[#244d42]"
                : "border-[#111111]/15 bg-white text-[#111111] hover:border-[#111111]/30"
            }`}
          >
            {t.joinOrg}
          </button>
        </div>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="inline-flex w-full items-center justify-center rounded-full bg-[#2F6B5A] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#244d42]"
          >
            {t.continue}
          </button>
          <Link
            href="/sign-in"
            className="inline-flex w-full items-center justify-center rounded-full border border-[#111111]/15 bg-white px-6 py-3 text-sm font-medium text-[#111111] transition hover:border-[#111111]/30"
          >
            {t.signIn}
          </Link>
        </div>
      </div>
    </main>
  );
}
