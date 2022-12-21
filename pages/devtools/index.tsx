import {
  Badge,
  Group,
  LoadingOverlay,
  MantineProvider,
  Stack,
  Text,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { generatePath, Result } from "../../src/generator";
import { getDom, getInspectedElement } from "../../src/utils";
import theme from "../theme";

function DevTools() {
  const [inspectedElement, setInspected] = useState<string>();
  const [results, setResults] = useState<Result[]>([]);
  const domParser = new DOMParser();

  useEffect(() => {
    if (!inspectedElement) {
      return;
    }

    getDom().then((result) => {
      const dom = domParser.parseFromString(result, "text/html");
      const node = domParser.parseFromString(inspectedElement, "text/html").body
        .firstChild;

      setResults(generatePath("xpath", dom, node as Element));
    });
  }, [inspectedElement]);

  useEffect(() => {
    getInspectedElement()
      .then((result) => setInspected(result))
      .catch(console.error);
  }, []);

  chrome.devtools.panels.elements.onSelectionChanged.addListener(async () => {
    setInspected(await getInspectedElement());
  });

  return (
    <>
      <LoadingOverlay
        visible={results.length <= 0}
        overlayBlur={2}
      ></LoadingOverlay>
      <Group align="center">
        <h1>Generated Selectors</h1>
        <Stack>
          {results.map((result) => (
            <Group noWrap>
              <Badge color="yellow">{result.occurrences}</Badge>
              <Text>{result.selector.value}</Text>
            </Group>
          ))}
        </Stack>
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
