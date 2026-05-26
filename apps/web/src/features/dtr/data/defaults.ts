import type {
  DtrEntry,
  DtrForm,
  InternProfile,
  SystemSettings,
} from "@/features/dtr/types"

export const initialProfile: InternProfile = {
  id: "intern-1",
  fullName: "",
  studentId: "",
  email: "",
  contactNumber: "",
  school: "",
  course: "",
  yearLevel: "",
  company: "",
  internRole: "",
  supervisor: "",
  supervisorTitle: "",
  internshipStart: "2026-02-17",
  internshipEnd: "2026-05-29",
  requiredHours: 729,
  status: "Completed",
}

export const initialSettings: SystemSettings = {
  systemTitle: "Internship DTR Tracker",
  defaultShiftStart: "09:00",
  defaultShiftEnd: "18:00",
  defaultBreakMinutes: 60,
  dailyTargetHours: 8,
  exportFormats: "PDF, CSV",
}

export function createEmptyForm(settings: SystemSettings): DtrForm {
  return {
    date: formatDateInput(new Date()),
    amIn: settings.defaultShiftStart,
    amOut: "12:00",
    pmIn: "13:00",
    pmOut: settings.defaultShiftEnd,
    breakMinutes: settings.defaultBreakMinutes.toString(),
    attendanceStatus: "Present",
    workSetup: "WFH",
    internRemarks: "",
  }
}

function formatDateInput(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function isWeekday(date: Date) {
  const day = date.getDay()
  return day !== 0 && day !== 6
}

function addDays(date: Date, days: number) {
  const nextDate = new Date(date)
  nextDate.setDate(nextDate.getDate() + days)
  return nextDate
}

type GeneratedSchedule = {
  amIn: string
  amOut: string
  pmIn: string
  pmOut: string
}

const onboardingSchedule: GeneratedSchedule = {
  amIn: "09:00",
  amOut: "12:00",
  pmIn: "13:00",
  pmOut: "16:00",
}

const scheduleByHours: Record<10 | 11 | 12, GeneratedSchedule> = {
  10: { amIn: "09:00", amOut: "12:00", pmIn: "13:00", pmOut: "20:00" },
  11: { amIn: "09:00", amOut: "12:00", pmIn: "13:00", pmOut: "21:00" },
  12: { amIn: "09:00", amOut: "12:00", pmIn: "13:00", pmOut: "22:00" },
}

const extensionWeekSchedules: GeneratedSchedule[] = [
  { amIn: "10:00", amOut: "12:00", pmIn: "13:00", pmOut: "17:00" },
  { amIn: "N/A", amOut: "N/A", pmIn: "13:00", pmOut: "20:00" },
  { amIn: "09:00", amOut: "12:00", pmIn: "13:00", pmOut: "18:00" },
  { amIn: "N/A", amOut: "N/A", pmIn: "14:00", pmOut: "20:30" },
  { amIn: "10:00", amOut: "12:00", pmIn: "13:00", pmOut: "18:30" },
]

function generatedTimeToMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number)

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return null
  }

  return hours * 60 + minutes
}

function sessionHours(timeIn: string, timeOut: string) {
  const start = generatedTimeToMinutes(timeIn)
  const end = generatedTimeToMinutes(timeOut)

  if (start === null || end === null || end <= start) {
    return 0
  }

  return (end - start) / 60
}

function totalScheduleHours(schedule: GeneratedSchedule) {
  return Number(
    (
      sessionHours(schedule.amIn, schedule.amOut) +
      sessionHours(schedule.pmIn, schedule.pmOut)
    ).toFixed(2)
  )
}

export function createInternshipDtrEntries(internId: string): DtrEntry[] {
  const startDate = new Date("2026-02-17T00:00:00")
  const endDate = new Date("2026-05-29T00:00:00")
  const officialCompletionDate = "2026-05-22"
  const entries: DtrEntry[] = []
  let currentDate = startDate
  let workdayIndex = 0
  let overtimeDayIndex = 0

  while (currentDate <= endDate) {
    if (isWeekday(currentDate)) {
      const date = formatDateInput(currentDate)
      const isExtensionWeek = date > officialCompletionDate
      let schedule: GeneratedSchedule
      let internRemarks = ""

      if (isExtensionWeek) {
        schedule =
          extensionWeekSchedules[
            entries.filter((entry) => entry.date > officialCompletionDate).length %
              extensionWeekSchedules.length
          ]
      } else if (workdayIndex === 0) {
        schedule = onboardingSchedule
        internRemarks = "Onboarding day (6 hours)."
      } else {
        overtimeDayIndex += 1
        if (overtimeDayIndex <= 46) {
          schedule = scheduleByHours[10]
        } else if (overtimeDayIndex === 47) {
          schedule = scheduleByHours[11]
        } else {
          schedule = scheduleByHours[12]
        }
      }

      const totalHours = totalScheduleHours(schedule)
      const overtimeHours = Number(Math.max(0, totalHours - 8).toFixed(2))
      const undertimeHours = Number(Math.max(0, 8 - totalHours).toFixed(2))

      if (!isExtensionWeek && date === officialCompletionDate) {
        internRemarks = "Official internship completion date (729 hours reached)."
      }

      entries.push({
        id: `dtr-${date}`,
        internId,
        date,
        amIn: schedule.amIn,
        amOut: schedule.amOut,
        pmIn: schedule.pmIn,
        pmOut: schedule.pmOut,
        breakMinutes: 60,
        totalHours,
        overtimeHours,
        undertimeHours,
        attendanceStatus: "Present",
        workSetup: "WFH",
        internRemarks:
          internRemarks ||
          (isExtensionWeek
            ? "Extension week after official internship completion on May 22, 2026."
            : ""),
        supervisorRemarks: "Approved.",
        approvalStatus: "Approved",
      })

      if (!isExtensionWeek) {
        workdayIndex += 1
      }
    }

    currentDate = addDays(currentDate, 1)
  }

  return entries
}

export const initialDtrEntries = createInternshipDtrEntries(initialProfile.id)
