import { createDeck, isSequential, shuffle } from "./deck";
import { HAND_SIZE, PULL_STACK_SIZE } from "./types";
import type { Card, GameState, PlayStackId } from "./types";

export function dealNewGame(): GameState {
  const deck = shuffle(createDeck());

  const pullStack = deck.splice(0, PULL_STACK_SIZE);
  const hand: (Card | null)[] = deck.splice(0, HAND_SIZE);
  const drawStack = deck; // everything left

  const first = drawStack.pop();
  const second = drawStack.pop();
  if (!first || !second) {
    throw new Error("Not enough cards to start the play stacks");
  }

  return {
    pullStack,
    drawStack,
    hand,
    playStacks: { A: [first], B: [second] },
    status: "playing",
    movesMade: 0,
    cardsPulled: 0,
  };
}

function topOf(stack: Card[]): Card | undefined {
  return stack[stack.length - 1];
}

export function canPlayCardOnStack(
  card: Card,
  state: GameState,
  stackId: PlayStackId,
): boolean {
  const top = topOf(state.playStacks[stackId]);
  if (!top) return false;
  return isSequential(card.rank, top.rank);
}

export function hasAnyLegalHandMove(state: GameState): boolean {
  return state.hand.some(
    (card) =>
      card !== null &&
      (canPlayCardOnStack(card, state, "A") ||
        canPlayCardOnStack(card, state, "B")),
  );
}

function checkStatus(state: GameState): GameState["status"] {
  const handEmpty = state.hand.every((c) => c === null);
  if (state.drawStack.length === 0 && handEmpty) {
    return "won";
  }
  if (state.pullStack.length === 0 && !hasAnyLegalHandMove(state)) {
    return "lost";
  }
  return "playing";
}

export function playFromHand(
  state: GameState,
  handIndex: number,
  stackId: PlayStackId,
): GameState {
  if (state.status !== "playing") return state;
  const card = state.hand[handIndex];
  if (!card) return state;
  if (!canPlayCardOnStack(card, state, stackId)) return state;

  const nextHand = [...state.hand];
  const nextDrawStack = [...state.drawStack];
  const drawnCard = nextDrawStack.pop() ?? null;
  nextHand[handIndex] = drawnCard;

  const nextState: GameState = {
    ...state,
    hand: nextHand,
    drawStack: nextDrawStack,
    playStacks: {
      ...state.playStacks,
      [stackId]: [...state.playStacks[stackId], card],
    },
    movesMade: state.movesMade + 1,
  };

  nextState.status = checkStatus(nextState);
  return nextState;
}

export function pullAndPlace(
  state: GameState,
  stackId: PlayStackId,
): GameState {
  if (state.status !== "playing") return state;
  if (state.pullStack.length === 0) return state;
  if (hasAnyLegalHandMove(state)) return state; // pulling only allowed when stuck

  const nextPullStack = [...state.pullStack];
  const card = nextPullStack.pop();
  if (!card) return state;

  const nextState: GameState = {
    ...state,
    pullStack: nextPullStack,
    playStacks: {
      ...state.playStacks,
      [stackId]: [...state.playStacks[stackId], card],
    },
    cardsPulled: state.cardsPulled + 1,
  };

  nextState.status = checkStatus(nextState);
  return nextState;
}
