import { isRedSuit, rankLabel, suitSymbol } from "../game/deck";
import type { Card as CardType } from "../game/types";
import type { PointerEvent as ReactPointerEvent } from "react";

interface CardFaceProps {
  card: CardType;
  size?: "normal" | "small";
  selected?: boolean;
  disabled?: boolean;
  dragging?: boolean;
  interactive?: boolean;
  onPointerDown?: (event: ReactPointerEvent<HTMLDivElement>) => void;
}

export function CardFace({
  card,
  size = "normal",
  selected,
  disabled,
  dragging,
  interactive,
  onPointerDown,
}: CardFaceProps) {
  const red = isRedSuit(card.suit);
  const classes = [
    "card",
    size === "small" ? "card--small" : "",
    red ? "card--red" : "card--black",
    selected ? "card--selected" : "",
    disabled ? "card--disabled" : "",
    dragging ? "card--dragging" : "",
    interactive ? "card--clickable" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} onPointerDown={onPointerDown}>
      <span className="card__corner card__corner--top">
        {rankLabel(card.rank)}
        <br />
        {suitSymbol(card.suit)}
      </span>
      <span className="card__pip">{suitSymbol(card.suit)}</span>
      <span className="card__corner card__corner--bottom">
        {rankLabel(card.rank)}
        <br />
        {suitSymbol(card.suit)}
      </span>
    </div>
  );
}

interface CardBackProps {
  size?: "normal" | "small";
}

export function CardBack({ size = "normal" }: CardBackProps) {
  const classes = ["card", "card--back", size === "small" ? "card--small" : ""]
    .filter(Boolean)
    .join(" ");
  return (
    <div className={classes}>
      <div className="card__back-pattern" />
    </div>
  );
}

export function EmptySlot() {
  return <div className="card card--empty" />;
}
