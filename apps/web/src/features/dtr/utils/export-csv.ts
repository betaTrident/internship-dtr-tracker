import type { DtrEntry, InternProfile } from "@/features/dtr/types"
import { formatDate, getDayName } from "@/features/dtr/utils/date"

export function exportCsv(profile: InternProfile, entries: DtrEntry[]) {
  const header = [
    "Date",
    "Day",
    "AM In",
    "AM Out",
    "PM In",
    "PM Out",
    "Break Minutes",
    "Total Hours",
    "Overtime",
    "Undertime",
    "Attendance Status",
    "Work Setup",
    "Intern Remarks",
    "Supervisor Remarks",
    "Approval Status",
  ]

  const rows = entries.map((entry) => [
    entry.date,
    getDayName(entry.date),
    entry.amIn,
    entry.amOut,
    entry.pmIn,
    entry.pmOut,
    entry.breakMinutes.toString(),
    entry.totalHours.toFixed(2),
    entry.overtimeHours.toFixed(2),
    entry.undertimeHours.toFixed(2),
    entry.attendanceStatus,
    entry.workSetup,
    entry.internRemarks,
    entry.supervisorRemarks,
    entry.approvalStatus,
  ])

  const csv = [header, ...rows]
    .map((row) => row.map((value) => `"${value.replace(/"/g, '""')}"`).join(","))
    .join("\n")

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  const fileName = profile.studentId || "intern"
  link.href = url
  link.download = `${fileName}-internship-dtr-${formatDate(new Date().toISOString().slice(0, 10))}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
