import type { Context, GetBlock } from '../types.js';
import { getColorClassName, h, notionPrefixFactory } from '../utils.js';
import { addTasksToAddWrappedChildren } from './children.js';
import handleRichText, { addTasksToAddRichTexts } from './rich-text.js';

const handler = (context: Context, block: GetBlock<'paragraph'>) => {
  const data = block[block.type];
  const childrenCount = data.children?.length || 0;
  const richTextCount = data.rich_text?.length || 0;

  const shouldReturnRaw =
    richTextCount === 1 &&
    childrenCount < 1 &&
    typeof context.options.convertRawHtml?.(data.rich_text[0]) === 'string';
  if (shouldReturnRaw) {
    return handleRichText(context, block, data.rich_text[0]);
  }

  const shouldUseDivAsP =
    context.options.enableNestedParagraph && childrenCount > 0;

  const tagName = shouldUseDivAsP ? 'div' : 'p';

  const className: string[] = [];
  if (shouldUseDivAsP) {
    const blockClass = notionPrefixFactory(context)(block.type);
    className.push(blockClass);
  }

  const colorClassName = getColorClassName(data.color);
  colorClassName && className.push(colorClassName);

  const hast = h(
    tagName,
    {
      className: className.length > 0 ? className : undefined,
      role: shouldUseDivAsP ? 'paragraph' : undefined,
    },
    []
  );

  addTasksToAddWrappedChildren(context, hast, data.children);
  addTasksToAddRichTexts({ context, block, hast, richTexts: data.rich_text });

  return hast;
};

export default handler;
