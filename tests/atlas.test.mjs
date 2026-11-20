import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import { createServer } from 'vite';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
after(() => server.close());
const { findTools, TOOLS, PROJECTS } = await server.ssrLoadModule('/src/themes/atlas/data/studio.ts');

test('initial and whitespace searches show the default curated tools', () => {
  const expected = ['whiteboard', 'markdown-editor', 'todo', 'data-stats', 'scientific-calc', 'class-timer', 'game-2048'];
  assert.deepEqual(findTools('', 'all').map(tool => tool.id), expected);
  assert.deepEqual(findTools('  ', 'all').map(tool => tool.id), expected);
});

test('account selections retain saved order and skip missing or duplicate tools', () => {
  const ids = ['game-2048', 'retired-tool', 'whiteboard', 'game-2048'];
  assert.deepEqual(findTools('', 'all', ids).map(tool => tool.id), ['game-2048', 'whiteboard']);
  assert.deepEqual(findTools('', 'all', ['retired-tool']), findTools('', 'all'));
  assert.deepEqual(findTools('计算器', 'all', ids), findTools('计算器', 'all'));
  assert.deepEqual(findTools('', 'games', ids), findTools('', 'games'));
});

test('search covers Chinese names, descriptions, English and multiple keywords', () => {
  assert.deepEqual(findTools('计算器', 'all').map(tool => tool.name), ['科学计算器', '浓度计算器']);
  assert.deepEqual(findTools('MARKDOWN', 'all').map(tool => tool.id), ['markdown-editor', 'todo']);
  assert.equal(findTools('MD5 哈希', 'tools')[0].id, 'codec');
  assert.equal(findTools('数学', 'teaching').some(tool => tool.id === 'linear-function'), true);
});

test('category filters combine with search and cover every project', () => {
  assert.equal(findTools('计算器', 'tools').length, 0);
  assert.equal(findTools('计算器', 'teaching').length, 2);
  assert.equal(findTools('', 'games').length, 15);
  for (const project of PROJECTS) {
    const results = findTools('', project.id);
    assert.ok(results.length > 0);
    assert.ok(results.every(tool => tool.category === project.id));
  }
});

test('no matches and clearing filters return the appropriate states', () => {
  assert.equal(findTools('不存在xyz', 'all').length, 0);
  assert.equal(findTools('', 'all').length, 7);
});

test('catalog preserves hash and Unicode routes and excludes retired demos', () => {
  assert.equal(findTools('白板', 'all')[0].href, 'https://tools.oscarstudio.cn/#/whiteboard');
  assert.equal(findTools('科学计算器', 'all')[0].href, 'https://edu.oscarstudio.cn/科学计算器/index.html');
  assert.equal(findTools('', 'ppt').length, 0);
  assert.equal(TOOLS.some(tool => tool.href.includes('ppt.oscarstudio.cn')), false);
  assert.equal(new Set(TOOLS.map(tool => tool.id)).size, TOOLS.length);
  for (const tool of TOOLS) {
    const project = PROJECTS.find(project => project.id === tool.category);
    assert.equal(new URL(tool.href).origin, new URL(project.href).origin);
  }
});

test('Atlas renders Chinese content, shared SDK container and default tool links', async () => {
  const { default: Atlas } = await server.ssrLoadModule('/src/themes/atlas/ThemeApp.tsx');
  const html = renderToStaticMarkup(createElement(Atlas));
  assert.match(html, /id="atlas-scope" data-theme="paper"/);
  assert.match(html, /让灵感，/);
  assert.match(html, /id="userButtonContainer"/);
  assert.equal((html.match(/class="st-tool"/g) || []).length, 7);
  assert.match(html, /\/user\/settings#featured/);
  assert.doesNotMatch(html, /<canvas|opilot · live preview|All systems operational/);
});

test('the app displays the studio loading screen while the lazy homepage loads', async () => {
  const { default: App } = await server.ssrLoadModule('/src/App.tsx');
  const html = renderToStaticMarkup(createElement(App));
  assert.match(html, /Oscar Studio/);
  assert.doesNotMatch(html, /id="atlas-scope"/);
});
