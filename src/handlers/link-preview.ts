import type { Context, GetBlock } from '../types.js';
import { h, notionPrefixFactory } from '../utils.js';

const handler = (context: Context, block: GetBlock<'link_preview'>) => {
  const data = block[block.type];
  const { url } = data;

  const blockClass = notionPrefixFactory(context)(block.type);

  const hast = h('div', { className: [blockClass] }, [
    h('a', { href: url }, [h('text', url)]),
  ]);

  return hast;
};

export default handler;
