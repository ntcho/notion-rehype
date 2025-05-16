import type { Context, GetBlock } from '../types.js';
import { getColorClassName, h } from '../utils.js';
import { addTasksToAddRichTexts } from './rich-text.js';

const handler = (
  context: Context,
  block: GetBlock<'heading_1'> | GetBlock<'heading_2'> | GetBlock<'heading_3'>
) => {
  // prettier-ignore
  // TS will not infer the type of block correctly, so we need to use a type assertion
  const data = block.type === 'heading_1' ? block[block.type] : block.type === 'heading_2' ? block[block.type] : block[block.type];

  const headingLevel = block.type.replace('heading_', '');

  const colorClassName = getColorClassName(data.color);
  const className = colorClassName ? [colorClassName] : undefined;

  const hast = h(`h${headingLevel}`, { className }, []);

  addTasksToAddRichTexts({ context, block, hast, richTexts: data.rich_text });

  return hast;
};

export default handler;
