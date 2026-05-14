import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-white/[0.06] bg-[#02030a]/92 py-12 text-white/45">
      <div className="mx-auto grid max-w-[1560px] gap-8 px-4 sm:grid-cols-3 sm:px-6 lg:px-8">
        <div>
          <p className="obs-display text-xs font-semibold uppercase tracking-[0.24em] text-white/68">
            The Observer
          </p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed">
            A speculative scientific instrument for emergence, prediction, and symbolic law discovery.
          </p>
        </div>
        <div>
          <p className="obs-label">Navigate</p>
          <ul className="mt-3 space-y-2 text-sm">
            {[
              ["/observe", "Observation field"],
              ["/method", "Method and metrics"],
              ["/theories", "Theories archive"],
              ["/lab", "Experimental lab"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="text-cyan-200/70 hover:text-cyan-200">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="obs-label">Statement</p>
          <p className="mt-3 text-sm leading-relaxed">
            This is not a claim about physics. It is an interface for asking when observation becomes knowledge.
          </p>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-[1560px] px-4 text-center text-[11px] text-white/30 sm:px-6">
        Synthetic universe dynamics / computational philosophy prototype
      </div>
    </footer>
  );
}
