import type { isFullBlock, isFullPage } from '@notionhq/client';

export declare type Task = (context: Context) => void;

export interface Options {
  notionPrefix?: string;
  enableNestedParagraph?: boolean;
  enableBlockId?: boolean;
  convertRawHtml?: (richTextObj: any) => string | false | undefined | null;
  pageReference?: { [pageId: string]: any };
  footnoteReference?: { [blockId: string]: any };
  footnoteTitle?: string;
  footnoteBackLabel?: string;
}

export interface Context {
  addTasks<T>(
    array: T[] | undefined,
    iterFunc: (item: T, index: number) => Task
  ): void;
  addTasks(task: Task): void;
  addFootnote(footnode: any): number;
  options: Options;
}

// Types from Notion SDK
type Asserts<Function> = Function extends (input: any) => input is infer Type
  ? Type
  : never;
export type Page = Asserts<typeof isFullPage>;
export type Block = Asserts<typeof isFullBlock>;

export type BlockType =
  | Block['type']
  | 'bulleted_list' // added by `groupBlocks` in utils.ts
  | 'numbered_list'
  | 'to_do_list';

export type GetBlock<T extends BlockType = BlockType> = Extract<
  Block,
  { type: T }
> &
  Record<T, { children?: Block[] }>;
export type RichTextItem = GetBlock<'image'>['image']['caption'][number];
