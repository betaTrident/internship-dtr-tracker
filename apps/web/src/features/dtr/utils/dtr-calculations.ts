import type { DtrForm } from "@/features/dtr/types"

export function timeToMinutes(time: string) {
  if (!time) {
    return null
  }

  const [hours, minutes] = time.split(":").map(Number)

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return null
  }

  return hours * 60 + minutes
}

export function calculateHours(form: DtrForm, dailyTargetHours: number) {
  const amIn = timeToMinutes(form.amIn)
  const amOut = timeToMinutes(form.amOut)
  const pmIn = timeToMinutes(form.pmIn)
  const pmOut = timeToMinutes(form.pmOut)
  const breakMinutes = Number(form.breakMinutes || 0)

  if (
    amIn === null ||
    amOut === null ||
    pmIn === null ||
    pmOut === null ||
    breakMinutes < 0
  ) {
    return { totalHours: 0, overtimeHours: 0, undertimeHours: 0 }
  }

  const workedMinutes = amOut - amIn + (pmOut - pmIn)
  const totalHours = Math.max(0, workedMinutes / 60)
  const roundedTotal = Number(totalHours.toFixed(2))

  return {
    totalHours: roundedTotal,
    overtimeHours: Number(Math.max(0, roundedTotal - dailyTargetHours).toFixed(2)),
    undertimeHours: Number(Math.max(0, dailyTargetHours - roundedTotal).toFixed(2)),
  }
}
