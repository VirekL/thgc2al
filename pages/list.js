import Head from 'next/head';
import { useEffect, useState, useMemo, useRef, useCallback, useTransition } from 'react';

const AVAILABLE_TAGS = [
  "Level", "Challenge", "Low Hertz", "Mobile", "Speedhack",
  "Noclip", "Miscellaneous", "Progress", "Consistency",
  "2P", "CBF", "Rated", "Formerly Rated", "Outdated Version"
];
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
  const [showSidebar, setShowSidebar] = useState(false); // Add sidebar state
  const mobileBtnRef = useRef();
  const [isPending, startTransition] = typeof useTransition === 'function' ? useTransition() : [false, fn => fn()];
  const { dateFormat, setDateFormat } = useDateFormat();
  const [showSettings, setShowSettings] = useState(false);
  // Developer mode state
  const [devMode, setDevMode] = useState(false);
  const [draggedIdx, setDraggedIdx] = useState(null);
  const [reordered, setReordered] = useState(null); // null = not in dev mode, else array
  const [showNewForm, setShowNewForm] = useState(false);
  const [newForm, setNewForm] = useState({
    name: '', id: '', player: '', length: '', version: '2.', video: '', showcaseVideo: '', date: '', submitter: '', levelID: '', thumbnail: '', tags: []
  });
  const [newFormTags, setNewFormTags] = useState([]);
  const [newFormCustomTags, setNewFormCustomTags] = useState('');

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

  // Listen for SHIFT+M to toggle dev mode
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.shiftKey && (e.key === 'M' || e.key === 'm')) {
        setDevMode(v => {
          const next = !v;
          if (!next) setReordered(null); // Reset on exit
          else setReordered(achievements);
          return next;
        });
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line
  }, [achievements]);

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

  // For dev mode, use reordered list
  const devAchievements = devMode && reordered ? reordered : achievements;

  function handleMobileToggle() {
    setShowMobileFilters(v => !v);
  }

  // Drag and drop handlers (dev mode) with auto-scroll
  function handleDragStart(idx) {
    setDraggedIdx(idx);
  }
  function handleDragOver(idx, e) {
    e.preventDefault();
    // Auto-scroll if near top/bottom
    const y = e.clientY;
    const scrollMargin = 60;
    const scrollSpeed = 18;
    if (y < scrollMargin) {
      window.scrollBy({ top: -scrollSpeed, behavior: 'smooth' });
    } else if (window.innerHeight - y < scrollMargin) {
      window.scrollBy({ top: scrollSpeed, behavior: 'smooth' });
    }
    if (draggedIdx === null || draggedIdx === idx) return;
    setReordered(prev => {
      if (!prev) return prev;
      const arr = [...prev];
      const [dragged] = arr.splice(draggedIdx, 1);
      arr.splice(idx, 0, dragged);
      setDraggedIdx(idx);
      return arr;
    });
  }
  function handleDrop() {
    setDraggedIdx(null);
  }

  // New achievement form handlers
  function handleNewFormChange(e) {
    const { name, value } = e.target;
    setNewForm(f => ({ ...f, [name]: value }));
  }
  function handleNewFormTagClick(tag) {
    setNewFormTags(tags => tags.includes(tag) ? tags.filter(t => t !== tag) : [...tags, tag]);
  }
  function handleNewFormCustomTagsChange(e) {
    setNewFormCustomTags(e.target.value);
  }
  function handleNewFormAdd() {
    // Compose tags
    let tags = [...newFormTags];
    if (newFormCustomTags.trim()) {
      newFormCustomTags.split(',').map(t => t.trim()).filter(Boolean).forEach(t => {
        if (!tags.includes(t)) tags.push(t);
      });
    }
    // Compose entry
    const entry = {};
    Object.entries(newForm).forEach(([k, v]) => {
      if (v && v.trim() !== '') entry[k] = v.trim();
    });
    if (tags.length > 0) entry.tags = tags;
    // Add to reordered list
    setReordered(prev => prev ? [...prev, entry] : [entry]);
    setShowNewForm(false);
    setNewForm({ name: '', id: '', player: '', length: '', version: '2.', video: '', showcaseVideo: '', date: '', submitter: '', levelID: '', thumbnail: '', tags: [] });
    setNewFormTags([]);
    setNewFormCustomTags('');
  }
  function handleNewFormCancel() {
    setShowNewForm(false);
    setNewForm({ name: '', id: '', player: '', length: '', version: '2.', video: '', showcaseVideo: '', date: '', submitter: '', levelID: '', thumbnail: '', tags: [] });
    setNewFormTags([]);
    setNewFormCustomTags('');
  }
  // Live preview for new achievement
  const newFormPreview = useMemo(() => {
    let tags = [...newFormTags];
    if (newFormCustomTags.trim()) {
      newFormCustomTags.split(',').map(t => t.trim()).filter(Boolean).forEach(t => {
        if (!tags.includes(t)) tags.push(t);
      });
    }
    const entry = {};
    Object.entries(newForm).forEach(([k, v]) => {
      if (v && v.trim() !== '') entry[k] = v.trim();
    });
    if (tags.length > 0) entry.tags = tags;
    return entry;
  }, [newForm, newFormTags, newFormCustomTags]);

  // Copy JSON to clipboard
  function handleCopyJson() {
    if (!reordered) return;
    const json = JSON.stringify(reordered.map(({rank, ...rest}) => rest), null, 2);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(json);
      alert('Copied new achievements.json to clipboard!');
    } else {
      // fallback
      const textarea = document.createElement('textarea');
      textarea.value = json;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      alert('Copied new achievements.json to clipboard!');
    }
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
          {devMode && (
            <div style={{marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12}}>
              <span style={{color: '#e67e22', fontWeight: 600}}>Developer Mode Enabled (SHIFT+M)</span>
              <button onClick={handleCopyJson} style={{padding: '6px 14px', borderRadius: 6, border: '1px solid #aaa', background: '#222', color: '#fff', cursor: 'pointer'}}>Copy achievements.json</button>
              <button onClick={() => setShowNewForm(true)} style={{padding: '6px 14px', borderRadius: 6, border: '1px solid #aaa', background: '#222', color: '#fff', cursor: 'pointer'}}>New Achievement</button>
            </div>
          )}
          {devMode && showNewForm && (
            <div style={{background: '#232323', borderRadius: 8, padding: 18, marginBottom: 18, maxWidth: 600, boxShadow: '0 2px 8px #0002'}}>
              <h3 style={{marginTop:0, color:'#e67e22'}}>New Achievement</h3>
              <form onSubmit={e => {e.preventDefault(); handleNewFormAdd();}} autoComplete="off">
                <label style={{display:'block',fontSize:13,marginTop:6}}>Name<input type="text" name="name" value={newForm.name} onChange={handleNewFormChange} required placeholder="Naracton Diablo X 99%" style={{width:'100%',fontSize:14,padding:4,marginTop:2,boxSizing:'border-box'}} /></label>
                <label style={{display:'block',fontSize:13,marginTop:6}}>ID<input type="text" name="id" value={newForm.id} onChange={handleNewFormChange} required placeholder="naracton-diablo-x-99" style={{width:'100%',fontSize:14,padding:4,marginTop:2,boxSizing:'border-box'}} /></label>
                <label style={{display:'block',fontSize:13,marginTop:6}}>Player<input type="text" name="player" value={newForm.player} onChange={handleNewFormChange} placeholder="Zoink" style={{width:'100%',fontSize:14,padding:4,marginTop:2,boxSizing:'border-box'}} /></label>
                <label style={{display:'block',fontSize:13,marginTop:6}}>Tags
                  <div style={{display:'flex',flexWrap:'wrap',gap:5,marginTop:4}}>
                    {AVAILABLE_TAGS.map(tag => (
                      <button type="button" key={tag} onClick={() => handleNewFormTagClick(tag)} style={{fontSize:11,padding:'3px 6px',backgroundColor:newFormTags.includes(tag)?'#007bff':'#eee',color:newFormTags.includes(tag)?'#fff':'#222',border:'1px solid #ccc',borderRadius:3,cursor:'pointer'}}>{tag}</button>
                    ))}
                  </div>
                  <input type="text" value={newFormCustomTags} onChange={handleNewFormCustomTagsChange} placeholder="Or type custom tags separated by commas" style={{width:'100%',fontSize:14,padding:4,marginTop:2,boxSizing:'border-box'}} />
                  <div style={{marginTop:4,fontSize:13}}>
                    {newFormTags.map(tag => (
                      <span key={tag} style={{display:'inline-block',background:'#ddd',padding:'2px 6px',margin:'2px',borderRadius:4,cursor:'pointer'}} title="Click to remove" onClick={() => handleNewFormTagClick(tag)}>{tag}</span>
                    ))}
                  </div>
                </label>
                <label style={{display:'block',fontSize:13,marginTop:6}}>Length<input type="text" name="length" value={newForm.length} onChange={handleNewFormChange} placeholder="69" style={{width:'100%',fontSize:14,padding:4,marginTop:2,boxSizing:'border-box'}} /></label>
                <label style={{display:'block',fontSize:13,marginTop:6}}>Version<input type="text" name="version" value={newForm.version} onChange={handleNewFormChange} placeholder="2.2" style={{width:'100%',fontSize:14,padding:4,marginTop:2,boxSizing:'border-box'}} /></label>
                <label style={{display:'block',fontSize:13,marginTop:6}}>Video URL<input type="text" name="video" value={newForm.video} onChange={handleNewFormChange} placeholder="https://youtu.be/..." style={{width:'100%',fontSize:14,padding:4,marginTop:2,boxSizing:'border-box'}} /></label>
                <label style={{display:'block',fontSize:13,marginTop:6}}>Showcase Video<input type="text" name="showcaseVideo" value={newForm.showcaseVideo} onChange={handleNewFormChange} placeholder="https://youtu.be/..." style={{width:'100%',fontSize:14,padding:4,marginTop:2,boxSizing:'border-box'}} /></label>
                <label style={{display:'block',fontSize:13,marginTop:6}}>Date (YYYY-MM-DD)<input type="text" name="date" value={newForm.date} onChange={handleNewFormChange} placeholder="2023-12-19" style={{width:'100%',fontSize:14,padding:4,marginTop:2,boxSizing:'border-box'}} /></label>
                <label style={{display:'block',fontSize:13,marginTop:6}}>Submitter<input type="text" name="submitter" value={newForm.submitter} onChange={handleNewFormChange} placeholder="kyle1saurus" style={{width:'100%',fontSize:14,padding:4,marginTop:2,boxSizing:'border-box'}} /></label>
                <label style={{display:'block',fontSize:13,marginTop:6}}>Level ID<input type="text" name="levelID" value={newForm.levelID} onChange={handleNewFormChange} placeholder="86407629" style={{width:'100%',fontSize:14,padding:4,marginTop:2,boxSizing:'border-box'}} /></label>
                <label style={{display:'block',fontSize:13,marginTop:6}}>Thumbnail<input type="text" name="thumbnail" value={newForm.thumbnail} onChange={handleNewFormChange} placeholder="Image URL" style={{width:'100%',fontSize:14,padding:4,marginTop:2,boxSizing:'border-box'}} /></label>
                <div style={{marginTop:10,display:'flex',gap:8}}>
                  <button type="submit" style={{padding:'6px 12px',fontSize:12}}>Add</button>
                  <button type="button" onClick={handleNewFormCancel} style={{padding:'6px 12px',fontSize:12}}>Cancel</button>
                </div>
              </form>
              <div style={{marginTop:15,background:'#eee',padding:10,fontSize:13,whiteSpace:'pre-wrap',wordBreak:'break-word',borderRadius:4}}>
                <strong>Preview:</strong>
                <br />
                {JSON.stringify(newFormPreview, null, 2)}
              </div>
            </div>
          )}
          {isPending ? (
            <div className="no-achievements">Loading...</div>
          ) : (devMode ? (
            devAchievements.map((a, i) => (
              <div
                key={a.id || i}
                draggable
                onDragStart={() => handleDragStart(i)}
                onDragOver={e => handleDragOver(i, e)}
                onDrop={handleDrop}
                style={{
                  opacity: draggedIdx === i ? 0.5 : 1,
                  border: draggedIdx === i ? '2px dashed #e67e22' : '1px solid #333',
                  marginBottom: 8,
                  background: '#181818',
                  cursor: 'move',
                  borderRadius: 8
                }}
              >
                <AchievementCard achievement={a} />
              </div>
            ))
          ) : (
            filtered.length === 0 ? (
              <div className="no-achievements">No achievements found.</div>
            ) : (
              filtered.map((a, i) => (
                <AchievementCard achievement={a} key={a.id || i} />
              ))
            )
          ))}
        </section>
      </main>
    </>
  );
}
