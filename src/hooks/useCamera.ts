import { useCallback, useEffect, useRef, useState } from 'react';

export type CameraState = 'idle' | 'starting' | 'live' | 'error';

export interface UseCamera {
  videoRef: React.RefObject<HTMLVideoElement>;
  state: CameraState;
  error: string | null;
  start: () => Promise<void>;
  stop: () => void;
  stream: MediaStream | null;
}

export function useCamera(): UseCamera {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [state, setState] = useState<CameraState>('idle');
  const [error, setError] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const stop = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setStream(null);
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setState('idle');
  }, []);

  const start = useCallback(async () => {
    setError(null);
    setState('starting');
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Camera API is not available in this browser.');
      }
      const s = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
        audio: false,
      });
      streamRef.current = s;
      setStream(s);
      if (videoRef.current) {
        videoRef.current.srcObject = s;
        await videoRef.current.play().catch(() => {});
      }
      setState('live');
    } catch (err) {
      const e = err as DOMError;
      let msg = 'Could not access the camera.';
      if (e?.name === 'NotAllowedError' || e?.name === 'SecurityError') {
        msg = 'Camera permission was denied. Please allow camera access and try again.';
      } else if (e?.name === 'NotFoundError' || e?.name === 'OverconstrainedError') {
        msg = 'No camera was found on this device.';
      } else if (e?.message) {
        msg = e.message;
      }
      setError(msg);
      setState('error');
      stop();
    }
  }, [stop]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  return { videoRef, state, error, start, stop, stream };
}

interface DOMError {
  name?: string;
  message?: string;
}
