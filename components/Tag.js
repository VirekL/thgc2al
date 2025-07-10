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

export default function Tag({ tag, onClick, tabIndex, clickable, state }) {
    const def = TAG_DEFINITIONS[tag.toUpperCase()] || {};
    const classNames = [
        'tag',
        def.className,
        clickable ? 'tag-clickable' : '',
        state === 'include' ? 'tag-include' : '',
        state === 'exclude' ? 'tag-exclude' : '',
        state === 'neutral' ? 'tag-neutral' : ''
    ].filter(Boolean).join(' ');
    return (
        <>
            <span
                className={classNames}
                onClick={clickable ? onClick : undefined}
                tabIndex={clickable ? (tabIndex ?? 0) : undefined}
                role={clickable ? 'button' : undefined}
                aria-pressed={clickable ? (state === 'include' ? 'true' : 'false') : undefined}
                onKeyDown={clickable ? (e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onClick && onClick(e);
                    }
                }) : undefined}
            >
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
          box-shadow: 0 2px 8px rgba(0,0,0,0.22), 0 4px 16px rgba(0,0,0,0.10); /* Enhanced drop shadow */
          color: #fff;
          background: linear-gradient(135deg, #23283E 0%, #2E3451 100%);
          text-transform: uppercase;
          text-shadow: 2px 2px 6px rgba(0,0,0,0.85), 0 1px 2px #000;
          transition: background 0.3s, border 0.2s, opacity 0.2s;
          outline: none;
          cursor: default;
        }
        .tag-clickable {
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.18);
        }
        .tag-clickable:hover {
          opacity: 0.85;
          filter: brightness(1.1);
        }
        .tag-include {
          border: none;
          box-shadow: 0 0 0 3px rgb(94, 255, 62);
        }
        .tag-exclude {
          border: none;
          box-shadow: 0 0 0 3px rgb(233, 64, 59);
          opacity: 0.7;
        }
        .tag-neutral {
          border: none;
          box-shadow: none;
        }
        .tag img {
          width: 16px;
          height: 16px;
          vertical-align: middle;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.7)) drop-shadow(0 0px 1px #000);
        }
.tag-level {
  background: linear-gradient(135deg, #43e97b 0%,rgb(37, 164, 180) 100%);
}
.tag-challenge {
  background: linear-gradient(135deg, #ffb347 0%,rgb(255, 95, 162) 100%);
}
.tag-low-hertz {
  background: linear-gradient(135deg,rgb(215, 36, 231) 0%,rgb(98, 50, 209) 100%);
}
.tag-mobile {
  background: linear-gradient(135deg, #4facfe 0%,rgb(28, 92, 175) 100%);
}
.tag-speedhack {
  background: linear-gradient(135deg, #ff6a00 0%,rgb(192, 82, 31) 100%);
}
.tag-noclip {
  background: linear-gradient(135deg, #e52d27 0%,rgb(139, 0, 46) 100%);
}
.tag-miscellaneous {
  background: linear-gradient(135deg,rgb(168, 172, 179) 0%,rgb(99, 107, 110) 100%);
}
.tag-progress {
  background: linear-gradient(135deg, #6dd5ed 0%, #4682b4 100%);
}
.tag-consistency {
  background: linear-gradient(135deg, #8f94fb 0%,rgb(48, 55, 180) 100%);
}
.tag-2p {
  background: linear-gradient(135deg,rgb(245, 122, 41) 0%,rgb(190, 88, 40) 100%);
}
.tag-cbf {
  background: linear-gradient(135deg, #ff758c 0%, #db303f 100%);
}
.tag-rated {
  background: linear-gradient(135deg,rgb(255, 183, 89) 0%,rgb(179, 145, 51) 100%);
}
.tag-formerly-rated {
  background: linear-gradient(135deg, #ff9966 0%, #833325 100%);
}
.tag-outdated-version {
  background: linear-gradient(135deg,rgb(138, 134, 115) 0%,rgb(206, 155, 47) 100%);
}
      `}</style>
        </>
    );
}

export { TAG_DEFINITIONS, TAG_PRIORITY_ORDER };
