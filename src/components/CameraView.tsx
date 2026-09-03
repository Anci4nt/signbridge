import { Camera, CameraOff, AlertTriangle, Loader2, Activity } from 'lucide-react';
import HandOverlay from './HandOverlay';
import type { HandLandmarks } from '@/types/sign';
import type { CameraState } from '@/hooks/useCamera';
import type { TrackerState } from '@/hooks/useHandTracking';

interface CameraViewProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  cameraState: CameraState;
  cameraError: string | null;
  trackerState: TrackerState;
  trackerError: string | null;
  hands: HandLandmarks[] | null;
  fps: number;
  onStart: () => void;
  onStop: () => void;
}

export default function CameraView({
  videoRef,
  cameraState,
  cameraError,
  trackerState,
  trackerError,
  hands,
  fps,
  onStart,
  onStop,
}: CameraViewProps) {
  const live = cameraState === 'live';
  const error = cameraState === 'error';

  return (
    <div className="glass overflow-hidden">
      {/* Status bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              live ? 'bg-accent-400 animate-pulse' : 'bg-slate-600'
            }`}
            aria-hidden
          />
          <span className="text-xs font-medium text-slate-300">
            {live ? 'Camera Live' : cameraState === 'starting' ? 'Starting…' : 'Camera Off'}
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1.5" aria-label="Frames per second">
            <Activity className="w-3.5 h-3.5 text-brand-300" aria-hidden />
            <span className="font-mono">{fps.toFixed(0)} FPS</span>
          </span>
          {live && (
            <span className="font-mono" aria-label="Detected hands">
              {hands?.length ?? 0}/2 hands
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                trackerState === 'ready'
                  ? 'bg-accent-400'
                  : trackerState === 'loading'
                    ? 'bg-warn-400 animate-pulse'
                    : trackerState === 'error'
                      ? 'bg-danger-500'
                      : 'bg-slate-600'
              }`}
              aria-hidden
            />
            Tracker {trackerState}
          </span>
        </div>
      </div>

      {/* Video stage */}
      <div className="relative aspect-video w-full bg-ink-950">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover -scale-x-100"
          playsInline
          muted
          aria-label="Webcam preview"
        />
        {live && <HandOverlay hands={hands} mirror />}

        {!live && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <div className="rounded-full bg-white/5 p-5 mb-4">
              <Camera className="w-10 h-10 text-brand-300" aria-hidden />
            </div>
            <p className="text-slate-300 font-medium mb-1">Camera is off</p>
            <p className="text-sm text-slate-500 max-w-xs">
              Press Start Camera to begin recognizing supported signs. Video stays on your device.
            </p>
          </div>
        )}

        {cameraState === 'starting' && (
          <div className="absolute inset-0 flex items-center justify-center bg-ink-950/80">
            <Loader2 className="w-8 h-8 text-brand-300 animate-spin" aria-hidden />
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <div className="rounded-full bg-danger-500/10 p-4 mb-4">
              <AlertTriangle className="w-9 h-9 text-danger-400" aria-hidden />
            </div>
            <p className="text-danger-400 font-medium mb-1">Camera unavailable</p>
            <p className="text-sm text-slate-400 max-w-sm">{cameraError}</p>
          </div>
        )}

        {live && trackerState === 'error' && (
          <div className="absolute bottom-3 left-3 right-3 rounded-lg border border-danger-500/30 bg-ink-900/90 px-3 py-2 text-xs text-danger-400">
            Hand tracker failed to load: {trackerError}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 p-4">
        {!live ? (
          <button onClick={onStart} className="btn-primary flex-1" aria-label="Start camera">
            <Camera className="w-4 h-4" aria-hidden />
            Start Camera
          </button>
        ) : (
          <button onClick={onStop} className="btn-danger flex-1" aria-label="Stop camera">
            <CameraOff className="w-4 h-4" aria-hidden />
            Stop Camera
          </button>
        )}
      </div>
    </div>
  );
}
