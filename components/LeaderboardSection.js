import Link from 'next/link';
import { useState } from 'react';

function SubmitterRow({ submitter, count, achievements, rank, tdStyle }) {
  const [show, setShow] = useState(false);
  return (
    <>
      <tr className="clickable-row" onClick={() => setShow(s => !s)} style={{cursor: 'pointer'}}>
        <td style={tdStyle}>#{rank}</td>
        <td style={tdStyle}>{submitter}</td>
        <td style={{...tdStyle, textAlign: 'left'}}>{count}</td>
      </tr>
      {show && (
        <tr className="hidden-row">
          <td colSpan={3} style={tdStyle}>
            <ul style={{listStyleType: 'none', margin: 0, padding: 0}}>
              {achievements.map((ach) => (
                <li key={ach.id || ach.name}>
                  <Link href={ach.id ? `/achievement/${ach.id}` : '#'}>{ach.name || '(Unnamed Achievement)'}</Link>
                </li>
              ))}
            </ul>
          </td>
        </tr>
      )}
    </>
  );
}

import { useEffect, useState } from 'react';

export default function Leaderboard({ submitters, tableStyle, thStyle, tdStyle }) {
  // If submitters prop is provided, show submitter leaderboard (submission-stats page)
  // If not, fetch and show player leaderboard (leaderboard page)
  const [playerStats, setPlayerStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const showPlayerLeaderboard = typeof submitters === 'undefined';
  useEffect(() => {
    if (showPlayerLeaderboard) {
      setLoading(true);
      fetch('/achievements.json')
        .then(res => res.json())
        .then(achievements => {
          // Build leaderboard: group by player, count achievements, sort by count desc
          const playerMap = {};
          achievements.forEach(ach => {
            if (!ach.player) return;
            if (!playerMap[ach.player]) {
              playerMap[ach.player] = { player: ach.player, count: 1, achievements: [ach], rank: 0 };
            } else {
              playerMap[ach.player].count += 1;
              playerMap[ach.player].achievements.push(ach);
            }
          });
          const sortedPlayers = Object.values(playerMap)
            .sort((a, b) => b.count - a.count)
            .map((p, i) => ({ ...p, rank: i + 1 }));
          setPlayerStats(sortedPlayers);
          setLoading(false);
        })
        .catch(e => { setError('Failed to load leaderboard'); setLoading(false); });
    }
  }, [showPlayerLeaderboard]);
  const safeSubmitters = Array.isArray(submitters) ? submitters : [];
  // Default styles for section, heading, table, th, and td
  const defaultSectionStyle = {
    padding: '3rem 2.5rem',
    background: 'linear-gradient(135deg, #23283E 60%, #2E3451 100%)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    borderRadius: '18px',
    border: '1.5px solid #343A52',
    margin: '2.5rem auto',
    maxWidth: 700,
    width: '100%',
    minHeight: 350,
    transition: 'box-shadow 0.3s',
  };
  const defaultHeadingStyle = {
    color: '#FFC800',
    fontWeight: 700,
    fontSize: '2.1rem',
    marginBottom: '2.2rem',
    letterSpacing: '0.03em',
    textShadow: '0 2px 8px #000a',
    textAlign: 'center',
  };
  const defaultTableStyle = {
    background: 'rgba(30,34,60,0.97)',
    borderRadius: '12px',
    boxShadow: '0 2px 12px #0004',
    margin: '0 auto',
    minWidth: 420,
    fontSize: '1.08rem',
    borderCollapse: 'separate',
    borderSpacing: '0 0.5rem',
    width: '100%',
  };
  const defaultThStyle = {
    background: '#23283E',
    color: '#FFC800',
    fontWeight: 700,
    fontSize: '1.1rem',
    padding: '1.1rem 0.7rem',
    border: 'none',
  };
  const defaultTdStyle = {
    background: 'rgba(36,40,70,0.93)',
    color: '#DFE3F5',
    padding: '1.1rem 0.7rem',
    border: 'none',
    borderRadius: '7px',
  };
  // Render player leaderboard if no submitters prop
  if (showPlayerLeaderboard) {
    return (
      <section
        id="leaderboard-section"
        className="leaderboard-container leaderboard-section-enhanced"
        style={defaultSectionStyle}
      >
        <h2 style={defaultHeadingStyle}>Top Players</h2>
        <div style={{ overflowX: 'auto' }}>
          {loading ? (
            <div style={{ color: '#FFC800', textAlign: 'center', padding: '2rem' }}>Loading...</div>
          ) : error ? (
            <div style={{ color: 'red', textAlign: 'center', padding: '2rem' }}>{error}</div>
          ) : (
            <table
              className="leaderboard-table"
              style={{ ...defaultTableStyle, ...(tableStyle || {}) }}
            >
              <thead>
                <tr>
                  <th style={{ ...defaultThStyle, ...(thStyle || {}) }}>#</th>
                  <th style={{ ...defaultThStyle, ...(thStyle || {}) }}>Player</th>
                  <th style={{ ...defaultThStyle, ...(thStyle || {}) }}>Achievements</th>
                </tr>
              </thead>
              <tbody>
                {playerStats.map((row) => (
                  <tr key={row.player} className="clickable-row" style={{ cursor: 'pointer' }}>
                    <td style={defaultTdStyle}>#{row.rank}</td>
                    <td style={defaultTdStyle}>{row.player}</td>
                    <td style={defaultTdStyle}>{row.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    );
  }
  // Otherwise, render submitter leaderboard (submission-stats page)
  return (
    <section
      id="submission-stats-section"
      className="leaderboard-container leaderboard-section-enhanced"
      style={defaultSectionStyle}
    >
      <h2 style={defaultHeadingStyle}>Top Submitters</h2>
      <div style={{ overflowX: 'auto' }}>
        <table
          className="leaderboard-table"
          style={{ ...defaultTableStyle, ...(tableStyle || {}) }}
        >
          <thead>
            <tr>
              <th style={{ ...defaultThStyle, ...(thStyle || {}) }}>#</th>
              <th style={{ ...defaultThStyle, ...(thStyle || {}) }}>Submitter</th>
              <th style={{ ...defaultThStyle, ...(thStyle || {}) }}>Submissions</th>
            </tr>
          </thead>
          <tbody>
            {safeSubmitters.map((row) => (
              <SubmitterRow key={row.submitter} {...row} tdStyle={{ ...defaultTdStyle, ...(tdStyle || {}) }} />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
