import type { Context, GetBlock } from '../types.js';
import { h, notionPrefixFactory } from '../utils.js';
import { addCaptionToHast } from './caption.js';
import { addTasksToAddRichTexts } from './rich-text.js';

const handler = (context: Context, block: GetBlock<'code'>) => {
  const data = block[block.type];

  const code = h('code', { className: [`language-${data.language}`] }, []);
  addTasksToAddRichTexts({
    context,
    block,
    hast: code,
    richTexts: data.rich_text,
    turnLineBreakToBr: false,
  });

  const pre = h('pre', [code]);

  if (!data.caption || data.caption.length < 1) {
    return pre;
  }

  const blockClass = notionPrefixFactory(context)(block.type);

  const hast = h('section', { className: [blockClass] }, [pre]);
  addCaptionToHast(context, hast, data.caption);

  return hast;
};

export default handler;
