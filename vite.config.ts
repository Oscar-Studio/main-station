import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { seoInject } from './vite-plugin-seo-inject';
import { syncCatalog } from './scripts/sync-tools-catalog.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CATALOG_PATH = path.resolve(__dirname, 'src/themes/atlas/data/catalog.json');
const OVERRIDES_PATH = path.resolve(__dirname, 'src/themes/atlas/data/catalog-overrides.json');
// 子站的工具目录文件；主站构建/开发时从这里自动同步出 catalog.json。
// 服务器上的 API 会在运行时读取同名文件实时组装，这里同步的是内置兜底快照。
const SUB_SITE_CONFIGS = ['tools', 'games', 'teaching-tools'].map(project =>
  path.resolve(__dirname, `../${project}/tools-config.json`),
);
const CATALOG_SOURCES = [...SUB_SITE_CONFIGS, OVERRIDES_PATH];

const SRC_ATLAS = path.resolve(__dirname, 'src/themes/atlas');
const SRC = path.resolve(__dirname, 'src');

export default defineConfig({
  base: '/',
  plugins: [react(), seoInject(), {
    name: 'homepage-tools-catalog',
    // 构建开始前按子站 tools-config.json 重新生成内置快照。
    // 快照只是兜底（运行时还会从 /api/ui/home-tools 拉实时目录），
    // 读不到子站配置时保留已提交的版本，不阻断构建。
    buildStart() {
      try {
        const { changed, count } = syncCatalog();
        if (changed) this.info(`工具目录已从子站同步：${count} 个工具`);
      } catch (error) {
        this.warn(`跳过工具目录同步，沿用现有快照：${(error as Error).message}`);
      }
    },
    // dev 时监听子站配置和人工精选文件，改完就重新生成并整页刷新。
    configureServer(server) {
      for (const file of CATALOG_SOURCES) server.watcher.add(file);
      let timer: ReturnType<typeof setTimeout> | undefined;
      const onChange = (file: string) => {
        if (!CATALOG_SOURCES.includes(path.resolve(file))) return;
        clearTimeout(timer);
        timer = setTimeout(() => {
          try {
            const { changed, count } = syncCatalog();
            if (!changed) return;
            server.config.logger.info(`工具目录已从子站同步：${count} 个工具`);
            server.ws.send({ type: 'full-reload' });
          } catch (error) {
            server.config.logger.error(`同步工具目录失败：${(error as Error).message}`);
          }
        }, 120);
      };
      server.watcher.on('change', onChange);
      server.watcher.on('add', onChange);
      server.watcher.on('unlink', onChange);
    },
    generateBundle() {
      // 这里重新读盘，确保拿到 buildStart 刚生成的版本。
      this.emitFile({ type: 'asset', fileName: 'homepage-tools.json', source: readFileSync(CATALOG_PATH, 'utf8') });
      // API 在服务器上运行时读取这份精选配置来实时组装目录。
      this.emitFile({ type: 'asset', fileName: 'catalog-overrides.json', source: readFileSync(OVERRIDES_PATH, 'utf8') });
    },
  }],
  resolve: {
    // 顺序很关键：先匹配 src/themes/atlas（atlas 子树专用），再回退 src。
    // atlas（crazy/4）子树里大量使用 '@/hooks/...' '@/lib/...' '@/data/...'
    // '@/components/...' 这种别名，这些文件全在 src/themes/atlas/ 下面。
    //
    // 主站（classic）代码不使用 @/ 别名（已确认），所以 SRC 兜底
    // 实际不会触发，但留着避免日后扩展时漏改。
    alias: [
      { find: '@', replacement: SRC_ATLAS },
      { find: '@', replacement: SRC },
    ],
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    // 手动拆包：
    //   - atlas chunk：crazy/4 整棵 React 树 + framer-motion / three / ogl
    //     / motion / @react-three 等。只有选了 Atlas 主页主题的用户才会下载；
    //     classic 用户首屏不带它。
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes('/src/themes/atlas/') ||
            id.includes('node_modules/framer-motion') ||
            id.includes('node_modules/motion/') ||
            id.includes('node_modules/three/') ||
            id.includes('node_modules/ogl/') ||
            id.includes('node_modules/@react-three/')
          ) {
            return 'atlas';
          }
          return undefined;
        },
      },
    },
    // 阻止 Vite 自动给 atlas chunk 加 modulepreload。
    // 默认行为下，Vite 会扫描 entry 的 dynamic import 并预加载——这会
    // 把 ~150kB 的 atlas 包塞进所有用户首屏，违背懒加载初衷。
    // Vite 内部把 manualChunks('atlas') 命名的 chunk 文件名挂成 atlas-*.js，
    // 但 modulePreload.resolveDependencies 接收的路径是相对路径，约定为
    // 'assets/<chunk>.js'。所以两种命中方式都要覆盖。
    modulePreload: {
      polyfill: false,
      resolveDependencies: (filename, deps) => {
        return deps.filter((d) => {
          return !/\batlas(-|App-)/i.test(d) && !/\batlas(-|App-)/i.test(filename);
        });
      },
    },
  },
});
