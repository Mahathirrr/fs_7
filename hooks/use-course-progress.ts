"use client";

import useSWR from "swr";
import { CourseProgress } from "@/types/lesson";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useCourseProgress(courseId: string) {
  const { data, error, mutate } = useSWR<CourseProgress>(
    `/api/courses/${courseId}/progress`,
    fetcher
  );

  const updateProgress = async (lessonId: string, progress: number) => {
    try {
      await fetch(`/api/lessons/${lessonId}/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ progress }),
      });
      mutate();
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  const markLessonComplete = async (lessonId: string) => {
    try {
      await fetch(`/api/lessons/${lessonId}/complete`, {
        method: "POST",
      });
      mutate();
    } catch (error) {
      console.error("Error marking lesson as complete:", error);
    }
  };

  return {
    progress: data?.overallProgress || 0,
    completedLessons: data?.completedLessons || [],
    currentLessonId: data?.currentLessonId,
    isLoading: !error && !data,
    isError: error,
    updateProgress,
    markLessonComplete,
  };
}