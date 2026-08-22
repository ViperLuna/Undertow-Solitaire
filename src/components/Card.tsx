import { isRedSuit, rankLabel, suitSymbol } from "../game/deck";
import type { Card as CardType } from "../game/types";

interface CardFaceProps {
  card: CardType;
  size?: "normal" | "small";
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export function CardFace({ card, size = "normal", selected, disabled, onClick }: CardFaceProps) {
  const red = isRedSuit(card.suit);
  const classes = [
    "card",
    size === "small" ? "card--small" : "",
    red ? "card--red" : "card--black",
    selected ? "card--selected" : "",
    disabled ? "card--disabled" : "",
    onClick ? "card--clickable" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} onClick={onClick}>
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
