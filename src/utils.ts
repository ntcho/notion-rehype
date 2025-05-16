import type { Element, ElementContent, Root, RootContent, Text } from 'hast';

import type { Block, Context, GetBlock } from './types';

// prettier-ignore
export function h(tagName: string, properties: Record<string, any>, children: ElementContent[]): Element;
export function h(tagName: string, children: ElementContent[]): Element;
export function h(root: null, children: RootContent[]): Root;
export function h(text: 'text', value: string): Text;
export function h(raw: 'raw', value: string): Text;
export function h(...args: any[]): Root | Element | Text {
  if (args[0] === null) {
    return { type: 'root', children: args[1] };
  }
  if (['text', 'raw'].includes(args[0]) && typeof args[1] === 'string') {
    return { type: args[0], value: args[1] };
  }
  return Array.isArray(args[1])
    ? { type: 'element', tagName: args[0], children: args[1] }
    : {
        type: 'element',
        tagName: args[0],
        properties: args[1],
        children: args[2],
      };
}

export const notionPrefixFactory = (context: Context) => {
  const prefix = context.options.notionPrefix || 'notion-';
  return (str: string) => prefix + str;
};

export const getFileDetails = (
  context: Context,
  fileObject:
    | GetBlock<'file'>['file']
    | GetBlock<'image'>['image']
    | GetBlock<'video'>['video']
    | GetBlock<'audio'>['audio']
    | GetBlock<'callout'>['callout']['icon']
): { url?: string; attr?: object } => {
  if (!fileObject) return {};

  const notionPrefix = notionPrefixFactory(context);
  const fileType = fileObject.type;
  const attr = { [`data-${notionPrefix('file-type')}`]: fileType };

  if (fileType === 'emoji') throw new TypeError('Emoji is not a file type');

  // @ts-ignore doesn't understand `fileObject[fileType]` will exist
  return { url: fileObject[fileType].url, attr };
};

export const hasChildren = (data: any) => (data.children?.length || 0) > 0;

export const addBlockIdToHast = (
  context: Context,
  block: any,
  hast: Element | Text
) => {
  if (hast.type !== 'element' || !context.options.enableBlockId || !block.id) {
    return;
  }

  const notionPrefix = notionPrefixFactory(context);
  const attrName = `data-${notionPrefix('block-id')}`;

  hast.properties = objAssign(hast.properties, { [attrName]: block.id });
};

export const getColorClassName = (color: string) => {
  if (!color || color === 'default') {
    return '';
  }
  return `color-${color}`;
};

export const objAssign = <T extends {}, U>(
  props: T | undefined,
  newProps: U
): T & U => {
  return Object.assign((props || {}) as T, newProps);
};

export const addClassToHast = (hast: Element, classItem: string) => {
  if (hast.properties?.className) {
    (hast.properties.className as string[]).push(classItem);
    return;
  }
  hast.properties = objAssign(hast.properties, { className: [classItem] });
};

const listItemTypes = new Set([
  'bulleted_list_item',
  'numbered_list_item',
  'to_do',
]);

/**
 * Groups Notion blocks by combining consecutive list items of the same type into a single list block
 * @param blocks Array of Notion blocks to group
 * @returns Array of grouped blocks where consecutive list items are combined
 */
export const groupBlocks = (blocks: Block[] | undefined) => {
  const result: any[] = [];

  if (!blocks) {
    return result;
  }

  let curListItemType = ''; // Tracks the current list item type we're processing
  let curListItems: Block[] = []; // Collects items of the same list type

  /**
   * Helper function to add the current list items to the result array
   * Converts list item types to their container types (e.g. bulleted_list_item -> bulleted_list)
   */
  const putListItemsToResult = () => {
    const curListType =
      curListItemType === 'to_do'
        ? 'to_do_list'
        : curListItemType.replace('_item', '');
    result.push({ type: curListType, [curListType]: curListItems });
  };

  const blocksCount = blocks.length;
  for (let i = 0; i < blocksCount; i += 1) {
    const block = blocks[i];

    // If the current block is not a list item type
    if (!listItemTypes.has(block.type)) {
      // If we were collecting list items, finalize the last list
      if (curListItemType) {
        putListItemsToResult();
        curListItemType = '';
        curListItems = [];
      }
      // Add non-list block directly to the result
      result.push(block);
      continue;
    }

    // Start collecting a new list if we don't have a current list type
    if (!curListItemType) {
      curListItemType = block.type;
      curListItems = [block];
      continue;
    }

    // If the current block matches our current list type, add it to the collection
    if (curListItemType === block.type) {
      curListItems.push(block);
      continue;
    }

    // Different list type, finalize the current list and start a new one
    putListItemsToResult();
    curListItemType = block.type;
    curListItems = [block];
  }

  // Add any remaining list items at the end
  if (curListItemType) {
    putListItemsToResult();
  }

  return result;
};

export const getFootnoteRefId = (index: number) =>
  `user-content-fnref-${index}`;
export const getFootnoteContentId = (index: number) =>
  `user-content-fn-${index}`;
