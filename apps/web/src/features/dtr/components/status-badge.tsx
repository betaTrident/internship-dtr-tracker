import { statusClass } from "@/features/dtr/utils/status-style"

export function StatusBadge({ label }: { label: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium ${statusClass(
        label
      )}`}
    >
      {label}
    </span>
  )
}
