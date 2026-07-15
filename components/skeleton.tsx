export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`bg-gray-800 rounded-lg animate-pulse ${className}`}
    />
  )
}