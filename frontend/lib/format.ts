import type { Locale } from "@/data/types";

export function formatCurrency(value: number, currency: string, locale: Locale) {
  return new Intl.NumberFormat(locale === "pt" ? "pt-BR" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatShortDate(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "pt" ? "pt-BR" : "en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

export function formatDateTime(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "pt" ? "pt-BR" : "en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date(value));
}

export function formatRelativeTime(value: string, locale: Locale) {
  const now = Date.now();
  const date = new Date(value).getTime();
  const diffHours = Math.round((date - now) / (1000 * 60 * 60));
  const formatter = new Intl.RelativeTimeFormat(locale === "pt" ? "pt-BR" : "en-US", {
    numeric: "auto",
  });

  if (Math.abs(diffHours) < 24) {
    return formatter.format(diffHours, "hour");
  }

  const diffDays = Math.round(diffHours / 24);
  return formatter.format(diffDays, "day");
}
