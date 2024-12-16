"use client";

import { useYouTubePlayer } from "@/hooks/use-youtube-player";
import YouTube from "react-youtube";
import { formatDuration } from "@/lib/utils/format";

interface VideoPlayerProps {
  videoId: string;
  onComplete?: () => void;
  onProgress?: (progress: number) => void;
  autoSaveProgress?: boolean;
  lessonId?: string;
}

export function VideoPlayer(props: VideoPlayerProps) {
  const {
    handleReady,
    handleStateChange,
    currentTime,
    duration,
    isPlaying,
  } = useYouTubePlayer(props);

  return (
    <div className="relative group">
      <div className="aspect-video bg-black rounded-lg overflow-hidden">
        <YouTube
          videoId={props.videoId}
          opts={{
            height: '100%',
            width: '100%',
            playerVars: {
              autoplay: 0,
              modestbranding: 1,
              rel: 0,
            },
          }}
          onReady={handleReady}
          onStateChange={handleStateChange}
          className="w-full h-full"
        />
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex items-center justify-between text-white">
          <span>{formatDuration(currentTime)}</span>
          <span>{formatDuration(duration)}</span>
        </div>
      </div>
    </div>
  );
}