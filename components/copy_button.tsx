import { clipboard } from "@extend-chrome/clipboard";
import { CopyButtonProps } from "@mantine/core";
import { useState } from "react";

export default function CopyButton({ value, children, timeout }: CopyButtonProps)
{
    const [copied, set_copied] = useState(false);

    const copy = () =>
    {
        clipboard.writeText(value).then(() =>
        {
            set_copied(true);
            setTimeout(() => set_copied(false), timeout ?? 1000);
        });
    };

    return children({ copied: copied, copy });
}