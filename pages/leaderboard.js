
import Head from 'next/head';
import { useEffect, useState } from 'react';
import Background from '../components/Background';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Link from 'next/link';

function getLeaderboard(achievements) {
  const leaderboard = {};
  const totalAchievements = achievements.length;
  achievements.forEach((achievement, index) => {
    const playerName = (achievement.player || '').trim();
    // Skip placeholder/anonymous player entries
    if (playerName === '-') return;
    let points = totalAchievements - index; // Rank-based points
    if (leaderboard[playerName]) {
      leaderboard[playerName].points += points;
      leaderboard[playerName].count += 1;
      leaderboard[playerName].achievements.push(achievement);
    } else {
      leaderboard[playerName] = { points, count: 1, achievements: [achievement] };
    }
  });
  // Sort players by total points
  return Object.entries(leaderboard)
    .sort(([, a], [, b]) => b.points - a.points)
    .map(([player, stats], index) => ({ player, ...stats, rank: index + 1 }));
}

function LeaderboardRow({ player, points, count, achievements, rank, allAchievements }) {
  // Find hardest achievement (lowest index in achievements list)
  let hardest = null;
  let hardestRank = allAchievements.length + 1;
  achievements.forEach(ach => {
    const r = allAchievements.findIndex(a => a.id === ach.id) + 1;
    if (r > 0 && r < hardestRank) {
      hardestRank = r;
      hardest = ach;
    }
  });
  const [show, setShow] = useState(false);
  return (
    <>
      <tr className="clickable-row" onClick={() => setShow(s => !s)} style={{ cursor: 'pointer' }}>
        <td>#{rank}</td>
        <td>{player}</td>
        <td style={{ textAlign: 'left' }}>{(points / 10).toFixed(1)}</td>
        <td>{count}</td>
        <td>{hardest ? <Link href={`/achievement/${hardest.id}`}>{hardest.name}</Link> : '-'}</td>
      </tr>
      {show && (
        <tr className="hidden-row">
          <td colSpan={5}>
            <ul style={{ listStyleType: 'none', margin: 0, padding: 0 }}>
              {achievements.map((ach) => {
                const mainListRank = allAchievements.findIndex(a => a.id === ach.id) + 1;
                let pts = allAchievements.length - (mainListRank - 1);
                const pointsDisplay = `+${(pts / 10).toFixed(1)}`;
                return (
                  <li key={ach.id}>
                    {pointsDisplay} · #{mainListRank} ·
                    <Link href={`/achievement/${ach.id}`}>{ach.name}</Link>
                  </li>
                );
              })}
            </ul>
          </td>
        </tr>
      )}
    </>
  );
}

export default function Leaderboard() {
  const [achievements, setAchievements] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  useEffect(() => {
    fetch('/achievements.json')
      .then(res => res.json())
      .then(data => {
        setAchievements(data);
        setLeaderboard(getLeaderboard(data));
      });
  }, []);
  return (
    <>
      <Head>
        <title>Leaderboard · The Hardest Achievements List</title>
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
      <main className="main-content">
        <Sidebar />
        <section id="leaderboard-section" className="leaderboard-container" style={{ flexGrow: 1, padding: '2rem' }}>
          <table className="leaderboard-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Player</th>
                <th>Points</th>
                <th># of Achievements</th>
                <th>Hardest Achievement</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((row, i) => (
                <LeaderboardRow key={row.player} {...row} allAchievements={achievements} />
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </>
  );
}
