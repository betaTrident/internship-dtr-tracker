import { CheckCircle2, RotateCcw, XCircle } from "lucide-react"

import { Button } from "@workspace/ui/components/button"

import { EmptyState } from "@/features/dtr/components/empty-state"
import { StatusBadge } from "@/features/dtr/components/status-badge"
import type { ApprovalStatus, DtrEntry, InternProfile } from "@/features/dtr/types"
import { formatDate, getDayName } from "@/features/dtr/utils/date"

type DtrTableProps = {
  entries: DtrEntry[]
  profiles: InternProfile[]
  showIntern?: boolean
  onStatusChange?: (entryId: string, status: ApprovalStatus, remarks: string) => void
}

export function DtrTable({
  entries,
  profiles,
  showIntern = false,
  onStatusChange,
}: DtrTableProps) {
  if (entries.length === 0) {
    return <EmptyState message="No DTR entries yet. Add an entry to begin tracking." />
  }

  return (
    <div className="overflow-hidden rounded-md border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="border-b bg-muted/70 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              {showIntern ? <th className="px-4 py-3">Intern</th> : null}
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">AM</th>
              <th className="px-4 py-3">PM</th>
              <th className="px-4 py-3">Hours</th>
              <th className="px-4 py-3">Attendance</th>
              <th className="px-4 py-3">Setup</th>
              <th className="px-4 py-3">Remarks</th>
              <th className="px-4 py-3">Approval</th>
              {onStatusChange ? <th className="px-4 py-3">Review</th> : null}
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => {
              const intern = profiles.find((item) => item.id === entry.internId)

              return (
                <tr key={entry.id} className="border-b last:border-0">
                  {showIntern ? (
                    <td className="px-4 py-3 font-medium">
                      {intern?.fullName || "Unnamed intern"}
                    </td>
                  ) : null}
                  <td className="px-4 py-3">
                    <div className="font-medium">{formatDate(entry.date)}</div>
                    <div className="text-xs text-muted-foreground">
                      {getDayName(entry.date)}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {entry.amIn} - {entry.amOut}
                  </td>
                  <td className="px-4 py-3">
                    {entry.pmIn} - {entry.pmOut}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{entry.totalHours.toFixed(2)}</div>
                    <div className="text-xs text-muted-foreground">
                      OT {entry.overtimeHours.toFixed(2)} / UT{" "}
                      {entry.undertimeHours.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge label={entry.attendanceStatus} />
                  </td>
                  <td className="px-4 py-3">{entry.workSetup}</td>
                  <td className="max-w-[220px] px-4 py-3 text-muted-foreground">
                    {entry.internRemarks || "-"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge label={entry.approvalStatus} />
                  </td>
                  {onStatusChange ? (
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            onStatusChange(
                              entry.id,
                              "Approved",
                              "Reviewed and approved."
                            )
                          }
                        >
                          <CheckCircle2 className="size-4" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            onStatusChange(
                              entry.id,
                              "Needs Correction",
                              "Please correct this DTR entry."
                            )
                          }
                        >
                          <RotateCcw className="size-4" />
                          Revise
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            onStatusChange(
                              entry.id,
                              "Rejected",
                              "Rejected after review. Please resubmit."
                            )
                          }
                        >
                          <XCircle className="size-4" />
                          Reject
                        </Button>
                      </div>
                    </td>
                  ) : null}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
