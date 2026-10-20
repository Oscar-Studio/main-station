import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import { createServer } from 'vite';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
after(() => server.close());
const { findTools, TOOLS, PROJECTS } = await server.ssrLoadModule('/src/themes/atlas/data/studio.ts');

test('initial and whitespace searches show the six curated tools', () => {
  const expected = ['whiteboard', 'markdown-editor', 'todo', 'scientific-calc', 'class-timer', 'game-2048'];
  assert.deepEqual(findTools('', 'all').map(tool => tool.id), expected);
  assert.deepEqual(findTools('  ', 'all').map(tool => tool.id), expected);
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
  assert.equal(findTools('', 'all').length, 6);
});

test('catalog preserves hash and Unicode routes and excludes retired demos', () => {
  assert.equal(findTools('白板', 'all')[0].href, 'https://tools.oscarstudio.cn/#/whiteboard');
  assert.equal(findTools('科学计算器', 'all')[0].href, 'https://edu.oscarstudio.cn/科学计算器/index.html');
  assert.equal(findTools('', 'ppt').length, 1);
  assert.equal(findTools('', 'ppt')[0].href, 'https://ppt.oscarstudio.cn/');
  assert.equal(new Set(TOOLS.map(tool => tool.id)).size, TOOLS.length);
  for (const tool of TOOLS) {
    const project = PROJECTS.find(project => project.id === tool.category);
    assert.equal(new URL(tool.href).origin, new URL(project.href).origin);
  }
});

test('Atlas renders Chinese content, shared SDK container and six tool links', async () => {
  const { default: Atlas } = await server.ssrLoadModule('/src/themes/atlas/ThemeApp.tsx');
  const html = renderToStaticMarkup(createElement(Atlas));
  assert.match(html, /id="atlas-scope" data-theme="paper"/);
  assert.match(html, /让灵感，/);
  assert.match(html, /id="userButtonContainer"/);
  assert.equal((html.match(/class="st-tool"/g) || []).length, 6);
  assert.doesNotMatch(html, /<canvas|opilot · live preview|All systems operational/);
});

test('classic remains selectable and renders its original five sections', async () => {
  const previous = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: {
    getItem: key => key === 'oscar-home-theme' ? 'classic' : null,
  } });
  try {
    const { default: App } = await server.ssrLoadModule('/src/App.tsx');
    const { I18nProvider } = await server.ssrLoadModule('/src/i18n/I18nProvider.tsx');
    const html = renderToStaticMarkup(createElement(I18nProvider, null, createElement(App)));
    assert.doesNotMatch(html, /id="atlas-scope"/);
    assert.match(html, /id="userButtonContainer"/);
    for (const id of ['ai', 'teaching-tools', 'tools', 'games', 'html-ppt']) assert.ok(html.includes(`id="${id}"`));
  } finally {
    if (previous) Object.defineProperty(globalThis, 'localStorage', previous);
    else delete globalThis.localStorage;
  }
});
