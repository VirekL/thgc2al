import Head from 'next/head';
import Link from 'next/link';
import Background from '../../components/Background';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';

export async function getStaticPaths() {
  const res = await fetch('http://localhost:3000/achievements.json');
  const achievements = await res.json();
  const paths = achievements
    .filter(a => a && a.id)
    .map(a => ({ params: { id: a.id.toString() } }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const res = await fetch('http://localhost:3000/achievements.json');
  const achievements = await res.json();
  const achievement = achievements.find(a => a && a.id && a.id.toString() === params.id) || null;
  return { props: { achievement } };
}

export default function AchievementPage({ achievement }) {
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
  return (
    <>
      <Head>
        <title>{achievement.name} · The Hardest Achievements List</title>
        {/* ...meta tags as in your other pages... */}
      </Head>
      <Background />
      <Header />
      <main>
        <Sidebar />
        <div>
          <h1>{achievement.name}</h1>
          <p>by {achievement.player}</p>
          {/* Render more achievement details here */}
          <Link href="/list">← Back to List</Link>
        </div>
      </main>
    </>
  );
}
