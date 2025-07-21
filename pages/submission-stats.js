import Head from 'next/head';
import { useEffect, useState } from 'react';
import Background from '../components/Background';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Leaderboard from '../components/LeaderboardSection';

export default function SubmissionStats() {
  const [submitters, setSubmitters] = useState([]);

  useEffect(() => {
    fetch('/achievements.json')
      .then(res => res.json())
      .then(achievements => {
        const submitterStats = {};
        achievements.forEach(achievement => {
          const submitter = achievement.submitter;
          if (!submitter) return;
          if (submitterStats[submitter]) {
            submitterStats[submitter].count += 1;
            submitterStats[submitter].achievements.push(achievement);
          } else {
            submitterStats[submitter] = { count: 1, achievements: [achievement] };
          }
        });
        const sortedSubmitters = Object.entries(submitterStats)
          .sort(([, a], [, b]) => b.count - a.count)
          .map(([submitter, stats], index) => ({ submitter, ...stats, rank: index + 1 }));
        setSubmitters(sortedSubmitters);
      });
  }, []);

  return (
    <>
      <Head>
        <title>Submission Stats · The Hardest Achievements List</title>
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
        <Leaderboard submitters={Array.isArray(submitters) ? submitters : []} />
      </main>
    </>
  );
}
