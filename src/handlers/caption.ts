import { Element } from 'hast';
import type { Context, RichTextItem } from '../types.js';
import { addClassToHast, h, notionPrefixFactory } from '../utils.js';
import handleRichText from './rich-text.js';

const handler = (context: Context, captions: RichTextItem[]) => {
  const captionClass = notionPrefixFactory(context)('caption');

  const hast = h('div', { className: [captionClass] }, []);

  context.addTasks(captions, (richTextObj: any) => (ctx) => {
    hast.children.push(handleRichText(ctx, null, richTextObj));
  });

  return hast;
};

export const addCaptionToHast = (
  context: Context,
  hast: Element,
  captions?: RichTextItem[]
) => {
  if (!captions || captions.length < 1) return;

  const caption = handler(context, captions);
  hast.children.push(caption);

  const CLS_WITH_CAPTION = 'with-caption';
  addClassToHast(hast, CLS_WITH_CAPTION);
};

export default handler;
