import type { Element, Text } from 'hast';

import handleAudio from './audio.js';
import handleBookmark from './bookmark.js';
import handleCallout from './callout.js';
import handleCode from './code.js';
import handleColumnList from './column-list.js';
import handleColumn from './column.js';
import handleDivider from './divider.js';
import handleEmbed from './embed.js';
import handleEquation from './equation.js';
import handleFile from './file.js';
import handleHeading from './heading.js';
import handleImage from './image.js';
import handleLinkPreview from './link-preview.js';
import handleLinkToPage from './link-to-page.js';
import handleNormalList from './normal-list.js';
import handleParagraph from './paragraph.js';
import handleQuote from './quote.js';
import handleSyncedBlock from './synced-block.js';
import handleTable from './table.js';
import handleTodoList from './to-do-list.js';
import handleToggle from './toggle.js';
import handleVideo from './video.js';

import type { Block, BlockType, Context } from '../types.js';
import { addBlockIdToHast } from '../utils.js';

import { addTasksToAddDirectChildren } from './children.js';
import handleFootnotes from './footnotes.js';
export {
  addTasksToAddDirectChildren as addTasksToAddHastChildren,
  handleFootnotes,
};

const handlerByBlockType: Partial<
  Record<BlockType, (context: Context, [x]: any) => Element | Text>
> = {
  paragraph: handleParagraph,
  heading_1: handleHeading,
  heading_2: handleHeading,
  heading_3: handleHeading,
  callout: handleCallout,
  quote: handleQuote,
  bulleted_list: handleNormalList,
  numbered_list: handleNormalList,
  to_do_list: handleTodoList,
  toggle: handleToggle,
  code: handleCode,
  embed: handleEmbed,
  image: handleImage,
  video: handleVideo,
  file: handleFile,
  bookmark: handleBookmark,
  equation: handleEquation,
  divider: handleDivider,
  column_list: handleColumnList,
  column: handleColumn,
  link_preview: handleLinkPreview,
  link_to_page: handleLinkToPage,
  synced_block: handleSyncedBlock,
  table: handleTable,
  audio: handleAudio,
};

export const getBlockHast = (
  context: Context,
  block: Block
): Element | Text | null => {
  const handler = handlerByBlockType[block.type];

  if (!handler) return null;

  const hast = handler(context, block);
  addBlockIdToHast(context, block, hast);

  return hast;
};
