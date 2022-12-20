import { Badge, Group, MantineProvider, Stack, Text } from "@mantine/core";
import React from "react";
import { createRoot } from "react-dom/client";
import theme from "../theme";

function PopUp() {
  return (
    <Stack
      align="center"
      style={{ padding: "10px", width: "300px", height: "500px" }}
    >
      <h1>Indiana</h1>
      <hr style={{ width: "80%" }} />
      <Text align="center">Please use the specified hotkey to start!</Text>
      <hr style={{ width: "80%" }} />
      <Group>
        <Text>Version</Text>
        <Badge color="green">{chrome.runtime.getManifest().version}</Badge>
      </Group>
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
