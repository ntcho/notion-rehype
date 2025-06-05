import type { Context, GetBlock } from '../types.js';
import { getFileDetails, h, notionPrefixFactory } from '../utils.js';
import { addCaptionToHast } from './caption.js';

const handler = (context: Context, block: GetBlock<'video'>) => {
  const data = block[block.type];
  const { url, attr: fileAttr } = getFileDetails(context, data);

  const blockClass = notionPrefixFactory(context)(block.type);

  const youtubeMatch =
    data.type === 'file' ? null : YOUTUBE_URL_REGEX.exec(data.external.url);

  const video =
    youtubeMatch === null
      ? h('video', { src: url, controls: true, ...fileAttr }, [])
      : h(
          'iframe',
          { src: `https://youtube.com/embed/${youtubeMatch[5]}`, ...fileAttr },
          []
        );

  const hast = h('div', { className: [blockClass] }, [video]);
  addCaptionToHast(context, hast, data.caption);

  return hast;
};

export default handler;

/**
 * From https://stackoverflow.com/a/37704433/4524257
 *
 * Capture groups:
 * 1. protocol
 * 2. subdomain
 * 3. domain
 * 4. path
 * 5. video code
 * 6. query string
 */
const YOUTUBE_URL_REGEX =
  /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(?:-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|live\/|v\/)?)([\w\-]+)(\S+)?$/;
