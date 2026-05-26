import type { DtrForm } from "@/features/dtr/types"
import { timeToMinutes } from "@/features/dtr/utils/dtr-calculations"

export function validateForm(form: DtrForm) {
  const amIn = timeToMinutes(form.amIn)
  const amOut = timeToMinutes(form.amOut)
  const pmIn = timeToMinutes(form.pmIn)
  const pmOut = timeToMinutes(form.pmOut)
  const breakMinutes = Number(form.breakMinutes || 0)

  if (!form.date) {
    return "Date is required."
  }

  if (amIn === null || amOut === null || pmIn === null || pmOut === null) {
    return "Complete all morning and afternoon time fields."
  }

  if (amOut <= amIn) {
    return "Morning time out must be later than morning time in."
  }

  if (pmOut <= pmIn) {
    return "Afternoon time out must be later than afternoon time in."
  }

  if (pmIn < amOut) {
    return "Afternoon time in cannot overlap the morning schedule."
  }

  if (breakMinutes < 0 || breakMinutes > 240) {
    return "Break duration must be between 0 and 240 minutes."
  }

  return ""
}
