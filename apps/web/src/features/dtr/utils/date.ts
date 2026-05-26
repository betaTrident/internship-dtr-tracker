export function getDayName(date: string) {
  if (!date) {
    return "-"
  }

  return new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(
    new Date(`${date}T00:00:00`)
  )
}

export function formatDate(date: string) {
  if (!date) {
    return "Not set"
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`))
}
