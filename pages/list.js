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
import DevModePanel from '../components/DevModePanel';

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
  // If devMode is true, disable normal click navigation (but allow ctrl+click and middle click)
  const { devMode } = AchievementCard;
  const handleClick = e => {
    if (devMode) {
      // Allow ctrl+click and middle click
      if (e.ctrlKey || e.button === 1) return;
      e.preventDefault();
    }
  };
  return (
    <Link href={`/achievement/${achievement.id}`} passHref legacyBehavior>
      <a style={{ textDecoration: 'none', color: 'inherit' }} onClick={handleClick} onMouseDown={handleClick}>
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
  // Track hovered achievement index for dev controls
  const [hoveredIdx, setHoveredIdx] = useState(null);
  // New achievement form state
  const [newForm, setNewForm] = useState({
    name: '', id: '', player: '', length: '', version: '2.', video: '', showcaseVideo: '', date: '', submitter: '', levelID: '', thumbnail: '', tags: []
  });
  const [newFormTags, setNewFormTags] = useState([]);
  const [newFormCustomTags, setNewFormCustomTags] = useState('');
  const [insertIdx, setInsertIdx] = useState(null); // For new achievement insert position
  // Edit achievement state
  const [editIdx, setEditIdx] = useState(null); // index of achievement being edited
  const [editForm, setEditForm] = useState(null); // form state for editing
  const [editFormTags, setEditFormTags] = useState([]);
  const [editFormCustomTags, setEditFormCustomTags] = useState('');
  const achievementRefs = useRef([]);
  // Track the last added/duplicated achievement index for scrolling
  const [scrollToIdx, setScrollToIdx] = useState(null);
  // Edit achievement handlers
  function handleEditAchievement(idx) {
    if (!reordered || !reordered[idx]) return;
    const a = reordered[idx];
    setEditIdx(idx);
    setEditForm({ ...a });
    setEditFormTags(Array.isArray(a.tags) ? [...a.tags] : []);
    setEditFormCustomTags('');
    setShowNewForm(false); // Hide new form if open
  }

  function handleEditFormChange(e) {
    const { name, value } = e.target;
    setEditForm(f => ({ ...f, [name]: value }));
  }

  function handleEditFormTagClick(tag) {
    setEditFormTags(tags => tags.includes(tag) ? tags.filter(t => t !== tag) : [...tags, tag]);
  }

  function handleEditFormCustomTagsChange(e) {
    setEditFormCustomTags(e.target.value);
  }

  function handleEditFormSave() {
    // Compose entry
    const entry = {};
    Object.entries(editForm).forEach(([k, v]) => {
      if (typeof v === 'string') {
        if (v.trim() !== '') entry[k] = v.trim();
      } else if (v !== undefined && v !== null && v !== '') {
        entry[k] = v;
      }
    });
    // Compose tags
    let tags = [...editFormTags];
    if (typeof editFormCustomTags === 'string' && editFormCustomTags.trim()) {
      editFormCustomTags.split(',').map(t => (typeof t === 'string' ? t.trim() : t)).filter(Boolean).forEach(t => {
        if (!tags.includes(t)) tags.push(t);
      });
    }
    if (tags.length > 0) entry.tags = tags;

    setReordered(prev => {
      if (!prev) return prev;
      const arr = [...prev];
      // Remove the achievement from its old position
      const [removed] = arr.splice(editIdx, 1);
      // Update the removed achievement with new values
      const updated = { ...removed, ...entry };
      // Determine new rank (default to end if invalid)
      let newRank = parseInt(updated.rank, 10);
      if (isNaN(newRank) || newRank < 1) newRank = arr.length + 1;
      // Insert at new position (rank - 1)
      arr.splice(newRank - 1, 0, updated);
      // Recalculate ranks for all achievements
      arr.forEach((a, i) => { a.rank = i + 1; });
      return arr;
    });
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
  }, [achievements]);

  // Mobile gesture: pinch, swipe left, then right to activate dev mode
  useEffect(() => {
    if (!isMobile) return;
    let pinchActive = false;
    let lastTouches = [];
    let swipeSequence = [];
    let pinchStartDist = null;
    let pinchEndDist = null;
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
        pinchEndDist = getDistance(e.touches);
      }
      lastTouches = Array.from(e.touches);
    }

    function handleTouchEnd(e) {
      // Pinch detection: fingers move closer together
      if (pinchActive && pinchStartDist && pinchEndDist && pinchEndDist < pinchStartDist - 40) {
        // Pinch detected
        swipeSequence = [];
        pinchActive = false;
        pinchStartDist = null;
        pinchEndDist = null;
        gestureTimeout = setTimeout(() => { swipeSequence = []; }, 2000);
        return;
      }
      // Swipe detection (after pinch)
      if (e.changedTouches.length === 1 && !pinchActive && swipeSequence.length < 2) {
        const touch = e.changedTouches[0];
        if (lastTouches.length === 1) {
          const dx = touch.clientX - lastTouches[0].clientX;
          if (Math.abs(dx) > 60) {
            swipeSequence.push(dx < 0 ? 'left' : 'right');
            gestureTimeout = setTimeout(() => { swipeSequence = []; }, 2000);
          }
        }
        // If sequence is left then right (or right then left), activate dev mode
        if ((swipeSequence[0] === 'left' && swipeSequence[1] === 'right') || (swipeSequence[0] === 'right' && swipeSequence[1] === 'left')) {
          setDevMode(true);
          setReordered(achievements.map(a => ({ ...a })));
          alert('Developer mode activated by gesture!');
          swipeSequence = [];
          if (gestureTimeout) clearTimeout(gestureTimeout);
        }
      }
      lastTouches = Array.from(e.touches);
    }

    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: false });
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      if (gestureTimeout) clearTimeout(gestureTimeout);
    };
  }, [isMobile, achievements]);

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
    if (draggedIdx === null) return;
    setReordered(prev => {
      if (!prev) return prev;
      const arr = [...prev];
      // Clamp idx to valid range (0 to arr.length)
      let targetIdx = idx;
      if (targetIdx < 0) targetIdx = 0;
      if (targetIdx > arr.length) targetIdx = arr.length;
      // If dragging past the end, insert at end
      if (draggedIdx === targetIdx || draggedIdx === targetIdx - 1) return arr;
      const [dragged] = arr.splice(draggedIdx, 1);
      // If dragging to end, insert at arr.length
      if (targetIdx >= arr.length) {
        arr.push(dragged);
        setDraggedIdx(arr.length - 1);
      } else {
        arr.splice(targetIdx, 0, dragged);
        setDraggedIdx(targetIdx);
      }
      // Recalculate ranks for all
      arr.forEach((a, i) => { a.rank = i + 1; });
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
    if (typeof newFormCustomTags === 'string' && newFormCustomTags.trim()) {
      newFormCustomTags.split(',').map(t => (typeof t === 'string' ? t.trim() : t)).filter(Boolean).forEach(t => {
        if (!tags.includes(t)) tags.push(t);
      });
    }
    // Compose entry
    const entry = {};
    Object.entries(newForm).forEach(([k, v]) => {
      if (typeof v === 'string') {
        if (v.trim() !== '') entry[k] = v.trim();
      } else if (v !== undefined && v !== null && v !== '') {
        entry[k] = v;
      }
    });
    if (tags.length > 0) entry.tags = tags;
    // Insert at insertIdx or end
    setReordered(prev => {
      let newArr;
      if (!prev) {
        setScrollToIdx(0);
        newArr = [entry];
      } else if (insertIdx === null || insertIdx < 0 || insertIdx > prev.length - 1) {
        setScrollToIdx(prev.length);
        newArr = [...prev, entry];
      } else {
        newArr = [...prev];
        newArr.splice(insertIdx + 1, 0, entry);
        setScrollToIdx(insertIdx + 1);
      }
      // Assign rank property to all achievements
      newArr.forEach((a, i) => { a.rank = i + 1; });
      return newArr;
    });
    setShowNewForm(false);
    setNewForm({ name: '', id: '', player: '', length: '', version: '2.', video: '', showcaseVideo: '', date: '', submitter: '', levelID: '', thumbnail: '', tags: [] });
    setNewFormTags([]);
    setNewFormCustomTags('');
    setInsertIdx(null);
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

  // Find the most visible achievement card in viewport
  function getMostVisibleIdx() {
    if (!achievementRefs.current) return null;
    let maxVisible = 0;
    let bestIdx = null;
    achievementRefs.current.forEach((ref, idx) => {
      if (!ref) return;
      const rect = ref.getBoundingClientRect();
      const visible = Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0));
      if (visible > maxVisible) {
        maxVisible = visible;
        bestIdx = idx;
      }
    });
    return bestIdx;
  }
  // When opening the new form, set insertIdx to the most visible card
  function handleShowNewForm() {
    if (showNewForm) {
      setShowNewForm(false);
      setInsertIdx(null);
      setNewForm({ name: '', id: '', player: '', length: '', version: '2.', video: '', showcaseVideo: '', date: '', submitter: '', levelID: '', thumbnail: '', tags: [] });
      setNewFormTags([]);
      setNewFormCustomTags('');
      return;
    }
    setInsertIdx(getMostVisibleIdx());
    setShowNewForm(true);
  }

  // Scroll to the new/duplicated achievement after it's added
  useEffect(() => {
    if (scrollToIdx !== null && achievementRefs.current[scrollToIdx]) {
      achievementRefs.current[scrollToIdx].scrollIntoView({ behavior: 'smooth', block: 'center' });
      setScrollToIdx(null);
    }
  }, [scrollToIdx, devAchievements]);

  // Remove achievement at index
  function handleRemoveAchievement(idx) {
    setReordered(prev => {
      if (!prev) return prev;
      const arr = [...prev];
      arr.splice(idx, 1);
      return arr;
    });
  }

  // Duplicate achievement at index
  function handleDuplicateAchievement(idx) {
    setReordered(prev => {
      if (!prev) return prev;
      const arr = [...prev];
      const copy = { ...arr[idx], id: arr[idx].id + '-copy' };
      arr.splice(idx + 1, 0, copy);
      setScrollToIdx(idx + 1);
      return arr;
    });
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
          <DevModePanel
            devMode={devMode}
            editIdx={editIdx}
            editForm={editForm}
            editFormTags={editFormTags}
            editFormCustomTags={editFormCustomTags}
            AVAILABLE_TAGS={AVAILABLE_TAGS}
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
            onImportAchievementsJson={json => {
              // Accepts array or object
              let imported = Array.isArray(json) ? json : (json.achievements || []);
              if (!Array.isArray(imported)) {
                alert('Invalid achievements.json format.');
                return;
              }
              // Add rank property
              imported = imported.map((a, i) => ({ ...a, rank: i + 1 }));
              setReordered(imported);
              setDevMode(true);
              alert('Imported achievements.json!');
            }}
          />
          {isPending ? (
            <div className="no-achievements">Loading...</div>
          ) : (devMode ? (
            devAchievements.map((a, i) => (
              <div
                key={a.id || i}
                ref={el => {
                  achievementRefs.current[i] = el;
                }}
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
                  borderRadius: 8,
                  position: 'relative'
                }}
                onClick={() => {
                  if (showNewForm && scrollToIdx === i) setShowNewForm(false);
                }}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(v => v === i ? null : v)}
              >
                {(hoveredIdx === i) && (
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    display: 'flex',
                    gap: 32,
                    zIndex: 2,
                    background: 'var(--secondary-bg, #232323)',
                    borderRadius: '1.5rem',
                    padding: '22px 40px',
                    boxShadow: '0 4px 24px #000b',
                    alignItems: 'center',
                    border: '2px solid var(--primary-accent, #e67e22)',
                    transition: 'background 0.2s, border 0.2s',
                  }}>
                    <button
                      title="Edit"
                      style={{
                        background: 'var(--info, #2980b9)',
                        border: 'none',
                        color: '#fff',
                        fontSize: 44,
                        cursor: 'pointer',
                        opacity: 1,
                        borderRadius: '50%',
                        width: 64,
                        height: 64,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 8px #0006',
                        transition: 'background 0.15s, transform 0.1s',
                        outline: 'none',
                      }}
                      onMouseOver={e => e.currentTarget.style.background = 'var(--info-hover, #3498db)'}
                      onMouseOut={e => e.currentTarget.style.background = 'var(--info, #2980b9)'}
                      onClick={e => {e.stopPropagation(); handleEditAchievement(i);}}
                    >✏️</button>
                    <button
                      title="Duplicate"
                      style={{
                        background: 'var(--primary-accent, #e67e22)',
                        border: 'none',
                        color: '#fff',
                        fontSize: 44,
                        cursor: 'pointer',
                        opacity: 1,
                        borderRadius: '50%',
                        width: 64,
                        height: 64,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 8px #0006',
                        transition: 'background 0.15s, transform 0.1s',
                        outline: 'none',
                      }}
                      onMouseOver={e => e.currentTarget.style.background = 'var(--primary-accent-hover, #ff9800)'}
                      onMouseOut={e => e.currentTarget.style.background = 'var(--primary-accent, #e67e22)'}
                      onClick={e => {e.stopPropagation(); handleDuplicateAchievement(i);}}
                    >📄</button>
                    <button
                      title="Remove"
                      style={{
                        background: 'var(--danger, #c0392b)',
                        border: 'none',
                        color: '#fff',
                        fontSize: 44,
                        cursor: 'pointer',
                        opacity: 1,
                        borderRadius: '50%',
                        width: 64,
                        height: 64,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 8px #0006',
                        transition: 'background 0.15s, transform 0.1s',
                        outline: 'none',
                      }}
                      onMouseOver={e => e.currentTarget.style.background = 'var(--danger-hover, #e74c3c)'}
                      onMouseOut={e => e.currentTarget.style.background = 'var(--danger, #c0392b)'}
                      onClick={e => {e.stopPropagation(); handleRemoveAchievement(i);}}
                    >🗑️</button>
                  </div>
                )}
                <AchievementCard achievement={a} devMode={devMode} />
              </div>
            ))
          ) : (
            filtered.length === 0 ? (
              <div className="no-achievements">No achievements found.</div>
            ) : (
              filtered.map((a, i) => (
                <AchievementCard achievement={a} key={a.id || i} devMode={devMode} />
              ))
            )
          ))}
        </section>
      </main>
    </>
  );
}
