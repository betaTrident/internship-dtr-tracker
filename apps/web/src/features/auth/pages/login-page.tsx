import { useState, type FormEvent } from "react"
import { ArrowRight, Clock3, LogIn } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"

import type { AuthUser, StoredAuthUser } from "@/features/auth/types"

type LoginPageProps = {
  users: StoredAuthUser[]
  onLogin: (user: AuthUser) => void
  onShowSignup: () => void
}

export function LoginPage({ users, onLogin, onShowSignup }: LoginPageProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const user = users.find(
      (item) =>
        item.email.toLowerCase() === email.trim().toLowerCase() &&
        item.password === password
    )

    if (!user) {
      setError("Email or password is incorrect.")
      return
    }

    onLogin({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    })
  }

  return (
    <main className="grid min-h-svh bg-background lg:grid-cols-[minmax(0,1fr)_minmax(420px,520px)]">
      <section className="hidden border-r bg-zinc-950 text-white lg:flex">
        <div className="flex w-full flex-col justify-between px-12 py-10">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-md bg-white text-zinc-950">
              <Clock3 className="size-5" />
            </div>
            <div>
              <p className="text-base font-semibold">Internship DTR Tracker</p>
              <p className="text-sm text-zinc-400">Attendance and approval workspace</p>
            </div>
          </div>
          <div className="max-w-xl">
            <p className="text-5xl font-semibold leading-tight">
              Keep daily records clean, reviewed, and ready to export.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-sm text-zinc-300">
            <div className="border-t border-white/20 pt-3">Intern logs</div>
            <div className="border-t border-white/20 pt-3">Supervisor review</div>
            <div className="border-t border-white/20 pt-3">Admin settings</div>
          </div>
        </div>
      </section>
      <section className="flex items-center justify-center px-4 py-10 sm:px-6">
        <Card className="w-full max-w-md rounded-lg">
          <CardHeader>
            <div className="mb-2 grid size-10 place-items-center rounded-md bg-primary text-primary-foreground lg:hidden">
              <Clock3 className="size-5" />
            </div>
            <CardTitle className="text-2xl font-semibold">Log in</CardTitle>
            <p className="text-sm text-muted-foreground">
              Access your DTR dashboard using your registered account.
            </p>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4" onSubmit={handleSubmit}>
              <div className="grid gap-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
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
                <Label htmlFor="login-password">Password</Label>
                <Input
                  id="login-password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value)
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
                <LogIn className="size-4" />
                Log in
              </Button>
            </form>
            <div className="mt-5 flex items-center justify-center gap-1 text-sm">
              <span className="text-muted-foreground">No account yet?</span>
              <Button variant="link" className="h-auto px-1" onClick={onShowSignup}>
                Sign up
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
