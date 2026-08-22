export type Suit = "spades" | "hearts" | "diamonds" | "clubs";

// Rank as a circular value 1 (Ace) .. 13 (King). Ace also wraps to King.
export type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;

export interface Card {
  id: string;
  suit: Suit;
  rank: Rank;
}

export type PlayStackId = "A" | "B";

export type GameStatus = "playing" | "won" | "lost";

export interface GameState {
  pullStack: Card[]; // top of stack = last element; drawn blind
  drawStack: Card[]; // top of stack = last element; refills the hand
  hand: (Card | null)[]; // fixed-length 5 slots, null once drawStack runs dry
  playStacks: Record<PlayStackId, Card[]>; // top of stack = last element
  status: GameStatus;
  movesMade: number;
  cardsPulled: number;
}

export const HAND_SIZE = 5;
export const PULL_STACK_SIZE = 15;
