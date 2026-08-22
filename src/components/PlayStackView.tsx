import { CardFace, EmptySlot } from "./Card";
import type { Card, PlayStackId } from "../game/types";

interface PlayStackViewProps {
  stackId: PlayStackId;
  cards: Card[];
  playable: boolean;
  pullTarget: boolean;
  dragActive: boolean;
  dragAcceptable: boolean;
  onClick: () => void;
  onDropCard: () => void;
}

export function PlayStackView({
  cards,
  playable,
  pullTarget,
  dragActive,
  dragAcceptable,
  onClick,
  onDropCard,
}: PlayStackViewProps) {
  const top = cards[cards.length - 1];
  const clickable = playable || pullTarget;
  const grayedForDrag = dragActive && !dragAcceptable;

  return (
    <div
      className={[
        "play-stack",
        playable ? "play-stack--playable" : "",
        pullTarget ? "play-stack--pull-target" : "",
        grayedForDrag ? "play-stack--drag-invalid" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={clickable ? onClick : undefined}
      onDragOver={(event) => {
        if (dragAcceptable) event.preventDefault();
      }}
      onDrop={(event) => {
        event.preventDefault();
        if (dragAcceptable) onDropCard();
      }}
    >
      {top ? <CardFace card={top} /> : <EmptySlot />}
      <div className="play-stack__count">{cards.length}</div>
    </div>
  );
}
