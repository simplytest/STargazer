import { Box, Button, Center, Divider, Group, NumberInput, SegmentedControl, Stack, Switch, Text, Tooltip, useMantineColorScheme } from "@mantine/core";
import { IconBrain, IconBug, IconCheck, IconDatabaseExport, IconInfoCircle, IconMoon, IconPalette, IconSun, TablerIconsProps } from "@tabler/icons-react";
import { CSSProperties, Fragment, ReactNode, useEffect, useState } from "react";
import { worker } from "../src/client/worker";
import { meta } from "../src/extension/meta";
import { scripting } from "../src/extension/scripting";
import useStorage from "../src/hooks/storage";
import { vault_t } from "../src/vault";
import CopyButton from "./copy_button";

function IconText({ Icon, text, center }: {Icon: (props: TablerIconsProps) => JSX.Element, text: string, center?: boolean})
{
    const Wrapping = center ? Center : Fragment;

    return <Wrapping>
        <Icon size={12} />
        <Box ml={5}>{text}</Box>
    </Wrapping>;
}

function Section({ Icon, text }: {Icon: (props: TablerIconsProps) => JSX.Element, text: string})
{
    return <Divider label={<IconText Icon={Icon} text={text} />} />;
}

type OptionProps<P extends object> = Omit<P, "w"> &
{
    width?: number;
    tooltip?: ReactNode;
    "no-fixed"?: boolean;
    "option-label": string;
    Control: (props: P) => ReactNode;
}

export function Option<P extends object>({ "option-label": option_label, Control, "no-fixed": no_fixed, tooltip, width, ...data }: OptionProps<P>)
{
    const Wrapping = tooltip ? Tooltip : Fragment;

    return <Wrapping label={tooltip} multiline>
        <Group position="apart" noWrap>
            <Text>{option_label}</Text>
            <Control {...data as P} {...(no_fixed ? {} : { w: width ?? 150 })} />
        </Group>
    </Wrapping>;
}


export default function Settings({ style }: {style?: CSSProperties})
{
    const { colorScheme: theme, toggleColorScheme: set_theme } = useMantineColorScheme();

    const [top_n, set_top_n] = useStorage("top-n", 15);
    const [type, set_type] = useStorage("selector-type", "xpath");
    const [to_show, set_to_show] = useStorage("result-to-show", 3);

    const [show_raw, set_show_raw] = useStorage("show-raw", false);
    const [show_scores, set_show_scores] = useStorage("show-scores", false);

    const [access, set_access] = useState(false);
    const [vault_instance] = useStorage<vault_t>("vault", { folders: [] });

    useEffect(() =>
    {
        scripting.can_access().then(set_access);
    }, []);

    const change_type = (value: string) =>
    {
        set_type(value);
        worker.update_selectors();
    };

    return <Stack m="lg" style={style}>
        <Section text="Appearance" Icon={IconPalette} />
        <Option Control={SegmentedControl} option-label="Theme" data={[
            { label: <IconText Icon={IconSun} text="Light" center />, value: "light" },
            { label: <IconText Icon={IconMoon} text="Dark" center />, value: "dark" },
        ]} value={theme} onChange={set_theme} />

        <Section text="Generator" Icon={IconBrain} />
        <Option Control={SegmentedControl} option-label="Selector Type" data={[
            { label: "CSS", value: "css" },
            { label: "XPath", value: "xpath" },
        ]} value={type} onChange={change_type} disabled={!access} />
        <Option Control={NumberInput} option-label="Results to Show" min={1} precision={0} stepHoldDelay={500} stepHoldInterval={100} variant="filled" value={to_show} onChange={set_to_show} />
        <Option Control={NumberInput} option-label="Mutate Top" tooltip={
            <Text>
                Higher values can yield better results but are more expensive to compute.<br />
                We recommend 100 for good results, 15 for faster results
            </Text>
        } min={15} precision={0} stepHoldDelay={500} stepHoldInterval={100} variant="filled" value={top_n} onChange={set_top_n} />

        <Section text="Information" Icon={IconInfoCircle} />
        <Option Control={Text<"div">} option-label="Version" align="right">{meta.version()}</Option>
        <Option Control={Text<"div">} option-label="Build Date" align="right">{meta.build()}</Option>

        {meta.developer() &&
        <>
            <Section text="Developer Options" Icon={IconBug} />
            <Option Control={Switch} option-label="Show Raw" no-fixed checked={show_raw} onChange={e => set_show_raw(e.currentTarget.checked)} />
            <Option Control={Switch} option-label="Show Scores" no-fixed checked={show_scores} onChange={e => set_show_scores(e.currentTarget.checked)} />
            <CopyButton value={JSON.stringify(vault_instance)}>
                {({ copied, copy }) =>
                    <Button fullWidth leftIcon={copied ? <IconCheck /> : <IconDatabaseExport />} onClick={copy}>
                        Export Vault
                    </Button>
                }
            </CopyButton>
        </>
        }
    </Stack>;
}