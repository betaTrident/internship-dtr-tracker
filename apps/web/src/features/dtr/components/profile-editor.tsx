import { type FormEvent, useState } from "react"
import { ChevronDown, Pencil, Save, X } from "lucide-react"

import { Button } from "@workspace/ui/components/button"

import { FieldLabel } from "@/components/form/field-label"
import { SelectInput } from "@/components/form/select-input"
import { TextInput } from "@/components/form/text-input"
import type { InternProfile } from "@/features/dtr/types"

type ProfileEditorProps = {
  profile: InternProfile
  onProfileChange: (profile: InternProfile) => void
}

export function ProfileEditor({ profile, onProfileChange }: ProfileEditorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [draftProfile, setDraftProfile] = useState(profile)
  const [saveMessage, setSaveMessage] = useState("")

  function update<Key extends keyof InternProfile>(key: Key, value: InternProfile[Key]) {
    setDraftProfile((current) => ({ ...current, [key]: value }))
    setSaveMessage("")
  }

  function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onProfileChange(draftProfile)
    setSaveMessage("Profile details saved.")
    setIsOpen(false)
  }

  function handleCancel() {
    setDraftProfile(profile)
    setSaveMessage("")
    setIsOpen(false)
  }

  return (
    <div className="rounded-md border bg-card p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Custom Profile Details</h2>
          <p className="text-sm text-muted-foreground">
            Edit intern identity, school, company, and internship requirements.
          </p>
          {saveMessage ? (
            <p className="mt-1 text-sm font-medium text-emerald-600 dark:text-emerald-400">
              {saveMessage}
            </p>
          ) : null}
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setIsOpen((current) => !current)
            setSaveMessage("")
          }}
          aria-expanded={isOpen}
        >
          <Pencil className="size-4" />
          {isOpen ? "Hide" : "Edit"}
          <ChevronDown
            className={`size-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </Button>
      </div>

      {isOpen ? (
        <form className="mt-4 grid gap-4" onSubmit={handleSave}>
          <div className="grid gap-3 md:grid-cols-2">
        <FieldLabel label="Full Name">
          <TextInput
            value={draftProfile.fullName}
            onChange={(event) => update("fullName", event.target.value)}
          />
        </FieldLabel>
        <FieldLabel label="Student / Intern ID">
          <TextInput
            value={draftProfile.studentId}
            onChange={(event) => update("studentId", event.target.value)}
          />
        </FieldLabel>
        <FieldLabel label="Email">
          <TextInput
            type="email"
            value={draftProfile.email}
            onChange={(event) => update("email", event.target.value)}
          />
        </FieldLabel>
        <FieldLabel label="Contact Number">
          <TextInput
            value={draftProfile.contactNumber}
            onChange={(event) => update("contactNumber", event.target.value)}
          />
        </FieldLabel>
        <FieldLabel label="School / University">
          <TextInput
            value={draftProfile.school}
            onChange={(event) => update("school", event.target.value)}
          />
        </FieldLabel>
        <FieldLabel label="Course / Program">
          <TextInput
            value={draftProfile.course}
            onChange={(event) => update("course", event.target.value)}
          />
        </FieldLabel>
        <FieldLabel label="Year Level">
          <TextInput
            value={draftProfile.yearLevel}
            onChange={(event) => update("yearLevel", event.target.value)}
          />
        </FieldLabel>
        <FieldLabel label="Company / Organization">
          <TextInput
            value={draftProfile.company}
            onChange={(event) => update("company", event.target.value)}
          />
        </FieldLabel>
        <FieldLabel label="Intern Role / Position">
          <TextInput
            value={draftProfile.internRole}
            onChange={(event) => update("internRole", event.target.value)}
          />
        </FieldLabel>
        <FieldLabel label="Supervisor Name">
          <TextInput
            value={draftProfile.supervisor}
            onChange={(event) => update("supervisor", event.target.value)}
          />
        </FieldLabel>
        <FieldLabel label="Supervisor Title / Position">
          <TextInput
            value={draftProfile.supervisorTitle}
            onChange={(event) => update("supervisorTitle", event.target.value)}
          />
        </FieldLabel>
        <FieldLabel label="Start Date">
          <TextInput
            type="date"
            value={draftProfile.internshipStart}
            onChange={(event) => update("internshipStart", event.target.value)}
          />
        </FieldLabel>
        <FieldLabel label="End Date">
          <TextInput
            type="date"
            value={draftProfile.internshipEnd}
            onChange={(event) => update("internshipEnd", event.target.value)}
          />
        </FieldLabel>
        <FieldLabel label="Required Hours">
          <TextInput
            min="0"
            type="number"
            value={draftProfile.requiredHours}
            onChange={(event) =>
              update("requiredHours", Number(event.target.value || 0))
            }
          />
        </FieldLabel>
        <FieldLabel label="Internship Status">
          <SelectInput
            value={draftProfile.status}
            onChange={(event) =>
              update("status", event.target.value as InternProfile["status"])
            }
          >
            <option>Active</option>
            <option>Completed</option>
            <option>Inactive</option>
          </SelectInput>
        </FieldLabel>
          </div>
          <div className="flex flex-wrap justify-end gap-2 border-t pt-4">
            <Button type="button" variant="outline" onClick={handleCancel}>
              <X className="size-4" />
              Cancel
            </Button>
            <Button type="submit">
              <Save className="size-4" />
              Save Profile
            </Button>
          </div>
        </form>
      ) : null}
    </div>
  )
}
