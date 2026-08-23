import { useCallback, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { PlayStackId } from "./types";

const DRAG_THRESHOLD_PX = 6;

interface UseCardDragOptions {
  onTap: (handIndex: number) => void;
  onDrop: (handIndex: number, stackId: PlayStackId) => void;
  canDropOnStack: (handIndex: number, stackId: PlayStackId) => boolean;
}

// Custom pointer-events-based drag, the same approach canvas/design tools
// (Figma, Photopea) use instead of the native HTML5 drag-and-drop API.
// A short-movement pointerdown->pointerup counts as a tap; crossing the
// threshold promotes the gesture to a drag, tracked via window-level
// listeners so it keeps working no matter where the pointer moves.
export function useCardDrag({ onTap, onDrop, canDropOnStack }: UseCardDragOptions) {
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const ghostRef = useRef<HTMLDivElement | null>(null);

  const startDrag = useCallback(
    (handIndex: number, startEvent: ReactPointerEvent<HTMLDivElement>) => {
      startEvent.preventDefault();
      const pointerId = startEvent.pointerId;
      const startX = startEvent.clientX;
      const startY = startEvent.clientY;
      let dragging = false;
      let hoveredStack: PlayStackId | null = null;

      const positionGhost = (x: number, y: number) => {
        if (ghostRef.current) {
          ghostRef.current.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
        }
      };

      const handleMove = (event: PointerEvent) => {
        if (event.pointerId !== pointerId) return;

        if (!dragging) {
          const dx = event.clientX - startX;
          const dy = event.clientY - startY;
          if (Math.hypot(dx, dy) < DRAG_THRESHOLD_PX) return;
          dragging = true;
          setDraggingIndex(handIndex);
        }

        positionGhost(event.clientX, event.clientY);

        const el = document.elementFromPoint(event.clientX, event.clientY);
        const stackEl = el instanceof Element ? el.closest<HTMLElement>("[data-stack-id]") : null;
        hoveredStack = (stackEl?.dataset.stackId as PlayStackId | undefined) ?? null;
      };

      const finish = (commit: boolean) => {
        window.removeEventListener("pointermove", handleMove);
        window.removeEventListener("pointerup", handleUp);
        window.removeEventListener("pointercancel", handleCancel);

        if (dragging) {
          if (commit && hoveredStack && canDropOnStack(handIndex, hoveredStack)) {
            onDrop(handIndex, hoveredStack);
          }
        } else if (commit) {
          onTap(handIndex);
        }

        setDraggingIndex(null);
      };

      const handleUp = (event: PointerEvent) => {
        if (event.pointerId !== pointerId) return;
        finish(true);
      };

      const handleCancel = (event: PointerEvent) => {
        if (event.pointerId !== pointerId) return;
        finish(false);
      };

      window.addEventListener("pointermove", handleMove);
      window.addEventListener("pointerup", handleUp);
      window.addEventListener("pointercancel", handleCancel);
    },
    [onTap, onDrop, canDropOnStack],
  );

  return { draggingIndex, ghostRef, startDrag };
}
