"use client";

import { Progress } from "@/components/ui/progress";
import { useCourseProgress } from "@/hooks/use-course-progress";
import { CheckCircle, Circle } from "lucide-react";

interface ProgressTrackerProps {
  courseId: string;
  totalLessons: number;
}

export function ProgressTracker({ courseId, totalLessons }: ProgressTrackerProps) {
  const { progress, completedLessons, isLoading } = useCourseProgress(courseId);

  if (isLoading) {
    return <div>Loading progress...</div>;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span>Progress Kursus</span>
        <span>{Math.round(progress * 100)}%</span>
      </div>
      <Progress value={progress * 100} className="h-2" />
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {completedLessons.length} dari {totalLessons} pelajaran selesai
        </span>
      </div>
    </div>
  );
}