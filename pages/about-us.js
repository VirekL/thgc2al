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
            <section style={{marginBottom: '1.5em'}}>
              <h4>Geometry Dash</h4>
              <p>
                Only achievements within the levels of the official Geometry Dash series are eligible. Submissions from platformer levels, other metrics (e.g., creator points, in-game achievements, stars), or other games will not be accepted.
              </p>
            </section>
            <section style={{marginBottom: '1.5em'}}>
              <h4>Baseline</h4>
              <p>
                To be included in the main list, an achievement must be more difficult than the lowest-ranked current entry.
              </p>
              <h4>One Thousand Achievements Limit</h4>
              <p>
                If the baseline rank approaches or reaches 1000, a new baseline will be reassessed &amp; established, and any achievements falling below this updated threshold will be moved to the Legacy List.
              </p>
            </section>
            <section style={{marginBottom: '1.5em'}}>
              <h4><span style={{fontWeight:700, color:'#e67e22'}}>External Factors</span></h4>
              <p>
                <strong>Achievements that rely on artificially increased difficulty through external limitations are <span style={{color:'#e74c3c'}}>not eligible</span>.</strong>
                <br />
                <span style={{fontStyle:'italic', color:'#aaa'}}>This includes (but is not limited to):</span>
              </p>
              <ul style={{marginLeft:'1.2em', marginBottom:'0.7em'}}>
                <li><span style={{fontWeight:500}}>Using a low-polling-rate mouse</span></li>
                <li><span style={{fontWeight:500}}>Playing blindfolded or with the monitor turned off</span></li>
                <li><span style={{fontWeight:500}}>Impaired setup</span></li>
              </ul>
              <div style={{margin:'0.7em 0 0.2em 0'}}>
                <span style={{fontWeight:600, color:'#34d058'}}>Exception:</span> <span style={{fontStyle:'italic'}}>Low-hertz achievements performed on mobile devices are exempt from this rule due to the inherent input latency of touchscreen controls. These achievements are recognized separately and marked with a dedicated <span style={{fontWeight:600, color:'#2980b9'}}>mobile</span> tag.</span>
              </div>
            </section>
            <section style={{marginBottom: '1.5em'}}>
              <h4><span style={{fontWeight:700, color:'#e67e22'}}>Consistency</span></h4>
              <div style={{marginBottom:'0.7em'}}>
                <strong>Significant Difficulty Increase:</strong> <span style={{fontStyle:'italic'}}>A consistency achievement must represent a <span style={{color:'#e74c3c'}}>clear and substantial increase in difficulty</span> compared to the standard execution of the level.</span>
              </div>
              <div style={{marginBottom:'0.7em'}}>
                <strong>One Achievement Per Level:</strong> <span style={{fontStyle:'italic'}}>Only one consistency achievement may be active per level at any given time.</span>
              </div>
              <div style={{marginBottom:'0.7em'}}>
                <strong>Achievement Replacement:</strong> <span style={{fontStyle:'italic'}}>If a new consistency achievement is validated as more difficult than the current one, it will replace the existing achievement. Submissions that are less difficult than the current achievement will not be accepted.</span>
              </div>
              <div style={{marginBottom:'0.7em'}}>
                <strong>Allowed Actions:</strong> <span style={{fontStyle:'italic'}}>The following actions are permitted during attempts, provided they aren’t meaningful attempts:</span>
                <ul style={{marginLeft:'1.2em', marginTop:'0.3em'}}>
                  <li><span style={{fontWeight:500}}>Re-entering the level</span></li>
                  <li><span style={{fontWeight:500}}>Restarting</span></li>
                  <li><span style={{fontWeight:500}}>Switching start positions</span></li>
                  <li><span style={{fontWeight:500}}>Filler deaths (e.g., No clicking, random clicking)</span></li>
                </ul>
              </div>
              <div style={{marginBottom:'0.7em'}}>
                <strong>Performance Threshold:</strong> <span style={{fontStyle:'italic'}}>All attempts must demonstrate performance closely comparable in difficulty to the highest-performing run.</span><br />
                <span style={{color:'#aaa'}}>Examples of unacceptable attempts include <b>wildly inconsistent performances</b> (e.g., 215%, 8%, 100%), as they do not reflect true consistency. In such cases, only the highest-performing run (e.g., 215%) will be considered.</span>
              </div>
              <div style={{marginBottom:'0.7em'}}>
                <strong>Moderation &amp; Discretion:</strong> <span style={{fontStyle:'italic'}}>In cases of ambiguity, borderline performance, or disputed claims, a dedicated moderation team will review and evaluate the submission.</span>
              </div>
            </section>
          </section>
        </div>
      </main>
    </>
  );
}
