// Static copy & data — ported from crazy/2/script.js and index.html

export const SITE = {
  brand: 'Oscar Studio',
  title: 'Tools for thinkers, makers, teachers, players.',
  sub: 'A studio building instruments for AI, teaching, presentation, and play. Every tool is open, sharp, and made to disappear into your work.',
  icp: 'OSCAR STUDIO · SHANGHAI · 2026',
  version: 'v2.0 · redrawn',
  marqueeText: 'AI · TEACHING · HTML-PPT · GAMES · OPEN SOURCE · BUILT IN SHANGHAI · 2026 — ',
} as const;

export interface NavLink {
  href: string;
  label: string;
  cursor: string;
  external?: boolean;
}

export interface ModuleCard {
  id: string;
  label: string;
  index: number;
  tagline: string;
  name: string;
  desc: string;
  external?: boolean;
  href?: string;
  cursor?: string;
}

export const NAV_LINKS: readonly NavLink[] = [
  { href: '#ai', label: 'AI', cursor: 'AI' },
  { href: '#teaching', label: 'Teaching', cursor: 'Teaching' },
  { href: 'https://tools.oscarstudio.cn', label: 'Tools', cursor: 'Open', external: true },
  { href: '#games', label: 'Games', cursor: 'Games' },
  { href: '#ppt', label: 'HTML-PPT', cursor: 'HTML-PPT' },
  { href: 'https://docs.oscarstudio.cn', label: 'Docs ↗', cursor: 'Open', external: true },
];

export const MODULES: readonly ModuleCard[] = [
  { id: 'ai', label: 'AI', index: 1, tagline: 'ai.oscarstudio.cn', name: 'AI Tools', desc: 'Conversations, augmented with multi-model routing.' },
  { id: 'teaching', label: 'Teaching', index: 2, tagline: 'edu.oscarstudio.cn', name: 'Teaching Tools', desc: '17+ HTML instruments for the classroom.' },
  { id: 'tools', label: 'Tools', index: 3, tagline: 'tools.oscarstudio.cn', name: 'Tools', desc: 'Quick utilities for everyday work — converters, generators, and tiny scripts.' },
  { id: 'games', label: 'Games', index: 4, tagline: 'games.oscarstudio.cn', name: 'Games', desc: 'Quiet puzzles for restless evenings.' },
  { id: 'ppt', label: 'HTML-PPT', index: 5, tagline: 'ppt.oscarstudio.cn', name: 'HTML-PPT', desc: 'Slides that breathe, in pure HTML.' },
];

export const NEURAL_TAGS = [
  'DeepSeek',
  '文心一言',
  'MiniMax',
  'GPT-4o',
  'Claude',
  'Gemini',
  'Qwen',
  'Llama',
] as const;

export const NEURAL_STATS = [
  { num: 6, label: 'models' },
  { num: 128, label: 'k tokens / day' },
  { num: 42, label: 'ms avg latency' },
] as const;

export const TYPING_DEMO = {
  title: 'opilot · live preview',
  initialPrompt: 'Draft a syllabus for an intro to design systems',
  initialResponse:
    'Module 01 — Foundations · What design systems are, why they exist, and what they are not. Module 02 — Tokens · Color, type, space, motion — the atoms. Module 03 — Components · Patterns that compose tokens into reusable building blocks. Module 04 — Documentation · How to write the manual your team will actually read.',
  suggestions: [
    'Explain quantum entanglement like I\'m twelve',
    'Write a haiku about Shanghai at midnight',
    'Draft a syllabus for intro to design systems',
  ],
} as const;

export const TOOLS = [
  {
    name: '摘词本',
    desc: '英语单词背诵与复习，基于 FSRS 自适应复习算法。',
    icon: 'notebook',
    featured: true,
  },
  {
    name: 'Scientific Calculator',
    desc: 'Algebra, trigonometry, unit conversions — sharp and offline.',
    icon: 'calc',
  },
  {
    name: 'Countdown Timer',
    desc: 'Big-screen friendly, with fullscreen mode.',
    icon: 'clock',
  },
  {
    name: 'Stopwatch',
    desc: 'Lap times, splits, exports to your clipboard.',
    icon: 'stopwatch',
  },
  {
    name: 'Group Splitter',
    desc: 'Divide any roster into balanced teams.',
    icon: 'group',
  },
  {
    name: 'Scoreboard',
    desc: 'Track scores across rounds, export to CSV.',
    icon: 'board',
  },
  {
    name: 'Random Name Picker',
    desc: 'A tiny fairness engine for the classroom.',
    icon: 'dice',
  },
] as const;

