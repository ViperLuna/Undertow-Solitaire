import { CardFace, EmptySlot } from "./Card";
import { canPlayCardOnStack } from "../game/engine";
import type { GameState } from "../game/types";

interface HandProps {
  state: GameState;
  selectedHandIndex: number | null;
  stuck: boolean;
  onSelect: (index: number) => void;
}

export function Hand({ state, selectedHandIndex, stuck, onSelect }: HandProps) {
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
            disabled={disabled}
            onClick={disabled ? undefined : () => onSelect(index)}
          />
        );
      })}
    </div>
  );
}
