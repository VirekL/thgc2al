import i from"next/link";export default function t(){return<nav >

      <i href="/list"className="sidebar-link">Main List</i>

      <i href="/timeline"className="sidebar-link">Timeline</i>

      <i href="/leaderboard"className="sidebar-link">Leaderboard</i>

      <i href="/submission-stats"className="sidebar-link">Submission Stats</i>

      <a href="#"id="random-achievement-btn"className="sidebar-link">Random</a>

      <i href="/about-us"className="sidebar-link">About Us</i>

      <div style={{position:"relative",width:"100%",paddingBottom:"350px"}}>

        <iframe src="https://discord.com/widget?id=1122038339541934091&theme=dark"style={{position:"absolute",top:0,left:0,width:"100%",height:"100%"}}allowTransparency="true"frameBorder="0"sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"></iframe>

      </div>

    </nav>};
