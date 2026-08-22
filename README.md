# Undertow Solitaire

A single-player patience game adapted from the two-player card game
**Speed**. Instead of racing an opponent, you race the deck: clear your
hand and the Draw Stack before you run out of moves, while trying to
keep as much of your Pull Stack in reserve as possible.

## Rules

**Setup**
- 15 cards go to the **Pull Stack** (face-down reserve).
- 5 cards go to **My Hand**.
- The rest go to the **Draw Stack** (face-down).
- The top 2 cards of the Draw Stack are flipped face-up to start the two
  **Play Stacks**.

**Play**
- From your hand, play a card onto either Play Stack if it's one rank away
  from that stack's top card. Suit and color don't matter — only face
  value. Sequences wrap: King ↔ Ace ↔ 2.
- You can play in either direction and switch stacks/direction at any time,
  as long as each individual play is sequential.
- Whenever you play a card from your hand, the top card of the Draw Stack
  is drawn to refill your hand back to 5 (once the Draw Stack runs out,
  your hand simply shrinks as you play it down).
- If no card in your hand can legally be played on either Play Stack, pull
  the top card from the Pull Stack and place it on either Play Stack. You
  can't see it until after it's placed — it always goes down regardless of
  sequence, and play then continues normally.

**Winning & losing**
- **Win:** the Draw Stack and your hand are both empty.
- **Loss:** the Pull Stack is empty and no legal hand plays remain.

**Scoring**
- +5 points for every card played from your hand (pulled cards don't
  count).
- +50 points for every card still sitting in the Pull Stack when the game
  ends — the reserve you never had to touch. Since a loss requires the
  Pull Stack to be empty, this bonus is really a win-condition jackpot.

## Development

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check and build for production
npm run preview  # preview the production build
```

Built with React + Vite + TypeScript. Game rules and state live in
`src/game/`; UI components live in `src/components/`.
