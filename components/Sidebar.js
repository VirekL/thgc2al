import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback } from 'react';

export default function Sidebar() {
  const router = useRouter();

  const handleRandomClick = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Random button clicked');
    const res = await fetch('/achievements.json');
    const data = await res.json();
    console.log('Fetched achievements:', data);
    const valid = data.filter(a => a && a.id && a.name);
    if (valid.length > 0) {
      const random = valid[Math.floor(Math.random() * valid.length)];
      console.log('Redirecting to:', `/achievement/${random.id}`);
      router.push(`/achievement/${random.id}`);
    } else {
      console.log('No valid achievements found');
    }
  }, [router]);

  return (
    <nav className="sidebar">
      <Link href="/list" className="sidebar-link">Main List</Link>
      <Link href="/timeline" className="sidebar-link">Timeline</Link>
      <Link href="/leaderboard" className="sidebar-link">Leaderboard</Link>
      <Link href="/submission-stats" className="sidebar-link">Submission Stats</Link>
      <a href="#" id="random-achievement-btn" className="sidebar-link" onClick={handleRandomClick} role="button" tabIndex={0}>Random</a>
      <Link href="/about-us" className="sidebar-link">About Us</Link>
      <div style={{position: "relative", width: "100%", paddingBottom: "350px"}}>
        <iframe
          src="https://discord.com/widget?id=1122038339541934091&theme=dark"
          style={{position: "absolute", top: 0, left: 0, width: "100%", height: "100%"}}
          allowTransparency="true"
          frameBorder="0"
          sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
        ></iframe>
      </div>
    </nav>
  );
}
