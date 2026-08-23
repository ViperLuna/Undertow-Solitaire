import { PULL_STACK_SIZE } from "./types";
import type { GameState } from "./types";

export const POINTS_PER_CARD_PLAYED = 5;
export const POINTS_PER_PULL_STACK_CARD_REMAINING = 50;

const DECK_SIZE = 52;
const INITIAL_PLAY_STACK_CARDS = 2;

// A win always plays exactly this many cards from hand: everything that
// ever passes through it (the deck, minus what's held in reserve and the
// two cards used to seed the Play Stacks at deal time).
const MAX_HAND_PLAYS = DECK_SIZE - PULL_STACK_SIZE - INITIAL_PLAY_STACK_CARDS;

// The best score obtainable at all: a win, having never pulled from the
// Pull Stack.
export const MAX_POSSIBLE_SCORE =
  MAX_HAND_PLAYS * POINTS_PER_CARD_PLAYED + PULL_STACK_SIZE * POINTS_PER_PULL_STACK_CARD_REMAINING;

export interface ScoreBreakdown {
  playPoints: number;
  reservePoints: number;
  total: number;
}

// A loss can only happen once the Pull Stack is empty, so the reserve
// bonus naturally pays out only on (or near) a win.
export function calculateScore(state: GameState): ScoreBreakdown {
  const playPoints = state.movesMade * POINTS_PER_CARD_PLAYED;
  const reservePoints = state.pullStack.length * POINTS_PER_PULL_STACK_CARD_REMAINING;
  return { playPoints, reservePoints, total: playPoints + reservePoints };
}

// The best score still reachable from here: every pull permanently costs
// 50 points of ceiling, regardless of how the rest of the game goes.
export function calculateMaxAchievableScore(state: GameState): number {
  return MAX_POSSIBLE_SCORE - state.cardsPulled * POINTS_PER_PULL_STACK_CARD_REMAINING;
}
