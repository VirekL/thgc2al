import Head from 'next/head';
import { useEffect, useState, useMemo, useRef, useCallback, useTransition } from 'react';
import Link from 'next/link';
import Sidebar from '../components/Sidebar';
import Background from '../components/Background';
import { useDateFormat } from '../components/DateFormatContext';

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
const TAG_PRIORITY_ORDER = [
  'LEVEL', 'CHALLENGE', 'LOW HERTZ', 'MOBILE', 'SPEEDHACK',
  'NOCLIP', 'MISCELLANEOUS', 'PROGRESS', 'CONSISTENCY', '2P', 'CBF',
  'RATED', 'FORMERLY RATED', 'OUTDATED VERSION'
];

function Tag({ tag }) {
  const def = TAG_DEFINITIONS[tag.toUpperCase()];
  return (
    <span
      className={"tag-filter-pill neutral"}
      style={{
        background: def?.color || '#2E3451',
        color: '#fff',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        fontWeight: 500,
        fontSize: 13,
        padding: '4px 10px',
        borderRadius: 20,
        marginRight: 4,
        border: '1.5px solid transparent',
        boxShadow: '0 1px 3px rgba(0,0,0,0.10)'
      }}
    >
      {def?.icon && (
        <img src={def.icon} alt={def.text} style={{ width: 16, height: 16, verticalAlign: 'middle' }} />
      )}
      <span>{def?.text || tag}</span>
    </span>
  );
}

function TagFilterPills({ allTags, filterTags, setFilterTags, isMobile, show, setShow }) {
  const tagStates = {};
  allTags.forEach(tag => {
    if (filterTags.include.includes(tag)) tagStates[tag] = 'include';
    else if (filterTags.exclude.includes(tag)) tagStates[tag] = 'exclude';
    else tagStates[tag] = 'neutral';
  });

  function handlePillClick(tag) {
    if (tagStates[tag] === 'neutral') setFilterTags(prev => ({ ...prev, include: [...prev.include, tag] }));
    else if (tagStates[tag] === 'include') setFilterTags(prev => ({ ...prev, include: prev.include.filter(t => t !== tag), exclude: [...prev.exclude, tag] }));
    else setFilterTags(prev => ({ ...prev, exclude: prev.exclude.filter(t => t !== tag) }));
  }

  return (
    <div
      className="tag-filter-pills"
      style={{
        minHeight: 40,
        marginBottom: 16,
        display: isMobile ? (show ? 'flex' : 'none') : 'flex',
        flexWrap: 'wrap',
        gap: 8,
        alignItems: 'center',
        transition: 'all 0.2s',
      }}
    >
      {allTags.length === 0 ? (
        <span style={{ color: '#aaa', fontSize: 13 }}>Loading tags...</span>
      ) : (
        allTags.sort((a, b) => TAG_PRIORITY_ORDER.indexOf(a.toUpperCase()) - TAG_PRIORITY_ORDER.indexOf(b.toUpperCase())).map(tag => {
          let state = tagStates[tag];
          let border = state === 'include' ? '2px solid #fff' : state === 'exclude' ? '2px solid #f55' : '1px solid #343A52';
          let opacity = state === 'exclude' ? 0.5 : 1;
          return (
            <span
              key={tag}
              className={`tag-filter-pill ${state}`}
              style={{
                cursor: 'pointer',
                padding: '4px 10px',
                borderRadius: 6,
                background: TAG_DEFINITIONS[tag.toUpperCase()]?.color || '#1B1F30',
                color: '#DFE3F5',
                border,
                opacity,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                fontWeight: 500,
                fontSize: 13,
              }}
              onClick={() => handlePillClick(tag)}
              tabIndex={0}
              aria-label={`${tag} filter pill`}
              onKeyDown={e => { if (e.key === ' ' || e.key === 'Enter') { handlePillClick(tag); e.preventDefault(); } }}
            >
              {TAG_DEFINITIONS[tag.toUpperCase()]?.icon && (
                <img src={TAG_DEFINITIONS[tag.toUpperCase()].icon} alt={tag} style={{ width: 16, height: 16, verticalAlign: 'middle' }} />
              )}
              <span>{TAG_DEFINITIONS[tag.toUpperCase()]?.text || tag}</span>
            </span>
          );
        })
      )}
    </div>
  );
}

