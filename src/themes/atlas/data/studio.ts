import catalog from './catalog.json';

export const PROJECTS = [
  { id: 'ai', shortName: 'AI 工作室', name: '和灵感，多聊两句。', english: 'AI STUDIO', icon: 'spark', href: 'https://ai.oscarstudio.cn/', description: '让 AI 成为你的思考搭档。写作、提问、探索，一起把想法往前推一步。', action: '进入 AI Studio' },
  { id: 'teaching', shortName: '教学工具', name: '把知识，变得看得见。', english: 'LEARN & TEACH', icon: 'learn', href: 'https://edu.oscarstudio.cn/', description: '从函数图像到物理实验，让抽象的概念在眼前发生。', action: '探索教学工具' },
  { id: 'tools', shortName: '实用工具', name: '小工具，解决真问题。', english: 'EVERYDAY TOOLS', icon: 'tools', href: 'https://tools.oscarstudio.cn/', description: '写一段文字、画一张草图、整理一件小事。顺手，就很好。', action: '打开工具集' },
  { id: 'games', shortName: '益智游戏', name: '给大脑，放个小假。', english: 'PLAY A LITTLE', icon: 'game', href: 'https://games.oscarstudio.cn/', description: '在棋盘与数字之间，找回单纯的快乐。下一局，也许就有新思路。', action: '去玩一会儿' },
  { id: 'ppt', shortName: '演示文稿', name: '好想法，值得好好讲。', english: 'PRESENT YOUR IDEAS', icon: 'slides', href: 'https://ppt.oscarstudio.cn/', description: '用 HTML 演示文稿，把你的故事带到浏览器里的舞台上。', action: '探索 HTML-PPT' },
] as const;

export const CATEGORIES = [
  { id: 'all', label: '精选推荐' },
  ...PROJECTS.map(project => ({ id: project.id, label: project.shortName })),
];

// Verified snapshot of sub-sites' tools-config.json, plus AI and PPT entries.
// HTML-PPT's two legacy demo entries now return 404; only its current app is listed.
// Keep original demoFile/hash routes; no runtime cross-site catalogue request.
export const TOOLS = catalog.map(tool => {
  const project = PROJECTS.find(item => item.id === tool.category)!;
  const icons: Record<string, string> = { whiteboard: 'pen', 'markdown-editor': 'text', todo: 'check', 'scientific-calc': 'calculator', 'class-timer': 'clock', 'game-2048': 'game' };
  return { ...tool, icon: icons[tool.id] || project.icon, categoryLabel: project.shortName };
});

export function findTools(query: string, category: string) {
  const words = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  return TOOLS.filter(tool => {
    if (category !== 'all' && tool.category !== category) return false;
    if (words.length === 0 && category === 'all') return tool.featured;
    const text = [tool.name, tool.description, tool.categoryLabel, tool.category, ...tool.keywords].join(' ').toLocaleLowerCase();
    return words.every(word => text.includes(word));
  });
}
