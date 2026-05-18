import { cn } from "@/lib/utils";

export function SkeletonCard({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-2xl bg-elevated", className)} />;
}

export function SkeletonText({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-lg bg-elevated", className)} />;
}

export function SkeletonStatCard() {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4 space-y-3">
      <div className="flex items-center justify-between">
        <SkeletonCard className="h-4 w-4" />
        <SkeletonText className="h-3 w-16" />
      </div>
      <SkeletonText className="h-7 w-12" />
      <SkeletonText className="h-3 w-20" />
    </div>
  );
}

export function SkeletonWorkoutCard() {
  return (
    <div className="rounded-3xl border border-border bg-surface p-5 space-y-3">
      <SkeletonText className="h-3 w-24" />
      <SkeletonText className="h-6 w-40" />
      <SkeletonText className="h-4 w-48" />
      <div className="flex gap-2 pt-1">
        <SkeletonCard className="h-6 w-16 rounded-full" />
        <SkeletonCard className="h-6 w-14 rounded-full" />
        <SkeletonCard className="h-6 w-20 rounded-full" />
      </div>
    </div>
  );
}
