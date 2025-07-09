const TAG_DEFINITIONS = {
  LEVEL: { color: 'rgb(34, 139, 34)', text: 'Level' },
  CHALLENGE: { color: 'rgb(255, 165, 0)', text: 'Challenge' },
  'LOW HERTZ': { color: 'rgb(128, 0, 128)', text: 'Low Hertz' },
  MOBILE: { color: 'rgb(0, 191, 255)', text: 'Mobile' },
  SPEEDHACK: { color: 'rgb(255, 69, 0)', text: 'Speedhack' },
  NOCLIP: { color: 'rgb(139, 0, 0)', text: 'Noclip' },
  MISCELLANEOUS: { color: 'rgb(105, 105, 105)', text: 'Miscellaneous' },
  PROGRESS: { color: 'rgb(70, 130, 180)', text: 'Progress' },
  CONSISTENCY: { color: 'rgb(75, 0, 130)', text: 'Consistency' },
  '2P': { color: 'rgb(230, 115, 39)', icon: '/assets/2p-icon.png', text: '2 Player' },
  CBF: { color: 'rgb(219, 48, 63)', icon: '/assets/cbf-logo.png', text: 'CBF' },
  RATED: { color: 'rgb(230, 184, 60)', icon: '/assets/rated-icon.png', text: 'Rated' },
  'FORMERLY RATED': { color: 'rgb(131, 51, 37)', icon: '/assets/formerly-rated-icon.png', text: 'Formerly Rated' },
  'OUTDATED VERSION': { color: 'rgb(110, 103, 33)', icon: '/assets/outdated-version-icon.png', text: 'Outdated Version' },
};

export default function Tag({ tag }) {
  const def = TAG_DEFINITIONS[tag.toUpperCase()];
  return (
    <span
      className="tag"
      style={{
        background: def?.icon ? undefined : def?.color || undefined,
        color: '#fff',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        fontWeight: 500,
        fontSize: 13,
        padding: '4px 10px',
        borderRadius: 8,
        marginRight: 4,
        border: '1px solid #343A52',
        boxShadow: '0 1px 3px rgba(0,0,0,0.10)'
      }}
    >
      {def?.icon && (
        <img src={def.icon} alt={def.text} style={{ width: 16, height: 16, verticalAlign: 'middle', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.7)) drop-shadow(0 0px 1px #000)' }} />
      )}
      <span>{def?.text || tag}</span>
    </span>
  );
}

export { TAG_DEFINITIONS };
