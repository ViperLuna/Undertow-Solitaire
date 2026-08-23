import { useEffect, useRef, useState } from "react";
import { CardFace } from "./components/Card";
import { Hand } from "./components/Hand";
import { PlayStackView } from "./components/PlayStackView";
import { ReserveStack } from "./components/ReserveStack";
import { GameOverOverlay } from "./components/GameOverOverlay";
import { HowToPlayOverlay } from "./components/HowToPlayOverlay";
import { LeaderboardNameEntry } from "./components/LeaderboardNameEntry";
import { LeaderboardOverlay } from "./components/LeaderboardOverlay";
import { MainMenu } from "./components/MainMenu";
import { canPlayCardOnStack } from "./game/engine";
import { calculateMaxAchievableScore, calculateScore, type ScoreBreakdown } from "./game/scoring";
import { useCardDrag } from "./game/useCardDrag";
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
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [pendingResult, setPendingResult] = useState<PendingResult | null>(null);
  const resolvedStateRef = useRef<GameState | null>(null);

  const { draggingIndex, ghostRef, startDrag } = useCardDrag({
    onTap: selectHandCard,
    onDrop: playHandIndexOnStack,
    canDropOnStack: (handIndex, stackId) => {
      const card = state.hand[handIndex];
      return Boolean(card) && canPlayCardOnStack(card!, state, stackId);
    },
  });

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
  const draggedCard = draggingIndex !== null ? state.hand[draggingIndex] : null;
  const activeCard = draggedCard ?? selectedCard;
  const liveScore = calculateScore(state);
  const maxAchievableScore = calculateMaxAchievableScore(state);

  const handleStackClick = (stackId: PlayStackId) => {
    if (stuck) {
      pullOnStack(stackId);
      return;
    }
    if (selectedCard) {
      playOnStack(stackId);
    }
  };

  const leaderboardOverlay = showLeaderboard && (
    <LeaderboardOverlay
      entries={entries}
      lastRecordedId={lastRecordedId}
      onClose={() => setShowLeaderboard(false)}
      onClear={clear}
    />
  );

  const howToPlayOverlay = showHowToPlay && <HowToPlayOverlay onClose={() => setShowHowToPlay(false)} />;

  if (screen === "menu") {
    return (
      <div className="app">
        <MainMenu
          onPlay={handlePlay}
          onShowLeaderboard={() => setShowLeaderboard(true)}
          onShowHowToPlay={() => setShowHowToPlay(true)}
        />
        {leaderboardOverlay}
        {howToPlayOverlay}
      </div>
    );
  }

  return (
    <div className="app">
      <div className="max-score-badge">
        <span className="max-score-badge__label">Max Score</span>
        <span className="max-score-badge__value">{maxAchievableScore}</span>
      </div>

      <header className="app__header">
        <h1>Undertow Solitaire</h1>
        <div className="app__header-actions">
          <button type="button" className="app__secondary-btn" onClick={() => setShowHowToPlay(true)}>
            How to Play
          </button>
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
                dragActive={draggingIndex !== null}
                dragAcceptable={dragAcceptable}
                onClick={() => handleStackClick(stackId)}
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
          draggingHandIndex={draggingIndex}
          stuck={stuck}
          onPointerDownCard={startDrag}
        />
      </section>

      {draggingIndex !== null && state.hand[draggingIndex] && (
        <div ref={ghostRef} className="drag-ghost">
          <CardFace card={state.hand[draggingIndex]!} />
        </div>
      )}

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
      {howToPlayOverlay}
    </div>
  );
}

export default App;
