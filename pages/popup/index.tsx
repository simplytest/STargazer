import {
  Badge,
  Group,
  MantineProvider,
  Space,
  Stack,
  Text,
} from "@mantine/core";
import { IconHeartHandshake } from "@tabler/icons";
import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { getHotkey, getVersion } from "../../src/utils";
import theme from "../theme";

function PopUp() {
  const [hotkey, setHotkey] = React.useState<string>();

  useEffect(() => {
    getHotkey()
      .then((result) => setHotkey(result))
      .catch(console.error);
  }, []);

  return (
    <Stack
      align="center"
      style={{ padding: "10px", width: "300px", height: "500px" }}
    >
      <h1>Indiana</h1>
      <Group>
        <Text>Version</Text>
        <Badge color="green">{getVersion()}</Badge>
      </Group>
      <hr style={{ width: "80%" }} />
      <Text align="center">
        <a
          href="https://developer.chrome.com/docs/devtools/open/"
          target="_blank"
        >
          Open the Dev-Tools
        </a>{" "}
        and use the specified hotkey to freeze the webpage if necessary. Use the
        "Inspect Element" feature to locate your desired element and head over
        to the "Indiana" tab on the right besides "Styles"
      </Text>
      <Group>
        <Badge color="orange">{hotkey}</Badge>
      </Group>
      <hr style={{ width: "80%" }} />
      <Space style={{ marginTop: "auto", marginBottom: "auto" }} />
      <Text>
        Made with <IconHeartHandshake color="red" /> by{" "}
        <a href="https://simplytest.de/" target="_blank">
          SimplyTest
        </a>
      </Text>
    </Stack>
  );
}

createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
      <PopUp />
    </MantineProvider>
  </React.StrictMode>
);
