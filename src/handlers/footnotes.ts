import type { Context, RichTextItem } from '../types.js';
import { getFootnoteContentId, getFootnoteRefId, h } from '../utils.js';
import handleRichText from './rich-text.js';

const getLiHast = (context: Context, footnote: any, count: number) => {
  const id = getFootnoteContentId(count);
  const refId = getFootnoteRefId(count);

  const hast = h('li', { id }, []);

  footnote.rich_text?.forEach((richTextObj: RichTextItem) => {
    hast.children.push(handleRichText(context, null, richTextObj));
  });

  const backLabel = context.options.footnoteBackLabel || 'Back to ref';
  const backToRefLink = h(
    'a',
    {
      href: `#${refId}`,
      className: ['footnote-backref'],
      title: backLabel,
      'aria-label': backLabel,
    },
    [h('text', '↩')]
  );
  hast.children.push(backToRefLink);

  return hast;
};

const handler = (context: Context, footnotes: any[]) => {
  const blockClass = 'footnotes';

  const title = context.options.footnoteTitle || 'Footnotes';
  const footnotesTitle =
    title === '<hr>'
      ? h('hr', { className: [`${blockClass}-divider`] }, [])
      : h('h2', { className: [`${blockClass}-title`] }, [h('text', title)]);

  const footnotesList = h(
    'ol',
    { className: [`${blockClass}-list`] },
    footnotes.map((footnote, index) => getLiHast(context, footnote, index + 1))
  );

  const hast = h('section', { className: [blockClass] }, [
    footnotesTitle,
    footnotesList,
  ]);

  return hast;
};

export default handler;
