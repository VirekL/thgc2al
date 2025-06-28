import { useEffect } from 'react';

export default function Background() {
  useEffect(() => {
    // Inject styles only once
    if (!document.getElementById('background-style')) {
      const style = document.createElement('style');
      style.id = 'background-style';
      style.textContent = `
        #background-root {
          position: fixed;
          inset: 0;
          width: 100vw;
          height: 100vh;
          z-index: -1000;
          pointer-events: none;
        }
        #dynamic-background {
          position: absolute;
          inset: 0;
          width: 100vw;
          height: 100vh;
          z-index: -2;
          background-size: cover;
          background-position: center;
          filter: grayscale(75%) blur(5px) brightness(.7);
          transition: background-image 0.3s ease-in-out;
          pointer-events: none;
        }
        #blue-tint-overlay {
          position: absolute;
          inset: 0;
          width: 100vw;
          height: 100vh;
          z-index: -1;
          background: rgba(19,23,41,.8);
          pointer-events: none;
        }
      `;
      document.head.appendChild(style);
    }

    // Fetch achievements and set background
    function setBackgroundFromAchievements(achievements) {
      if (!achievements || !achievements.length) return;
      let topAchievement = achievements.find(a => a && (a.thumbnail || a.levelID));
      if (!topAchievement) return;
      let bgUrl = topAchievement.thumbnail || (topAchievement.levelID ? `https://tjcsucht.net/levelthumbs/${topAchievement.levelID}.png` : null);
      if (bgUrl) {
        const bgDiv = document.getElementById('dynamic-background');
        if (bgDiv) bgDiv.style.backgroundImage = `url('${bgUrl}')`;
      }
    }

    // Try both possible paths for achievements.json
    fetch('/achievements.json')
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(setBackgroundFromAchievements)
      .catch(() => {
        fetch('achievements.json')
          .then(res => res.ok ? res.json() : Promise.reject())
          .then(setBackgroundFromAchievements)
          .catch(() => {});
      });
  }, []);

  return (
    <div id="background-root">
      <div id="blue-tint-overlay"></div>
      <div id="dynamic-background"></div>
    </div>
  );
}
