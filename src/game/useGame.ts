import { useCallback, useReducer, useState } from "react";
import { dealNewGame, hasAnyLegalHandMove, playFromHand, pullAndPlace } from "./engine";
import type { GameState, PlayStackId } from "./types";

type Action =
  | { type: "NEW_GAME" }
  | { type: "PLAY_FROM_HAND"; handIndex: number; stackId: PlayStackId }
  | { type: "PULL_AND_PLACE"; stackId: PlayStackId };

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "NEW_GAME":
      return dealNewGame();
    case "PLAY_FROM_HAND":
      return playFromHand(state, action.handIndex, action.stackId);
    case "PULL_AND_PLACE":
      return pullAndPlace(state, action.stackId);
    default:
      return state;
  }
}

export function useGame() {
  const [state, dispatch] = useReducer(reducer, undefined, dealNewGame);
  const [selectedHandIndex, setSelectedHandIndex] = useState<number | null>(null);

  const stuck = state.status === "playing" && !hasAnyLegalHandMove(state);

  const selectHandCard = useCallback(
    (index: number) => {
      if (state.status !== "playing" || stuck) return;
      setSelectedHandIndex((current) => (current === index ? null : index));
    },
    [state.status, stuck],
  );

  const playHandIndexOnStack = useCallback((handIndex: number, stackId: PlayStackId) => {
    dispatch({ type: "PLAY_FROM_HAND", handIndex, stackId });
    setSelectedHandIndex(null);
  }, []);

  const playOnStack = useCallback(
    (stackId: PlayStackId) => {
      if (selectedHandIndex === null) return;
      playHandIndexOnStack(selectedHandIndex, stackId);
    },
    [selectedHandIndex, playHandIndexOnStack],
  );

  const pullOnStack = useCallback((stackId: PlayStackId) => {
    dispatch({ type: "PULL_AND_PLACE", stackId });
  }, []);

  const newGame = useCallback(() => {
    setSelectedHandIndex(null);
    dispatch({ type: "NEW_GAME" });
  }, []);

  return {
    state,
    selectedHandIndex,
    stuck,
    selectHandCard,
    playOnStack,
    playHandIndexOnStack,
    pullOnStack,
    newGame,
  };
}
