import { useEffect, useRef, useState } from "react";
import { Hand } from "./components/Hand";
import { PlayStackView } from "./components/PlayStackView";
import { ReserveStack } from "./components/ReserveStack";
import { GameOverOverlay } from "./components/GameOverOverlay";
import { LeaderboardNameEntry } from "./components/LeaderboardNameEntry";
import { LeaderboardOverlay } from "./components/LeaderboardOverlay";
import { MainMenu } from "./components/MainMenu";
import { canPlayCardOnStack } from "./game/engine";
import { calculateScore, type ScoreBreakdown } from "./game/scoring";
import { useGame } from "./game/useGame";
import { useLeaderboard } from "./game/useLeaderboard";
import type { GameState, PlayStackId } from "./game/types";

const STACK_IDS: PlayStackId[] = ["A", "B"];

type Screen = "menu" | "game";

interface PendingResult {
  score: ScoreBreakdown;
  won: boolean;
}

function App() {
  const {
    state,
    selectedHandIndex,
    stuck,
    selectHandCard,
    playOnStack,
    playHandIndexOnStack,
    pullOnStack,
    newGame,
  } = useGame();
  const { entries, lastRecordedId, qualifies, record, clear } = useLeaderboard();

  const [screen, setScreen] = useState<Screen>("menu");
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [dragHandIndex, setDragHandIndex] = useState<number | null>(null);
  const [pendingResult, setPendingResult] = useState<PendingResult | null>(null);
  const resolvedStateRef = useRef<GameState | null>(null);

  useEffect(() => {
    if (screen !== "game") return;
    if (state.status === "playing") return;
    if (resolvedStateRef.current === state) return;
    resolvedStateRef.current = state;
    setPendingResult({ score: calculateScore(state), won: state.status === "won" });
  }, [state, screen]);

  const handlePlay = () => {
    resolvedStateRef.current = null;
    setPendingResult(null);
    setDragHandIndex(null);
    newGame();
    setScreen("game");
  };

  const handleBackToMenu = () => {
    setPendingResult(null);
    setScreen("menu");
  };

  const handleSaveScore = async (name: string) => {
    if (!pendingResult) return;
    await record({
      name,
      score: pendingResult.score.total,
      playPoints: pendingResult.score.playPoints,
      reservePoints: pendingResult.score.reservePoints,
      won: pendingResult.won,
      movesMade: state.movesMade,
      cardsPulled: state.cardsPulled,
      timestamp: Date.now(),
    });
    setPendingResult(null);
    setScreen("menu");
  };

  const selectedCard = selectedHandIndex !== null ? state.hand[selectedHandIndex] : null;
  const draggedCard = dragHandIndex !== null ? state.hand[dragHandIndex] : null;
  const activeCard = draggedCard ?? selectedCard;
  const liveScore = calculateScore(state);

  const handleStackClick = (stackId: PlayStackId) => {
    if (stuck) {
      pullOnStack(stackId);
      return;
    }
    if (selectedCard) {
      playOnStack(stackId);
    }
  };

  const handleDropOnStack = (stackId: PlayStackId) => {
    if (dragHandIndex === null) return;
    playHandIndexOnStack(dragHandIndex, stackId);
    setDragHandIndex(null);
  };

  const leaderboardOverlay = showLeaderboard && (
    <LeaderboardOverlay
      entries={entries}
      lastRecordedId={lastRecordedId}
      onClose={() => setShowLeaderboard(false)}
      onClear={clear}
    />
  );

  if (screen === "menu") {
    return (
      <div className="app">
        <MainMenu onPlay={handlePlay} onShowLeaderboard={() => setShowLeaderboard(true)} />
        {leaderboardOverlay}
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app__header">
        <h1>Undertow Solitaire</h1>
        <div className="app__header-actions">
          <button type="button" className="app__secondary-btn" onClick={() => setShowLeaderboard(true)}>
            Leaderboard
          </button>
          <button type="button" className="app__secondary-btn" onClick={handleBackToMenu}>
            Menu
          </button>
        </div>
      </header>

      <div className="app__status">
        {state.status === "playing" && stuck && (
          <p className="status-banner status-banner--stuck">
            No legal plays &mdash; click or drop on a Play Stack to pull blind from the Pull Stack.
          </p>
        )}
        {state.status === "playing" && !stuck && (
          <p className="status-banner">
            {state.movesMade} plays &middot; {state.cardsPulled} pulls &middot; {liveScore.total} pts
          </p>
        )}
      </div>

      <main className="board">
        <ReserveStack label="Pull Stack" count={state.pullStack.length} />

        <div className="play-stacks">
          {STACK_IDS.map((stackId) => {
            const legal = Boolean(activeCard) && canPlayCardOnStack(activeCard!, state, stackId);
            const dragAcceptable = Boolean(draggedCard) && canPlayCardOnStack(draggedCard!, state, stackId);
            return (
              <PlayStackView
                key={stackId}
                stackId={stackId}
                cards={state.playStacks[stackId]}
                playable={legal}
                pullTarget={stuck && state.status === "playing"}
                dragActive={dragHandIndex !== null}
                dragAcceptable={dragAcceptable}
                onClick={() => handleStackClick(stackId)}
                onDropCard={() => handleDropOnStack(stackId)}
              />
            );
          })}
        </div>

        <ReserveStack label="Draw Stack" count={state.drawStack.length} />
      </main>

      <section className="hand-section">
        <h2>My Hand</h2>
        <Hand
          state={state}
          selectedHandIndex={selectedHandIndex}
          draggingHandIndex={dragHandIndex}
          stuck={stuck}
          onSelect={selectHandCard}
          onDragStart={setDragHandIndex}
          onDragEnd={() => setDragHandIndex(null)}
        />
      </section>

      {pendingResult &&
        (qualifies(pendingResult.score.total) ? (
          <LeaderboardNameEntry won={pendingResult.won} score={pendingResult.score} onSubmit={handleSaveScore} />
        ) : (
          <GameOverOverlay
            won={pendingResult.won}
            movesMade={state.movesMade}
            cardsPulled={state.cardsPulled}
            score={pendingResult.score}
            onBackToMenu={handleBackToMenu}
          />
        ))}

      {leaderboardOverlay}
    </div>
  );
}

export default App;
