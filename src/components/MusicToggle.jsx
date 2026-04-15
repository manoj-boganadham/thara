function MusicToggle({ isMuted, onToggle }) {
  return (
    <button
      type="button"
      className="music-toggle-fab"
      onClick={onToggle}
      aria-label={isMuted ? 'Unmute background music' : 'Mute background music'}
      title={isMuted ? 'Unmute' : 'Mute'}
    >
      <span aria-hidden="true">{isMuted ? '🔇' : '🔊'}</span>
    </button>
  );
}

export default MusicToggle;
