import type { Context, GetBlock } from '../types.js';
import { h, notionPrefixFactory } from '../utils.js';

const handler = (context: Context, block: GetBlock<'embed'>) => {
  const data = block[block.type];

  const blockClass = notionPrefixFactory(context)(block.type);

  const hast = h('iframe', { src: data.url, className: [blockClass] }, []);

  return hast;
};

export default handler;
