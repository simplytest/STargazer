import { SegmentedControl, Select, Stack } from "@mantine/core";
import { ContextModalProps } from "@mantine/modals";
import { Prism, PrismProps } from "@mantine/prism";
import { IconCode } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { framework_t } from "../src/export";
import to_csharp from "../src/export/csharp";
import to_java from "../src/export/java";
import to_javascript from "../src/export/javascript";
import to_typescript from "../src/export/typescript";
import { folder_t } from "../src/vault";
import { Option } from "./settings";
import { useStorage } from "../src/hooks/storage";

interface ExportModalProps
{
    folder: folder_t;
}

const props = new Map<string, PrismProps>([
    ["javascript", { language: "javascript" } as PrismProps],
    ["typescript", { language: "typescript" } as PrismProps],
    ["csharp", { language: "clike" } as PrismProps],
    ["java", { language: "clike" } as PrismProps],
]);

const transformer = new Map([
    ["javascript", to_javascript],
    ["typescript", to_typescript],
    ["csharp", to_csharp],
    ["java", to_java],
]);

export default function ExportModal({ innerProps }: ContextModalProps<ExportModalProps>)
{
    const [code, set_code] = useState("");
    const [language, set_language] = useStorage("export-language", "csharp");
    const [framework, set_framework] = useStorage<framework_t>("export-framework", "selenium");

    useEffect(() =>
    {
        const transform = transformer.get(language);
        set_code(transform({ framework, folder: innerProps.folder }));
    }, [framework, language]);

    return <Stack m="xs" align="stretch">
        <Prism {...props.get(language)}>
            {code}
        </Prism>

        <Option option-label="Framework" Control={SegmentedControl} data={[
            { label: "Selenium", value: "selenium" },
            { label: "Playwright", value: "playwright" },
        ]} value={framework} onChange={set_framework} width={200} />
        <Option option-label="Language" Control={Select} data={[
            { label: "C#", value: "csharp" },
            { label: "Java", value: "java" },
            { label: "JavaScript", value: "javascript" },
            { label: "TypeScript", value: "typescript" },
        ]} value={language} onChange={set_language} icon={<IconCode size="1rem" />} variant="filled" width={200} />
    </Stack>;
}