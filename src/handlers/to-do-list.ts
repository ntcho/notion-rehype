import type { Context, GetBlock } from '../types.js';
import {
  addBlockIdToHast,
  getColorClassName,
  h,
  hasChildren,
  notionPrefixFactory,
} from '../utils.js';
import { addTasksToAddDirectChildren } from './children.js';
import { addTasksToAddRichTexts } from './rich-text.js';

const getListItemHast = (context: Context, block: GetBlock<'to_do'>) => {
  const data = block[block.type];

  const todoCheckbox = h(
    'input',
    { type: 'checkbox', checked: data.checked, disabled: true },
    []
  );

  const colorClassName = getColorClassName(data.color);
  const className = colorClassName ? [colorClassName] : undefined;

  const hast = h('li', { className }, [todoCheckbox]);

  addTasksToAddDirectChildren(context, hast, data.children);
  addTasksToAddRichTexts({
    context,
    block,
    hast,
    richTexts: data.rich_text,
    wrapRichTexts: hasChildren(data),
  });

  addBlockIdToHast(context, block, hast);

  return hast;
};

const handler = (
  context: Context,
  block: Required<{
    type: 'to_do_list';
    to_do_list: GetBlock<'to_do'>[];
  }>
) => {
  const blockClass = notionPrefixFactory(context)(block.type);

  const hast = h('ul', { className: [blockClass] }, []);

  const listItems = block[block.type];
  listItems.forEach((listItem: any) => {
    hast.children.push(getListItemHast(context, listItem));
  });

  return hast;
};

export default handler;
