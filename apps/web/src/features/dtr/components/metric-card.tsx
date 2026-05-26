import type { ComponentType } from "react"

type MetricCardProps = {
  icon: ComponentType<{ className?: string }>
  label: string
  value: string
  detail: string
}

export function MetricCard({ icon: Icon, label, value, detail }: MetricCardProps) {
  return (
    <div className="rounded-md border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          <p className="mt-2 text-2xl font-semibold">{value}</p>
        </div>
        <div className="grid size-10 place-items-center rounded-md border bg-muted">
          <Icon className="size-5 text-muted-foreground" />
        </div>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{detail}</p>
    </div>
  )
}
