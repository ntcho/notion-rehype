import type { Context, GetBlock } from '../types.js';
import { h, notionPrefixFactory } from '../utils.js';
import { addTasksToAddDirectChildren } from './children.js';

const handler = (context: Context, block: GetBlock<'synced_block'>) => {
  const notionPrefix = notionPrefixFactory(context);

  const data = block[block.type];
  const { synced_from } = data;

  const blockClass = notionPrefix(block.type);
  const syncType = synced_from ? 'reference' : 'original';
  const className = [blockClass, `${blockClass}-${syncType}`];

  const hast = h('section', { className }, []);

  if (synced_from) {
    hast.properties![`data-${notionPrefix('synced-from')}`] =
      synced_from.block_id;
  }

  addTasksToAddDirectChildren(context, hast, data.children);

  return hast;
};

export default handler;
