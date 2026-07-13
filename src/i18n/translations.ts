export const translations = {
  zh: {
    brand: 'Oscar Studio',
    navAi: 'AI 工具',
    navTeaching: '教学工具',
    navPpt: 'HTML-PPT',
    navGames: '益智游戏',
    navFeedback: '反馈',
    navDocs: '文档',
    navCta: 'Oscar Studio 高定服务',
    opilotLabel: 'Opilot',
    langZh: '简体中文',
    langEn: 'English',
    heroTitle: 'Oscar Studio',
    heroSubtitle: '专注于提升教学和学习质量',
    heroPrimary: '开始探索',
    heroSecondary: '加入我们',
    aiTitle: 'AI 工具',
    aiDesc: '集成多种先进 AI 模型，包括 DeepSeek 和 MiniMax，为您提供智能问答、文本生成、语音合成等全方位 AI 服务。简洁易用的界面让您轻松享受人工智能带来的便利，无论是学习、工作还是创意写作，都能为您提供有力的支持。',
    aiAction: 'Explore',
    teachingTitle: '教学工具',
    teachingDesc: '丰富的 HTML 演示工具，专为教师和学生设计。包含函数图像绘制、几何图形演示、化学方程式配平、计时器、抽签器等多种实用工具，让抽象的知识变得直观可见，使课堂教学更加生动有趣，提升学习效率。',
    teachingAction: 'Explore',
    pptTitle: 'HTML-PPT',
    pptDesc: '创新的网页版 PPT 演示方案，使用纯 HTML、CSS 和 JavaScript 构建。无需安装任何软件，直接在浏览器中展示您的演示文稿。支持动画效果、响应式布局，让您的演讲更加流畅专业。跨越平台限制，随时随地精彩呈现。',
    pptAction: 'Explore',
    gamesTitle: '益智游戏',
    gamesDesc: '精心设计的益智游戏集合，包括中国象棋、国际象棋、五子棋、24点等多种经典游戏。在娱乐中锻炼思维能力和逻辑推理能力，适合各个年龄段的用户。简洁美观的界面和流畅的操作体验，让游戏时光更加愉快。',
    gamesAction: 'Explore',
    footerCopy: 'Oscar Studio © 2026',
    footerGithub: 'GitHub 仓库',
    footerIcp: '粤ICP备2026012488号-1',
    backToTopAria: '回到顶部',
  },
  en: {
    brand: 'Oscar Studio',
    navAi: 'AI Tools',
    navTeaching: 'Teaching Tools',
    navPpt: 'HTML-PPT',
    navGames: 'Games',
    navFeedback: 'Feedback',
    navDocs: 'Docs',
    navCta: 'Oscar Studio Premium',
    opilotLabel: 'Opilot',
    langZh: '简体中文',
    langEn: 'English',
    heroTitle: 'Oscar Studio',
    heroSubtitle: 'Focused on improving teaching and learning quality',
    heroPrimary: 'Start Exploring',
    heroSecondary: 'Join Us',
    aiTitle: 'AI Tools',
    aiDesc: 'Integrating advanced AI models including DeepSeek and MiniMax, providing comprehensive AI services such as intelligent Q&A, text generation, and speech synthesis. The clean and easy-to-use interface lets you enjoy the convenience of artificial intelligence for learning, work, and creative writing.',
    aiAction: 'Explore',
    teachingTitle: 'Teaching Tools',
    teachingDesc: 'A rich collection of HTML presentation tools designed for teachers and students. Includes function plotting, geometry demonstrations, chemical equation balancing, timers, random selectors, and more. Makes abstract knowledge intuitive and classroom teaching more engaging.',
    teachingAction: 'Explore',
    pptTitle: 'HTML-PPT',
    pptDesc: 'An innovative web-based PPT presentation solution built with pure HTML, CSS, and JavaScript. No software installation needed — just present directly in your browser. Supports animations and responsive layouts for smoother, more professional presentations.',
    pptAction: 'Explore',
    gamesTitle: 'Puzzle Games',
    gamesDesc: 'A carefully designed collection of puzzle games including Chinese Chess, International Chess, Gomoku, 24 Points, and more. Exercise your thinking and logical reasoning skills while having fun. Suitable for all ages with a clean interface and smooth experience.',
    gamesAction: 'Explore',
    footerCopy: 'Oscar Studio © 2026',
    footerGithub: 'GitHub',
    footerIcp: 'ICP License',
    backToTopAria: 'Back to top',
  },
} as const;

export type Lang = keyof typeof translations;
export type TranslationKey = keyof typeof translations.zh;

export const ALLOWED: readonly Lang[] = ['zh', 'en'] as const;
export const STORAGE_KEY = 'lang';

export function readInitialLang(): Lang {
  if (typeof window === 'undefined') return 'zh';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return ALLOWED.includes(stored as Lang) ? (stored as Lang) : 'zh';
}
