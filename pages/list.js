import Head from 'next/head';
import { useEffect, useState, useMemo, useRef, useCallback, useTransition } from 'react';
import Link from 'next/link';
import Sidebar from '../components/Sidebar';
import Background from '../components/Background';
import { useDateFormat } from '../components/DateFormatContext';
import Tag, { TAG_PRIORITY_ORDER } from '../components/Tag';

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
        allTags.sort((a, b) => TAG_PRIORITY_ORDER.indexOf(a.toUpperCase()) - TAG_PRIORITY_ORDER.indexOf(b.toUpperCase())).map(tag => (
          <Tag
            key={tag}
            tag={tag}
            state={tagStates[tag]}
            onClick={() => handlePillClick(tag)}
            tabIndex={0}
            clickable={true}
          />
        ))
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
  // Helper for tooltips on less obvious tags, using About Us page definitions
  const TAG_TOOLTIPS = {
    LEVEL: 'A traditional level, which spans 30+ seconds.',
    CHALLENGE: 'Tiny or short length level; a level that spans under 30 seconds.',
    'LOW HERTZ': 'Done at a low hz. It can be added if it adds a lot more difficulty to the level.',
    MOBILE: 'Played on mobile.',
    SPEEDHACK: 'Altered speed using hacks.',
    NOCLIP: 'Done with noclip on.',
    MISCELLANEOUS: 'An achievement that doesn\'t fit with any other types.',
    PROGRESS: 'Parts of the level completed.',
    CONSISTENCY: 'Progress done in a row.',
    '2P': 'Level uses 2 player mode.',
    CBF: 'Achievement uses Geode mod Click Between Frames, which allows players to input actions in between visual frames, effectively increasing input precision.',
    RATED: 'Level is rated ingame.',
    'FORMERLY RATED': 'Level was rated, but had its rating status removed.',
    'OUTDATED VERSION': 'Level is rated and is on an older version than the current one.'
  };

  return (
    <Link href={`/achievement/${achievement.id}`} passHref legacyBehavior>
      <a style={{ textDecoration: 'none', color: 'inherit' }}>
        <div
          className="achievement-item improved-card"
          tabIndex={0}
          style={{ cursor: 'pointer', marginBottom: '2rem', boxShadow: '0 4px 16px rgba(0,0,0,0.18)', borderRadius: '12px', padding: '1.5rem', background: 'var(--accent-bg)', display: 'flex', alignItems: 'center', minHeight: '140px' }}
        >
          <div className="thumbnail-container" style={{ flex: '0 0 180px', height: '110px', marginRight: '2rem', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.22)' }}>
            <img
              src={achievement.thumbnail || (achievement.levelID ? `https://tjcsucht.net/levelthumbs/${achievement.levelID}.png` : '/assets/default-thumbnail.png')}
              alt={achievement.name}
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }}
            />
          </div>
          <div className="achievement-details" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.5rem' }}>
            <div className="text" style={{ marginBottom: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              <h2 style={{ fontSize: '1.6rem', marginBottom: '0.2rem', textAlign: 'left', fontWeight: 700 }}>{achievement.name}</h2>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-color)', textAlign: 'left', marginBottom: 0 }}>{achievement.player}</p>
            </div>
            <div className="tag-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.2rem' }}>
              {(achievement.tags || [])
                .sort((a, b) => TAG_PRIORITY_ORDER.indexOf(a.toUpperCase()) - TAG_PRIORITY_ORDER.indexOf(b.toUpperCase()))
                .map(tag => (
                  <span key={tag} style={{ position: 'relative' }}>
                    <Tag
                      tag={tag}
                      {...(TAG_TOOLTIPS[tag.toUpperCase()] ? {
                        tabIndex: 0,
                        clickable: false,
                        onMouseEnter: e => {
                          const tooltip = document.createElement('div');
                          tooltip.className = 'tag-tooltip';
                          tooltip.innerText = TAG_TOOLTIPS[tag.toUpperCase()];
                          tooltip.style.position = 'absolute';
                          tooltip.style.bottom = '120%';
                          tooltip.style.left = '50%';
                          tooltip.style.transform = 'translateX(-50%)';
                          tooltip.style.background = 'rgba(30,30,40,0.97)';
                          tooltip.style.color = '#fff';
                          tooltip.style.padding = '6px 12px';
                          tooltip.style.borderRadius = '8px';
                          tooltip.style.fontSize = '13px';
                          tooltip.style.boxShadow = '0 2px 8px rgba(0,0,0,0.22)';
                          tooltip.style.zIndex = '9999';
                          e.currentTarget.appendChild(tooltip);
                        },
                        onMouseLeave: e => {
                          const tooltips = e.currentTarget.querySelectorAll('.tag-tooltip');
                          tooltips.forEach(t => t.remove());
                        }
                      } : {})}
                    />
                  </span>
                ))}
            </div>
            <div className="rank-date-container" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginTop: '0.2rem' }}>
              <div className="achievement-length" style={{ fontWeight: 500, fontSize: '1.05rem', color: '#b8c6e0' }}>
                {achievement.length ? `${Math.floor(achievement.length / 60)}:${(achievement.length % 60).toString().padStart(2, '0')}` : 'N/A'}
              </div>
              <div className="achievement-date" style={{ fontSize: '1.05rem', color: '#b8c6e0' }}>
                {achievement.date ? formatDate(achievement.date, dateFormat) : 'N/A'}
              </div>
              <div className="rank" style={{ fontWeight: 700, fontSize: '1.1rem', color: '#ffc800' }}>
                <strong>#{achievement.rank}</strong>
              </div>
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
  const [showSidebar, setShowSidebar] = useState(false); // Add sidebar state
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
        <div
          className="header-bar"
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'flex-start' : 'center',
            gap: isMobile ? 0 : 16,
            width: '100%',
            paddingBottom: isMobile ? 8 : 0
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: isMobile ? '100%' : 'auto' }}>
            <button
              id="mobile-hamburger-btn"
              className="mobile-hamburger-btn"
              type="button"
              aria-label="Open sidebar"
              title="Open sidebar menu"
              onClick={() => isMobile && setShowSidebar(true)}
              style={{ marginRight: 12 }}
            >
              <span className="bi bi-list hamburger-icon" aria-hidden="true"></span>
            </button>
            <div className="logo">
              <img src="/assets/favicon-96x96.png" alt="The Hardest Achievements List Logo" title="The Hardest Achievements List Logo" className="logo-img" />
            </div>
            <h1 className="title main-title" style={{ marginLeft: 12, fontSize: isMobile ? 22 : undefined, lineHeight: 1.1 }}>
              The Hardest Achievements List
            </h1>
          </div>
          {/* Only show search bar and arrow below on mobile */}
          {isMobile && (
            <div style={{ width: '100%', marginTop: 12 }}>
              <div className="search-bar" style={{ width: '100%', maxWidth: 400, margin: '0 auto' }}>
                <input
                  type="text"
                  placeholder="Search achievements..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  aria-label="Search achievements"
                  className="search-input"
                  style={{ width: '100%' }}
                />
              </div>
              {/* Tag filter pills below search bar, above arrow */}
              <div className="tag-filter-pills-container" style={{ width: '100%' }}>
                <TagFilterPills
                  allTags={allTags}
                  filterTags={filterTags}
                  setFilterTags={setFilterTags}
                  isMobile={isMobile}
                  show={showMobileFilters}
                  setShow={setShowMobileFilters}
                />
              </div>
              <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: 8 }}>
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
              </div>
            </div>
          )}
          {/* Desktop search bar stays in header-bar */}
          {!isMobile && (
            <div className="search-bar" style={{ width: '100%', maxWidth: 400, marginLeft: 'auto' }}>
              <input
                type="text"
                placeholder="Search achievements..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                aria-label="Search achievements"
                className="search-input"
                style={{ width: '100%' }}
              />
            </div>
          )}
        </div>
        {/* Desktop: tag filter pills below header-bar, mobile: handled above */}
        {!isMobile && (
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
        )}
      </header>
      {/* Mobile Sidebar Overlay */}
      {isMobile && showSidebar && (
        <div
          className="sidebar-mobile-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.75)",
            zIndex: 1001,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
          onClick={() => setShowSidebar(false)}
        >
          <div
            className="sidebar sidebar-mobile-open"
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 1002,
              width: "90vw",
              maxWidth: 350,
              maxHeight: "90vh",
              boxShadow: "0 8px 32px rgba(0,0,0,0.45)",
              display: "flex",
              flexDirection: "column",
              background: "var(--secondary-bg)",
              borderRadius: "1.2rem",
              overflowY: "auto"
            }}
            onClick={e => e.stopPropagation()}
          >
            <button
              aria-label="Close sidebar"
              title="Close sidebar"
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                background: "none",
                border: "none",
                color: "#DFE3F5",
                fontSize: 28,
                cursor: "pointer",
                zIndex: 1003
              }}
              onClick={() => setShowSidebar(false)}
            >
              ×
            </button>
            <Sidebar />
          </div>
        </div>
      )}
      <main className="main-content achievements-main">
        {/* Desktop sidebar only */}
        {!isMobile && <Sidebar />}
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
