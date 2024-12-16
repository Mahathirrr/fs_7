"use client";

import { useState, useEffect, useCallback } from 'react';

interface UseYouTubePlayerProps {
  videoId: string;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
  autoSaveProgress?: boolean;
  lessonId?: string;
}

export function useYouTubePlayer({
  videoId,
  onProgress,
  onComplete,
  autoSaveProgress = true,
  lessonId,
}: UseYouTubePlayerProps) {
  const [player, setPlayer] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const handleReady = useCallback((event: any) => {
    setPlayer(event.target);
    setDuration(event.target.getDuration());
  }, []);

  const handleStateChange = useCallback((event: any) => {
    const isVideoPlaying = event.data === 1;
    setIsPlaying(isVideoPlaying);

    if (event.data === 0) { // Video ended
      onComplete?.();
    }
  }, [onComplete]);

  useEffect(() => {
    if (!player || !isPlaying) return;

    const interval = setInterval(() => {
      const currentTime = player.getCurrentTime();
      setCurrentTime(currentTime);
      
      const progress = currentTime / duration;
      onProgress?.(progress);

      if (autoSaveProgress && lessonId) {
        saveProgress(lessonId, progress);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [player, isPlaying, duration, onProgress, autoSaveProgress, lessonId]);

  return {
    handleReady,
    handleStateChange,
    currentTime,
    duration,
    isPlaying,
  };
}

async function saveProgress(lessonId: string, progress: number) {
  try {
    await fetch(`/api/lessons/${lessonId}/progress`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ progress }),
    });
  } catch (error) {
    console.error("Failed to save progress:", error);
  }
}