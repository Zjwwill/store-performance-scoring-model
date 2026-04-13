import { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
  light?: boolean;
};

export function SectionHeading({ eyebrow, title, description, action, light }: SectionHeadingProps) {
  return (
    <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <div className={`mb-3 text-xs font-semibold uppercase tracking-[0.24em] ${light ? "text-cyan-200" : "text-cyan-600"}`}>
          {eyebrow}
        </div>
        <h2 className={`font-display text-3xl font-semibold tracking-tight sm:text-4xl ${light ? "text-white" : "text-ink"}`}>{title}</h2>
        {description ? (
          <p className={`mt-4 text-base leading-7 ${light ? "text-slate-300" : "text-slate-600"}`}>{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
