import { Prism } from '@mantine/prism';
import { Language as PrismLanguage } from 'prism-react-renderer';
import { Translator } from '../types/code';
import { Page } from '../types/store';
import construct from './construct';

import csharp from './lang/csharp';
import java from './lang/java';
import typescript from './lang/ts';
import javascript from './lang/js';

export enum Language {
  java = 'java',
  csharp = 'csharp',
  javascript = 'javascript',
  typescript = 'typescript',
}

const translate: Map<Language, [Translator, PrismLanguage]> = new Map([
  [Language.java, [java, 'clike']],
  [Language.csharp, [csharp, 'clike']],
  [Language.javascript, [javascript, 'javascript']],
  [Language.typescript, [typescript, 'typescript']],
]);

export default function generate(language: Language, page: Page) {
  const code = construct(page);
  const [makeCode, prismLang] = translate.get(language);
  return <Prism language={prismLang}>{makeCode(code).join('\n')}</Prism>;
}
