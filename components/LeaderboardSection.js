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

export default function Leaderboard({ submitters, tableStyle, thStyle, tdStyle }) {
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
            {submitters.map((row) => (
              <SubmitterRow key={row.submitter} {...row} tdStyle={{ ...defaultTdStyle, ...(tdStyle || {}) }} />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
