import { addCaptionToHast } from './caption.js';
import { h, getNotionFileUrlAndAttr, notionPrefixFactory } from '../utils.js';

import { BlockType, Context } from '../types.js';

const handler = (context: Context, block: any) => {
  const data = block[BlockType.image];
  const { url, attr: fileAttr } = getNotionFileUrlAndAttr(context, data);

  const blockClass = notionPrefixFactory(context)(BlockType.image);
  const img = h('img', { src: url, dim: data.dim, ...fileAttr }, []);
  data.caption && (img.properties!!.caption = data.caption);

  const hast = h('div', { className: [blockClass] }, [img]);
  // addCaptionToHast(context, hast, data.caption);

  return hast;
};

export default handler;
