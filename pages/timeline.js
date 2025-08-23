import Head from 'next/head';
import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { useDateFormat } from '../components/DateFormatContext';
import Background from '../components/Background';
import Sidebar from '../components/Sidebar';
import Tag, { TAG_PRIORITY_ORDER } from '../components/Tag';
import Link from 'next/link';
import DevModePanel from '../components/DevModePanel';

function calculateDaysLasted(currentDate, previousDate) {
  if (!currentDate || !previousDate) return 'N/A';
  const current = new Date(currentDate);
  const previous = new Date(previousDate);
  const diffTime = Math.abs(current - previous);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
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

function TimelineAchievementCardInner({ achievement, previousAchievement, onEdit, onHover, isHovered }) {
  const { dateFormat } = useDateFormat();
  let lastedDays, lastedLabel;
  if (previousAchievement) {
    lastedDays = calculateDaysLasted(achievement.date, previousAchievement.date);
    lastedLabel = `Lasted ${lastedDays} days`;
  } else {
    // Calculate days from achievement date to today
    const today = new Date();
    const achievementDate = new Date(achievement.date);
    if (!achievement.date || isNaN(achievementDate)) {
      lastedLabel = 'Lasting N/A days';
    } else {
      const diffTime = Math.abs(today - achievementDate);
      const days = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
      lastedLabel = `Lasting ${days} days`;
    }
  }
  return (
    <Link href={`/achievement/${achievement.id}`} passHref legacyBehavior>
      <a style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}>
        <div
          className={`achievement-item ${isHovered ? 'hovered' : ''}`}
          tabIndex={0}
          style={{ cursor: 'pointer' }}
          onMouseEnter={onHover}
          onMouseLeave={onHover}
        >
          <div className="rank-date-container">
            <div className="achievement-length">
              {achievement.length ? `${Math.floor(achievement.length / 60)}:${(achievement.length % 60).toString().padStart(2, '0')}` : 'N/A'}
            </div>
            <div className="lasted-days">{lastedLabel}</div>
            <div className="rank"><strong>{achievement.date ? formatDate(achievement.date, dateFormat) : 'N/A'}</strong></div>
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
          {/* Developer mode hover menu */}
          {onEdit && (
            <div className="hover-menu" style={{ display: isHovered ? 'flex' : 'none' }}>
              <button className="hover-menu-btn" onClick={onEdit} title="Edit achievement">
                <span className="bi bi-pencil" aria-hidden="true"></span>
              </button>
            </div>
          )}
        </div>
      </a>
    </Link>
  );
}

const TimelineAchievementCard = React.memo(TimelineAchievementCardInner, (prev, next) => {
  return prev.achievement === next.achievement && prev.isHovered === next.isHovered && prev.onEdit === next.onEdit && prev.onHover === next.onHover;
});

