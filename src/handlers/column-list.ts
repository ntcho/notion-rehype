import type { Context, GetBlock } from '../types.js';
import { h, notionPrefixFactory } from '../utils.js';
import { getBlockHast } from './index.js';

const handler = (context: Context, block: GetBlock<'column_list'>) => {
  const data = block[block.type];
  const children = data.children || [];

  const blockClass = notionPrefixFactory(context)(block.type);

  const hast = h(
    'section',
    { className: [blockClass, `${blockClass}-${children.length}`] },
    []
  );
  context.addTasks(children, (child) => (ctx) => {
    const childHast = getBlockHast(ctx, child);
    childHast && hast.children.push(childHast);
  });

  return hast;
};

export default handler;
