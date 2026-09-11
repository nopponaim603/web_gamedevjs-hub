const DICT = {
  tagline: {
    en: "Dip. Draw. Claim. Cut their trail before they cut yours.",
    zh: "蘸墨、画弧、晕染圈地——在被切之前，切断他们的尾巴。",
  },
  play: { en: "PLAY", zh: "开始对局" },
  friends: { en: "PLAY\x20WITH\x20FRIENDS", zh: "和朋友玩" },
  skins: { en: "Brushes", zh: "笔头" },
  how: { en: "How to play", zh: "玩法" },
  nickname: { en: "Your name", zh: "你的名字" },
  frTitle: { en: "Friends arena", zh: "好友竞技场" },
  host: { en: "CREATE ROOM", zh: "创建房间" },
  or: { en: "— or join with a code —", zh: "— 或输入房间码加入 —" },
  joinCode: { en: "ROOM\x20CODE", zh: "房间码" },
  joinGo: { en: "JOIN", zh: "加入" },
  back: { en: "Back", zh: "返回" },
  room: { en: "Room", zh: "房间" },
  shareHint: {
    en: "Share\x20the\x20link\x20—\x20friends\x20drop\x20straight\x20into\x20your\x20arena.\x20Bots\x20fill\x20the\x20rest.",
    zh: "把链接发给朋友，点开直接进你的竞技场；空位由\x20bot\x20补齐。",
  },
  copyLink: { en: "COPY INVITE LINK", zh: "复制邀请链接" },
  copied: { en: "Copied!", zh: "已复制！" },
  roomGo: { en: "START", zh: "开打" },
  waitingHost: { en: "Waiting for host to start…", zh: "等房主开局…" },
  connecting: { en: "Connecting…", zh: "连接中…" },
  reconnecting: { en: "Reconnecting…", zh: "重连中…" },
  offline: {
    en: "Practice arena (offline) — bots only",
    zh: "练习场（离线）— 全员 bot",
  },
  onlineN: {
    en: (q) => "Online · " + q + " player" + (q > 1 ? "s" : ""),
    zh: (q) => "在线 · " + q + " 名真人",
  },
  skTitle: { en: "Brush heads", zh: "笔头皮肤" },
  howTitle: { en: "How\x20to\x20play", zh: "玩法" },
  howItems: {
    en: [
      "Drag anywhere to steer. You never stop moving.",
      "Leave your color, draw a line, and loop back home — everything you enclosed gets washed in your ink.",
      "Your ink meter drains outside. Empty = crawling. Refill at home.",
      "Run\x20over\x20ANY\x20wet\x20trail\x20to\x20cut\x20it\x20—\x20its\x20owner\x20bursts.\x20Yours\x20included.",
      "Second\x20finger\x20(or\x20Shift)\x20=\x20boost.\x20It\x20burns\x20ink\x20fast.",
      "Final 15 s: boost is free. Go berserk.",
      "Most territory when the timer ends wins the round.",
    ],
    zh: [
      "任意位置拖动转向，小笔尖永不停下。",
      "冲出领地画一笔，绕回自己颜色——圈住的一切都会被你的墨晕染。",
      "出圈耗墨，墨尽变慢爬行；回家蘸墨恢复。",
      "碾过任何湿尾巴都会切断它——主人当场爆浆（包括你自己的尾巴）。",
      "第二根手指（或 Shift）= 加速冲刺，超费墨。",
      "最后\x2015\x20秒加速免费，放开抢！",
      "计时结束时领地最大者赢下本局。",
    ],
  },
  tut1: {
    en: "Drag to steer — dash out of your puddle",
    zh: "拖动转向——冲出你的小色块",
  },
  tut2: {
    en: "Loop back to your color to CLAIM",
    zh: "绕回自己的颜色——晕染圈地！",
  },
  tut3: {
    en: "Ink\x20low\x20=\x20slow.\x20Refill\x20at\x20home",
    zh: "墨条见底会变慢，回家蘸墨",
  },
  tut4: {
    en: "Cross a wet trail to CUT its owner",
    zh: "碾断别人的湿尾巴=击杀",
  },
  frenzy: { en: "FREE BOOST!", zh: "加速免费！" },
  roundOver: { en: "ROUND OVER", zh: "本局结束" },
  nextIn: {
    en: (q) => "Next round in " + q + "…",
    zh: (q) => q + " 秒后下一局…",
  },
  youBest: {
    en: (q, Z) => "You:\x20" + q + " cuts · peak " + (Z / 100).toFixed(1) + "%",
    zh: (q, Z) =>
      "你：切杀 " + q + "\x20·\x20峰值\x20" + (Z / 100).toFixed(1) + "%",
  },
  spectating: {
    en: "Out\x20for\x20this\x20round\x20—\x20watching\x20the\x20finale",
    zh: "本局出局——观战到结算",
  },
  respawnIn: {
    en: (q) => "Respawn in " + q + "…",
    zh: (q) => q + " 秒后重生…",
  },
  cutBy: {
    en: (q, Z) => q + " cut " + Z + "!",
    zh: (q, Z) => q + " 切断了 " + Z + "！",
  },
  selfCut: {
    en: (q) => q + "\x20tripped\x20on\x20their\x20own\x20trail",
    zh: (q) => q + " 踩了自己的尾巴",
  },
  headon: {
    en: (q, Z) => q + " crashed into " + Z,
    zh: (q, Z) => q + "\x20撞上了\x20" + Z,
  },
  claimed: { en: (q) => "+" + q + "%", zh: (q) => "+" + q + "%" },
  youDied: { en: "SPLAT!", zh: "爆浆了！" },
  lead: {
    en: (q) => q + "\x20takes\x20the\x20lead!",
    zh: (q) => q + "\x20登顶！",
  },
  win: { en: (q) => q + " wins the round!", zh: (q) => q + "\x20赢下本局！" },
  stats: {
    en: (q, Z) => "wins " + q + "\x20·\x20cuts\x20" + Z,
    zh: (q, Z) => "胜场 " + q + "\x20·\x20切杀\x20" + Z,
  },
  skinNames: {
    en: {
      drop: "Droplet",
      cat: "Cat\x20paw",
      koi: "Koi",
      plane: "Paper plane",
      gingko: "Gingko",
      lantern: "Lantern",
      brush: "Old brush",
      fish: "Goldfish",
    },
    zh: {
      drop: "墨滴",
      cat: "猫爪",
      koi: "锦鲤",
      plane: "纸飞机",
      gingko: "银杏",
      lantern: "灯笼",
      brush: "毛笔",
      fish: "金鱼",
    },
  },
  skinLocks: {
    en: {
      cat: "Claim 5,000 cells",
      koi: "Claim 20,000 cells",
      plane: "10 cuts",
      gingko: "50\x20cuts",
      lantern: "Peak\x2015%\x20in\x20a\x20round",
      brush: "Win a round",
      fish: "Win 10 rounds",
    },
    zh: {
      cat: "累计圈地\x205000\x20格",
      koi: "累计圈地\x2020000\x20格",
      plane: "累计切杀 10",
      gingko: "累计切杀\x2050",
      lantern: "单局峰值 15%",
      brush: "赢 1 局",
      fish: "赢 10 局",
    },
  },
};
let lang = "en";
try {
  const nav = (navigator.language || "").toLowerCase();
  if (nav.startsWith("zh")) lang = "zh";
} catch {}
export const i18n = {
  get lang() {
    return lang;
  },
  set lang(q) {
    lang = q === "zh" ? "zh" : "en";
  },
  toggle() {
    lang = lang === "zh" ? "en" : "zh";
  },
  t(q, ...Z) {
    const V = _oms83vf_c,
      e = DICT[q];
    if (!e) return q;
    const D = e[lang] ?? e.en;
    return typeof D === V(236) ? D(...Z) : D;
  },
};
