"use client";

import Link from "next/link";
import { useState } from "react";
import type { User } from "@/data/types";

type UserMenuProps = {
  user: User;
  profileLabel: string;
  signOutLabel: string;
  onSignOut: () => void;
};

export function UserMenu({ user, profileLabel, signOutLabel, onSignOut }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-[#111111]/15 bg-white text-sm font-medium text-[#111111] transition hover:border-[#111111]/30"
        aria-expanded={isOpen}
      >
        {user.name
          .split(" ")
          .map((part) => part[0])
          .slice(0, 2)
          .join("")}
      </button>

      {isOpen ? (
        <div className="absolute right-0 top-12 z-30 w-64 rounded-2xl border border-black/10 bg-white p-4 shadow-[0_24px_64px_rgba(17,17,17,0.12)]">
          <div>
            <div className="text-sm font-semibold text-[#111111]">{user.name}</div>
            <div className="mt-1 text-sm text-[#111111]/60">{user.email}</div>
          </div>

          <div className="my-4 h-px bg-black/10" />

          <div className="grid gap-2 text-sm">
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="rounded-xl px-3 py-2 text-[#111111]/75 transition hover:bg-[#F7F6F2] hover:text-[#111111]"
            >
              {profileLabel}
            </Link>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onSignOut();
              }}
              className="rounded-xl px-3 py-2 text-left text-[#111111]/75 transition hover:bg-[#F7F6F2] hover:text-[#111111]"
            >
              {signOutLabel}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
