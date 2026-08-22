import { useState } from "react";
import type { FormEvent } from "react";
import type { ScoreBreakdown } from "../game/scoring";

interface LeaderboardNameEntryProps {
  won: boolean;
  score: ScoreBreakdown;
  onSubmit: (name: string) => void;
}

export function LeaderboardNameEntry({ won, score, onSubmit }: LeaderboardNameEntryProps) {
  const [name, setName] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit(name.trim() || "Anonymous");
  };

  return (
    <div className="overlay">
      <div className="overlay__panel">
        <h2>You made the leaderboard!</h2>
        <p>{won ? "Hand and Draw Stack fully played out." : "Pull Stack is empty and no plays remain."}</p>
        <p className="overlay__score">{score.total} points</p>
        <p className="overlay__score-breakdown">
          {score.playPoints} for plays + {score.reservePoints} reserve bonus
        </p>
        <form onSubmit={handleSubmit} className="name-entry-form">
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Your name"
            maxLength={24}
            autoFocus
          />
          <button type="submit">Save Score</button>
        </form>
      </div>
    </div>
  );
}
