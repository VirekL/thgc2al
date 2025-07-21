import Link from 'next/link';
import { useState } from 'react';

function SubmitterRow({ submitter, count, achievements, rank }) {
  const [show, setShow] = useState(false);
  return (
    <>
      <tr className="clickable-row" onClick={() => setShow(s => !s)} style={{cursor: 'pointer'}}>
        <td>#{rank}</td>
        <td>{submitter}</td>
        <td style={{textAlign: 'left'}}>{count}</td>
      </tr>
      {show && (
        <tr className="hidden-row">
          <td colSpan={3}>
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

export default function Leaderboard({ submitters }) {
  return (
    <table className="leaderboard-table" style={{width: '100%', borderCollapse: 'collapse'}}>
      <thead>
        <tr>
          <th>#</th>
          <th>Submitter</th>
          <th>Submissions</th>
        </tr>
      </thead>
      <tbody>
        {submitters.map((row) => (
          <SubmitterRow key={row.submitter} {...row} />
        ))}
      </tbody>
    </table>
  );
}
