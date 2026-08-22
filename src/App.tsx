import { Hand } from "./components/Hand";
import { PlayStackView } from "./components/PlayStackView";
import { ReserveStack } from "./components/ReserveStack";
import { GameOverOverlay } from "./components/GameOverOverlay";
import { canPlayCardOnStack } from "./game/engine";
import { calculateScore } from "./game/scoring";
import { useGame } from "./game/useGame";
import type { PlayStackId } from "./game/types";

const STACK_IDS: PlayStackId[] = ["A", "B"];

function App() {
  const { state, selectedHandIndex, stuck, selectHandCard, playOnStack, pullOnStack, newGame } =
    useGame();

  const selectedCard = selectedHandIndex !== null ? state.hand[selectedHandIndex] : null;
  const score = calculateScore(state);

  const handleStackClick = (stackId: PlayStackId) => {
    if (stuck) {
      pullOnStack(stackId);
      return;
    }
    if (selectedCard) {
      playOnStack(stackId);
    }
  };

  return (
    <div className="app">
      <header className="app__header">
        <h1>Undertow Solitaire</h1>
        <button type="button" className="app__new-game" onClick={newGame}>
          New Game
        </button>
      </header>

      <div className="app__status">
        {state.status === "playing" && stuck && (
          <p className="status-banner status-banner--stuck">
            No legal plays &mdash; click a Play Stack to pull blind from the Pull Stack.
          </p>
        )}
        {state.status === "playing" && !stuck && (
          <p className="status-banner">
            {state.movesMade} plays &middot; {state.cardsPulled} pulls &middot; {score.total} pts
          </p>
        )}
      </div>

      <main className="board">
        <ReserveStack label="Pull Stack" count={state.pullStack.length} />

        <div className="play-stacks">
          {STACK_IDS.map((stackId) => {
            const playable = Boolean(selectedCard) && canPlayCardOnStack(selectedCard!, state, stackId);
            return (
              <PlayStackView
                key={stackId}
                stackId={stackId}
                cards={state.playStacks[stackId]}
                playable={playable}
                pullTarget={stuck && state.status === "playing"}
                onClick={() => handleStackClick(stackId)}
              />
            );
          })}
        </div>

        <ReserveStack label="Draw Stack" count={state.drawStack.length} />
      </main>

      <section className="hand-section">
        <h2>My Hand</h2>
        <Hand state={state} selectedHandIndex={selectedHandIndex} stuck={stuck} onSelect={selectHandCard} />
      </section>

      <GameOverOverlay
        status={state.status}
        movesMade={state.movesMade}
        cardsPulled={state.cardsPulled}
        score={score}
        onNewGame={newGame}
      />
    </div>
  );
}

export default App;
