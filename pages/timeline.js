import Head from 'next/head';
import { useEffect, useState, useMemo } from 'react';
import { useDateFormat } from '../components/DateFormatContext';
import Background from '../components/Background';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Tag from '../components/Tag';

const TAG_PRIORITY_ORDER = [
  'LEVEL', 'CHALLENGE', 'LOW HERTZ', 'MOBILE', 'SPEEDHACK',
  'NOCLIP', 'MISCELLANEOUS', 'PROGRESS', 'CONSISTENCY', '2P', 'CBF',
  'RATED', 'FORMERLY RATED', 'OUTDATED VERSION'
];

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

function TimelineAchievementCard({ achievement, previousAchievement }) {
  const { dateFormat } = useDateFormat();
  const lastedDays = previousAchievement ? calculateDaysLasted(achievement.date, previousAchievement.date) : 'N/A';
  return (
    <div className="achievement-item" tabIndex={0} style={{cursor: 'pointer'}}>
      <div className="rank-date-container">
        <div className="achievement-length">
          {achievement.length ? `${Math.floor(achievement.length / 60)}:${(achievement.length % 60).toString().padStart(2, '0')}` : 'N/A'}
        </div>
        <div className="lasted-days">Lasted {lastedDays} days</div>
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
    </div>
  );
}

export default function Timeline() {
  const [achievements, setAchievements] = useState([]);
  const [search, setSearch] = useState('');
  const [filterTags, setFilterTags] = useState({ include: [], exclude: [] });
  const [allTags, setAllTags] = useState([]);

  useEffect(() => {
    fetch('/timeline.json')
      .then(res => res.json())
      .then(data => {
        // Sort by date descending
        const sorted = [...data].sort((a, b) => new Date(b.date) - new Date(a.date));
        setAchievements(sorted);
        // Collect all unique tags
        const tags = new Set();
        sorted.forEach(a => (a.tags || []).forEach(t => tags.add(t)));
        setAllTags(Array.from(tags));
      });
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

  function handleTagClick(tag) {
    setFilterTags(prev => {
      if (prev.include.includes(tag)) {
        return { ...prev, include: prev.include.filter(t => t !== tag), exclude: [...prev.exclude, tag] };
      } else if (prev.exclude.includes(tag)) {
        return { ...prev, exclude: prev.exclude.filter(t => t !== tag) };
      } else {
        return { ...prev, include: [...prev.include, tag] };
      }
    });
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
      <Header />
      <main className="main-content" style={{display: 'flex', gap: '2rem', padding: '2rem', justifyContent: 'center', alignItems: 'flex-start'}}>
        <Sidebar />
        <section className="achievements" style={{flexGrow: 1, width: '70%', maxWidth: '1000px', display: 'flex', flexDirection: 'column', gap: '1rem', padding: '2rem', maxHeight: 'calc(100vh - 150px)', overflowY: 'auto'}}>
          <div className="search-bar" style={{marginBottom: 16}}>
            <input
              type="text"
              placeholder="Search achievements..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label="Search achievements"
              style={{padding: '0.75rem', borderRadius: 8, border: '2px solid #343A52', width: '100%'}}
            />
          </div>
          <div className="tag-filter-pills" style={{marginBottom: 16, display: 'flex', flexWrap: 'wrap', gap: 8}}>
            {allTags.map(tag => {
              let state = 'neutral';
              if (filterTags.include.includes(tag)) state = 'include';
              if (filterTags.exclude.includes(tag)) state = 'exclude';
              return (
                <span
                  key={tag}
                  className={`tag-filter-pill ${state}`}
                  style={{cursor: 'pointer', padding: '4px 10px', borderRadius: 6, background: state === 'include' ? '#2E3451' : state === 'exclude' ? '#424A66' : '#1B1F30', color: '#DFE3F5', border: '1px solid #343A52'}}
                  onClick={() => handleTagClick(tag)}
                >
                  {tag}
                </span>
              );
            })}
          </div>
          {filtered.length === 0 ? (
            <div style={{color: '#aaa'}}>No achievements found.</div>
          ) : (
            filtered.map((a, i) => (
              <TimelineAchievementCard achievement={a} previousAchievement={filtered[i-1]} key={a.id || i} />
            ))
          )}
        </section>
      </main>
      <div id="blue-tint-overlay"></div>
      <div id="dynamic-background"></div>
    </>
  );
}
