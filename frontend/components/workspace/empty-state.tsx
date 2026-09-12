import Link from "next/link";

type EmptyStateProps = {
  title: string;
  body: string;
  cta: string;
  href: string;
};

export function EmptyState({ title, body, cta, href }: EmptyStateProps) {
  return (
    <div className="rounded-[1.75rem] border border-dashed border-black/15 bg-white p-10 text-center">
      <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[#111111]">{title}</h2>
      <p className="mx-auto mt-4 max-w-md text-base leading-7 text-[#111111]/65">{body}</p>
      <Link
        href={href}
        className="mt-6 inline-flex items-center justify-center rounded-full bg-[#111111] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#2F6B5A]"
      >
        {cta}
      </Link>
    </div>
  );
}
