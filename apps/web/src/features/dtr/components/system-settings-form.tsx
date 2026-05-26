import { FieldLabel } from "@/components/form/field-label"
import { TextInput } from "@/components/form/text-input"
import type { SystemSettings } from "@/features/dtr/types"

type SystemSettingsFormProps = {
  settings: SystemSettings
  onSettingsChange: (settings: SystemSettings) => void
}

export function SystemSettingsForm({
  settings,
  onSettingsChange,
}: SystemSettingsFormProps) {
  function update<Key extends keyof SystemSettings>(
    key: Key,
    value: SystemSettings[Key]
  ) {
    onSettingsChange({ ...settings, [key]: value })
  }

  return (
    <div className="rounded-md border bg-card p-5 shadow-sm">
      <h2 className="text-lg font-semibold">Custom System Settings</h2>
      <div className="mt-4 grid gap-3">
        <FieldLabel label="System Title">
          <TextInput
            value={settings.systemTitle}
            onChange={(event) => update("systemTitle", event.target.value)}
          />
        </FieldLabel>
        <FieldLabel label="Default Shift Start">
          <TextInput
            type="time"
            value={settings.defaultShiftStart}
            onChange={(event) => update("defaultShiftStart", event.target.value)}
          />
        </FieldLabel>
        <FieldLabel label="Default Shift End">
          <TextInput
            type="time"
            value={settings.defaultShiftEnd}
            onChange={(event) => update("defaultShiftEnd", event.target.value)}
          />
        </FieldLabel>
        <FieldLabel label="Default Break Minutes">
          <TextInput
            min="0"
            type="number"
            value={settings.defaultBreakMinutes}
            onChange={(event) =>
              update("defaultBreakMinutes", Number(event.target.value || 0))
            }
          />
        </FieldLabel>
        <FieldLabel label="Daily Target Hours">
          <TextInput
            min="0"
            step="0.25"
            type="number"
            value={settings.dailyTargetHours}
            onChange={(event) =>
              update("dailyTargetHours", Number(event.target.value || 0))
            }
          />
        </FieldLabel>
        <FieldLabel label="Export Formats Label">
          <TextInput
            value={settings.exportFormats}
            onChange={(event) => update("exportFormats", event.target.value)}
          />
        </FieldLabel>
      </div>
    </div>
  )
}
