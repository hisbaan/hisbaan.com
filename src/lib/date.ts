let formatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "2-digit",
})

export function formatDate(date: Date): string {
  return formatter.format(date)
}
