import type { Context, GetBlock } from '../types.js';
import { h, notionPrefixFactory } from '../utils.js';
import { addCaptionToHast } from './caption.js';

const handler = (context: Context, block: GetBlock<'bookmark'>) => {
  const data = block[block.type];
  const { url, caption } = data;

  const blockClass = notionPrefixFactory(context)(block.type);

  // TODO: add url preview
  const hast = h('a', { className: [blockClass], href: url }, [h('text', url)]);
  addCaptionToHast(context, hast, caption);

  return hast;
};

export default handler;
