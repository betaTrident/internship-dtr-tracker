import { CheckCircle2, ClipboardCheck, Clock3, Users } from "lucide-react"

import { DtrTable } from "@/features/dtr/components/dtr-table"
import { MetricCard } from "@/features/dtr/components/metric-card"
import { StatusBadge } from "@/features/dtr/components/status-badge"
import type {
  ApprovalStatus,
  DtrEntry,
  InternProfile,
} from "@/features/dtr/types"

type SupervisorPageProps = {
  profiles: InternProfile[]
  entries: DtrEntry[]
  onStatusChange: (entryId: string, status: ApprovalStatus, remarks: string) => void
}

export function SupervisorPage({
  profiles,
  entries,
  onStatusChange,
}: SupervisorPageProps) {
  const pendingEntries = entries.filter(
    (entry) =>
      entry.approvalStatus === "Submitted" ||
      entry.approvalStatus === "Needs Correction"
  )
  const approvedEntries = entries.filter((entry) => entry.approvalStatus === "Approved")

  return (
    <main className="mx-auto grid max-w-7xl gap-5 px-4 py-6 sm:px-6 lg:px-8">
      <section className="grid gap-4 md:grid-cols-4">
        <MetricCard
          icon={Users}
          label="Assigned Interns"
          value={profiles.length.toString()}
          detail="Customizable profile list"
        />
        <MetricCard
          icon={ClipboardCheck}
          label="Pending Review"
          value={pendingEntries.length.toString()}
          detail="Submitted or needs correction"
        />
        <MetricCard
          icon={CheckCircle2}
          label="Approved DTRs"
          value={approvedEntries.length.toString()}
          detail="Verified attendance entries"
        />
        <MetricCard
          icon={Clock3}
          label="Total Hours"
          value={`${entries.reduce((sum, entry) => sum + entry.totalHours, 0).toFixed(1)}h`}
          detail="All records"
        />
      </section>

      <section className="rounded-md border bg-card p-5 shadow-sm">
        <h2 className="text-lg font-semibold">Intern Progress</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {profiles.map((intern) => {
            const internEntries = entries.filter((entry) => entry.internId === intern.id)
            const total = internEntries.reduce(
              (sum, entry) => sum + entry.totalHours,
              0
            )
            const percent =
              intern.requiredHours > 0
                ? Math.min(100, (total / intern.requiredHours) * 100)
                : 0

            return (
              <div key={intern.id} className="rounded-md border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{intern.fullName || "Unnamed intern"}</p>
                    <p className="text-sm text-muted-foreground">
                      {intern.internRole || "No role"}
                    </p>
                  </div>
                  <StatusBadge label={intern.status} />
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {total.toFixed(2)} of {intern.requiredHours} hours rendered
                </p>
              </div>
            )
          })}
        </div>
      </section>

      <section className="rounded-md border bg-card p-5 shadow-sm">
        <h2 className="text-lg font-semibold">DTR Submissions for Review</h2>
        <div className="mt-4">
          <DtrTable
            entries={pendingEntries}
            profiles={profiles}
            showIntern
            onStatusChange={onStatusChange}
          />
        </div>
      </section>
    </main>
  )
}
