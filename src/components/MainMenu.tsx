interface MainMenuProps {
  onPlay: () => void;
  onShowLeaderboard: () => void;
  onShowHowToPlay: () => void;
}

export function MainMenu({ onPlay, onShowLeaderboard, onShowHowToPlay }: MainMenuProps) {
  return (
    <div className="menu">
      <h1 className="menu__title">Undertow Solitaire</h1>
      <p className="menu__tagline">Clear the tide. Guard your reserve.</p>
      <div className="menu__actions">
        <button type="button" className="menu__play-btn" onClick={onPlay}>
          Play
        </button>
        <button type="button" className="menu__secondary-btn" onClick={onShowHowToPlay}>
          How to Play
        </button>
        <button type="button" className="menu__secondary-btn" onClick={onShowLeaderboard}>
          Leaderboard
        </button>
      </div>
    </div>
  );
}
