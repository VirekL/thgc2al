import Head from 'next/head';
import Background from '../components/Background';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

export default function AboutUs() {
  return (
    <>
      <Head>
        <title>About Us · The Hardest Achievements List</title>
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
      <main className="main-content" style={{display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: '2rem', padding: '2rem 1rem'}}>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: '2rem', maxWidth: '1100px', width: '100%', margin: '0 auto'}}>
          <Sidebar />
          <section className="about-us about-us-container">
            <h2>The Hardest Achievements List</h2>
            <p>What is this list?</p>
            <p>
              This list ranks <strong>rated levels</strong>, <strong>unrated</strong>, <strong>challenges</strong>,
              <strong>runs</strong>, <strong>speedhacked</strong>, and more. This is all under one list, sorted by
              difficulty, with the baseline starting at <strong>Zodiac</strong>.
            </p>
            <h3>List Editors</h3>
            <ul>
              <li><strong>Anceps</strong></li>
              <li><strong>Brachiozaur</strong></li>
              <li><strong>kyle1saurus</strong></li>
            </ul>
            <h3>Tags Definitions</h3>
            <ul>
              <li><strong>Level</strong>: A traditional level, which spans 30+ seconds. <em>(Acheron)</em></li>
              <li><strong>Challenge</strong>: Tiny or short length level; a level that spans under 30 seconds. <em>(VSC)</em></li>
              <li><strong>Low Hertz</strong>: Done at a low hz. It can be added if it adds a lot more difficulty to the level. <em>(The Rupture 60hz)</em></li>
              <li><strong>Mobile</strong>: Played on mobile. <em>(Hard Machine 144hz Mobile)</em></li>
              <li><strong>Speedhack</strong>: Altered speed using hacks. <em>(Sonic Wave 1.35x)</em></li>
              <li><strong>Noclip</strong>: Done with noclip on. <em>(vsc superbuff 6 deaths, 99.79 accuracy)</em></li>
              <li><strong>Miscellaneous</strong>: An achievement that doesn't fit with any other types.</li>
              <li><strong>Progress</strong>: Parts of the level completed. <em>(Singularity 61%)</em></li>
              <li><strong>Consistency</strong>: Progress done in a row. <em>(Slaughterhouse 300%, Extra Mile 77% + 69% + 53%)</em></li>
              <li><strong>2P</strong>: Level uses 2 player mode.</li>
              <li><strong>CBF</strong>: Achievement uses Geode mod Click Between Frames, which allows players to input actions in between visual frames, effectively increasing input precision.</li>
              <li><strong>Rated</strong>: Level is rated ingame.</li>
              <li><strong>Formerly rated</strong>: Level was rated, but had its rating status removed.</li>
              <li><strong>Outdated Version</strong>: Level is rated and is on an older version than the current one.</li>
            </ul>
            <h3>Rules</h3>
            <ul>
              <li>All achievements must be done in <strong>Geometry Dash</strong> levels (no platformers, ingame achievements, other games, etc.).</li>
              <li>Achievements must be considered more difficult to complete than the lowest achievement in order to be placed. If the baseline reaches or nears 1000, a new baseline will be decided, and achievements that fall below the new baseline will be moved to the legacy list.</li>
              <li>Anything made more difficult by using external factors will not be considered. Examples include using a low polling rate mouse or turning off a monitor while playing. <strong>Low hertz achievements done on mobile are exempt</strong> from this rule due to the inherent input latency associated with touchscreen controls.</li>
            </ul>
          </section>
        </div>
      </main>
    </>
  );
}
