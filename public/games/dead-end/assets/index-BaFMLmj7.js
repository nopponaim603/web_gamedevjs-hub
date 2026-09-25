<!doctype html>
<html lang="en" class="booting">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
  <meta name="theme-color" content="#111914" />
  <meta name="description" content="Dead End — a top-down zombie survival shooter. Hold out in a deserted suburban neighborhood until the evacuation arrives." />
  <title>DEAD END — Last night in the neighborhood</title>
   <link rel="canonical" href="https://dead-end.replit.app/" />
   <meta property="og:type" content="website" />
   <meta property="og:site_name" content="Dead End" />
   <meta property="og:url" content="https://dead-end.replit.app/" />
   <meta property="og:title" content="DEAD END — Last night in the neighborhood" />
   <meta property="og:description" content="A top-down zombie survival shooter. Clear five waves, scavenge supplies, and reach the evacuation zone." />
   <meta property="og:image" content="https://dead-end.replit.app/social-preview.png?v=2" />
   <meta property="og:image:url" content="https://dead-end.replit.app/social-preview.png?v=2" />
   <meta property="og:image:secure_url" content="https://dead-end.replit.app/social-preview.png?v=2" />
   <meta property="og:image:type" content="image/png" />
   <meta property="og:image:width" content="1200" />
   <meta property="og:image:height" content="630" />
   <meta property="og:image:alt" content="Dead End, a top-down zombie survival game set in a neon lit city at night." />
   <meta name="twitter:card" content="summary_large_image" />
   <meta name="twitter:title" content="DEAD END — Last night in the neighborhood" />
   <meta name="twitter:description" content="Clear five waves, scavenge supplies, and make the evacuation." />
   <meta name="twitter:image" content="https://dead-end.replit.app/social-preview.png?v=2" />
   <meta name="twitter:image:src" content="https://dead-end.replit.app/social-preview.png?v=2" />
   <meta name="twitter:image:alt" content="Dead End, a top-down zombie survival game set in a neon lit city at night." />
  <link rel="icon" type="image/svg+xml" href="./favicon.svg" />
  <link rel="alternate icon" type="image/x-icon" href="./favicon.ico" />
  <link rel="apple-touch-icon" href="./apple-touch-icon.png" />
  <style>
    html,body{margin:0;background:#111a17}
    .booting #app{visibility:hidden}
    #boot-screen{display:none}
    .booting #boot-screen{position:fixed;inset:0;z-index:100;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;background:radial-gradient(ellipse at center,#24382b,#111a17 70%);color:#c9ef75;font:12px monospace;letter-spacing:2px;text-align:center}
    #boot-screen strong{font:bold clamp(32px,7vw,56px) sans-serif;letter-spacing:5px}
    #boot-screen p{color:#a2ad9a;font-size:10px;letter-spacing:1px}
    .boot-spinner{width:30px;height:30px;border:2px solid #c9ef7526;border-top-color:#c9ef75;border-radius:50%;animation:boot-spin 1s linear infinite}
    @keyframes boot-spin{to{transform:rotate(360deg)}}
    @media(prefers-reduced-motion:reduce){.boot-spinner{animation:none}}
  </style>
  <script type="module" crossorigin src="/assets/index-DuL6qU6q.js"></script>
  <link rel="stylesheet" crossorigin href="/assets/index-B-NhBloe.css">
</head>
<body>
  <div id="boot-screen" role="status" aria-live="polite"><strong>DEAD END.</strong><i class="boot-spinner" aria-hidden="true"></i><span id="boot-label">PREPARING THE NEIGHBORHOOD</span><p>Loading assets. Stay close.</p></div>
  <main id="app">
    <canvas id="game" aria-label="Top-down zombie survival game"></canvas>
    <div id="vignette"></div><div id="damage-flash"></div>
    <div id="crosshair"><i></i><b></b></div>
    <div id="hitmarker"></div>

    <header class="topbar">
      <a class="brand" href="./" aria-label="Dead End home"><img class="brand-logo" src="./brand/dead-end-logo.svg" width="209" height="44" alt="Dead End — Survival Protocol" fetchpriority="high" /></a>
      <div id="survivor-counts" class="survivor-counts" data-status="loading" role="group" aria-label="Player counts" title="Today: unique players (UTC). Total includes a baseline of 520 historical visitors."><span class="survivor-count"><span class="count-label"><i></i>SURVIVORS TODAY</span><strong id="survivors-today">—</strong></span><span class="count-divider"></span><span class="survivor-count"><span class="count-label">TOTAL SURVIVORS</span><strong id="survivors-total">—</strong></span></div>
      <div class="top-actions"><button id="sound-button" class="icon-button" title="Toggle sound (M)" aria-label="Toggle sound" aria-pressed="true">SOUND <span id="sound-state">ON</span></button><button id="pause-button" class="icon-button" title="Pause (Esc)">II <span>PAUSE</span></button></div>
    </header>

    <section id="hud" class="hidden" aria-label="Game status">
      <div class="wave-panel"><div class="eyebrow" id="wave-eyebrow">HOLD THE NEIGHBORHOOD</div><div class="wave-line"><span id="wave-label">WAVE 01</span><span class="wave-divider">/</span><span class="wave-total">05</span></div><div class="wave-meter"><i id="wave-progress"></i></div><div class="wave-bottom"><span id="remaining">10 HOSTILES REMAINING</span><span id="survival-time">00:00</span></div></div>
      <div class="mini-panel"><div class="eyebrow"><span id="map-label">NEIGHBORHOOD MAP</span><span class="live-dot">LIVE</span></div><canvas id="minimap" width="220" height="220" aria-label="Minimap showing player, zombies, and supply drops"></canvas><div class="map-legend"><span><i class="player-dot"></i>YOU</span><span><i class="hostile-dot"></i>HOSTILES</span><span>N ↑</span></div></div>
      <div class="player-panel"><div class="player-caption"><span class="survivor-icon">✚</span><div><span class="eyebrow">SURVIVOR 001</span><strong id="health-label">100 <small>/ 100</small></strong></div><span id="health-status">STABLE</span></div><div class="health-track"><i id="health-bar"></i></div><div class="stamina-row"><span>STAMINA</span><div><i id="stamina-bar"></i></div><span>SHIFT</span></div></div>
      <div class="kill-panel"><span class="eyebrow">ELIMINATED</span><strong id="kill-count">000</strong><span id="combo" class="hidden">×2 STREAK</span></div>
      <div class="weapon-panel"><div class="weapon-top"><span class="eyebrow" id="weapon-name">M4 CARBINE</span><span class="weapon-mode" id="weapon-mode">AUTO</span></div><div class="weapon-main"><svg viewBox="0 0 130 45" aria-hidden="true"><path d="M8 18h25l7-5h29v-5h10v5h34v5h13v5H79l-5 6H58l-5 13H41l4-14H31L8 36z"/><path d="M62 26h12l5 14H67z" opacity=".65"/></svg><div><strong id="ammo">30</strong><span>/ <b id="reserve">180</b></span></div></div><div class="ammo-track" id="ammo-track"></div><div class="weapon-bottom"><span id="reload-hint"><kbd>R</kbd> RELOAD</span><span><kbd>1</kbd> RIFLE <kbd>2</kbd> SHOTGUN</span></div><div id="reload-progress"><i></i></div></div>
      <div id="boss-bar" class="hidden"><div class="boss-top"><span class="boss-dot">●</span><span id="boss-name">SECTOR THREAT</span><span>THREAT</span></div><div class="boss-track"><i id="boss-health"></i></div></div>
      <div id="announcement" class="hidden"><span id="announcement-kicker">INCOMING TRANSMISSION</span><strong id="announcement-title">WAVE 01</strong><p id="announcement-text">Stay moving. Watch your corners.</p></div>
      <div id="toast" class="hidden"></div>
      <div class="bottom-guide"><span><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> MOVE</span><span>MOUSE AIM · HOLD TO FIRE</span><span><kbd>SPACE</kbd> DODGE</span></div>
    </section>

    <section id="menu" class="screen">
      <div class="menu-shade"></div>
      <div class="menu-content">
        <div class="dispatch"><span class="status-dot"></span> EMERGENCY BROADCAST <span>21:47</span></div>
        <div class="title-overline">LAST NIGHT IN THE NEIGHBORHOOD</div>
        <h1>DEAD<br/><span>END.</span></h1>
        <p class="intro" id="menu-intro">The neighbors aren't themselves tonight.<br/>Five waves. One way out. Keep breathing.</p>
        <div class="level-select" id="level-select" role="group" aria-label="Select sector">
          <div class="menu-step"><b aria-hidden="true">1</b> CHOOSE A MAP<button type="button" class="menu-step-more" id="map-more" aria-label="Show more maps">MORE →</button></div>
          <div class="map-tiles" id="map-tiles" role="tablist" aria-label="Maps">
            <button class="map-card" type="button" role="tab" data-map="oakridge"><span class="map-num">01</span><span class="map-name">OAKRIDGE</span><span class="map-sub">SUBURBAN COUNTY</span><span class="map-count"></span></button>
            <button class="map-card" type="button" role="tab" data-map="vice"><span class="map-num">02</span><span class="map-name">VICE BEACH</span><span class="map-sub">OCEAN DRIVE</span><span class="map-count"></span></button>
            <button class="map-card" type="button" role="tab" data-map="ashfall"><span class="map-num">03</span><span class="map-name">ASHFALL</span><span class="map-sub">ROUTE 9 · THE FLATS</span><span class="map-count"></span></button>
            <button class="map-card" type="button" role="tab" data-map="meridian"><span class="map-num">04</span><span class="map-name">MERIDIAN</span><span class="map-sub">DOWNTOWN CROSSING</span><span class="map-count"></span></button>
            <button class="map-card" type="button" role="tab" data-map="blackgate"><span class="map-num">05</span><span class="map-name">BLACKGATE</span><span class="map-sub">HACK &amp; SLASH RPG</span><span class="map-count"></span></button>
            <button class="map-card closed" type="button" role="tab" data-map="two-pines" data-closed="1" aria-disabled="true" title="Coming soon"><span class="map-num">06</span><span class="map-name">TWO PINES</span><span class="map-sub">GROCERY · AFTER CLOSING</span><span class="map-count">COMING SOON</span></button>
            <button class="map-card closed" type="button" role="tab" data-map="howling-swamp" data-closed="1" aria-disabled="true" title="Coming soon"><span class="map-num">07</span><span class="map-name">HOWLING SWAMP</span><span class="map-sub">SINGLE LANE · CHAMPION DUEL</span><span class="map-count">COMING SOON</span></button>
          </div>
          <div class="map-games-head"><span class="eyebrow" id="map-games-title"></span><span class="eyebrow map-games-hint">THEN PRESS START ↓</span></div>
          <button class="level-card" id="level-swamp" data-map="howling-swamp"><span class="level-name">HOWLING SWAMP 3D</span><span class="level-model">JEV · OPENROUTER</span><span class="level-harness">CHAMPION BENCHMARK</span><span class="level-sub">ENTER THE BAYOU →</span><span class="level-lock">PLAY</span></button>
          <button class="level-card selected" id="level-0" data-map="oakridge"><span class="level-num">01</span><span class="level-name">OAKRIDGE 2D</span><span class="level-model">GPT-6 ASTRA XHIGH</span><span class="level-harness">CODEX</span><span class="level-sub">SUBURBAN COUNTY</span><span class="level-lock">SELECTED</span></button>
          <button class="level-card" id="level-oakridge-3d" data-map="oakridge"><span class="level-name">OAKRIDGE 3D</span><span class="level-model">GPT-6 ASTRA XHIGH</span><span class="level-harness">CODEX</span></button>
          <button class="level-card locked" id="level-1" data-map="vice"><span class="level-num">02</span><span class="level-name">VICE BEACH 2D</span><span class="level-model">GLM 5.3 FLASH MAX</span><span class="level-harness">ZCODE</span><span class="level-sub">OCEAN DRIVE</span><span class="level-lock">LOCKED</span></button>
          <button class="level-card new-release" id="level-vice-3d" data-map="vice"><span class="level-new-badge">NEW</span><span class="level-num">02</span><span class="level-name">VICE BEACH 3D</span><span class="level-model">CLAUDE OPUS 5.5</span><span class="level-harness">CLAUDE CODE</span><span class="level-sub">OCEAN DRIVE · LAST CALL</span><span class="level-lock">READY</span></button>
          <button class="level-card" id="level-2" data-map="meridian"><span class="level-num">03</span><span class="level-name">MERIDIAN 3D</span><span class="level-model">CLAUDE FABLE 5.1 XHIGH</span><span class="level-harness">CLAUDE CODE</span><span class="level-sub">DOWNTOWN CROSSING</span><span class="level-lock">READY</span></button>
          <button class="level-card" id="level-dungeon" data-map="blackgate"><span class="level-num">04</span><span class="level-name">BLACKGATE</span><span class="level-model">SWE-2 MAX</span><span class="level-harness">DEVIN</span><span class="level-sub">HACK &amp; SLASH RPG</span><span class="level-lock">READY</span></button>
          <button class="level-card new-release" id="level-grocery" data-map="two-pines"><span class="level-new-badge">NEW</span><span class="level-num">06</span><span class="level-name">CLOSING TIME</span><span class="level-model">CLAUDE OPUS 5.5</span><span class="level-harness">CLAUDE CODE</span><span class="level-sub">TWO PINES · AFTER HOURS</span><span class="level-lock">READY</span></button>
          <button class="level-card" id="level-wasteland" data-map="ashfall"><span class="level-num">05</span><span class="level-name">ASHFALL 3D</span><span class="level-model">CLAUDE FABLE 5.1 XHIGH</span><span class="level-harness">CLAUDE CODE</span><span class="level-sub">ROUTE 9 · THE FLATS</span><span class="level-lock">READY</span></button>
        </div>
        <button id="start-button" class="primary-button" disabled><span id="start-label">PREPARING NEIGHBORHOOD</span><span>↗</span></button>
        <div class="menu-meta"><span class="status-dot"></span><span id="asset-status">BUILDING THE PERIMETER</span><span id="best-label"></span></div>
      </div>
      <aside class="mission-card"><div class="mission-top"><span>FIELD NOTES</span><span>№ 004</span></div><div class="map-symbol">⌖</div><h2 id="mission-title">Welcome to<br/>Oakridge.</h2><p id="mission-blurb">A quiet street. Good schools.<br/>Absolutely nowhere to run.</p><div class="mission-rule"></div><div class="mission-step"><b>01</b><span>Clear five waves of infected.</span></div><div class="mission-step"><b>02</b><span>Collect supplies. Watch for spitters.</span></div><div class="mission-step"><b>03</b><span>Reach the evacuation zone.</span></div><div class="mission-foot"><span>THREAT LEVEL</span><span id="mission-threat">■■■■□ SEVERE</span></div></aside>
      <footer class="menu-footer"><span>BROWSER EDITION <i>·</i> SINGLE PLAYER <i>·</i> HEADPHONES RECOMMENDED</span><span class="menu-credits"><a href="https://replit.com" target="_blank" rel="noopener">BUILT IN <b>REPLIT</b> <i>↗</i></a><a href="https://threejsassets.com" target="_blank" rel="noopener">ASSETS BY <b>THREEJSASSETS.COM</b> <i>↗</i></a></span></footer>
    </section>

    <section id="pause-screen" class="modal hidden"><div class="modal-card"><span class="eyebrow">TAKE A BREATH</span><h2>STILL ALIVE.</h2><p>The dead can wait.</p><button id="resume-button" class="primary-button"><span>KEEP GOING</span><span>↗</span></button><button id="restart-button" class="secondary-button">RESTART RUN</button><button id="quit-button" class="secondary-button">QUIT TO MAIN MENU</button><div class="controls-list"><span>WASD / ARROWS <b>Move</b></span><span>MOUSE + LEFT CLICK <b>Aim & fire</b></span><span>SHIFT / SPACE <b>Sprint / Dodge</b></span><span>R / 1 / 2 <b>Reload / Weapons</b></span><span>SCROLL <b>Zoom</b></span><span>ESC / M <b>Pause / Sound</b></span></div></div></section>
    <section id="end-screen" class="modal hidden"><div class="modal-card"><span class="eyebrow" id="end-kicker">SIGNAL LOST</span><h2 id="end-title">DEAD END.</h2><p id="end-message">You held the line. Until you didn't.</p><div class="end-stats"><div><span>ELIMINATED</span><b id="end-kills">0</b></div><div><span>TIME ALIVE</span><b id="end-time">00:00</b></div><div><span>WAVE</span><b id="end-wave">01</b></div></div><button id="next-button" class="primary-button hidden"><span id="next-label">GO TO VICE BEACH</span><span>↗</span></button><button id="retry-button" class="primary-button secondary-retry"><span id="retry-label">ONE MORE NIGHT</span><span>↗</span></button><button id="menu-button" class="secondary-button">BACK TO MAIN MENU</button></div></section>
    <section id="perk-screen" class="modal hidden"><div class="modal-card perk-card"><span class="eyebrow">STREET CLEAR · CHOOSE ONE</span><h2>FIELD UPGRADE.</h2><p>Whatever gets you through the next wave.</p><div class="perk-select" id="perk-options"></div><p class="perk-hint">PICK WITH <kbd>1</kbd><kbd>2</kbd><kbd>3</kbd> — THE NEXT WAVE HOLDS UNTIL YOU CHOOSE</p></div></section>
    <div id="mobile-controls"><div id="move-pad"><i></i></div><div id="aim-pad"><span>AIM<br/>& FIRE</span><i></i></div><button id="mobile-reload" aria-label="Reload weapon">R</button><button id="mobile-dodge" aria-label="Dodge">↗</button><button id="mobile-swap" aria-label="Switch weapon">⇄</button></div>
    <div id="fatal-error" class="modal hidden"><div class="modal-card"><span class="eyebrow">CONNECTION INTERRUPTED</span><h2>HOLD ON.</h2><p id="fatal-message"></p><a id="fatal-newtab" class="primary-button hidden" href="./" target="_blank" rel="noopener"><span>OPEN IN A NEW TAB</span><span>↗</span></a><button class="primary-button" onclick="location.reload()"><span>TRY AGAIN</span><span>↗</span></button></div></div>
  </main>
<script src="https://i.replit.com/script.js" async="" data-website-id="563b756e-dbb6-472c-86f4-d9fe05899b18"></script></body>
</html>
