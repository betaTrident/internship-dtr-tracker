import { useState } from "react"
import {
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Download,
  FileDown,
  Filter,
} from "lucide-react"

import { Button } from "@workspace/ui/components/button"

import { SelectInput } from "@/components/form/select-input"
import { DtrEntryForm } from "@/features/dtr/components/dtr-entry-form"
import { DtrTable } from "@/features/dtr/components/dtr-table"
import { MetricCard } from "@/features/dtr/components/metric-card"
import { ProfileEditor } from "@/features/dtr/components/profile-editor"
import type { DtrEntry, InternProfile, SystemSettings } from "@/features/dtr/types"
import { exportCsv } from "@/features/dtr/utils/export-csv"
import { exportPdf } from "@/features/dtr/utils/export-pdf"

type InternPageProps = {
  profile: InternProfile
  entries: DtrEntry[]
  settings: SystemSettings
  onAddEntry: (entry: DtrEntry) => void
  onProfileChange: (profile: InternProfile) => void
}

export function InternPage({
  profile,
  entries,
  settings,
  onAddEntry,
  onProfileChange,
}: InternPageProps) {
  const [statusFilter, setStatusFilter] = useState("All")
  const totalRendered = entries.reduce((sum, entry) => sum + entry.totalHours, 0)
  const approvedHours = entries
    .filter((entry) => entry.approvalStatus === "Approved")
    .reduce((sum, entry) => sum + entry.totalHours, 0)
  const remaining = Math.max(0, profile.requiredHours - totalRendered)
  const progress =
    profile.requiredHours > 0
      ? Math.min(100, (totalRendered / profile.requiredHours) * 100)
      : 0
  const visibleEntries =
    statusFilter === "All"
      ? entries
      : entries.filter((entry) => entry.approvalStatus === statusFilter)

  return (
    <main className="mx-auto grid max-w-7xl gap-5 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
      <section className="grid gap-5">
        <div className="grid gap-4 md:grid-cols-4">
          <MetricCard
            icon={Clock3}
            label="Rendered"
            value={`${totalRendered.toFixed(2)}h`}
            detail={`${remaining.toFixed(2)} hours remaining`}
          />
          <MetricCard
            icon={CheckCircle2}
            label="Approved"
            value={`${approvedHours.toFixed(2)}h`}
            detail="Verified by supervisor"
          />
          <MetricCard
            icon={CalendarDays}
            label="DTR Entries"
            value={entries.length.toString()}
            detail="Current internship records"
          />
          <MetricCard
            icon={ClipboardCheck}
            label="Progress"
            value={`${progress.toFixed(0)}%`}
            detail={`${profile.requiredHours} required hours`}
          />
        </div>

        <div className="rounded-md border bg-card p-5 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Intern Profile
              </p>
              <h2 className="mt-1 text-2xl font-semibold">
                {profile.fullName || "Unnamed Intern"}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {profile.studentId || "No ID"} | {profile.course || "No program"} |{" "}
                {profile.yearLevel || "No year level"}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => exportCsv(profile, entries)}>
                <Download className="size-4" />
                CSV
              </Button>
              <Button onClick={() => exportPdf(profile, entries, settings)}>
                <FileDown className="size-4" />
                PDF
              </Button>
            </div>
          </div>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-5 grid gap-3 text-sm md:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-muted-foreground">School</p>
              <p className="font-medium">{profile.school || "Not set"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Company</p>
              <p className="font-medium">{profile.company || "Not set"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Intern Role</p>
              <p className="font-medium">{profile.internRole || "Not set"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Supervisor</p>
              <p className="font-medium">
                {profile.supervisor || profile.supervisorTitle
                  ? [profile.supervisor, profile.supervisorTitle]
                      .filter(Boolean)
                      .join(" - ")
                  : "Not set"}
              </p>
            </div>
          </div>
        </div>

        <ProfileEditor profile={profile} onProfileChange={onProfileChange} />

        <div className="rounded-md border bg-card p-5 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold">My DTR Records</h2>
              <p className="text-sm text-muted-foreground">
                Review attendance, remarks, approval state, and export-ready details.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="size-4 text-muted-foreground" />
              <SelectInput
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option>All</option>
                <option>Draft</option>
                <option>Submitted</option>
                <option>Approved</option>
                <option>Rejected</option>
                <option>Needs Correction</option>
              </SelectInput>
            </div>
          </div>
          <div className="mt-4">
            <DtrTable entries={visibleEntries} profiles={[profile]} />
          </div>
        </div>
      </section>

      <aside className="grid content-start gap-5">
        <DtrEntryForm
          profile={profile}
          settings={settings}
          onAddEntry={onAddEntry}
        />
      </aside>
    </main>
  )
}
