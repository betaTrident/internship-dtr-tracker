import { useState, type FormEvent } from "react"
import { Check, Clock3, GraduationCap, ShieldCheck, UserPlus } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"

import type { StoredAuthUser } from "@/features/auth/types"
import type { Role } from "@/features/dtr"

type SignupPageProps = {
  users: StoredAuthUser[]
  onSignup: (user: StoredAuthUser) => void
  onShowLogin: () => void
}

const roleOptions = [
  { value: "intern", label: "Intern", icon: GraduationCap },
  { value: "supervisor", label: "Supervisor", icon: Check },
  { value: "admin", label: "Admin", icon: ShieldCheck },
] satisfies { value: Role; label: string; icon: typeof GraduationCap }[]

export function SignupPage({ users, onSignup, onShowLogin }: SignupPageProps) {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [role, setRole] = useState<Role>("intern")
  const [error, setError] = useState("")

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmedEmail = email.trim().toLowerCase()

    if (password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    if (users.some((user) => user.email.toLowerCase() === trimmedEmail)) {
      setError("An account with this email already exists.")
      return
    }

    const newUser: StoredAuthUser = {
      id: crypto.randomUUID(),
      fullName: fullName.trim(),
      email: trimmedEmail,
      password,
      role,
    }

    onSignup(newUser)
  }

  return (
    <main className="grid min-h-svh bg-background lg:grid-cols-[minmax(420px,520px)_minmax(0,1fr)]">
      <section className="flex items-center justify-center px-4 py-10 sm:px-6">
        <Card className="w-full max-w-md rounded-lg">
          <CardHeader>
            <div className="mb-2 grid size-10 place-items-center rounded-md bg-primary text-primary-foreground">
              <Clock3 className="size-5" />
            </div>
            <CardTitle className="text-2xl font-semibold">Create account</CardTitle>
            <p className="text-sm text-muted-foreground">
              Set up access for the internship DTR workspace.
            </p>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4" onSubmit={handleSubmit}>
              <div className="grid gap-2">
                <Label htmlFor="signup-name">Full name</Label>
                <Input
                  id="signup-name"
                  autoComplete="name"
                  value={fullName}
                  onChange={(event) => {
                    setFullName(event.target.value)
                    setError("")
                  }}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value)
                    setError("")
                  }}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label>Role</Label>
                <div className="grid grid-cols-3 gap-2">
                  {roleOptions.map((option) => {
                    const Icon = option.icon
                    const active = role === option.value

                    return (
                      <Button
                        key={option.value}
                        type="button"
                        variant={active ? "default" : "outline"}
                        onClick={() => setRole(option.value)}
                      >
                        <Icon className="size-4" />
                        {option.label}
                      </Button>
                    )
                  })}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value)
                    setError("")
                  }}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="signup-confirm-password">Confirm password</Label>
                <Input
                  id="signup-confirm-password"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) => {
                    setConfirmPassword(event.target.value)
                    setError("")
                  }}
                  required
                />
              </div>
              {error ? (
                <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </p>
              ) : null}
              <Button className="h-10 w-full" type="submit">
                <UserPlus className="size-4" />
                Sign up
              </Button>
            </form>
            <div className="mt-5 flex items-center justify-center gap-1 text-sm">
              <span className="text-muted-foreground">Already registered?</span>
              <Button variant="link" className="h-auto px-1" onClick={onShowLogin}>
                Log in
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
      <section className="hidden border-l bg-zinc-950 text-white lg:flex">
        <div className="flex w-full flex-col justify-between px-12 py-10">
          <p className="text-base font-semibold">Internship DTR Tracker</p>
          <div className="max-w-xl">
            <p className="text-5xl font-semibold leading-tight">
              One workspace for interns, supervisors, and administrators.
            </p>
          </div>
          <div className="grid gap-3 text-sm text-zinc-300">
            <div className="border-t border-white/20 pt-3">Track rendered hours</div>
            <div className="border-t border-white/20 pt-3">Review attendance status</div>
            <div className="border-t border-white/20 pt-3">Export records when needed</div>
          </div>
        </div>
      </section>
    </main>
  )
}
