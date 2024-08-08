import { CopyButton } from "./copy-button";

export function Property({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="grid grid-cols-[auto_1fr_auto] gap-2 items-center justify-between mb-2 pb-2 border-b border-border/50 last:border-b-0 text-sm last:mb-0 last:pb-0"
    >
      <strong className="line-clamp-1">{label}</strong>
      <span className="text-accent-foreground opacity-80 line-clamp-1 text-right">
        {value}
      </span>

        <CopyButton variant="ghost" value={value} />
      </div>
  )
}