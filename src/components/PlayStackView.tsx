import { CardFace, EmptySlot } from "./Card";
import type { Card, PlayStackId } from "../game/types";

interface PlayStackViewProps {
  stackId: PlayStackId;
  cards: Card[];
  playable: boolean;
  pullTarget: boolean;
  onClick: () => void;
}

export function PlayStackView({ cards, playable, pullTarget, onClick }: PlayStackViewProps) {
  const top = cards[cards.length - 1];
  const clickable = playable || pullTarget;

  return (
    <div
      className={[
        "play-stack",
        playable ? "play-stack--playable" : "",
        pullTarget ? "play-stack--pull-target" : "",
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
