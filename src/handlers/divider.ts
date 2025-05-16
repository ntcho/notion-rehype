import type { Context, GetBlock } from '../types.js';
import { h } from '../utils.js';

const handler = (context: Context, block: GetBlock<'divider'>) => {
  const hast = h('hr', []);

  return hast;
};

export default handler;
