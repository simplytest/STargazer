import { Badge, Group, MantineProvider, Text } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import theme from "../theme";

async function getInspectedElement(): Promise<string> {
  return new Promise<string>((resolve) => {
    chrome.devtools.inspectedWindow.eval(`$0.outerHTML`, {}, (result) => {
      resolve(result.substring(0, 25));
    });
  });
}

function DevTools() {
  const [inspectedElement, setInspected] = useState<string>();

  useEffect(() => {
    (async () => {
      setInspected(await getInspectedElement());
    })();
  }, []);

  chrome.devtools.panels.elements.onSelectionChanged.addListener(async () => {
    setInspected(await getInspectedElement());
  });

  return (
    <>
      <h1>Indiana</h1>
      <Group noWrap>
        <Text>Selected Node</Text>
        <Badge>{inspectedElement}</Badge>
      </Group>
    </>
  );
}

createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <MantineProvider withGlobalStyles theme={theme}>
      <DevTools />
    </MantineProvider>
  </React.StrictMode>
);
