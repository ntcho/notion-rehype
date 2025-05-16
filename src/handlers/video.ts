import type { Context, GetBlock } from '../types.js';
import { getFileDetails, h, notionPrefixFactory } from '../utils.js';
import { addCaptionToHast } from './caption.js';

const handler = (context: Context, block: GetBlock<'video'>) => {
  const data = block[block.type];
  const { url, attr: fileAttr } = getFileDetails(context, data);

  const blockClass = notionPrefixFactory(context)(block.type);

  const hast = h('div', { className: [blockClass] }, [
    h('video', { src: url, ...fileAttr }, []),
  ]);
  addCaptionToHast(context, hast, data.caption);

  return hast;
};

export default handler;
