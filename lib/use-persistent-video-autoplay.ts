import { useCallback, useEffect, useRef, type RefObject } from "react";

type Options = {
  /** Start attempting playback before the loader finishes */
  active?: boolean;
  /** Container used to detect when the video is on screen */
  viewportRef?: RefObject<Element | null>;
  onPlaying?: () => void;
};

/**
 * Keeps a muted background hero video playing on iOS/Android — including Low Power
 * Mode / battery saver — by re-asserting play whenever the browser pauses it.
 */
export function usePersistentVideoAutoplay(
  videoRef: RefObject<HTMLVideoElement | null>,
  { active = true, viewportRef, onPlaying }: Options = {},
) {
  const unlockedRef = useRef(false);
  const onPlayingRef = useRef(onPlaying);
  onPlayingRef.current = onPlaying;

  const prepareVideo = useCallback((video: HTMLVideoElement) => {
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "true");
  }, []);

  const isInViewport = useCallback(() => {
    const root = viewportRef?.current;
    if (!root) return true;
    const rect = root.getBoundingClientRect();
    return rect.bottom > 0 && rect.top < window.innerHeight;
  }, [viewportRef]);

  const ensurePlaying = useCallback(() => {
    const video = videoRef.current;
    if (!video || !active) return;
    if (document.visibilityState !== "visible") return;
    if (!isInViewport()) return;

    prepareVideo(video);

    if (video.paused && !video.ended) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            unlockedRef.current = true;
            onPlayingRef.current?.();
          })
          .catch(() => {});
      }
    }
  }, [active, isInViewport, prepareVideo, videoRef]);

  // Begin buffering/playback as early as possible (during loader)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    prepareVideo(video);
    ensurePlaying();

    const onReady = () => ensurePlaying();
    video.addEventListener("loadeddata", onReady);
    video.addEventListener("canplay", onReady);

    return () => {
      video.removeEventListener("loadeddata", onReady);
      video.removeEventListener("canplay", onReady);
    };
  }, [ensurePlaying, prepareVideo, videoRef]);

  // Aggressive resume — battery saver on iOS/Android pauses muted video silently
  useEffect(() => {
    if (!active) return;

    const video = videoRef.current;
    if (!video) return;

    const onPause = () => {
      // No controls on hero — any pause is browser-initiated; resume immediately
      window.setTimeout(ensurePlaying, 0);
    };

    const onPlaybackIssue = () => ensurePlaying();

    video.addEventListener("pause", onPause);
    video.addEventListener("stalled", onPlaybackIssue);
    video.addEventListener("waiting", onPlaybackIssue);
    video.addEventListener("suspend", onPlaybackIssue);
    video.addEventListener("ended", onPlaybackIssue);

    const onVisibility = () => {
      if (document.visibilityState === "visible") ensurePlaying();
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("focus", ensurePlaying);
    window.addEventListener("pageshow", ensurePlaying);

    // First scroll/touch anywhere unlocks mobile media policy without hero UI
    const unlock = () => {
      unlockedRef.current = true;
      ensurePlaying();
    };
    document.addEventListener("touchstart", unlock, { passive: true });
    document.addEventListener("touchend", unlock, { passive: true });
    document.addEventListener("scroll", unlock, { passive: true });
    document.addEventListener("click", unlock, { passive: true });

    // Watchdog for Low Power Mode periodic suspension
    const watchdog = window.setInterval(ensurePlaying, 750);

    let observer: IntersectionObserver | undefined;
    const root = viewportRef?.current;
    if (root) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) ensurePlaying();
        },
        { threshold: 0.15 },
      );
      observer.observe(root);
    }

    ensurePlaying();

    return () => {
      video.removeEventListener("pause", onPause);
      video.removeEventListener("stalled", onPlaybackIssue);
      video.removeEventListener("waiting", onPlaybackIssue);
      video.removeEventListener("suspend", onPlaybackIssue);
      video.removeEventListener("ended", onPlaybackIssue);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("focus", ensurePlaying);
      window.removeEventListener("pageshow", ensurePlaying);
      document.removeEventListener("touchstart", unlock);
      document.removeEventListener("touchend", unlock);
      document.removeEventListener("scroll", unlock);
      document.removeEventListener("click", unlock);
      window.clearInterval(watchdog);
      observer?.disconnect();
    };
  }, [active, ensurePlaying, videoRef, viewportRef]);
}