// Teaser cards for the standalone Tools sub-site (tools.oscarstudio.cn).
// Kept short on purpose — full catalogue lives there.
export const UTILS = [
  { name: '编解码器', desc: 'Base64 / URL / Hex / Unicode / HTML / ROT13 / Punycode, plus MD5 / SHA 哈希。全部本地运行,不传数据。', icon: '🔐', slug: 'codec' },
  { name: '密码生成器', desc: '强密码 + Diceware 助记密码 + zxcvbn 强度评估 + 批量生成 + 历史记录。', icon: '🔑', slug: 'password-generator' },
  { name: '白板', desc: '基于 tldraw 的无限画布:画笔、形状、文本、图片、自动保存,登录后云端同步。', icon: '🎨', slug: 'whiteboard' },
  { name: 'Markdown 编辑器', desc: '支持 LaTeX 公式,可导出图片,自定义配色,适合写文档和笔记。', icon: '📝', slug: 'markdown-editor' },
  { name: '待办清单', desc: '极简待办:优先级、截止、分组、子任务、标签、Markdown 备注。本地保存,登录后云同步。', icon: '✅', slug: 'todo' },
  { name: 'JSON 工具', desc: '格式化、校验、路径查询 (JSONPath)、差异对比、模拟生成,开发日常一键到位。', icon: '🧩', slug: 'json' },
] as const;

export const DECK_SLIDES = [
  {
    meta: '01 / 03 · cover',
    eyebrow: 'A studio keynote',
    title: 'The web\nis a stage.',
    visual: 'orb',
  },
  {
    meta: '02 / 03 · principle',
    eyebrow: 'Principle 01',
    title: 'Layout is\ntiming.',
    body: 'Each transition is a sentence. Each sentence has a beat. We compose them by hand.',
    visual: 'bars',
  },
  {
    meta: '03 / 03 · demo',
    eyebrow: 'Live',
    title: 'Press Space\nto advance.',
    body: 'Or click anywhere on the deck. Yes, anywhere.',
    visual: 'grid',
  },
] as const;

export const GAMES = [
  {
    name: 'Chinese Chess',
    desc: 'Tradition, on a 9×10 board.',
    href: 'https://games.oscarstudio.cn',
    visual: 'xiangqi',
  },
  {
    name: 'Gomoku',
    desc: 'Five in a row. Logic, not luck.',
    href: 'https://games.oscarstudio.cn',
    visual: 'gomoku',
  },
  {
    name: '24 Points',
    desc: 'Make 24 from any four numbers.',
    href: 'https://games.oscarstudio.cn',
    visual: 'twentyfour',
  },
  {
    name: '2048',
    desc: 'Combine tiles. Reach the number.',
    href: 'https://games.oscarstudio.cn',
    visual: 'tt2048',
  },
] as const;

export const LEADERBOARD = [
  { rank: '01', name: '夜莺', score: '2,408' },
  { rank: '02', name: 'buildbot', score: '2,184' },
  { rank: '03', name: '汤圆', score: '1,962' },
  { rank: '04', name: 'ada.z', score: '1,807' },
  { rank: '05', name: 'Oscar', score: '1,733' },
  { rank: '06', name: 'kelp', score: '1,612' },
  { rank: '07', name: 'paperboat', score: '1,540' },
] as const;

export const FOOTER = {
  brandTag: 'An independent studio building small, sharp instruments for thinking and making.',
  beian: '粤ICP备2026012488号-1',
  beianUrl: 'https://beian.miit.gov.cn/',
  statusText: 'All systems operational',
  rights: 'Made in Shanghai, with care.',
} as const;