"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LanguageSwitcher } from "@/components/workspace/language-switcher";
import { UserMenu } from "@/components/workspace/user-menu";
import type { Locale } from "@/app/i18n/client";
import type { User } from "@/data/types";
import { signOutSession } from "@/lib/session";

type AppShellProps = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  currentSection: "dashboard" | "contracts" | "profile";
  pageTitle: string;
  user: User;
  attentionCount: number;
  shellText: {
    brand: string;
    nav: {
      dashboard: string;
      contracts: string;
      profile: string;
      signOut: string;
    };
    userMenu: {
      profile: string;
      signOut: string;
    };
    mobile: {
      dashboard: string;
      contracts: string;
      profile: string;
    };
  };
  children: React.ReactNode;
};

export function AppShell({
  locale,
  setLocale,
  currentSection,
  pageTitle,
  user,
  attentionCount,
  shellText,
  children,
}: AppShellProps) {
  const router = useRouter();
  const navItems = [
    { href: "/dashboard", key: "dashboard", label: shellText.nav.dashboard },
    { href: "/contracts", key: "contracts", label: shellText.nav.contracts },
  ] as const;

  const handleSignOut = () => {
    signOutSession();
    router.push("/sign-in");
  };

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#111111]">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="hidden w-[240px] flex-col border-r border-black/10 px-6 py-6 lg:flex">
          <Link href="/dashboard" className="text-lg font-semibold tracking-tight text-[#111111]">
            {shellText.brand}
          </Link>

          <nav className="mt-10 grid gap-2 text-sm">
            {navItems.map((item) => {
              const isActive = currentSection === item.key;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between rounded-xl px-3 py-2.5 transition ${
                    isActive
                      ? "bg-white text-[#111111] shadow-[0_12px_30px_rgba(17,17,17,0.05)]"
                      : "text-[#111111]/65 hover:bg-white/70 hover:text-[#111111]"
                  }`}
                >
                  <span>{item.label}</span>
                  {item.key === "contracts" && attentionCount > 0 ? (
                    <span className="rounded-full border border-black/10 px-2 py-0.5 text-xs text-[#111111]/65">
                      {attentionCount}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto grid gap-2 border-t border-black/10 pt-6 text-sm">
            <Link
              href="/profile"
              className={`rounded-xl px-3 py-2.5 transition ${
                currentSection === "profile"
                  ? "bg-white text-[#111111] shadow-[0_12px_30px_rgba(17,17,17,0.05)]"
                  : "text-[#111111]/65 hover:bg-white/70 hover:text-[#111111]"
              }`}
            >
              {shellText.nav.profile}
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              className="rounded-xl px-3 py-2.5 text-left text-[#111111]/65 transition hover:bg-white/70 hover:text-[#111111]"
            >
              {shellText.nav.signOut}
            </button>
          </div>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="border-b border-black/10 bg-[#F7F6F2]/90 px-4 py-4 backdrop-blur-sm sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="lg:hidden">
                  <Link href="/dashboard" className="text-base font-semibold tracking-tight text-[#111111]">
                    {shellText.brand}
                  </Link>
                </div>
                <h1 className="text-lg font-semibold tracking-tight text-[#111111] sm:text-xl">{pageTitle}</h1>
              </div>

              <div className="flex items-center gap-3">
                <LanguageSwitcher locale={locale} setLocale={setLocale} />
                <UserMenu
                  user={user}
                  profileLabel={shellText.userMenu.profile}
                  signOutLabel={shellText.userMenu.signOut}
                  onSignOut={handleSignOut}
                />
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <div className="mx-auto max-w-6xl">{children}</div>
          </main>
        </div>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-3 border-t border-black/10 bg-[#F7F6F2]/95 px-4 py-3 backdrop-blur-sm lg:hidden">
        <Link href="/dashboard" className={`text-center text-sm ${currentSection === "dashboard" ? "text-[#111111]" : "text-[#111111]/60"}`}>
          {shellText.mobile.dashboard}
        </Link>
        <Link href="/contracts" className={`text-center text-sm ${currentSection === "contracts" ? "text-[#111111]" : "text-[#111111]/60"}`}>
          {shellText.mobile.contracts}
        </Link>
        <Link href="/profile" className={`text-center text-sm ${currentSection === "profile" ? "text-[#111111]" : "text-[#111111]/60"}`}>
          {shellText.mobile.profile}
        </Link>
      </nav>
    </div>
  );
}
