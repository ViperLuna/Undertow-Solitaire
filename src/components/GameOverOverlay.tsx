import type { GameStatus } from "../game/types";
import type { ScoreBreakdown } from "../game/scoring";

interface GameOverOverlayProps {
  status: GameStatus;
  movesMade: number;
  cardsPulled: number;
  score: ScoreBreakdown;
  onNewGame: () => void;
}

export function GameOverOverlay({ status, movesMade, cardsPulled, score, onNewGame }: GameOverOverlayProps) {
  if (status === "playing") return null;

  const won = status === "won";

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
        <button type="button" onClick={onNewGame}>
          Play Again
        </button>
      </div>
    </div>
  );
}
