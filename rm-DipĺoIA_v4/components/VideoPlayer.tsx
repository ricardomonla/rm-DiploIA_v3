
import React, { useEffect, useRef, useId } from 'react';

// Extend the Window interface to include YouTube IFrame API properties
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
}

interface VideoPlayerProps {
  videoId: string;
  onReady: (player: any) => void;
  onProgress: (time: number) => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoId, onReady, onProgress }) => {
  const playerRef = useRef<any>(null);
  const initializationRef = useRef<boolean>(false);
  // Generate a unique ID to avoid collisions if multiple players or rapid re-renders occur
  const uniqueContainerId = `yt-player-${useId().replace(/:/g, '')}`;

  useEffect(() => {
    let internalPlayer: any = null;

    const createPlayer = () => {
      const container = document.getElementById(uniqueContainerId);
      if (!container || !window.YT || !window.YT.Player) return;

      try {
        internalPlayer = new window.YT.Player(uniqueContainerId, {
          height: '100%',
          width: '100%',
          videoId: videoId,
          // Use 'host' to force a secure connection, often fixes Error 153
          host: 'https://www.youtube.com',
          playerVars: {
            autoplay: 1,
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
            controls: 1,
            origin: window.location.protocol + '//' + window.location.host,
            enablejsapi: 1,
            widget_referrer: window.location.href
          },
          events: {
            onReady: (event: any) => {
              playerRef.current = event.target;
              onReady(event.target);
            },
            onError: (event: any) => {
              console.error('YouTube Player Error Code:', event.data);
            }
          },
        });
      } catch (err) {
        console.error('Failed to initialize YouTube Player:', err);
      }
    };

    // Load API Script if not present
    if (!window.YT) {
      if (!document.querySelector('script[src*="iframe_api"]')) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        if (firstScriptTag && firstScriptTag.parentNode) {
          firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        } else {
          document.head.appendChild(tag);
        }
      }

      const checkAPI = setInterval(() => {
        if (window.YT && window.YT.Player) {
          clearInterval(checkAPI);
          createPlayer();
        }
      }, 100);

      // Standard callback
      const previousValue = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (previousValue) previousValue();
        createPlayer();
      };
    } else {
      createPlayer();
    }

    const interval = setInterval(() => {
      if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
        try {
          const state = playerRef.current.getPlayerState?.();
          if (state === 1 || state === 2) {
            onProgress(playerRef.current.getCurrentTime());
          }
        } catch (e) {
          // Ignore transient errors during buffer/load
        }
      }
    }, 500);

    return () => {
      clearInterval(interval);
      if (internalPlayer && typeof internalPlayer.destroy === 'function') {
        internalPlayer.destroy();
      }
      playerRef.current = null;
    };
  }, [videoId, onReady, onProgress, uniqueContainerId]);

  return (
    <div className="w-full h-full bg-black flex items-center justify-center overflow-hidden">
      {/* Container with unique ID */}
      <div id={uniqueContainerId} className="w-full h-full"></div>
    </div>
  );
};

export default VideoPlayer;