function TagFilterPillsInner({ allTags, filterTags, setFilterTags, isMobile, show, setShow }) {
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

export default function Timeline() {
  const [achievements, setAchievements] = useState([]);
  const [search, setSearch] = useState('');
  const [filterTags, setFilterTags] = useState({ include: [], exclude: [] });
  const [allTags, setAllTags] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [devMode, setDevMode] = useState(false);
  const [reordered, setReordered] = useState(null);
  const [hoveredIdx, setHoveredIdx] = useState(null); // Track hovered achievement index for dev controls
  const [newForm, setNewForm] = useState({
    name: '', id: '', player: '', length: 0, version: 2, video: '', showcaseVideo: '', date: '', submitter: '', levelID: 0, thumbnail: '', tags: []
  });
  const [newFormTags, setNewFormTags] = useState([]);
  const [newFormCustomTags, setNewFormCustomTags] = useState('');
  const [insertIdx, setInsertIdx] = useState(null); // For new achievement insert position
  const [editIdx, setEditIdx] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [editFormTags, setEditFormTags] = useState([]);
  const [editFormCustomTags, setEditFormCustomTags] = useState('');
  const mobileBtnRef = useRef();
  const [showNewForm, setShowNewForm] = useState(false);

  useEffect(() => {
    fetch('/timeline.json')
      .then(res => res.json())
      .then(data => {
        const sorted = [...data].sort((a, b) => new Date(b.date) - new Date(a.date));
        setAchievements(sorted);
        const tags = new Set();
        sorted.forEach(a => (a.tags || []).forEach(t => tags.add(t)));
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

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.shiftKey && (e.key === 'M' || e.key === 'm')) {
        setDevMode(v => {
          const next = !v;
          if (!next) setReordered(null);
          else setReordered(achievements);
          return next;
        });
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [achievements]);

  useEffect(() => {
    if (!isMobile) return;
    let pinchActive = false;
    let lastTouches = [];
    let swipeSequence = [];
    let pinchStartDist = null;
    let gestureTimeout = null;

    function getDistance(touches) {
      if (touches.length < 2) return 0;
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    }

    function handleTouchStart(e) {
      if (e.touches.length === 2) {
        pinchActive = true;
        pinchStartDist = getDistance(e.touches);
        swipeSequence = [];
        if (gestureTimeout) clearTimeout(gestureTimeout);
      }
      lastTouches = Array.from(e.touches);
    }

    function handleTouchMove(e) {
      if (pinchActive && e.touches.length === 2) {
        const pinchEndDist = getDistance(e.touches);
        if (pinchEndDist > pinchStartDist * 1.5) {
          setDevMode(true);
          pinchActive = false;
        }
      }
    }

    function handleTouchEnd() {
      pinchActive = false;
    }

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobile]);

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

  function handleEditAchievement(idx) {
    setEditIdx(idx);
    setEditForm(achievements[idx]);
    setEditFormTags(achievements[idx].tags || []);
    setEditFormCustomTags('');
  }

  function handleEditFormChange(e) {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  }

  function handleEditFormTagClick(tag) {
    setEditFormTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  }

  function handleEditFormCustomTagsChange(e) {
    setEditFormCustomTags(e.target.value);
  }

  function handleEditFormSave() {
    const updated = { ...editForm, tags: [...editFormTags, ...editFormCustomTags.split(',').map(t => t.trim()).filter(Boolean)] };
    setAchievements(prev => prev.map((a, i) => (i === editIdx ? updated : a)));
    setEditIdx(null);
    setEditForm(null);
    setEditFormTags([]);
    setEditFormCustomTags('');
  }

  function handleEditFormCancel() {
    setEditIdx(null);
    setEditForm(null);
    setEditFormTags([]);
    setEditFormCustomTags('');
  }

  function handleNewFormChange(e) {
    const { name, value } = e.target;
    setNewForm(prev => ({ ...prev, [name]: value }));
  }

  function handleNewFormTagClick(tag) {
    setNewFormTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  }

  function handleNewFormCustomTagsChange(e) {
    setNewFormCustomTags(e.target.value);
  }

  function handleNewFormAdd() {
    const newAchievement = { ...newForm, tags: [...newFormTags, ...newFormCustomTags.split(',').map(t => t.trim()).filter(Boolean)] };
    setAchievements(prev => {
      if (insertIdx !== null) {
        const updated = [...prev];
        updated.splice(insertIdx, 0, newAchievement);
        return updated;
      } else {
        return [...prev, newAchievement];
      }
    });
    setNewForm({ name: '', id: '', player: '', length: 0, version: 2, video: '', showcaseVideo: '', date: '', submitter: '', levelID: 0, thumbnail: '', tags: [] });
    setNewFormTags([]);
    setNewFormCustomTags('');
    setInsertIdx(null);
  }

  function handleNewFormCancel() {
    setNewForm({ name: '', id: '', player: '', length: 0, version: 2, video: '', showcaseVideo: '', date: '', submitter: '', levelID: 0, thumbnail: '', tags: [] });
    setNewFormTags([]);
    setNewFormCustomTags('');
    setInsertIdx(null);
  }

  function handleShowNewForm() {
    setShowNewForm(v => !v);
  }

  const newFormPreview = useMemo(() => {
    let tags = [...newFormTags];
    if (typeof newFormCustomTags === 'string' && newFormCustomTags.trim()) {
      newFormCustomTags.split(',').map(t => (typeof t === 'string' ? t.trim() : t)).filter(Boolean).forEach(t => {
        if (!tags.includes(t)) tags.push(t);
      });
    }
    const entry = {};
    Object.entries(newForm).forEach(([k, v]) => {
      if (typeof v === 'string') {
        if (v.trim() !== '') entry[k] = v.trim();
      } else if (v !== undefined && v !== null && v !== '') {
        entry[k] = v;
      }
    });
    if (tags.length > 0) entry.tags = tags;
    return entry;
  }, [newForm, newFormTags, newFormCustomTags]);

  function handleCopyJson() {
    try {
      const json = JSON.stringify(achievements.map(({ rank, ...rest }) => rest), null, 2);
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(json).catch(() => console.log('copy failed'));
      } else {
        // Server-side or fallback: log to console so build doesn't break
        // (Dev users can call this in the browser.)
        // eslint-disable-next-line no-console
        console.log(json);
      }
      return json;
    } catch (e) {
      // noop
      return null;
    }
  }

  function onImportAchievementsJson(json) {
    let imported = Array.isArray(json) ? json : (json.achievements || []);
    if (!Array.isArray(imported)) {
      return;
    }
    imported = imported.map((a, i) => ({ ...a, rank: i + 1 }));
    setAchievements(imported);
    setDevMode(true);
  }

  function handleRemoveAchievement(idx) {
    setAchievements(prev => prev.filter((_, i) => i !== idx));
  }

  function handleDuplicateAchievement(idx) {
    setAchievements(prev => {
      const duplicated = { ...prev[idx], id: `${prev[idx].id}-copy` };
      return [...prev.slice(0, idx + 1), duplicated, ...prev.slice(idx + 1)];
    });
  }

  function handleHover(idx) {
    setHoveredIdx(idx === hoveredIdx ? null : idx);
  }

  return (
    <>
      <Head>
        <title>Timeline · The Hardest Achievements List</title>
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
          {/* Only show search bar, tag pills, and arrow below on mobile */}
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
      <main className="main-content" style={{display: 'flex', gap: '2rem', padding: '2rem', justifyContent: 'center', alignItems: 'flex-start'}}>
        {!isMobile && <Sidebar />}
        <section className="achievements" style={{flexGrow: 1, width: '70%', maxWidth: '1000px', display: 'flex', flexDirection: 'column', gap: '1rem', padding: '2rem', maxHeight: 'calc(100vh - 150px)', overflowY: 'auto'}}>
          {filtered.length === 0 ? (
            <div style={{color: '#aaa'}}>No achievements found.</div>
          ) : (
            filtered.map((a, i) => (
              <div
                key={a.id || i}
                onMouseEnter={() => handleHover(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{ position: 'relative' }}
              >
                <TimelineAchievementCard
                  achievement={a}
                  previousAchievement={filtered[i-1]}
                  onEdit={() => handleEditAchievement(i)}
                  isHovered={i === hoveredIdx}
                />
                {devMode && i === hoveredIdx && (
                  <div className="devmode-hover-controls" style={{ position: 'absolute', top: 0, right: 0, display: 'flex', gap: 8 }}>
                    <button onClick={() => handleEditAchievement(i)}>Edit</button>
                    <button onClick={() => handleDuplicateAchievement(i)}>Duplicate</button>
                    <button onClick={() => handleRemoveAchievement(i)}>Remove</button>
                  </div>
                )}
              </div>
            ))
          )}
        </section>
      </main>
      <DevModePanel
        devMode={devMode}
        editIdx={editIdx}
        editForm={editForm}
        editFormTags={editFormTags}
        editFormCustomTags={editFormCustomTags}
        handleEditFormChange={handleEditFormChange}
        handleEditFormTagClick={handleEditFormTagClick}
        handleEditFormCustomTagsChange={handleEditFormCustomTagsChange}
        handleEditFormSave={handleEditFormSave}
        handleEditFormCancel={handleEditFormCancel}
        showNewForm={showNewForm}
        newForm={newForm}
        newFormTags={newFormTags}
        newFormCustomTags={newFormCustomTags}
        handleNewFormChange={handleNewFormChange}
        handleNewFormTagClick={handleNewFormTagClick}
        handleNewFormCustomTagsChange={handleNewFormCustomTagsChange}
        handleNewFormAdd={handleNewFormAdd}
        handleNewFormCancel={handleNewFormCancel}
        handleCopyJson={handleCopyJson}
        handleShowNewForm={handleShowNewForm}
        newFormPreview={newFormPreview}
        onImportAchievementsJson={onImportAchievementsJson}
      />
    </>
  );
}

const TagFilterPills = React.memo(TagFilterPillsInner, (prev, next) => {
  return prev.allTags === next.allTags && prev.filterTags === next.filterTags && prev.isMobile === next.isMobile && prev.show === next.show;
});
