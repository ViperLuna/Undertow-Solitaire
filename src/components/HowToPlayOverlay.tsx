interface HowToPlayOverlayProps {
  onClose: () => void;
}

export function HowToPlayOverlay({ onClose }: HowToPlayOverlayProps) {
  return (
    <div className="overlay" onClick={onClose}>
      <div
        className="overlay__panel overlay__panel--wide how-to-play"
        onClick={(event) => event.stopPropagation()}
      >
        <h2>How to Play</h2>

        <div className="how-to-play__body">
          <h3>Setup</h3>
          <p>
            15 cards form the <strong>Pull Stack</strong>, 5 go to <strong>My Hand</strong>, and the rest become
            the <strong>Draw Stack</strong>. The top 2 Draw Stack cards are flipped face-up to start the two{" "}
            <strong>Play Stacks</strong>.
          </p>

          <h3>Playing</h3>
          <p>
            From your hand, play a card onto either Play Stack if it's one rank away from that stack's top card.
            Suit and color don't matter &mdash; only face value. Sequences wrap: King &harr; Ace &harr; 2. You can
            play in either direction and switch stacks or direction at any time, as long as each play is
            sequential.
          </p>
          <p>
            Every time you play a card from your hand, the top of the Draw Stack refills your hand back to 5
            (once the Draw Stack runs dry, your hand just shrinks as you play it down).
          </p>

          <h3>Stuck?</h3>
          <p>
            If nothing in your hand can legally play, pull the top card from the Pull Stack and place it on
            either Play Stack &mdash; you can't see it until after it lands, and it always goes down regardless
            of sequence. Play then continues normally.
          </p>

          <h3>Winning &amp; Losing</h3>
          <p>
            <strong>Win:</strong> the Draw Stack and your hand are both empty.
            <br />
            <strong>Loss:</strong> the Pull Stack is empty and no legal hand plays remain.
          </p>

          <h3>Scoring</h3>
          <p>
            +5 points for every card played from your hand (pulled cards don't count). +50 points for every card
            still sitting in the Pull Stack when the game ends &mdash; the reserve you never had to touch.
          </p>
        </div>

        <div className="overlay__actions">
          <button type="button" onClick={onClose}>
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