function formatDate(date, dateFormat) {
  if (!date) return 'N/A';
  const d = new Date(date);
  if (isNaN(d)) return 'N/A';
  const yy = String(d.getFullYear()).slice(-2);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  if (dateFormat === 'YYYY/MM/DD') return `${yyyy}/${mm}/${dd}`;
  if (dateFormat === 'MM/DD/YY') return `${mm}/${dd}/${yy}`;
  if (dateFormat === 'DD/MM/YY') return `${dd}/${mm}/${yy}`;
  // Default: Month D, Yr
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function AchievementCard({ achievement, onClick }) {
  const { dateFormat } = useDateFormat();
  return (
    <Link href={`/achievement/${achievement.id}`} passHref legacyBehavior>
      <a style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="achievement-item" tabIndex={0} style={{cursor: 'pointer'}}>
          <div className="rank-date-container">
            <div className="achievement-length">
              {achievement.length ? `${Math.floor(achievement.length / 60)}:${(achievement.length % 60).toString().padStart(2, '0')}` : 'N/A'}
            </div>
            <div className="achievement-date">
              {achievement.date ? formatDate(achievement.date, dateFormat) : 'N/A'}
            </div>
            <div className="rank"><strong>#{achievement.rank}</strong></div>
          </div>
          <div className="tag-container">
            {(achievement.tags || []).sort((a, b) => TAG_PRIORITY_ORDER.indexOf(a.toUpperCase()) - TAG_PRIORITY_ORDER.indexOf(b.toUpperCase())).map(tag => (
              <Tag tag={tag} key={tag} />
            ))}
          </div>
          <div className="achievement-details">
            <div className="text">
              <h2>{achievement.name}</h2>
              <p>{achievement.player}</p>
            </div>
            <div className="thumbnail-container">
              <img src={achievement.thumbnail || (achievement.levelID ? `https://tjcsucht.net/levelthumbs/${achievement.levelID}.png` : '/assets/default-thumbnail.png')} alt={achievement.name} loading="lazy" />
            </div>
          </div>
        </div>
      </a>
    </Link>
  );
}

function useDebouncedValue(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

export default function List() {
  const [achievements, setAchievements] = useState([]);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 200);
  const [filterTags, setFilterTags] = useState({ include: [], exclude: [] });
  const [allTags, setAllTags] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const mobileBtnRef = useRef();
  const [isPending, startTransition] = typeof useTransition === 'function' ? useTransition() : [false, fn => fn()];
  const { dateFormat, setDateFormat } = useDateFormat();
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    fetch('/achievements.json')
      .then(res => res.json())
      .then(data => {
        const valid = data.filter(a => a && typeof a.name === 'string' && a.name && a.id);
        const withRank = valid.map((a, i) => ({ ...a, rank: i + 1 }));
        setAchievements(withRank);
        const tags = new Set();
        withRank.forEach(a => (a.tags || []).forEach(t => tags.add(t)));
        setAllTags(Array.from(tags));
      });
  }, []);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 900);
      if (window.innerWidth > 900) setShowMobileFilters(false);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const searchLower = useMemo(() => debouncedSearch.trim().toLowerCase(), [debouncedSearch]);

  const filterFn = useCallback(
    a => {
      if (searchLower) {
        if (typeof a.name !== 'string') return false;
        // Match if the search term appears anywhere in the name (substring, case-insensitive)
        if (!a.name.toLowerCase().includes(searchLower)) return false;
      }
      const tags = (a.tags || []).map(t => t.toUpperCase());
      if (filterTags.include.length && !filterTags.include.every(tag => tags.includes(tag.toUpperCase()))) return false;
      if (filterTags.exclude.length && filterTags.exclude.some(tag => tags.includes(tag.toUpperCase()))) return false;
      return true;
    },
    [searchLower, filterTags]
  );

  const filtered = useMemo(() => {
    return achievements.filter(filterFn);
  }, [achievements, filterFn]);

  function handleMobileToggle() {
    setShowMobileFilters(v => !v);
  }

  return (
    <>
      <Head>
        <title>The Hardest Achievements List</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" type="image/png" href="/assets/favicon-96x96.png" sizes="96x96" />
        <link rel="shortcut icon" href="/assets/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/assets/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="THAL" />
        <link rel="manifest" href="/assets/site.webmanifest" />
        <meta
          name="description"
          content="This Geometry Dash list ranks rated, unrated, challenges, runs, speedhacked, low refresh rate, (and more) all under one list."
        />
      </Head>
      <Background />
      <header className="main-header">
        <div className="header-bar">
          <button id="mobile-hamburger-btn" className="mobile-hamburger-btn" type="button" aria-label="Open sidebar" title="Open sidebar menu">
            <span className="bi bi-list hamburger-icon" aria-hidden="true"></span>
          </button>
          <div className="logo">
            <img src="/assets/favicon-96x96.png" alt="The Hardest Achievements List Logo" title="The Hardest Achievements List Logo" className="logo-img" />
          </div>
          <h1 className="title main-title">The Hardest Achievements List</h1>
          {/* Settings button */}
          <button
            className="settings-btn"
            aria-label="Open settings"
            title="Open settings"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 8,
              zIndex: 10,
              display: "flex",
              alignItems: "center",
              marginLeft: 'auto'
            }}
            onClick={() => setShowSettings(true)}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#DFE3F5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.09A1.65 1.65 0 0 0 9 3.09V3a2 2 0 1 1 4 0v.09c0 .66.39 1.26 1 1.51a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.09c.22.61.85 1 1.51 1H21a2 2 0 1 1 0 4h-.09c-.66 0-1.26.39-1.51 1z"/></svg>
          </button>
        </div>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search achievements..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label="Search achievements"
            className="search-input"
          />
          {isMobile && (
            <button
              ref={mobileBtnRef}
              id="mobile-filter-toggle-btn"
              aria-label={showMobileFilters ? 'Hide Filters' : 'Show Filters'}
              onClick={handleMobileToggle}
              className="mobile-filter-toggle"
              dangerouslySetInnerHTML={{
                __html: showMobileFilters
                  ? '<span class="arrow-img-wrapper"><img src="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/icons/chevron-up.svg" alt="Hide Filters" class="arrow-img" /></span>'
                  : '<span class="arrow-img-wrapper"><img src="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/icons/chevron-down.svg" alt="Show Filters" class="arrow-img" /></span>'
              }}
            />
          )}
        </div>
        <div className="tag-filter-pills-container">
          <TagFilterPills
            allTags={allTags}
            filterTags={filterTags}
            setFilterTags={setFilterTags}
            isMobile={isMobile}
            show={showMobileFilters}
            setShow={setShowMobileFilters}
          />
        </div>
        {/* Settings Modal */}
        {showSettings && (
          <div
            className="settings-modal-overlay"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000
            }}
            onClick={() => setShowSettings(false)}
          >
            <div
              className="settings-modal"
              style={{
                background: "#23283E",
                borderRadius: 12,
                padding: 32,
                minWidth: 300,
                minHeight: 180,
                boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative"
              }}
              onClick={e => e.stopPropagation()}
            >
              <button
                aria-label="Close settings"
                title="Close"
                style={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  background: "none",
                  border: "none",
                  color: "#DFE3F5",
                  fontSize: 24,
                  cursor: "pointer"
                }}
                onClick={() => setShowSettings(false)}
              >
                ×
              </button>
              <h2 style={{ color: "#DFE3F5", marginBottom: 24 }}>Settings</h2>
              <div style={{ width: "100%", marginBottom: 12 }}>
                <label style={{ color: "#DFE3F5", fontWeight: 600, fontSize: 16, marginBottom: 8, display: "block" }}>Date Format</label>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <label style={{ color: "#DFE3F5", fontSize: 15, cursor: "pointer" }}>
                    <input
                      type="radio"
                      name="date-format"
                      value="Month D, Yr"
                      checked={dateFormat === "Month D, Yr"}
                      onChange={() => setDateFormat("Month D, Yr")}
                      style={{ marginRight: 8 }}
                    />
                    Month D, Yr (Default)
                  </label>
                  <label style={{ color: "#DFE3F5", fontSize: 15, cursor: "pointer" }}>
                    <input
                      type="radio"
                      name="date-format"
                      value="YYYY/MM/DD"
                      checked={dateFormat === "YYYY/MM/DD"}
                      onChange={() => setDateFormat("YYYY/MM/DD")}
                      style={{ marginRight: 8 }}
                    />
                    YYYY/MM/DD
                  </label>
                  <label style={{ color: "#DFE3F5", fontSize: 15, cursor: "pointer" }}>
                    <input
                      type="radio"
                      name="date-format"
                      value="MM/DD/YY"
                      checked={dateFormat === "MM/DD/YY"}
                      onChange={() => setDateFormat("MM/DD/YY")}
                      style={{ marginRight: 8 }}
                    />
                    MM/DD/YY
                  </label>
                  <label style={{ color: "#DFE3F5", fontSize: 15, cursor: "pointer" }}>
                    <input
                      type="radio"
                      name="date-format"
                      value="DD/MM/YY"
                      checked={dateFormat === "DD/MM/YY"}
                      onChange={() => setDateFormat("DD/MM/YY")}
                      style={{ marginRight: 8 }}
                    />
                    DD/MM/YY
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
      <main className="main-content achievements-main">
        <Sidebar />
        <section className="achievements achievements-section">
          {isPending ? (
            <div className="no-achievements">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="no-achievements">No achievements found.</div>
          ) : (
            filtered.map((a, i) => (
              <AchievementCard achievement={a} key={a.id || i} />
            ))
          )}
        </section>
      </main>
    </>
  );
}
