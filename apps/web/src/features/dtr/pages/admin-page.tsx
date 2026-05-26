import { Building2, ClipboardCheck, Clock3, Users } from "lucide-react"

import { EmptyState } from "@/features/dtr/components/empty-state"
import { MetricCard } from "@/features/dtr/components/metric-card"
import { StatusBadge } from "@/features/dtr/components/status-badge"
import { SystemSettingsForm } from "@/features/dtr/components/system-settings-form"
import type { DtrEntry, InternProfile, SystemSettings } from "@/features/dtr/types"

type AdminPageProps = {
  profiles: InternProfile[]
  entries: DtrEntry[]
  settings: SystemSettings
  onSettingsChange: (settings: SystemSettings) => void
}

export function AdminPage({
  profiles,
  entries,
  settings,
  onSettingsChange,
}: AdminPageProps) {
  const totalRendered = entries.reduce((sum, entry) => sum + entry.totalHours, 0)
  const pending = entries.filter((entry) => entry.approvalStatus === "Submitted")
  const roles = Array.from(
    new Set(profiles.map((intern) => intern.internRole).filter(Boolean))
  )

  return (
    <main className="mx-auto grid max-w-7xl gap-5 px-4 py-6 sm:px-6 lg:px-8">
      <section className="grid gap-4 md:grid-cols-4">
        <MetricCard
          icon={Users}
          label="Total Interns"
          value={profiles.length.toString()}
          detail="Editable prototype profile"
        />
        <MetricCard
          icon={Building2}
          label="Roles"
          value={roles.length.toString()}
          detail="Based on profile roles"
        />
        <MetricCard
          icon={Clock3}
          label="Rendered Hours"
          value={`${totalRendered.toFixed(1)}h`}
          detail="All DTR entries"
        />
        <MetricCard
          icon={ClipboardCheck}
          label="Pending"
          value={pending.length.toString()}
          detail="Awaiting supervisor review"
        />
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <div className="rounded-md border bg-card p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Internship Program Report</h2>
          <div className="mt-4 overflow-hidden rounded-md border">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[780px] text-left text-sm">
                <thead className="border-b bg-muted/70 text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Intern</th>
                    <th className="px-4 py-3">Program</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Rendered</th>
                    <th className="px-4 py-3">Remaining</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {profiles.map((intern) => {
                    const internEntries = entries.filter(
                      (entry) => entry.internId === intern.id
                    )
                    const rendered = internEntries.reduce(
                      (sum, entry) => sum + entry.totalHours,
                      0
                    )
                    const remaining = Math.max(0, intern.requiredHours - rendered)

                    return (
                      <tr key={intern.id} className="border-b last:border-0">
                        <td className="px-4 py-3">
                          <div className="font-medium">
                            {intern.fullName || "Unnamed intern"}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {intern.studentId || "No ID"}
                          </div>
                        </td>
                        <td className="px-4 py-3">{intern.course || "Not set"}</td>
                        <td className="px-4 py-3">{intern.internRole || "Not set"}</td>
                        <td className="px-4 py-3">{rendered.toFixed(2)}h</td>
                        <td className="px-4 py-3">{remaining.toFixed(2)}h</td>
                        <td className="px-4 py-3">
                          <StatusBadge label={intern.status} />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="grid content-start gap-5">
          <SystemSettingsForm
            settings={settings}
            onSettingsChange={onSettingsChange}
          />

          <div className="rounded-md border bg-card p-5 shadow-sm">
            <h2 className="text-lg font-semibold">Role Hours</h2>
            <div className="mt-4 grid gap-3">
              {roles.length === 0 ? (
                <EmptyState message="Add intern roles in the profile editor to populate this report." />
              ) : (
                roles.map((role) => {
                  const roleInterns = profiles.filter(
                    (intern) => intern.internRole === role
                  )
                  const roleHours = entries
                    .filter((entry) =>
                      roleInterns.some((intern) => intern.id === entry.internId)
                    )
                    .reduce((sum, entry) => sum + entry.totalHours, 0)

                  return (
                    <div
                      key={role}
                      className="flex items-center justify-between gap-4 rounded-md border p-3 text-sm"
                    >
                      <span>{role}</span>
                      <span className="font-semibold">{roleHours.toFixed(2)}h</span>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
