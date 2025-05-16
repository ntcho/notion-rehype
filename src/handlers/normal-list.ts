import type { Context, GetBlock } from '../types.js';
import {
  addBlockIdToHast,
  getColorClassName,
  h,
  hasChildren,
} from '../utils.js';
import { addTasksToAddDirectChildren } from './children.js';
import { addTasksToAddRichTexts } from './rich-text.js';

const getListItemHast = (
  context: Context,
  block: GetBlock<'bulleted_list_item'> | GetBlock<'numbered_list_item'>
) => {
  // prettier-ignore
  // TS will not infer the type of block correctly, so we need to use a type assertion
  const data = block.type === 'bulleted_list_item' ? block[block.type] : block[block.type];

  const colorClassName = getColorClassName(data.color);
  const className = colorClassName ? [colorClassName] : undefined;

  const hast = h('li', { className }, []);

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
  block:
    | Required<{
        type: 'bulleted_list';
        bulleted_list: GetBlock<'bulleted_list_item'>[];
      }>
    | Required<{
        type: 'numbered_list';
        numbered_list: GetBlock<'numbered_list_item'>[];
      }>
) => {
  const type = block.type;

  const tagName = type === 'bulleted_list' ? 'ul' : 'ol';
  const hast = h(tagName, []);

  // prettier-ignore
  // TS will not infer the type of block correctly, so we need to use a type assertion
  const listItems = type === 'bulleted_list' ? block[type] : block[type];
  listItems.forEach((listItem) => {
    hast.children.push(getListItemHast(context, listItem));
  });

  return hast;
};

export default handler;
