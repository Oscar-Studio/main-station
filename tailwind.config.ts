import type { Config } from 'tailwindcss';

/**
 * Tailwind v3 配置 — 服务 atlas 主题（crazy/4 集成进来的实验主题）。
 *
 * 隔离手段（两道）：
 *   1. content 只扫 src/themes/atlas/**，主站其它 .tsx 里的 className
 *      不会被识别成 utility。
 *   2. important: '#atlas-scope' —— atlas 内部编译出来的所有
 *      utility 都会自动带 #atlas-scope 前缀（CSS 选择器特异性
 *      提升到 (0,1,0)），与主站的全局样式无冲突。
 *   3. corePlugins.preflight: false —— 关闭 Tailwind 的全局
 *      reset。atlas 需要的 reset 由 globals.css 手动写在
 *      #atlas-scope 后代选择器里。
 *
 * 主站其余 UI（classic）继续走 src/styles/global.css 的普通 CSS。
 */
const config: Config = {
  content: ['./index.html', './src/themes/atlas/**/*.{ts,tsx}'],
  important: '#atlas-scope',
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        // paper / ink 主题色（rgb 形式以支持 bg-paper/60 等透明度修饰符）
        paper: 'rgb(var(--paper-rgb) / <alpha-value>)',
        'paper-2': 'rgb(var(--paper-2-rgb) / <alpha-value>)',
        'paper-3': 'rgb(var(--paper-3-rgb) / <alpha-value>)',
        // 别名（历史用法：canvas === paper）
        canvas: 'rgb(var(--paper-rgb) / <alpha-value>)',
        'canvas-soft': 'rgb(var(--paper-2-rgb) / <alpha-value>)',
        'canvas-mid': 'rgb(var(--paper-3-rgb) / <alpha-value>)',
        ink: 'var(--ink)',
        'ink-2': 'var(--ink-2)',
        hairline: 'var(--hairline)',
        'hairline-strong': 'var(--hairline-strong)',
        body: 'var(--ink-2)',
        mute: 'var(--gray-500)',
        'gray-400': 'var(--gray-400)',
        'gray-300': 'var(--gray-300)',
        accent: 'var(--accent)',
        'accent-2': 'var(--accent-2)',
        'accent-soft': 'var(--accent-soft)',
        green: 'var(--green)',
      },
      fontFamily: {
        display: ['Inter', 'Noto Sans SC', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
        serif: ['Fraunces', 'Noto Serif SC', 'Georgia', 'serif'],
      },
      fontSize: {
        'eyebrow': ['12px', { lineHeight: '16px', letterSpacing: '1.2px' }],
        'label-mono': ['14px', { lineHeight: '20px', letterSpacing: '1.4px' }],
        'display-xs': ['20px', { lineHeight: '28px', letterSpacing: '-0.01em' }],
        'display-sm': ['32px', { lineHeight: '36px', letterSpacing: '-0.02em' }],
        'display-md': ['48px', { lineHeight: '52px', letterSpacing: '-0.025em' }],
        'display-lg': ['72px', { lineHeight: '76px', letterSpacing: '-0.03em' }],
        'display-xl': ['96px', { lineHeight: '96px', letterSpacing: '-0.04em' }],
        'display-2xl': ['128px', { lineHeight: '124px', letterSpacing: '-0.04em' }],
      },
      borderRadius: {
        pill: '9999px',
        card: '12px',
        tile: '4px',
      },
      transitionTimingFunction: {
        snap: 'cubic-bezier(0.22, 1, 0.36, 1)',
        gentle: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      maxWidth: {
        container: '1280px',
        'container-wide': '1440px',
      },
      screens: {
        // 覆盖默认 lg=1024 让 md/lg 排序正确（否则 md:grid-cols-2 会在 lg 后覆盖）
        lg: '1100px',
      },
    },
  },
  plugins: [],
};

export default config;