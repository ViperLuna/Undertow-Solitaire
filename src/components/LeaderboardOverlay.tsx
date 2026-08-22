import type { LeaderboardEntry } from "../game/leaderboard";

interface LeaderboardOverlayProps {
  entries: LeaderboardEntry[];
  lastRecordedId: number | null;
  onClose: () => void;
  onClear: () => void;
}

export function LeaderboardOverlay({ entries, lastRecordedId, onClose, onClear }: LeaderboardOverlayProps) {
  const handleClear = () => {
    if (window.confirm("Clear all leaderboard scores? This can't be undone.")) {
      onClear();
    }
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div
        className="overlay__panel overlay__panel--wide"
        onClick={(event) => event.stopPropagation()}
      >
        <h2>Leaderboard</h2>

        {entries.length === 0 ? (
          <p className="overlay__stats">No games recorded yet &mdash; finish a game to set the first score.</p>
        ) : (
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Score</th>
                <th>Result</th>
                <th>Plays</th>
                <th>Pulls</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => (
                <tr
                  key={entry.id}
                  className={entry.id === lastRecordedId ? "leaderboard-table__row--latest" : undefined}
                >
                  <td>{index + 1}</td>
                  <td>{entry.score}</td>
                  <td className={entry.won ? "leaderboard-table__win" : "leaderboard-table__loss"}>
                    {entry.won ? "Win" : "Loss"}
                  </td>
                  <td>{entry.movesMade}</td>
                  <td>{entry.cardsPulled}</td>
                  <td>{new Date(entry.timestamp).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="overlay__actions">
          <button type="button" className="overlay__secondary-btn" onClick={handleClear}>
            Clear
          </button>
          <button type="button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
