import { CardFace, EmptySlot } from "./Card";
import { canPlayCardOnStack } from "../game/engine";
import type { GameState } from "../game/types";

interface HandProps {
  state: GameState;
  selectedHandIndex: number | null;
  draggingHandIndex: number | null;
  stuck: boolean;
  onSelect: (index: number) => void;
  onDragStart: (index: number) => void;
  onDragEnd: () => void;
}

export function Hand({
  state,
  selectedHandIndex,
  draggingHandIndex,
  stuck,
  onSelect,
  onDragStart,
  onDragEnd,
}: HandProps) {
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
            draggable={!disabled}
            onClick={disabled ? undefined : () => onSelect(index)}
            onDragStart={disabled ? undefined : () => onDragStart(index)}
            onDragEnd={onDragEnd}
          />
        );
      })}
    </div>
  );
}
