import type { Context, GetBlock, RichTextItem } from '../types.js';
import { addBlockIdToHast, h } from '../utils.js';
import handleRichText from './rich-text.js';

const getTableCellHast = (
  context: Context,
  rowBlock: GetBlock<'table_row'>,
  richTexts: RichTextItem[],
  type: 'th' | 'td',
  scope: string | undefined
) => {
  const hast = h(type, { scope }, []);
  context.addTasks(richTexts, (richTextObj: any) => (ctx) => {
    hast.children.push(handleRichText(ctx, rowBlock, richTextObj));
  });

  return hast;
};

const getTableRowHast = (
  context: Context,
  block: GetBlock<'table_row'>,
  isThead: boolean,
  hasColumnHeader: boolean
) => {
  const { cells } = block[block.type];

  const hast = h('tr', []);
  context.addTasks(cells, (cell: any[], index) => (ctx) => {
    const cellType = isThead || (hasColumnHeader && index === 0) ? 'th' : 'td';

    let scope: 'col' | 'row' | undefined;
    if (cellType === 'th') {
      scope = isThead ? 'col' : 'row';
    }

    const cellHast = getTableCellHast(ctx, block, cell, cellType, scope);
    hast.children.push(cellHast);
  });

  addBlockIdToHast(context, block, hast);

  return hast;
};

const handler = (context: Context, block: GetBlock<'table'>) => {
  const data = block[block.type];
  const { has_column_header, has_row_header } = data;
  const children = (data.children as GetBlock<'table_row'>[]) || [];

  const [headerRows, bodyRows] = data.has_row_header
    ? [children.slice(0, 1), children.slice(1)]
    : [[], children];

  const hast = h('table', []);

  if (headerRows.length > 0) {
    const thead = h('thead', []);
    context.addTasks(headerRows, (row) => (ctx) => {
      const rowHast = getTableRowHast(ctx, row, true, has_column_header);
      thead.children.push(rowHast);
    });

    hast.children.push(thead);
  }

  if (bodyRows.length > 0) {
    const tbody = h('tbody', []);
    context.addTasks(bodyRows, (row) => (ctx) => {
      const rowHast = getTableRowHast(ctx, row, false, has_column_header);
      tbody.children.push(rowHast);
    });

    hast.children.push(tbody);
  }

  return hast;
};

export default handler;
