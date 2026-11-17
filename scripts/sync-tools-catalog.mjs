// 生成主站内置的工具目录快照（catalog.json）。
//
// 真正的组装逻辑在 API/libs/toolsCatalog.js：首页运行时由 /api/ui/home-tools 实时返回，
// 这个脚本只在构建时把同一份结果写进 src/themes/atlas/data/catalog.json，
// 用于首屏渲染和 API 不可达时的兜底。
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const CATALOG_PATH = path.join(scriptDir, '../src/themes/atlas/data/catalog.json');

let catalogModule = null;
function loadCatalogModule() {
  // 组装逻辑与 API 共用；延迟加载，缺文件时由调用方决定是报错还是跳过。
  if (!catalogModule) catalogModule = require('../../API/libs/toolsCatalog.js');
  return catalogModule;
}

/**
 * 重新生成 catalog.json。check=true 时只比对、不写盘。
 * @returns {{ changed: boolean, count: number }}
 */
export function syncCatalog({ check = false } = {}) {
  const tools = loadCatalogModule().assembleSync();
  const next = `${JSON.stringify(tools, null, 2)}\n`;
  let current = null;
  try {
    current = readFileSync(CATALOG_PATH, 'utf8');
  } catch {
    current = null;
  }
  if (current === next) return { changed: false, count: tools.length };
  if (!check) writeFileSync(CATALOG_PATH, next);
  return { changed: true, count: tools.length };
}

const runDirectly = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (runDirectly) {
  if (process.argv.includes('--check')) {
    const { changed, count } = syncCatalog({ check: true });
    if (changed) {
      console.error('工具目录已过期，请运行 npm run sync:catalog');
      process.exit(1);
    }
    console.log(`工具目录与子站一致：${count} 个工具`);
  } else {
    const { changed, count } = syncCatalog();
    console.log(changed ? `工具目录已同步：${count} 个工具` : `工具目录已是最新：${count} 个工具`);
  }
}
