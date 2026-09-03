import { useCallback, useEffect, useRef } from 'react';
import type { HandLandmarks } from '@/types/sign';

interface HandOverlayProps {
  hands: HandLandmarks[] | null;
  /** Mirror the canvas horizontally to match the mirrored video preview. */
  mirror?: boolean;
}

// MediaPipe hand connections (pairs of landmark indices).
const HAND_CONNECTIONS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4], // thumb
  [0, 5], [5, 6], [6, 7], [7, 8], // index
  [5, 9], [9, 10], [10, 11], [11, 12], // middle
  [9, 13], [13, 14], [14, 15], [15, 16], // ring
  [13, 17], [17, 18], [18, 19], [19, 20], // pinky
  [0, 17], // palm base
];

/**
 * Draws the 21-landmark hand skeleton over the webcam feed.
 * The canvas is sized to match its parent and re-renders every frame
 * via the `hands` prop.
 */
export default function HandOverlay({ hands, mirror = true }: HandOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    ctx.clearRect(0, 0, w, h);
    if (!hands || hands.length === 0) return;

    for (const [handIndex, hand] of hands.entries()) {
      const lms = hand.landmarks;
      ctx.save();
      if (mirror) {
        ctx.translate(w, 0);
        ctx.scale(-1, 1);
      }

      // Connections
      ctx.strokeStyle = handIndex === 0
        ? 'rgba(34, 211, 238, 0.9)'
        : 'rgba(168, 85, 247, 0.9)';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      for (const [a, b] of HAND_CONNECTIONS) {
        const p1 = lms[a];
        const p2 = lms[b];
        if (!p1 || !p2) continue;
        ctx.beginPath();
        ctx.moveTo(p1.x * w, p1.y * h);
        ctx.lineTo(p2.x * w, p2.y * h);
        ctx.stroke();
      }

      // Joints
      ctx.fillStyle = handIndex === 0
        ? 'rgba(52, 211, 153, 0.95)'
        : 'rgba(251, 191, 36, 0.95)';
      for (const lm of lms) {
        ctx.beginPath();
        ctx.arc(lm.x * w, lm.y * h, 4, 0, Math.PI * 2);
        ctx.fill();
      }
      const wrist = lms[0];
      if (wrist) {
        ctx.font = '600 12px sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.fillText(hand.handedness, wrist.x * w + 8, wrist.y * h - 8);
      }
      ctx.restore();
    }
  }, [hands, mirror]);

  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full pointer-events-none"
      aria-hidden="true"
    />
  );
}
