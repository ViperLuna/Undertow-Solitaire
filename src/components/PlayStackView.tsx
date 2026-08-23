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
}

export function PlayStackView({
  stackId,
  cards,
  playable,
  pullTarget,
  dragActive,
  dragAcceptable,
  onClick,
}: PlayStackViewProps) {
  const top = cards[cards.length - 1];
  const clickable = playable || pullTarget;
  const grayedForDrag = dragActive && !dragAcceptable;

  return (
    <div
      data-stack-id={stackId}
      className={[
        "play-stack",
        playable ? "play-stack--playable" : "",
        pullTarget ? "play-stack--pull-target" : "",
        grayedForDrag ? "play-stack--drag-invalid" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={clickable ? onClick : undefined}
    >
      {top ? <CardFace card={top} /> : <EmptySlot />}
      <div className="play-stack__count">{cards.length}</div>
    </div>
  );
}
