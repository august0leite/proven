"use client";

import { useEffect, useState } from "react";
import type { User } from "@/data/types";

export type SessionLocale = "en" | "pt";

export type SessionState = {
  isAuthenticated: boolean;
  locale: SessionLocale;
  user: User | null;
};

const SESSION_KEY = "proven-session";

const DEFAULT_SESSION: SessionState = {
  isAuthenticated: false,
  locale: "pt",
  user: null,
};

function isLocale(value: unknown): value is SessionLocale {
  return value === "en" || value === "pt";
}

function normalizeSession(raw: unknown): SessionState {
  if (!raw || typeof raw !== "object") {
    return DEFAULT_SESSION;
  }

  const maybeSession = raw as Partial<SessionState>;

  return {
    isAuthenticated: Boolean(maybeSession.isAuthenticated),
    locale: isLocale(maybeSession.locale) ? maybeSession.locale : DEFAULT_SESSION.locale,
    user: maybeSession.user ?? null,
  };
}

export function readSession(): SessionState {
  if (typeof window === "undefined") {
    return DEFAULT_SESSION;
  }

  try {
    const stored = window.localStorage.getItem(SESSION_KEY);

    if (!stored) {
      return DEFAULT_SESSION;
    }

    const parsed = JSON.parse(stored) as unknown;
    return normalizeSession(parsed);
  } catch {
    return DEFAULT_SESSION;
  }
}

export function writeSession(session: SessionState) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function updateSession(patch: Partial<SessionState>) {
  const current = readSession();
  const next = normalizeSession({ ...current, ...patch });
  writeSession(next);
  return next;
}

export function setSessionLocale(locale: SessionLocale) {
  return updateSession({ locale });
}

export function setAuthenticatedUser(user: User) {
  return updateSession({ isAuthenticated: true, user });
}

export function signOutSession() {
  const current = readSession();
  const next: SessionState = {
    isAuthenticated: false,
    locale: current.locale,
    user: null,
  };

  writeSession(next);
  return next;
}

export function useSessionState() {
  const [session, setSession] = useState<SessionState>(DEFAULT_SESSION);

  useEffect(() => {
    setSession(readSession());
  }, []);

  const setLocale = (locale: SessionLocale) => {
    const next = setSessionLocale(locale);
    setSession(next);
  };

  const signIn = (user: User) => {
    const next = setAuthenticatedUser(user);
    setSession(next);
  };

  const signOut = () => {
    const next = signOutSession();
    setSession(next);
  };

  return {
    session,
    setLocale,
    signIn,
    signOut,
  };
}
