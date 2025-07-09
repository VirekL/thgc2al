import React from 'react';

const TAG_PRIORITY_ORDER = [
  'LEVEL', 'CHALLENGE', 'LOW HERTZ', 'MOBILE', 'SPEEDHACK',
  'NOCLIP', 'MISCELLANEOUS', 'PROGRESS', 'CONSISTENCY', '2P', 'CBF',
  'RATED', 'FORMERLY RATED', 'OUTDATED VERSION'
];

const TAG_DEFINITIONS = {
  LEVEL: { className: 'tag-level', text: 'Level' },
  CHALLENGE: { className: 'tag-challenge', text: 'Challenge' },
  'LOW HERTZ': { className: 'tag-low-hertz', text: 'Low Hertz' },
  MOBILE: { className: 'tag-mobile', text: 'Mobile' },
  SPEEDHACK: { className: 'tag-speedhack', text: 'Speedhack' },
  NOCLIP: { className: 'tag-noclip', text: 'Noclip' },
  MISCELLANEOUS: { className: 'tag-miscellaneous', text: 'Miscellaneous' },
  PROGRESS: { className: 'tag-progress', text: 'Progress' },
  CONSISTENCY: { className: 'tag-consistency', text: 'Consistency' },
  '2P': { className: 'tag-2p', icon: '/assets/2p-icon.png', text: '2 Player' },
  CBF: { className: 'tag-cbf', icon: '/assets/cbf-logo.png', text: 'CBF' },
  RATED: { className: 'tag-rated', icon: '/assets/rated-icon.png', text: 'Rated' },
  'FORMERLY RATED': { className: 'tag-formerly-rated', icon: '/assets/formerly-rated-icon.png', text: 'Formerly Rated' },
  'OUTDATED VERSION': { className: 'tag-outdated-version', icon: '/assets/outdated-version-icon.png', text: 'Outdated Version' },
};

export default function Tag({ tag }) {
  const def = TAG_DEFINITIONS[tag.toUpperCase()] || {};
  const classNames = ['tag', def.className].filter(Boolean).join(' ');
  return (
    <>
      <span className={classNames}>
        {def.icon && (
          <img src={def.icon} alt={def.text} />
        )}
        <span>{def.text || tag}</span>
      </span>
      <style jsx>{`
        .tag {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-weight: 500;
          font-size: 13px;
          padding: 4px 10px;
          border-radius: 8px;
          margin-right: 4px;
          border: 1px solid #343A52;
          box-shadow: 0 1px 3px rgba(0,0,0,0.10);
          color: #fff;
          background: linear-gradient(135deg, #23283E 0%, #2E3451 100%);
          text-transform: uppercase;
          text-shadow: 2px 2px 6px rgba(0,0,0,0.85), 0 1px 2px #000;
          transition: background 0.3s, border 0.2s, opacity 0.2s;
        }
        .tag img {
          width: 16px;
          height: 16px;
          vertical-align: middle;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.7)) drop-shadow(0 0px 1px #000);
        }
        .tag-level { background: linear-gradient(135deg, #228B22 0%, #43e97b 100%); }
        .tag-challenge { background: linear-gradient(135deg, #ffb347 0%, #ff7e5f 100%); }
        .tag-low-hertz { background: linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%); }
        .tag-mobile { background: linear-gradient(135deg, #00bfff 0%, #4facfe 100%); }
        .tag-speedhack { background: linear-gradient(135deg, #ff512f 0%, #dd2476 100%); }
        .tag-noclip { background: linear-gradient(135deg, #8B0000 0%, #e52d27 100%); }
        .tag-miscellaneous { background: linear-gradient(135deg, #757F9A 0%, #232526 100%); }
        .tag-progress { background: linear-gradient(135deg, #4682b4 0%, #6dd5ed 100%); }
        .tag-consistency { background: linear-gradient(135deg, #4e54c8 0%, #8f94fb 100%); }
        .tag-2p { background: linear-gradient(135deg, #e67327 0%, #ffb347 100%); }
        .tag-cbf { background: linear-gradient(135deg, #db303f 0%, #ff758c 100%); }
        .tag-rated { background: linear-gradient(135deg, #e6b83c 0%, #ffe259 100%); }
        .tag-formerly-rated { background: linear-gradient(135deg, #833325 0%, #ff9966 100%); }
        .tag-outdated-version { background: linear-gradient(135deg, #6e6721 0%, #f9d423 100%); }
      `}</style>
    </>
  );
}

export { TAG_DEFINITIONS, TAG_PRIORITY_ORDER };
