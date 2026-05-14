import Link from "next/link";
import { Eye, Radio } from "lucide-react";

const links = [
  { href: "/observe", label: "Observe" },
  { href: "/method", label: "Method" },
  { href: "/theories", label: "Theories" },
  { href: "/lab", label: "Lab" },
  { href: "/about", label: "About" },
];

export default function NavBar() {
  return (
    <header className="sticky top-0 z-[100] border-b border-white/[0.06] bg-[#02030a]/76 backdrop-blur-2xl">
      <div className="mx-auto flex h-16 max-w-[1560px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-3 text-white">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-full border border-cyan-200/20 bg-cyan-200/5 text-cyan-200 shadow-[0_0_32px_rgba(103,232,249,0.12)]">
            <Eye className="h-4 w-4" aria-hidden />
            <span className="absolute inset-[-5px] rounded-full border border-cyan-200/10 opacity-0 transition group-hover:opacity-100" />
          </span>
          <span className="obs-display text-sm font-semibold uppercase tracking-[0.24em]">
            The Observer
          </span>
        </Link>

        <nav className="hidden items-center rounded-full border border-white/[0.08] bg-white/[0.035] p-1 backdrop-blur-xl md:flex" aria-label="Site">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="rounded-full px-4 py-2 text-xs font-medium text-white/58 transition hover:bg-white/[0.07] hover:text-white"
            >
              {label}
            </Link>
          ))}
        </nav>

        <Link
          href="/observe"
          className="obs-link-glow inline-flex h-10 items-center gap-2 rounded-full bg-white/[0.055] px-4 text-xs font-semibold text-cyan-100 transition hover:-translate-y-0.5 hover:bg-cyan-300/10"
        >
          <Radio className="h-3.5 w-3.5" aria-hidden />
          Live Field
        </Link>
      </div>
    </header>
  );
}
