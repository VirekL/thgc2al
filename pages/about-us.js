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
              <h4>External Factors</h4>
              <p>
                Achievements that rely on artificially increased difficulty through external limitations are not eligible. This includes (but is not limited to):
              </p>
              <ul>
                <li>Using a low-polling-rate mouse</li>
                <li>Playing blindfolded or with the monitor turned off</li>
                <li>Impaired setup</li>
              </ul>
              <h5>Exception</h5>
              <p>
                Low-hertz achievements performed on mobile devices are exempt from this rule due to the inherent input latency of touchscreen controls. These achievements are recognized separately and marked with a dedicated mobile tag.
              </p>
            </section>
            <section style={{marginBottom: '1.5em'}}>
              <h4>Consistency</h4>
              <h5>Significant Difficulty Increase</h5>
              <p>
                A consistency achievement must represent a clear and substantial increase in difficulty compared to the standard execution of the level.
              </p>
              <h5>One Achievement Per Level</h5>
              <p>
                Only one consistency achievement may be active per level at any given time.
              </p>
              <h5>Achievement Replacement</h5>
              <p>
                If a new consistency achievement is validated as more difficult than the current one, it will replace the existing achievement. Submissions that are less difficult than the current achievement will not be accepted.
              </p>
              <h5>Allowed Actions</h5>
              <p>
                The following actions are permitted during attempts, provided they aren’t meaningful attempts:
              </p>
              <ul>
                <li>Re-entering the level</li>
                <li>Restarting</li>
                <li>Switching start positions</li>
                <li>Filler deaths (e.g., No clicking, random clicking)</li>
              </ul>
              <h5>Performance Threshold</h5>
              <p>
                All attempts must demonstrate performance closely comparable in difficulty to the highest-performing run.<br />
                Examples of unacceptable attempts include wildly inconsistent performances (e.g., 215%, 8%, 100%), as they do not reflect true consistency. In such cases, only the highest-performing run (e.g., 215%) will be considered.
              </p>
              <h5>Moderation &amp; Discretion</h5>
              <p>
                In cases of ambiguity, borderline performance, or disputed claims, a dedicated moderation team will review and evaluate the submission.
              </p>
            </section>
          </section>
        </div>
      </main>
    </>
  );
}
