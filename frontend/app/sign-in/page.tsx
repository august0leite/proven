"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { translations, useStoredLocale } from "../i18n/client";
import { setAuthenticatedUser } from "@/lib/session";

type AuthState =
  | "idle"
  | "loading"
  | "invalid"
  | "expired"
  | "connection"
  | "wallet"
  | "success";

declare global {
  interface Window {
    ethereum?: unknown;
  }
}

export default function SignInPage() {
  const { locale, setLocale } = useStoredLocale("pt");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [authState, setAuthState] = useState<AuthState>("idle");
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("session") === "expired") {
      setAuthState("expired");
    }
  }, []);

  const t = translations[locale].signIn;

  const statusMessage = useMemo(() => {
    switch (authState) {
      case "loading":
        return {
          tone: "border-[#111111]/10 bg-[#111111]/5 text-[#111111]/80",
          text: t.status.loading,
        };
      case "invalid":
        return {
          tone: "border-[#8E3636]/20 bg-[#8E3636]/8 text-[#6F2929]",
          text: t.status.invalid,
        };
      case "expired":
        return {
          tone: "border-[#B77D2B]/25 bg-[#B77D2B]/10 text-[#7D5A24]",
          text: t.status.expired,
        };
      case "connection":
        return {
          tone: "border-[#8E3636]/20 bg-[#8E3636]/8 text-[#6F2929]",
          text: t.status.connection,
        };
      case "wallet":
        return {
          tone: "border-[#2F6B5A]/20 bg-[#2F6B5A]/8 text-[#244D42]",
          text: t.status.wallet,
        };
      case "success":
        return {
          tone: "border-[#2F6B5A]/25 bg-[#2F6B5A]/10 text-[#244D42]",
          text: t.status.success,
        };
      default:
        return null;
    }
  }, [authState, t]);

  const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const buildUserFromEmail = (rawEmail: string) => {
    const normalizedEmail = rawEmail.trim().toLowerCase();
    const nameFromEmail = normalizedEmail.split("@")[0]?.replace(/[._-]+/g, " ") ?? "User";
    const normalizedName = nameFromEmail
      .split(" ")
      .filter(Boolean)
      .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
      .join(" ");

    return {
      id: "session-user",
      name: normalizedName || "User",
      email: normalizedEmail,
      wallets: [],
    };
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthState("loading");

    await wait(850);

    if (!navigator.onLine || email.trim().toLowerCase() === "network@proven.io") {
      setAuthState("connection");
      return;
    }

    if (email.trim().toLowerCase() === "expired@proven.io") {
      setAuthState("expired");
      return;
    }

    if (email.trim().toLowerCase() !== "user@proven.io" || password !== "proven123") {
      setAuthState("invalid");
      return;
    }

    if (rememberMe) {
      window.localStorage.setItem("proven-remember-email", email.trim());
    } else {
      window.localStorage.removeItem("proven-remember-email");
    }

    setAuthenticatedUser(buildUserFromEmail(email));

    setAuthState("success");
    await wait(650);
    router.push("/dashboard");
  };

  const handleWalletAuth = async () => {
    setAuthState("wallet");
    await wait(700);

    if (!window.ethereum) {
      return;
    }

    setAuthenticatedUser({
      id: "wallet-user",
      name: "Wallet User",
      email: "wallet@proven.io",
      wallets: [
        {
          address: "0x8f34...91ac",
          connectedAt: new Date().toISOString(),
        },
      ],
    });

    setAuthState("success");
    await wait(650);
    router.push("/dashboard");
  };

  return (
    <main className="min-h-screen bg-[#F7F6F2] px-6 py-12 text-[#111111] lg:px-8">
      <div className="mx-auto flex w-full max-w-xl items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center rounded-full border border-[#111111]/15 bg-white px-4 py-2 text-sm font-medium text-[#111111]/80 transition hover:border-[#111111]/30 hover:text-[#111111]"
        >
          ← {t.back}
        </Link>
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
      </div>

      <div className="mx-auto mt-10 w-full max-w-xl rounded-[2rem] border border-black/10 bg-white p-8 shadow-[0_24px_64px_rgba(17,17,17,0.08)] md:p-10">
        <h1 className="text-4xl font-semibold tracking-[-0.05em] md:text-5xl">{t.heading}</h1>
        <p className="mt-4 text-base leading-7 text-[#111111]/70">{t.supporting}</p>

        {statusMessage ? (
          <div className={`mt-6 rounded-xl border px-4 py-3 text-sm ${statusMessage.tone}`}>{statusMessage.text}</div>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#111111]/75">{t.email}</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="w-full rounded-2xl border border-black/10 bg-[#F7F6F2] px-4 py-3 text-sm outline-none transition focus:border-[#2F6B5A]"
                placeholder="name@company.com"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#111111]/75">{t.password}</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="w-full rounded-2xl border border-black/10 bg-[#F7F6F2] px-4 py-3 text-sm outline-none transition focus:border-[#2F6B5A]"
                placeholder="********"
              />
            </label>

            <div className="flex items-center justify-between gap-4">
              <label className="inline-flex items-center gap-2 text-sm text-[#111111]/75">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                  className="h-4 w-4 rounded border-black/20 accent-[#2F6B5A]"
                />
                {t.remember}
              </label>
              <a href="#" className="text-sm font-medium text-[#111111]/65 transition hover:text-[#111111]">
                {t.forgot}
              </a>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={authState === "loading"}
                className="inline-flex w-full items-center justify-center rounded-full bg-[#2F6B5A] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#244d42] disabled:cursor-not-allowed disabled:opacity-80"
              >
                {authState === "loading" ? t.signingIn : t.signin}
              </button>
            </div>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-black/10" />
              <span className="text-xs font-medium uppercase tracking-[0.24em] text-[#111111]/45">{t.or}</span>
              <div className="h-px flex-1 bg-black/10" />
            </div>

            <button
              type="button"
              onClick={handleWalletAuth}
              className="inline-flex w-full items-center justify-center rounded-full border border-[#111111]/15 bg-white px-6 py-3 text-sm font-medium text-[#111111] transition hover:border-[#111111]/30"
            >
              {t.wallet}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-[#111111]/65">
            {t.signupPrompt}{" "}
            <Link href="/sign-up" className="font-medium text-[#111111] transition hover:text-[#2F6B5A]">
              {t.signup}
            </Link>
          </p>
      </div>
    </main>
  );
}
