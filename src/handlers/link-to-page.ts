import { Context, type GetBlock } from '../types.js';
import { h, notionPrefixFactory } from '../utils.js';

const handler = (context: Context, block: GetBlock<'link_to_page'>) => {
  const data = block[block.type];

  // prettier-ignore
  // TS will not infer the type of block correctly, so we need to use a type assertion
  const id = data.type === 'page_id' ? data[data.type] : data.type === 'database_id' ? data[data.type] : null;

  if (!id) throw new Error(`Reference id not found in block: ${block.id}`);

  const referredPage = (context.options.pageReference || {})[id];
  const linkName = referredPage?.title || id;
  const url = referredPage?.url;

  const blockClass = notionPrefixFactory(context)(block.type);

  const hast = h('div', { className: [blockClass] }, [
    h('a', { href: url }, [h('text', linkName)]),
  ]);

  return hast;
};

export default handler;
