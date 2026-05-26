import { type FormEvent, useState } from "react"
import { Plus } from "lucide-react"

import { Button } from "@workspace/ui/components/button"

import { FieldLabel } from "@/components/form/field-label"
import { SelectInput } from "@/components/form/select-input"
import { TextArea } from "@/components/form/text-area"
import { TextInput } from "@/components/form/text-input"
import { createEmptyForm } from "@/features/dtr/data/defaults"
import type {
  AttendanceStatus,
  DtrEntry,
  DtrForm,
  InternProfile,
  SystemSettings,
  WorkSetup,
} from "@/features/dtr/types"
import { calculateHours } from "@/features/dtr/utils/dtr-calculations"
import { validateForm } from "@/features/dtr/utils/dtr-validation"

type DtrEntryFormProps = {
  profile: InternProfile
  settings: SystemSettings
  onAddEntry: (entry: DtrEntry) => void
}

export function DtrEntryForm({ profile, settings, onAddEntry }: DtrEntryFormProps) {
  const [form, setForm] = useState<DtrForm>(() => createEmptyForm(settings))
  const [error, setError] = useState("")
  const calculated = calculateHours(form, settings.dailyTargetHours)

  function updateForm<Key extends keyof DtrForm>(key: Key, value: DtrForm[Key]) {
    setForm((current) => ({ ...current, [key]: value }))
    setError("")
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const validation = validateForm(form)

    if (validation) {
      setError(validation)
      return
    }

    const hours = calculateHours(form, settings.dailyTargetHours)
    onAddEntry({
      id: `dtr-${Date.now()}`,
      internId: profile.id,
      date: form.date,
      amIn: form.amIn,
      amOut: form.amOut,
      pmIn: form.pmIn,
      pmOut: form.pmOut,
      breakMinutes: Number(form.breakMinutes || 0),
      totalHours: hours.totalHours,
      overtimeHours: hours.overtimeHours,
      undertimeHours: hours.undertimeHours,
      attendanceStatus: form.attendanceStatus,
      workSetup: form.workSetup,
      internRemarks: form.internRemarks.trim(),
      supervisorRemarks: "",
      approvalStatus: "Submitted",
    })
    setForm(createEmptyForm(settings))
  }

  return (
    <form className="rounded-md border bg-card p-5 shadow-sm" onSubmit={handleSubmit}>
      <div className="flex items-center gap-2">
        <Plus className="size-5 text-muted-foreground" />
        <h2 className="text-lg font-semibold">Add DTR Entry</h2>
      </div>
      <div className="mt-4 grid gap-3">
        <FieldLabel label="Date">
          <TextInput
            type="date"
            value={form.date}
            onChange={(event) => updateForm("date", event.target.value)}
          />
        </FieldLabel>
        <div className="grid grid-cols-2 gap-3">
          <FieldLabel label="AM In">
            <TextInput
              type="time"
              value={form.amIn}
              onChange={(event) => updateForm("amIn", event.target.value)}
            />
          </FieldLabel>
          <FieldLabel label="AM Out">
            <TextInput
              type="time"
              value={form.amOut}
              onChange={(event) => updateForm("amOut", event.target.value)}
            />
          </FieldLabel>
          <FieldLabel label="PM In">
            <TextInput
              type="time"
              value={form.pmIn}
              onChange={(event) => updateForm("pmIn", event.target.value)}
            />
          </FieldLabel>
          <FieldLabel label="PM Out">
            <TextInput
              type="time"
              value={form.pmOut}
              onChange={(event) => updateForm("pmOut", event.target.value)}
            />
          </FieldLabel>
        </div>
        <FieldLabel label="Break Minutes">
          <TextInput
            min="0"
            max="240"
            type="number"
            value={form.breakMinutes}
            onChange={(event) => updateForm("breakMinutes", event.target.value)}
          />
        </FieldLabel>
        <div className="grid grid-cols-2 gap-3">
          <FieldLabel label="Attendance">
            <SelectInput
              value={form.attendanceStatus}
              onChange={(event) =>
                updateForm("attendanceStatus", event.target.value as AttendanceStatus)
              }
            >
              <option>Present</option>
              <option>Absent</option>
              <option>Late</option>
              <option>Half-day</option>
              <option>Holiday</option>
              <option>Excused</option>
            </SelectInput>
          </FieldLabel>
          <FieldLabel label="Setup">
            <SelectInput
              value={form.workSetup}
              onChange={(event) =>
                updateForm("workSetup", event.target.value as WorkSetup)
              }
            >
              <option>WFH</option>
              <option>Hybrid</option>
            </SelectInput>
          </FieldLabel>
        </div>
        <FieldLabel label="Intern Remarks">
          <TextArea
            value={form.internRemarks}
            onChange={(event) => updateForm("internRemarks", event.target.value)}
            placeholder="Optional notes for schedule changes or context."
          />
        </FieldLabel>
        <div className="rounded-md border bg-muted/50 p-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Calculated hours</span>
            <span className="font-semibold">
              {calculated.totalHours.toFixed(2)}h
            </span>
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            Overtime {calculated.overtimeHours.toFixed(2)}h | Undertime{" "}
            {calculated.undertimeHours.toFixed(2)}h
          </div>
        </div>
        {error ? (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
            {error}
          </div>
        ) : null}
        <Button type="submit" className="w-full">
          <Plus className="size-4" />
          Submit DTR Entry
        </Button>
      </div>
    </form>
  )
}
