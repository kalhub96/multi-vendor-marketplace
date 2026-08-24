export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`bg-background-tertiary rounded-lg animate-pulse ${className}`}
    />
  )
}