import type { Context, GetBlock } from '../types.js';
import { getFileDetails, h, notionPrefixFactory } from '../utils.js';
import { addCaptionToHast } from './caption.js';

const handler = (context: Context, block: GetBlock<'image'>) => {
  const data = block[block.type];

  const { url, attr: fileAttr } = getFileDetails(context, data);

  const blockClass = notionPrefixFactory(context)(block.type);
  const img = h('img', { src: url, ...fileAttr }, []);

  const hast = h('div', { className: [blockClass] }, [img]);
  addCaptionToHast(context, hast, data.caption);

  return hast;
};

export default handler;
