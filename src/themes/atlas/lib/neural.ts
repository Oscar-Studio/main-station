// Neural-graph node/link generator. Ported from crazy/2/effects.js initNeural().
import { NEURAL_TAGS } from '@/data/content';

export interface NeuralNode {
  id: number;
  cx: number;
  cy: number;
  label: string;
}

export interface NeuralLink {
  from: number;
  to: number;
}

export interface NeuralGraph {
  nodes: NeuralNode[];
  links: NeuralLink[];
}

const VBW = 600; // SVG viewBox width
const VBH = 600; // SVG viewBox height
const RADIUS = 200; // ring radius
const CENTER_X = VBW / 2;
const CENTER_Y = VBH / 2;

export function buildNeuralGraph(seed = 42): NeuralGraph {
  // seeded rng for stable render across SSR/CSR
  let state = seed;
  const rand = () => {
    state = (state * 9301 + 49297) % 233280;
    return state / 233280;
  };

  const nodes: NeuralNode[] = NEURAL_TAGS.map((label, i) => {
    const angle = (i / NEURAL_TAGS.length) * Math.PI * 2 - Math.PI / 2;
    return {
      id: i,
      cx: CENTER_X + Math.cos(angle) * RADIUS,
      cy: CENTER_Y + Math.sin(angle) * RADIUS,
      label,
    };
  });

  // 3 random links per node (some duplicates okay)
  const links: NeuralLink[] = [];
  for (let i = 0; i < NEURAL_TAGS.length; i++) {
    for (let j = 0; j < 3; j++) {
      const target = Math.floor(rand() * NEURAL_TAGS.length);
      if (target !== i) links.push({ from: i, to: target });
    }
  }

  return { nodes, links };
}