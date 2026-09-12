"use client";

import { AppShell } from "@/components/workspace/app-shell";
import { translations, useStoredLocale } from "@/app/i18n/client";
import { contractsNeedingAttention } from "@/data/contracts/mockContracts";
import { mockUser } from "@/data/users/mockUser";
import { useSessionState } from "@/lib/session";

export default function ProfilePage() {
  const { locale, setLocale } = useStoredLocale("pt");
  const { session } = useSessionState();
  const t = translations[locale].profilePage;
  const shellText = translations[locale].shell;
  const user = session.user ?? mockUser;

  return (
    <AppShell
      locale={locale}
      setLocale={setLocale}
      currentSection="profile"
      pageTitle={t.title}
      user={user}
      attentionCount={contractsNeedingAttention.length}
      shellText={shellText}
    >
      <section className="space-y-6">
        <div>
          <h2 className="text-4xl font-semibold tracking-[-0.05em] text-[#111111]">{t.title}</h2>
          <p className="mt-3 text-base leading-7 text-[#111111]/65">{t.subtitle}</p>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <section className="rounded-[1.75rem] border border-black/10 bg-white p-6">
            <h3 className="text-xl font-semibold tracking-[-0.04em] text-[#111111]">{t.personal}</h3>
            <div className="mt-5 grid gap-4">
              <div className="rounded-[1.25rem] border border-black/10 bg-[#F7F6F2] p-4">
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#111111]/45">{t.fullName}</div>
                <div className="mt-2 text-[#111111]">{user.name}</div>
              </div>
              <div className="rounded-[1.25rem] border border-black/10 bg-[#F7F6F2] p-4">
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#111111]/45">{t.email}</div>
                <div className="mt-2 text-[#111111]">{user.email}</div>
              </div>
            </div>
          </section>

          <section className="rounded-[1.75rem] border border-black/10 bg-white p-6">
            <h3 className="text-xl font-semibold tracking-[-0.04em] text-[#111111]">{t.security}</h3>
            <div className="mt-5 rounded-[1.25rem] border border-black/10 bg-[#F7F6F2] p-4">
              <div className="text-[10px] uppercase tracking-[0.2em] text-[#111111]/45">{t.password}</div>
              <div className="mt-2 text-[#111111]">••••••••</div>
              <button
                type="button"
                className="mt-4 inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-[#111111] transition hover:border-[#111111]/20"
              >
                {t.changePassword}
              </button>
            </div>
          </section>

          <section className="rounded-[1.75rem] border border-black/10 bg-white p-6">
            <h3 className="text-xl font-semibold tracking-[-0.04em] text-[#111111]">{t.wallets}</h3>
            <div className="mt-5 rounded-[1.25rem] border border-black/10 bg-[#F7F6F2] p-4">
              {user.wallets.length === 0 ? (
                <>
                  <div className="text-[#111111]/70">{t.noWallet}</div>
                  <button
                    type="button"
                    className="mt-4 inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-[#111111] transition hover:border-[#111111]/20"
                  >
                    {t.connectWallet}
                  </button>
                </>
              ) : (
                <div className="grid gap-3">
                  {user.wallets.map((wallet) => (
                    <div key={wallet.address} className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-[#111111]/75">
                      <div className="font-mono text-xs text-[#111111]">{wallet.address}</div>
                      <div className="mt-1">{t.connected}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className="rounded-[1.75rem] border border-black/10 bg-white p-6">
            <h3 className="text-xl font-semibold tracking-[-0.04em] text-[#111111]">{t.language}</h3>
            <div className="mt-5 rounded-[1.25rem] border border-black/10 bg-[#F7F6F2] p-4 text-[#111111]/70">
              {locale.toUpperCase()}
            </div>
          </section>
        </div>
      </section>
    </AppShell>
  );
}
