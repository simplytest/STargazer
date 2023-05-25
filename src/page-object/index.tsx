import { Stack } from '@mantine/core';
import { Prism } from '@mantine/prism';
import { IconBrandCSharp, IconBrandJavascript, IconBrandNetbeans, IconBrandTypescript } from '@tabler/icons-react';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { Language as PrismLanguage } from 'prism-react-renderer';
import { Translator } from '../types/code';
import { Page } from '../types/store';
import construct from './construct';

import csharp from './lang/csharp';
import java from './lang/java';
import javascript from './lang/js';
import typescript from './lang/ts';

export enum Language {
  java = 'java',
  csharp = 'csharp',
  javascript = 'javascript',
  typescript = 'typescript',
}

const translate: Map<Language, [Translator, PrismLanguage, string, typeof IconBrandCSharp]> = new Map([
  [Language.java, [java, 'clike', '.java', IconBrandNetbeans]],
  [Language.csharp, [csharp, 'clike', '.cs', IconBrandCSharp]],
  [Language.javascript, [javascript, 'javascript', '.js', IconBrandJavascript]],
  [Language.typescript, [typescript, 'typescript', '.ts', IconBrandTypescript]],
]);

export default function generate(language: Language, page: Page) {
  const generated = construct(page);
  const [translateCode, prismLang, extension, Icon] = translate.get(language);

  const classes = generated.map(clazz => ({
    clazz,
    code: translateCode(clazz).join('\n'),
  }));

  return (
    <Stack>
      {classes.map(x => {
        const { code, clazz } = x;
        const title = `${clazz.name}${extension}`;

        return (
          <Prism.Tabs key={code} defaultValue={title}>
            <Prism.TabsList>
              <Prism.Tab value={title} icon={<Icon />}>
                {title}
              </Prism.Tab>
            </Prism.TabsList>
            <Prism.Panel language={prismLang} value={title}>
              {code}
            </Prism.Panel>
          </Prism.Tabs>
        );
      })}
    </Stack>
  );
}

export function download(language: Language, page: Page) {
  const generated = construct(page);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [translateCode, _, extension] = translate.get(language);

  const classes = generated.map(clazz => ({
    clazz,
    code: translateCode(clazz).join('\n'),
  }));

  const zip = new JSZip();

  for (const { clazz, code } of classes) {
    zip.file(`${clazz.name}${extension}`, code);
  }

  zip.generateAsync({ type: 'blob' }).then(content => saveAs(content, 'src.zip'));
}
