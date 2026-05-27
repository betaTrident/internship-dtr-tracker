import { useMemo, useState } from "react"

import { LoginPage, SignupPage, type AuthUser, type StoredAuthUser } from "@/features/auth"
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
const AUTH_USERS_STORAGE_KEY = "internship-dtr-auth-users"
const AUTH_SESSION_STORAGE_KEY = "internship-dtr-auth-session"

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

function getInitialAuthUsers() {
  const storedUsers = localStorage.getItem(AUTH_USERS_STORAGE_KEY)

  if (!storedUsers) {
    return []
  }

  try {
    const parsedUsers = JSON.parse(storedUsers) as StoredAuthUser[]

    if (Array.isArray(parsedUsers)) {
      return parsedUsers
    }
  } catch {
    localStorage.removeItem(AUTH_USERS_STORAGE_KEY)
  }

  return []
}

function getInitialSession() {
  const storedSession = localStorage.getItem(AUTH_SESSION_STORAGE_KEY)

  if (!storedSession) {
    return null
  }

  try {
    return JSON.parse(storedSession) as AuthUser
  } catch {
    localStorage.removeItem(AUTH_SESSION_STORAGE_KEY)
  }

  return null
}

export function App() {
  const [authMode, setAuthMode] = useState<"login" | "signup">("login")
  const [authUsers, setAuthUsers] = useState<StoredAuthUser[]>(getInitialAuthUsers)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(getInitialSession)
  const [role, setRole] = useState<Role>(currentUser?.role ?? "intern")
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

  function setAuthenticatedUser(user: AuthUser) {
    localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(user))
    setCurrentUser(user)
    setRole(user.role)
  }

  function signupUser(user: StoredAuthUser) {
    const nextUsers = [...authUsers, user]
    localStorage.setItem(AUTH_USERS_STORAGE_KEY, JSON.stringify(nextUsers))
    setAuthUsers(nextUsers)

    setAuthenticatedUser({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    })
  }

  function signOut() {
    localStorage.removeItem(AUTH_SESSION_STORAGE_KEY)
    setCurrentUser(null)
    setRole("intern")
    setAuthMode("login")
  }

  if (!currentUser) {
    return authMode === "login" ? (
      <LoginPage
        users={authUsers}
        onLogin={setAuthenticatedUser}
        onShowSignup={() => setAuthMode("signup")}
      />
    ) : (
      <SignupPage
        users={authUsers}
        onSignup={signupUser}
        onShowLogin={() => setAuthMode("login")}
      />
    )
  }

  return (
    <div className="min-h-svh bg-muted/30 text-foreground">
      <AppHeader
        role={role}
        title={settings.systemTitle}
        userName={currentUser.fullName}
        onRoleChange={setRole}
        onSignOut={signOut}
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
