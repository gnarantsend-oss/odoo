export default function Loading() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6">
        {/* Animated logo mark */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin" />
          <div className="absolute inset-2 rounded-full border border-transparent border-t-primary/50 animate-spin"
               style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
          </div>
        </div>
        {/* Skeleton rows */}
        <div className="flex flex-col items-center gap-2 w-40">
          <div className="skeleton h-2 w-full rounded-full" />
          <div className="skeleton h-2 w-3/4 rounded-full" />
        </div>
      </div>
    </div>
  );
}
