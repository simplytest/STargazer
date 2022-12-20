import { MantineThemeOverride } from "@mantine/core";

const theme: MantineThemeOverride = {
    colorScheme: "dark",
    loader: "dots",
    primaryColor: "yellow",

    globalStyles: (theme) => ({
        body: {
            width: "300px",
            height: "500px",
        },
    }),
};

export default theme;