import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Background from '../components/Background';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

function Tag({ tag }) {
  return <span className="tag">{tag}</span>;
}

function AchievementDetails({ achievement }) {
  if (!achievement) {
    return <div className="not-found">Achievement not found.</div>;
  }
  return (
    <div className="single-achievement-card">
      <div className="single-achievement-header">
        <img
          className="single-achievement-thumbnail"
          src={
            achievement.thumbnail ||
            (achievement.levelID
              ? `https://tjcsucht.net/levelthumbs/${achievement.levelID}.png`
              : '/assets/default-thumbnail.png')
          }
          alt={achievement.name}
          loading="lazy"
        />
        <div className="single-achievement-title">
          <h2>{achievement.name}</h2>
          <p>by {achievement.player}</p>
        </div>
      </div>
      <div className="single-achievement-meta">
        <span className="single-achievement-date">
          {achievement.date
            ? new Date(achievement.date).toLocaleDateString()
            : ''}
        </span>
        <span className="single-achievement-tags">
          {(achievement.tags || []).map(tag => (
            <Tag tag={tag} key={tag} />
          ))}
        </span>
      </div>
      <div className="single-achievement-description">
        {achievement.description || ''}
      </div>
    </div>
  );
}

export default function Achievement() {
  const router = useRouter();
  const { id } = router.query;
  const [achievement, setAchievement] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch('/achievements.json')
      .then(res => res.json())
      .then(data => {
        const found = data.find(a => a.id === id);
        setAchievement(found || null);
        setNotFound(!found);
      });
  }, [id]);

  return (
    <>
      <Head>
        <title>The Hardest Achievements List</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          rel="icon"
          type="image/png"
          href="/assets/favicon-96x96.png"
          sizes="96x96"
        />
        <link rel="shortcut icon" href="/assets/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/assets/apple-touch-icon.png"
        />
        <meta name="apple-mobile-web-app-title" content="THAL" />
        <link rel="manifest" href="/assets/site.webmanifest" />
        <meta
          name="description"
          content="This Geometry Dash list ranks rated, unrated, challenges, runs, speedhacked, low refresh rate, (and more) all under one list."
        />
      </Head>
      <Background />
      <Header />
      <div id="dynamic-background"></div>
      <div id="blue-tint-overlay"></div>
      <main className="main-content">
        <Sidebar />
        <section
          className="achievement-details-container"
          style={{ flexGrow: 1, padding: '2rem' }}
        >
          {id ? (
            <AchievementDetails achievement={achievement} />
          ) : (
            <div>Loading...</div>
          )}
        </section>
      </main>
    </>
  );
}