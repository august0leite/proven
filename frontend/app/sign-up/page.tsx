"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { translations, useStoredLocale } from "../i18n/client";

type SignupState = "idle" | "loading" | "exists" | "connection" | "wallet" | "success";

type FieldErrors = {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
};

declare global {
  interface Window {
    ethereum?: unknown;
  }
}

export default function SignUpPage() {
  const { locale, setLocale } = useStoredLocale("pt");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signupState, setSignupState] = useState<SignupState>("idle");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const router = useRouter();

  const t = translations[locale].signUp;

  const statusMessage = useMemo(() => {
    switch (signupState) {
      case "exists":
        return {
          tone: "border-[#B77D2B]/25 bg-[#B77D2B]/10 text-[#7D5A24]",
          text: t.status.exists,
          showSignInLink: true,
        };
      case "connection":
        return {
          tone: "border-[#8E3636]/20 bg-[#8E3636]/8 text-[#6F2929]",
          text: t.status.connection,
          showSignInLink: false,
        };
      case "wallet":
        return {
          tone: "border-[#2F6B5A]/20 bg-[#2F6B5A]/8 text-[#244D42]",
          text: t.status.wallet,
          showSignInLink: false,
        };
      case "success":
        return {
          tone: "border-[#2F6B5A]/25 bg-[#2F6B5A]/10 text-[#244D42]",
          text: t.status.success,
          showSignInLink: false,
        };
      default:
        return null;
    }
  }, [signupState, t]);

  const isSubmitting = signupState === "loading";

  const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const validate = () => {
    const errors: FieldErrors = {};

    if (!fullName.trim()) {
      errors.fullName = t.errors.fullName;
    }

    if (!email.trim()) {
      errors.email = t.errors.emailRequired;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = t.errors.emailInvalid;
    }

    if (password.length < 8) {
      errors.password = t.errors.passwordLength;
    }

    if (confirmPassword !== password) {
      errors.confirmPassword = t.errors.passwordsMatch;
    }

    if (!acceptedTerms) {
      errors.terms = t.errors.terms;
    }

    return errors;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSignupState("idle");

    const errors = validate();
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setSignupState("loading");
    await wait(900);

    if (!navigator.onLine || email.trim().toLowerCase() === "network@proven.io") {
      setSignupState("connection");
      return;
    }

    if (email.trim().toLowerCase() === "exists@proven.io") {
      setSignupState("exists");
      return;
    }

    setSignupState("success");
    await wait(650);
    router.push("/onboarding");
  };

  const handleWallet = async () => {
    setSignupState("wallet");
    setFieldErrors({});
    await wait(700);

    if (!window.ethereum) {
      return;
    }

    setSignupState("success");
    await wait(650);
    router.push("/onboarding?credential=wallet");
  };


  const buttonClass = signupState === "exists" || signupState === "connection"
    ? "bg-[#8E3636] hover:bg-[#742d2d]"
    : "bg-[#2F6B5A] hover:bg-[#244d42]";

  return (
    <main className="h-screen overflow-hidden bg-[#F7F6F2] px-4 py-4 text-[#111111] sm:px-6 sm:py-6 lg:px-8">
      <div className="mx-auto flex h-full w-full max-w-xl flex-col justify-center">
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

        <div className="mx-auto mt-4 w-full max-w-xl rounded-[2rem] border border-black/10 bg-white p-5 shadow-[0_24px_64px_rgba(17,17,17,0.08)] sm:p-6 md:p-7">
          <h1 className="text-4xl font-semibold tracking-[-0.05em] md:text-5xl">{t.heading}</h1>
          <p className="mt-3 text-sm leading-6 text-[#111111]/70 sm:text-base sm:leading-7">{t.supporting}</p>

          {statusMessage ? (
            <div className={`mt-4 rounded-xl border px-4 py-3 text-sm ${statusMessage.tone}`}>
              <span>{statusMessage.text}</span>
              {statusMessage.showSignInLink ? (
                <>
                  {" "}
                  <Link href="/sign-in" className="font-medium underline">
                    {t.signin}
                  </Link>
                </>
              ) : null}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#111111]/75">{t.fullName}</span>
              <input
                type="text"
                value={fullName}
                onChange={(event) => {
                  setFullName(event.target.value);
                  if (fieldErrors.fullName) {
                    setFieldErrors((prev) => ({ ...prev, fullName: undefined }));
                  }
                }}
                required
                disabled={isSubmitting}
                className={`w-full rounded-2xl border bg-[#F7F6F2] px-4 py-3 text-sm outline-none transition focus:border-[#2F6B5A] ${
                  fieldErrors.fullName ? "border-[#8E3636]/45" : "border-black/10"
                }`}
                placeholder={t.fullNamePlaceholder}
              />
              {fieldErrors.fullName ? <p className="mt-2 text-xs text-[#6F2929]">{fieldErrors.fullName}</p> : null}
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#111111]/75">{t.workEmail}</span>
              <input
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (fieldErrors.email) {
                    setFieldErrors((prev) => ({ ...prev, email: undefined }));
                  }
                }}
                required
                disabled={isSubmitting}
                className={`w-full rounded-2xl border bg-[#F7F6F2] px-4 py-3 text-sm outline-none transition focus:border-[#2F6B5A] ${
                  fieldErrors.email ? "border-[#8E3636]/45" : "border-black/10"
                }`}
                placeholder={t.workEmailPlaceholder}
              />
              {fieldErrors.email ? <p className="mt-2 text-xs text-[#6F2929]">{fieldErrors.email}</p> : null}
            </label>

            <label className="block">
              <div className="mb-2 flex items-center justify-between">
                <span className="block text-sm font-medium text-[#111111]/75">{t.password}</span>
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-xs font-medium uppercase tracking-[0.2em] text-[#111111]/55 transition hover:text-[#111111]"
                >
                  {showPassword ? t.hide : t.show}
                </button>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  if (fieldErrors.password) {
                    setFieldErrors((prev) => ({ ...prev, password: undefined }));
                  }
                }}
                required
                disabled={isSubmitting}
                className={`w-full rounded-2xl border bg-[#F7F6F2] px-4 py-3 text-sm outline-none transition focus:border-[#2F6B5A] ${
                  fieldErrors.password ? "border-[#8E3636]/45" : "border-black/10"
                }`}
                placeholder={t.passwordPlaceholder}
              />
              <p className="mt-2 text-xs text-[#111111]/55">{t.passwordRequirement}</p>
              {fieldErrors.password ? <p className="mt-1 text-xs text-[#6F2929]">{fieldErrors.password}</p> : null}
            </label>

            <label className="block">
              <div className="mb-2 flex items-center justify-between">
                <span className="block text-sm font-medium text-[#111111]/75">{t.confirmPassword}</span>
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="text-xs font-medium uppercase tracking-[0.2em] text-[#111111]/55 transition hover:text-[#111111]"
                >
                  {showConfirmPassword ? t.hide : t.show}
                </button>
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(event) => {
                  setConfirmPassword(event.target.value);
                  if (fieldErrors.confirmPassword) {
                    setFieldErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                  }
                }}
                required
                disabled={isSubmitting}
                className={`w-full rounded-2xl border bg-[#F7F6F2] px-4 py-3 text-sm outline-none transition focus:border-[#2F6B5A] ${
                  fieldErrors.confirmPassword ? "border-[#8E3636]/45" : "border-black/10"
                }`}
                placeholder={t.confirmPasswordPlaceholder}
              />
              {fieldErrors.confirmPassword ? <p className="mt-2 text-xs text-[#6F2929]">{fieldErrors.confirmPassword}</p> : null}
            </label>

            <div className="rounded-xl border border-black/10 bg-[#F7F6F2] px-4 py-3">
              <label className="inline-flex items-start gap-3 text-sm text-[#111111]/75">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(event) => {
                    setAcceptedTerms(event.target.checked);
                    if (fieldErrors.terms) {
                      setFieldErrors((prev) => ({ ...prev, terms: undefined }));
                    }
                  }}
                  disabled={isSubmitting}
                  className="mt-0.5 h-4 w-4 rounded border-black/20 accent-[#2F6B5A]"
                />
                <span>
                  {t.termsPrefix}{" "}
                  <a href="#" className="font-medium text-[#111111] underline decoration-black/25 underline-offset-2">
                    {t.terms}
                  </a>{" "}
                  {t.and}{" "}
                  <a href="#" className="font-medium text-[#111111] underline decoration-black/25 underline-offset-2">
                    {t.privacy}
                  </a>
                </span>
              </label>
              {fieldErrors.terms ? <p className="mt-2 text-xs text-[#6F2929]">{fieldErrors.terms}</p> : null}
            </div>

            <div className="pt-1">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-sm font-medium text-white transition active:scale-[0.995] disabled:cursor-not-allowed disabled:opacity-80 ${buttonClass}`}
              >
                {isSubmitting ? t.creatingAccount : t.createAccount}
              </button>
            </div>

            <div className="my-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-black/10" />
              <span className="text-xs font-medium uppercase tracking-[0.24em] text-[#111111]/45">{t.or}</span>
              <div className="h-px flex-1 bg-black/10" />
            </div>

            <button
              type="button"
              onClick={handleWallet}
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center rounded-full border border-[#111111]/15 bg-white px-6 py-3 text-sm font-medium text-[#111111] transition hover:border-[#111111]/30 disabled:cursor-not-allowed disabled:opacity-75"
            >
              {t.wallet}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-[#111111]/65">
            {t.signinPrompt}{" "}
            <Link href="/sign-in" className="font-medium text-[#111111] transition hover:text-[#2F6B5A]">
              {t.signin}
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
