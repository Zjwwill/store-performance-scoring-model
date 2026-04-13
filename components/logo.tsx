export function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl bg-white/10 shadow-premium ring-1 ring-white/15">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-white/60 to-coral" />
        <div className="relative h-5 w-5 rounded-md bg-ink" />
      </div>
      <div>
        <div className="font-display text-lg font-semibold tracking-tight text-white">PrintForge</div>
        <div className="text-xs uppercase tracking-[0.22em] text-slate-300">Premium Online Printing</div>
      </div>
    </div>
  );
}
