import type { Context, GetBlock } from '../types.js';
import { getFileDetails, h, notionPrefixFactory } from '../utils.js';
import { addCaptionToHast } from './caption.js';

const handler = (context: Context, block: GetBlock<'file'>) => {
  const data = block[block.type];
  const { url, attr: fileAttr } = getFileDetails(context, data);

  if (!url) throw new Error('File URL is missing');

  let lastSlashIndex = 0;
  for (let i = url.length - 1; i > -1; i -= 1) {
    if (url[i] === '/') {
      lastSlashIndex = i;
      break;
    }
  }
  const fileName = url.slice(lastSlashIndex + 1) || 'Unknown File';

  const blockClass = notionPrefixFactory(context)(block.type);

  const hast = h('div', { className: [blockClass] }, [
    h('a', { src: url, ...fileAttr }, [h('text', fileName)]),
  ]);
  addCaptionToHast(context, hast, data.caption);

  return hast;
};

export default handler;
