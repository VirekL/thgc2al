import Head from 'next/head';
import { useEffect, useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Background from '../components/Background';

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
      className="tag"
      style={{
        background: def?.color || '#2E3451',
        color: '#fff',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        fontWeight: 500,
        fontSize: 13,
        padding: '2px 8px',
        borderRadius: 6,
        marginRight: 4,
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
  // State: { tag: 'neutral' | 'include' | 'exclude' }
  const tagStates = {};
  allTags.forEach(tag => {
    if (filterTags.include.includes(tag)) tagStates[tag] = 'include';
    else if (filterTags.exclude.includes(tag)) tagStates[tag] = 'exclude';
    else tagStates[tag] = 'neutral';
  });

  function handlePillClick(tag) {
    // Cycle: neutral -> include -> exclude -> neutral
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

function AchievementCard({ achievement, onClick }) {
  return (
    <Link href={`/achievement/${achievement.id}`} passHref legacyBehavior>
      <a style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="achievement-item" tabIndex={0} style={{cursor: 'pointer'}}>
          <div className="rank-date-container">
            <div className="achievement-length">
              {achievement.length ? `${Math.floor(achievement.length / 60)}:${(achievement.length % 60).toString().padStart(2, '0')}` : 'N/A'}
            </div>
            <div className="achievement-date">
              {achievement.date ? new Date(achievement.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
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

export default function List() {
  const [achievements, setAchievements] = useState([]);
  const [search, setSearch] = useState('');
  const [filterTags, setFilterTags] = useState({ include: [], exclude: [] });
  const [allTags, setAllTags] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const mobileBtnRef = useRef();

  useEffect(() => {
    fetch('/achievements.json')
      .then(res => res.json())
      .then(data => {
        // Add rank property for display
        const withRank = data.map((a, i) => ({ ...a, rank: i + 1 }));
        setAchievements(withRank);
        // Collect all unique tags
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

  const filtered = useMemo(() => {
    return achievements.filter(a => {
      const tags = (a.tags || []).map(t => t.toUpperCase());
      if (filterTags.include.length && !filterTags.include.every(tag => tags.includes(tag.toUpperCase()))) return false;
      if (filterTags.exclude.length && filterTags.exclude.some(tag => tags.includes(tag.toUpperCase()))) return false;
      if (search && !a.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [achievements, search, filterTags]);

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
      <Header>
        <div className="search-bar" style={{marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, width: '100%'}}>
          <input
            type="text"
            placeholder="Search achievements..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label="Search achievements"
            style={{padding: '0.75rem', borderRadius: 8, border: '2px solid #343A52', width: '100%'}}
          />
          {isMobile && (
            <button
              ref={mobileBtnRef}
              id="mobile-filter-toggle-btn"
              aria-label={showMobileFilters ? 'Hide Filters' : 'Show Filters'}
              onClick={handleMobileToggle}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                marginLeft: 8,
                display: 'flex',
                alignItems: 'center',
                height: 40,
              }}
              dangerouslySetInnerHTML={{
                __html: showMobileFilters
                  ? '<span class="arrow-img-wrapper"><img src="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/icons/chevron-up.svg" alt="Hide Filters" style="width: 20px; height: 20px; filter: invert(92%) sepia(7%) saturate(104%) hue-rotate(200deg) brightness(97%) contrast(92%);"></span>'
                  : '<span class="arrow-img-wrapper"><img src="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/icons/chevron-down.svg" alt="Show Filters" style="width: 20px; height: 20px; filter: invert(92%) sepia(7%) saturate(104%) hue-rotate(200deg) brightness(97%) contrast(92%);"></span>'
              }}
            />
          )}
        </div>
        <TagFilterPills
          allTags={allTags}
          filterTags={filterTags}
          setFilterTags={setFilterTags}
          isMobile={isMobile}
          show={showMobileFilters}
          setShow={setShowMobileFilters}
        />
      </Header>
      <main className="main-content" style={{display: 'flex', gap: '2rem', padding: '2rem', justifyContent: 'center', alignItems: 'flex-start'}}>
        <Sidebar />
        <section className="achievements" style={{flexGrow: 1, width: '70%', maxWidth: '1000px', display: 'flex', flexDirection: 'column', gap: '1rem', padding: '2rem', maxHeight: 'calc(100vh - 150px)', overflowY: 'auto'}}>
          {filtered.length === 0 ? (
            <div style={{color: '#aaa'}}>No achievements found.</div>
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
