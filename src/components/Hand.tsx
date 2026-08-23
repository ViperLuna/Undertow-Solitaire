import { CardFace, EmptySlot } from "./Card";
import { canPlayCardOnStack } from "../game/engine";
import type { GameState } from "../game/types";
import type { PointerEvent as ReactPointerEvent } from "react";

interface HandProps {
  state: GameState;
  selectedHandIndex: number | null;
  draggingHandIndex: number | null;
  stuck: boolean;
  onPointerDownCard: (index: number, event: ReactPointerEvent<HTMLDivElement>) => void;
}

export function Hand({ state, selectedHandIndex, draggingHandIndex, stuck, onPointerDownCard }: HandProps) {
  return (
    <div className="hand">
      {state.hand.map((card, index) => {
        if (!card) return <EmptySlot key={`empty-${index}`} />;

        const isPlayable =
          canPlayCardOnStack(card, state, "A") || canPlayCardOnStack(card, state, "B");
        const disabled = state.status !== "playing" || stuck || !isPlayable;

        return (
          <CardFace
            key={card.id}
            card={card}
            selected={selectedHandIndex === index}
            dragging={draggingHandIndex === index}
            disabled={disabled}
            interactive={!disabled}
            onPointerDown={disabled ? undefined : (event) => onPointerDownCard(index, event)}
          />
        );
      })}
    </div>
  );
}
