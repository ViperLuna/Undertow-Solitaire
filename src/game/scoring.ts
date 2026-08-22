import type { GameState } from "./types";

export const POINTS_PER_CARD_PLAYED = 5;
export const POINTS_PER_PULL_STACK_CARD_REMAINING = 50;

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
