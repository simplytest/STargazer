/* eslint-disable @typescript-eslint/no-namespace */

export namespace by
{
  export interface tag
  {
    tag: string;
  }

  export interface text
  {
    text: string;
  }

  export interface index
  {
    index: number;
  }

  export interface attribute
  {
    key: string;
    value: string;
  }
}

export type selector_t = by.tag | by.text | by.index | by.attribute;
export type chain_t = selector_t[];

export function select<T extends selector_t>(by: T)
{
    return by;
}

export function join(first: selector_t, second: selector_t)
{
    return { ...first, ...second };
}