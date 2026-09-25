import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SRC_ATLAS = path.resolve(__dirname, 'src/themes/atlas');
const SRC = path.resolve(__dirname, 'src');

export default defineConfig({
  base: '/',
  plugins: [react()],
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