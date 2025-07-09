import Head from 'next/head';
import Link from 'next/link';
import Background from '../../components/Background';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import fs from 'fs';
import path from 'path';
import { useState } from 'react';
import { useDateFormat } from '../../components/DateFormatContext';

export async function getStaticPaths() {
  const achievementsPath = path.join(process.cwd(), 'public', 'achievements.json');
  let achievements = [];
  try {
    const achievementsData = fs.readFileSync(achievementsPath, 'utf8');
    achievements = JSON.parse(achievementsData);
  } catch (e) {

  }

  const paths = achievements
    .filter(a => a && a.id && a.name)
    .map(a => ({ params: { id: a.id.toString() } }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const achievementsPath = path.join(process.cwd(), 'public', 'achievements.json');
  let achievements = [];
  try {
    const achievementsData = fs.readFileSync(achievementsPath, 'utf8');
    achievements = JSON.parse(achievementsData);
  } catch (e) {

  }

  achievements = achievements.filter(a => a && a.id && a.name);

  const achievement = achievements.find(a => a.id.toString() === params.id) || null;

  // Compute placement (rank) in the filtered list
  let placement = null;
  if (achievement) {
    const index = achievements.findIndex(a => a.id.toString() === params.id);
    if (index !== -1) placement = index + 1;
  }

  return { props: { achievement, placement } };
}

export default function AchievementPage({ achievement, placement }) {
  const [copyMsg, setCopyMsg] = useState('');
  const { dateFormat } = useDateFormat();
  function showCopyNotification(text) {
    setCopyMsg(text);
    setTimeout(() => setCopyMsg(''), 1800);
  }

  function formatDate(date) {
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
  function formatLength(length) {
    if (!length || isNaN(length)) return 'N/A';
    const min = Math.floor(Number(length) / 60);
    const sec = (Number(length) % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  }
  // Tag definitions and Tag component for consistent tag rendering
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
  function Tag({ tag }) {
    const def = TAG_DEFINITIONS[tag.toUpperCase()];
    return (
      <span
        className="tag-filter-pill neutral"
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
          border: '1px solid #343A52',
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
  function getEmbedLink(url) {
    if (!url) return null;
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      let videoId = '';
      if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1].split(/[?&]/)[0];
      } else {
        const match = url.match(/[?&]v=([^&]+)/);
        videoId = match ? match[1] : '';
      }
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }
    return null;
  }
  if (!achievement) {
    return (
      <div>
        <Head>
          <title>Achievement Not Found</title>
        </Head>
        <Background />
        <Header />
        <Sidebar />
        <div>Achievement not found.</div>
        <Link href="/list">← Back to List</Link>
      </div>
    );
  }

  const bgImage = achievement.thumbnail || (achievement.levelID ? `https://tjcsucht.net/levelthumbs/${achievement.levelID}.png` : null);
  return (
    <>
      <Head>
        <title>{achievement.name} · The Hardest Achievements List</title>
        <meta name="description" content={`${achievement.name} done by ${achievement.player} on ${formatDate(achievement.date)}. View Geometry Dash details, videos, and more on The Hardest Achievements List.`} />
      </Head>
      <Background bgImage={bgImage} />
      <Header />
      <main style={{ display: 'flex', gap: '2rem', padding: '2rem', justifyContent: 'center', alignItems: 'flex-start', minHeight: '100vh', overflowY: 'auto' }}>
        <Sidebar />
        <section style={{ flex: '1 1 0%', maxWidth: 900, overflowY: 'auto', maxHeight: 'calc(100vh - 4rem)', position: 'relative' }}>
          <div
            className="achievement-card"
            style={{
              color: 'var(--text-color, #DFE3F5)',
              position: 'relative',
              overflow: 'auto',
              minWidth: 320,
              minHeight: 400,
              maxHeight: 'calc(100vh - 4rem)',
              paddingBottom: '3rem' // Increased bottom padding for more space
            }}
          >
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 className="achievement-title" style={{ fontSize: '2rem', marginBottom: 8, textAlign: 'center' }}>{achievement.name}</h2>
              <p className="achievement-player" style={{ fontWeight: 700, color: '#8fa1c7', marginBottom: 16, textAlign: 'center', fontSize: '1.25rem' }}>{achievement.player}</p>
              { }
              {getEmbedLink(achievement.video) ? (
                <iframe
                  src={getEmbedLink(achievement.video)}
                  title="Achievement Video"
                  style={{ width: '100%', aspectRatio: '16/9', borderRadius: 8, marginBottom: 16, border: 0 }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : achievement.video ? (
                <a href={achievement.video} target="_blank" rel="noopener" style={{ color: '#7ecfff', textDecoration: 'underline', marginBottom: 16, display: 'block' }}>Watch Video</a>
              ) : (
                <p style={{ color: '#aaa', marginBottom: 16 }}>No video available</p>
              )}
              { }
              {achievement.tags && achievement.tags.length > 0 && (
                <div style={{ marginBottom: 16, textAlign: 'left' }}>
                  <strong>Tags:</strong>{' '}
                  <span style={{ display: 'inline-flex', gap: 8, flexWrap: 'wrap', verticalAlign: 'middle', justifyContent: 'flex-start' }}>
                    {achievement.tags.map(tag => (
                      <Tag tag={tag} key={tag} />
                    ))}
                  </span>
                </div>
              )}
              { }
              {/* Level Info: ID, Date, Length, Version (copyable, fancy) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 12, marginTop: 12 }}>
                {achievement.levelID && (
                  <div style={{ marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <strong>ID:</strong>
                    <button
                      onClick={() => { navigator.clipboard.writeText(achievement.levelID); showCopyNotification(`Copied ID: ${achievement.levelID}`); }}
                      className="copy-btn"
                      style={{ marginLeft: 4 }}
                    >{achievement.levelID}</button>
                  </div>
                )}
                {achievement.date && (
                  <div style={{ marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <strong>Date:</strong>
                    <button
                      onClick={() => { navigator.clipboard.writeText(formatDate(achievement.date)); showCopyNotification(`Copied Date: ${formatDate(achievement.date)}`); }}
                      className="copy-btn"
                      style={{ marginLeft: 4 }}
                    >{formatDate(achievement.date)}</button>
                  </div>
                )}
                {achievement.length && (
                  <div style={{ marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <strong>Length:</strong>
                    <button
                      onClick={() => { navigator.clipboard.writeText(formatLength(achievement.length)); showCopyNotification(`Copied Length: ${formatLength(achievement.length)}`); }}
                      className="copy-btn"
                      style={{ marginLeft: 4 }}
                    >{formatLength(achievement.length)}</button>
                  </div>
                )}
                {achievement.version && (
                  <div style={{ marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <strong>Version:</strong>
                    <button
                      onClick={() => { navigator.clipboard.writeText(achievement.version); showCopyNotification(`Copied Version: ${achievement.version}`); }}
                      className="copy-btn"
                      style={{ marginLeft: 4 }}
                    >{achievement.version}</button>
                  </div>
                )}
              </div>
              {placement && (
                <div style={{ marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <strong>Rank:</strong>
                  <button
                    onClick={() => { navigator.clipboard.writeText(placement); showCopyNotification(`Copied Rank: ${placement}`); }}
                    className="copy-btn"
                    style={{ marginLeft: 4 }}
                  >{placement}</button>
                </div>
              )}
              {achievement.showcaseVideo && (
                <div style={{ marginTop: 16 }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: 6 }}>Showcase</h3>
                  {getEmbedLink(achievement.showcaseVideo) ? (
                    <iframe
                      src={getEmbedLink(achievement.showcaseVideo)}
                      title="Showcase Video"
                      style={{ width: '100%', aspectRatio: '16/9', borderRadius: 8, border: 0 }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <a href={achievement.showcaseVideo} target="_blank" rel="noopener" style={{ color: '#7ecfff', textDecoration: 'underline' }}>Watch Showcase</a>
                  )}
                </div>
              )}
              { }
              {achievement.submitter && (
                <div style={{ marginTop: 16, color: '#b6c2e1', fontSize: 13 }}>
                  <strong>Thanks for submitting this achievement,</strong> {achievement.submitter}
                </div>
              )}
              <div style={{ marginTop: 24 }}>
                <Link href="/list" style={{ color: '#7ecfff', textDecoration: 'underline', fontWeight: 500 }}>← Back to List</Link>
              </div>
            </div>
          </div>
          {copyMsg && (
            <div className="copy-notification show">
              {copyMsg}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
