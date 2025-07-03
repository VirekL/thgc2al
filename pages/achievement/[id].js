import Head from 'next/head';
import Link from 'next/link';
import Background from '../../components/Background';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import fs from 'fs';
import path from 'path';
import { useState } from 'react';

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
  return { props: { achievement } };
}

export default function AchievementPage({ achievement }) {
  const [copyMsg, setCopyMsg] = useState('');
  function showCopyNotification(text) {
    setCopyMsg(text);
    setTimeout(() => setCopyMsg(''), 1800);
  }

  function formatDate(date) {
    if (!date) return 'N/A';
    const d = new Date(date);
    if (isNaN(d)) return 'N/A';
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }
  function formatLength(length) {
    if (!length || isNaN(length)) return 'N/A';
    const min = Math.floor(Number(length) / 60);
    const sec = (Number(length) % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  }
  function getTagMeta(tag) {
    const meta = {
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
    return meta[tag.toUpperCase()] || { color: '#444', text: tag };
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
      <Background />
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
              <p className="achievement-player" style={{ fontWeight: 700, color: '#8fa1c7', marginBottom: 16, textAlign: 'center', fontSize: '1.5rem' }}>{achievement.player}</p>
              {}
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
              {}
              {achievement.tags && achievement.tags.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <strong>Tags:</strong>{' '}
                  <span style={{ display: 'inline-flex', gap: 8, flexWrap: 'wrap', verticalAlign: 'middle' }}>
                    {achievement.tags.map(tag => {
                      const meta = getTagMeta(tag);
                      return (
                        <span key={tag} style={{ background: meta.color, color: '#fff', borderRadius: 6, padding: '2px 10px', display: 'inline-flex', alignItems: 'center', fontSize: 13, fontWeight: 500, gap: 4 }}>
                          {meta.icon && <img src={meta.icon} alt={meta.text} style={{ width: 18, height: 18, marginRight: 4, verticalAlign: 'middle' }} />}
                          {meta.text}
                        </span>
                      );
                    })}
                  </span>
                </div>
              )}
              {}
              {achievement.levelID && (
                <div style={{ marginBottom: 8 }}><strong>ID:</strong> <span style={{ cursor: 'pointer' }}>{achievement.levelID}</span></div>
              )}
              {/* Level Info: Length, Version, Date (copyable, fancy) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 8, marginTop: 8 }}>
                {achievement.length && (
                  <div style={{ marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <strong>Length:</strong>
                    <button
                      onClick={() => {navigator.clipboard.writeText(formatLength(achievement.length)); showCopyNotification(`Copied Length: ${formatLength(achievement.length)}`);}}
                      className="copy-btn"
                      style={{ marginLeft: 4 }}
                    >{formatLength(achievement.length)}</button>
                  </div>
                )}
                {achievement.version && (
                  <div style={{ marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <strong>Version:</strong>
                    <button
                      onClick={() => {navigator.clipboard.writeText(achievement.version); showCopyNotification(`Copied Version: ${achievement.version}`);}}
                      className="copy-btn"
                      style={{ marginLeft: 4 }}
                    >{achievement.version}</button>
                  </div>
                )}
                {achievement.date && (
                  <div style={{ marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <strong>Date:</strong>
                    <button
                      onClick={() => {navigator.clipboard.writeText(formatDate(achievement.date)); showCopyNotification(`Copied Date: ${formatDate(achievement.date)}`);}}
                      className="copy-btn"
                      style={{ marginLeft: 4 }}
                    >{formatDate(achievement.date)}</button>
                  </div>
                )}
              </div>
              {}
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
              {}
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
            <div className="copy-notification show" style={{
              position: 'fixed',
              bottom: 20,
              right: 20,
              left: 'auto',
              minWidth: 0,
              maxWidth: 260,
              fontSize: '0.95rem',
              padding: '0.45rem 1.1rem',
              borderRadius: 7,
              zIndex: 9999,
              pointerEvents: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
              background: 'rgba(30,40,70,0.93)',
              color: '#fff',
              textAlign: 'center',
              opacity: 1,
              transition: 'opacity 0.3s',
            }}>
              {copyMsg}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
