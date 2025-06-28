import{useEffect as e}from"react";export default function t(){return e(()=>{if(!document.getElementById("background-style")){let e=document.createElement("style");e.id="background-style",e.textContent=`
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
          z-index: 0;
          background-size: cover;
          background-position: center;
          transition: background-image 0.5s;
          pointer-events: none;
        }
        #blue-tint-overlay {
          position: absolute;
          inset: 0;
          width: 100vw;
          height: 100vh;
          z-index: 1;
          background: rgba(40, 80, 180, 0.12);
          pointer-events: none;
        }
      `,document.head.appendChild(e)}function t(e){if(!e||!e.length)return;let t=e.find(e=>e&&(e.thumbnail||e.levelID));if(!t)return;let n=t.thumbnail||(t.levelID?`https://tjcsucht.net/levelthumbs/${t.levelID}.png`:null);if(n){let o=document.getElementById("dynamic-background");o&&(o.style.backgroundImage=`url('${n}')`)}}fetch("/achievements.json").then(e=>e.ok?e.json():Promise.reject()).then(t).catch(()=>{fetch("achievements.json").then(e=>e.ok?e.json():Promise.reject()).then(t).catch(()=>{})})},[]),<div id="background-root">

      <div id="dynamic-background"></div>

      <div id="blue-tint-overlay"></div>

    </div>};
