import type { ScoreBreakdown } from "../game/scoring";

interface GameOverOverlayProps {
  won: boolean;
  movesMade: number;
  cardsPulled: number;
  score: ScoreBreakdown;
  onBackToMenu: () => void;
}

export function GameOverOverlay({ won, movesMade, cardsPulled, score, onBackToMenu }: GameOverOverlayProps) {
  return (
    <div className="overlay">
      <div className="overlay__panel">
        <h2>{won ? "You cleared the tide!" : "Pulled under"}</h2>
        <p>{won ? "Hand and Draw Stack fully played out." : "Pull Stack is empty and no plays remain."}</p>
        <p className="overlay__stats">
          {movesMade} plays &middot; {cardsPulled} pulls
        </p>
        <p className="overlay__score">{score.total} points</p>
        <p className="overlay__score-breakdown">
          {score.playPoints} for plays + {score.reservePoints} reserve bonus
        </p>
        <button type="button" onClick={onBackToMenu}>
          Back to Menu
        </button>
      </div>
    </div>
  );
}
