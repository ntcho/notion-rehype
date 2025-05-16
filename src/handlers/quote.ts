import type { Context, GetBlock } from '../types.js';
import { getColorClassName, h, hasChildren } from '../utils.js';
import { addTasksToAddDirectChildren } from './children.js';
import { addTasksToAddRichTexts } from './rich-text.js';

const handler = (context: Context, block: GetBlock<'quote'>) => {
  const data = block[block.type];

  const colorClassName = getColorClassName(data.color);
  const className = colorClassName ? [colorClassName] : undefined;

  const hast = h('blockquote', { className }, []);

  addTasksToAddDirectChildren(context, hast, data.children);
  addTasksToAddRichTexts({
    context,
    block,
    hast,
    richTexts: data.rich_text,
    wrapRichTexts: hasChildren(data),
  });

  return hast;
};

export default handler;
