import { useMemo, useState } from "react"

import {
  AppHeader,
  AdminPage,
  InternPage,
  SupervisorPage,
  initialDtrEntries,
  initialProfile,
  initialSettings,
  type ApprovalStatus,
  type DtrEntry,
  type InternProfile,
  type Role,
  type SystemSettings,
} from "@/features/dtr"

const PROFILE_STORAGE_KEY = "internship-dtr-profiles"

function normalizeStoredProfile(profile: InternProfile) {
  const normalizedStartDate =
    profile.internshipStart === "2026-02-16"
      ? initialProfile.internshipStart
      : profile.internshipStart

  return {
    ...initialProfile,
    ...profile,
    internshipStart: normalizedStartDate || initialProfile.internshipStart,
    internshipEnd: profile.internshipEnd || initialProfile.internshipEnd,
    requiredHours:
      profile.requiredHours === 486 ? initialProfile.requiredHours : profile.requiredHours,
    status: profile.status === "Active" ? initialProfile.status : profile.status,
  }
}

function getInitialProfiles() {
  const storedProfiles = localStorage.getItem(PROFILE_STORAGE_KEY)

  if (!storedProfiles) {
    return [initialProfile]
  }

  try {
    const parsedProfiles = JSON.parse(storedProfiles) as InternProfile[]

    if (Array.isArray(parsedProfiles) && parsedProfiles.length > 0) {
      return parsedProfiles.map(normalizeStoredProfile)
    }
  } catch {
    localStorage.removeItem(PROFILE_STORAGE_KEY)
  }

  return [initialProfile]
}

export function App() {
  const [role, setRole] = useState<Role>("intern")
  const [profiles, setProfiles] = useState<InternProfile[]>(getInitialProfiles)
  const [settings, setSettings] = useState<SystemSettings>(initialSettings)
  const [entries, setEntries] = useState<DtrEntry[]>(initialDtrEntries)
  const activeProfile = profiles[0]
  const activeEntries = useMemo(
    () =>
      entries
        .filter((entry) => entry.internId === activeProfile.id)
        .sort((a, b) => a.date.localeCompare(b.date)),
    [entries, activeProfile.id]
  )

  function updateActiveProfile(profile: InternProfile) {
    setProfiles((current) => {
      const nextProfiles = current.map((item) =>
        item.id === profile.id ? profile : item
      )
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(nextProfiles))
      return nextProfiles
    })
  }

  function addEntry(entry: DtrEntry) {
    setEntries((current) =>
      [...current, entry].sort((a, b) => a.date.localeCompare(b.date))
    )
  }

  function updateEntryStatus(
    entryId: string,
    status: ApprovalStatus,
    remarks: string
  ) {
    setEntries((current) =>
      current.map((entry) =>
        entry.id === entryId
          ? { ...entry, approvalStatus: status, supervisorRemarks: remarks }
          : entry
      )
    )
  }

  return (
    <div className="min-h-svh bg-muted/30 text-foreground">
      <AppHeader
        role={role}
        title={settings.systemTitle}
        onRoleChange={setRole}
      />
      {role === "intern" ? (
        <InternPage
          profile={activeProfile}
          entries={activeEntries}
          settings={settings}
          onAddEntry={addEntry}
          onProfileChange={updateActiveProfile}
        />
      ) : null}
      {role === "supervisor" ? (
        <SupervisorPage
          profiles={profiles}
          entries={entries}
          onStatusChange={updateEntryStatus}
        />
      ) : null}
      {role === "admin" ? (
        <AdminPage
          profiles={profiles}
          entries={entries}
          settings={settings}
          onSettingsChange={setSettings}
        />
      ) : null}
    </div>
  )
}
