import type { Context, GetBlock } from '../types.js';
import { h, notionPrefixFactory } from '../utils.js';
import { addTasksToAddDirectChildren } from './children.js';

const handler = (context: Context, block: GetBlock<'column'>) => {
  const data = block[block.type];

  const blockClass = notionPrefixFactory(context)(block.type);

  const hast = h('section', { className: [blockClass] }, []);
  addTasksToAddDirectChildren(context, hast, data.children);

  return hast;
};

export default handler;
