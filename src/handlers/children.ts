import { Element, Root } from 'hast';
import type { Block, Context } from '../types.js';
import { groupBlocks, h, notionPrefixFactory } from '../utils.js';
import { getBlockHast } from './index.js';

export const addTasksToAddDirectChildren = (
  context: Context,
  hast: Element | Root,
  children?: Block[]
) => {
  context.addTasks(groupBlocks(children), (child: any) => (ctx) => {
    const childHast = getBlockHast(ctx, child);
    childHast && hast.children.push(childHast);
  });
};

const handler = (context: Context, children?: Block[]): Element | null => {
  const wrapperClass = notionPrefixFactory(context)('children-wrapper');

  if (!children || children.length < 1) {
    return null;
  }

  const hast = h('div', { className: [wrapperClass] }, []);
  addTasksToAddDirectChildren(context, hast, children);

  return hast;
};

export const addTasksToAddWrappedChildren = (
  context: Context,
  hast: Element,
  children?: Block[]
) => {
  const childrenHast = handler(context, children);
  if (!childrenHast) {
    return;
  }
  context.addTasks(() => {
    hast.children.push(childrenHast);
  });
};

export default handler;
