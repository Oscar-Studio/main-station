import fs from 'node:fs';
import path from 'node:path';
import type { Plugin } from 'vite';
import { SITE, MODULES, UTILS } from './src/themes/atlas/data/content';

/**
 * 主站 SEO：静态注入 + sitemap/robots 生成
 *
 * 为什么要注入：主站 dist/index.html 里原本一个 <a> 都没有，指向 5 个子站的链接
 * 全部在 React 组件里，爬虫不执行 JS 就发现不了任何子站。注入后首页源码里
 * 直接带站名、描述和链接。
 *
 * 挂在 Vite 插件上而非 npm postbuild：main-station 的 deploy 会构建两次
 * （predeploy 一次，sync-site.sh 内一次），插件天然幂等。只在 build 生效。
 */

const DOMAIN = 'oscarstudio.cn';

const META = {
  title: 'Oscar Studio - AI、教学、演示与游戏工具集',
  description:
    'Oscar Studio 是一间做小而锋利工具的独立工作室：AI Studio 多模型对话、教学工具集（函数图像、几何画板、化学方程式配平）、HTML-PPT 在线演示编辑器、益智游戏集与实用工具集，全部免安装、打开即用。',
  keywords:
    'Oscar Studio,AI工具,教学工具,HTML PPT,演示文稿,益智游戏,在线工具,数独,2048,函数图像',
};

function escapeHtml(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** UTILS 的深链规则与 src/themes/atlas/components/sections/ModuleTools.tsx 保持一致 */
function utilHref(slug: string): string {
  return slug === 'whiteboard'
    ? 'https://tools.oscarstudio.cn/#/whiteboard'
    : `https://tools.oscarstudio.cn/${slug}`;
}

function buildStaticHtml(): string {
  const moduleItems = MODULES.map(
    (m) =>
      `    <li><a href="https://${escapeHtml(m.tagline)}">${escapeHtml(m.name)}</a>` +
      `<span class="seo-desc">${escapeHtml(m.desc)}</span></li>`
  ).join('\n');

  const utilItems = UTILS.map(
    (u) =>
      `    <li><a href="${escapeHtml(utilHref(u.slug))}">${escapeHtml(u.name)}</a>` +
      `<span class="seo-desc">${escapeHtml(u.desc)}</span></li>`
  ).join('\n');

  return `<style>
  .seo-static{max-width:960px;margin:0 auto;padding:48px 24px;line-height:1.7}
  .seo-static h1{font-size:28px;margin:0 0 8px}
  .seo-static .seo-intro{margin:0 0 24px;opacity:.72}
  .seo-static h2{font-size:18px;margin:28px 0 10px;opacity:.85}
  .seo-static ul{list-style:none;margin:0;padding:0;display:grid;gap:10px}
  .seo-static li{border:1px solid rgba(127,127,127,.35);border-radius:10px;padding:12px 14px}
  .seo-static a{font-weight:600;text-decoration:none}
  .seo-static .seo-desc{display:block;font-size:14px;opacity:.7}
</style>
<div class="seo-static">
  <h1>${escapeHtml(SITE.brand)}</h1>
  <p class="seo-intro">${escapeHtml(SITE.sub)}</p>
  <h2>子站导航</h2>
  <ul>
${moduleItems}
  </ul>
  <h2>实用工具精选</h2>
  <ul>
${utilItems}
  </ul>
</div>`;
}

function buildSitemap(lastmod: string): string {
  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `  <url><loc>https://${DOMAIN}/</loc><lastmod>${lastmod}</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>\n` +
    `</urlset>\n`
  );
}

function buildRobots(): string {
  return `User-agent: *\nAllow: /\n\nSitemap: https://${DOMAIN}/sitemap.xml\n`;
}

export function seoInject(): Plugin {
  let outDir = '';

  return {
    name: 'oscar-seo-inject',
    apply: 'build',

    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
    },

    transformIndexHtml: {
      order: 'post',
      handler(html) {
        const replaced = html.replace(
          /<div(\s+)id=["']root["'](\s*)>\s*<\/div>/i,
          (_m, a, b) => `<div${a}id="root"${b}>${buildStaticHtml()}</div>`
        );
        if (replaced === html) {
          this.warn('未找到空的 <div id="root"></div>，静态内容未注入');
        }
        return replaced;
      },
    },

    closeBundle() {
      const lastmod = new Date().toISOString().slice(0, 10);
      fs.writeFileSync(path.join(outDir, 'sitemap.xml'), buildSitemap(lastmod), 'utf8');
      fs.writeFileSync(path.join(outDir, 'robots.txt'), buildRobots(), 'utf8');
    },
  };
}

export { META };
