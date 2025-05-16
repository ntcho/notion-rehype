import type { Context, GetBlock } from '../types.js';
import { getColorClassName, h, notionPrefixFactory } from '../utils.js';
import { addTasksToAddDirectChildren } from './children.js';
import { addTasksToAddRichTexts } from './rich-text.js';

const handler = (context: Context, block: GetBlock<'toggle'>) => {
  const data = block[block.type];

  const toggleSummary = h('summary', {}, []);

  const blockClass = notionPrefixFactory(context)(block.type);
  const className: string[] = [blockClass];

  const colorClassName = getColorClassName(data.color);
  colorClassName && className.push(colorClassName);

  const hast = h('details', { className }, [toggleSummary]);

  addTasksToAddDirectChildren(context, hast, data.children);
  addTasksToAddRichTexts({
    context,
    block,
    hast: toggleSummary,
    richTexts: data.rich_text,
  });

  return hast;
};

export default handler;
