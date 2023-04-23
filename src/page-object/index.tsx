import { Prism } from '@mantine/prism';
import { Page } from '../types/store';
import csharp from './csharp';

export enum Language {
  csharp = 'csharp',
  nodejs = 'nodejs',
}

export default function generate(language: Language, page: Page) {
  switch (language) {
    case Language.csharp:
      return <Prism language="clike">{csharp(page)}</Prism>;
  }
}
