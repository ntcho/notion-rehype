import type { Context, GetBlock } from '../types.js';
import {
  getColorClassName,
  getFileDetails,
  h,
  hasChildren,
  notionPrefixFactory,
} from '../utils.js';
import { addTasksToAddDirectChildren } from './children.js';
import { addTasksToAddRichTexts } from './rich-text.js';

const handler = (context: Context, block: GetBlock<'callout'>) => {
  const data = block[block.type];

  const blockClass = notionPrefixFactory(context)(block.type);

  const calloutIcon = h('div', { className: [`${blockClass}-icon`] }, []);

  if (data.icon) {
    if (data.icon.type === 'emoji') {
      calloutIcon.children.push(h('text', data.icon.emoji));
    } else {
      const { url, attr } = getFileDetails(context, data.icon);
      calloutIcon.children.push(h('img', { src: url, ...attr }, []));
    }
  }

  const calloutContent = h('div', { className: [`${blockClass}-content`] }, []);

  addTasksToAddDirectChildren(context, calloutContent, data.children);
  addTasksToAddRichTexts({
    context,
    block,
    hast: calloutContent,
    richTexts: data.rich_text,
    wrapRichTexts: hasChildren(data),
  });

  const className = [blockClass];
  const colorClassName = getColorClassName(data.color);
  colorClassName && className.push(colorClassName);

  const hast = h('section', { className }, [calloutIcon, calloutContent]);

  return hast;
};

export default handler;
