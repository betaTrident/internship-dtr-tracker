import {
  ClipboardCheck,
  Clock3,
  GraduationCap,
  Moon,
  ShieldCheck,
  Sun,
} from "lucide-react"

import { Button } from "@workspace/ui/components/button"

import { useTheme } from "@/components/theme-provider"
import type { Role } from "@/features/dtr/types"

type AppHeaderProps = {
  role: Role
  title: string
  onRoleChange: (role: Role) => void
}

const roleOptions = [
  { value: "intern", label: "Intern", icon: GraduationCap },
  { value: "supervisor", label: "Supervisor", icon: ClipboardCheck },
  { value: "admin", label: "Admin", icon: ShieldCheck },
] satisfies { value: Role; label: string; icon: typeof GraduationCap }[]

export function AppHeader({ role, title, onRoleChange }: AppHeaderProps) {
  const { theme, setTheme } = useTheme()
  const isDark = theme === "dark"

  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-center gap-2">
          <div className="grid size-9 place-items-center rounded-md bg-primary text-primary-foreground">
            <Clock3 className="size-5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">{title || "Internship DTR Tracker"}</h1>
            <p className="text-sm text-muted-foreground">
              Customizable attendance, approval, and export workspace
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {roleOptions.map((option) => {
            const Icon = option.icon
            const active = role === option.value

            return (
              <Button
                key={option.value}
                variant={active ? "default" : "outline"}
                onClick={() => onRoleChange(option.value)}
              >
                <Icon className="size-4" />
                {option.label}
              </Button>
            )
          })}
          <Button
            variant="outline"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            title="Toggle light or dark mode"
          >
            {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
            {isDark ? "Light" : "Dark"}
          </Button>
        </div>
      </div>
    </header>
  )
}
