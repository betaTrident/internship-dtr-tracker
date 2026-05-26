export function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-md border border-dashed bg-muted/30 p-8 text-center text-sm text-muted-foreground">
      {message}
    </div>
  )
}
