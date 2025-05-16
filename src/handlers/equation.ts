import type { Context, GetBlock } from '../types.js';
import { h } from '../utils.js';

const handler = (context: Context, block: GetBlock<'equation'>) => {
  const data = block[block.type];

  const hast = h('section', { className: ['math', 'math-display'] }, [
    h('text', data.expression),
  ]);

  return hast;
};

export default handler;
