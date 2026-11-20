import catalog from './catalog.json';

export const PROJECTS = [
  { id: 'ai', shortName: 'AI 工作室', name: '和灵感，多聊两句。', english: 'AI STUDIO', icon: 'spark', href: 'https://ai.oscarstudio.cn/', description: '让 AI 成为你的思考搭档。写作、提问、探索，一起把想法往前推一步。', action: '进入 AI Studio' },
  { id: 'teaching', shortName: '教学工具', name: '把知识，变得看得见。', english: 'LEARN & TEACH', icon: 'learn', href: 'https://edu.oscarstudio.cn/', description: '从函数图像到物理实验，让抽象的概念在眼前发生。', action: '探索教学工具' },
  { id: 'tools', shortName: '实用工具', name: '小工具，解决真问题。', english: 'EVERYDAY TOOLS', icon: 'tools', href: 'https://tools.oscarstudio.cn/', description: '写一段文字、画一张草图、整理一件小事。顺手，就很好。', action: '打开工具集' },
  { id: 'games', shortName: '益智游戏', name: '给大脑，放个小假。', english: 'PLAY A LITTLE', icon: 'game', href: 'https://games.oscarstudio.cn/', description: '在棋盘与数字之间，找回单纯的快乐。下一局，也许就有新思路。', action: '去玩一会儿' },
] as const;

export const CATEGORIES = [
  { id: 'all', label: '精选推荐' },
  ...PROJECTS.map(project => ({ id: project.id, label: project.shortName })),
];

export interface ToolEntry {
  id: string;
  name: string;
  description: string;
  category: string;
  href: string;
  keywords: string[];
  featured: boolean;
}

export interface Tool extends ToolEntry {
  icon: string;
  categoryLabel: string;
}

const TOOL_ICONS: Record<string, string> = { whiteboard: 'pen', 'markdown-editor': 'text', todo: 'check', 'scientific-calc': 'calculator', 'class-timer': 'clock', 'game-2048': 'game' };

// catalog.json 是构建时生成的内置快照（来自三个子站的 tools-config.json），不要手改。
// 运行时 ThemeApp 会再从 /api/ui/home-tools 拉取实时目录替换它。
export function createToolCatalog(entries: readonly ToolEntry[]) {
  const tools: Tool[] = entries.flatMap(entry => {
    const project = PROJECTS.find(item => item.id === entry.category);
    if (!project) return [];
    return [{ ...entry, icon: TOOL_ICONS[entry.id] || project.icon, categoryLabel: project.shortName }];
  });
  const byId = new Map(tools.map(tool => [tool.id, tool]));
  const byHref = new Map(tools.map(tool => [tool.href, tool.id]));

  function find(query: string, category: string, featuredIds: string[] = []): Tool[] {
    const words = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    if (words.length === 0 && category === 'all') {
      const featured = [...new Set(featuredIds)].flatMap(id => byId.get(id) ?? []);
      return featured.length ? featured : tools.filter(tool => tool.featured);
    }
    return tools.filter(tool => {
      if (category !== 'all' && tool.category !== category) return false;
      const text = [tool.name, tool.description, tool.categoryLabel, tool.category, ...tool.keywords].join(' ').toLocaleLowerCase();
      return words.every(word => text.includes(word));
    });
  }

  return { tools, byId, byHref, find };
}

export type ToolCatalog = ReturnType<typeof createToolCatalog>;

export const DEFAULT_CATALOG: ToolCatalog = createToolCatalog(catalog as ToolEntry[]);

export const TOOLS = DEFAULT_CATALOG.tools;
export const toolsById = DEFAULT_CATALOG.byId;
export const findTools = DEFAULT_CATALOG.find;
