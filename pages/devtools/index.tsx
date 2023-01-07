import {
  Badge,
  Group,
  LoadingOverlay,
  MantineProvider,
  Modal,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import { IconAlertTriangle } from "@tabler/icons";
import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { generatePath, Result } from "../../src/generator";
import { getDom, getInspectedElement, InspectedElement } from "../../src/utils";
import theme from "../theme";

function DevTools() {
  const [inspectedElement, setInspected] = useState<InspectedElement>();
  const [error, setError] = useState<DOMException | string>();
  const [results, setResults] = useState<Result[]>();

  useEffect(() => {
    setError(undefined);
    setResults(undefined);

    if (!inspectedElement) {
      return;
    }

    getDom()
      .then(async (dom) => {
        setResults(await generatePath("xpath", dom, inspectedElement));
      })
      .catch(setError);
  }, [inspectedElement]);

  useEffect(() => {
    getInspectedElement()
      .then((result) => setInspected(result))
      .catch(setError);
  }, []);

  chrome.devtools.panels.elements.onSelectionChanged.addListener(async () => {
    setInspected(await getInspectedElement());
  });

  return (
    <>
      <LoadingOverlay visible={!results} overlayBlur={2}></LoadingOverlay>
      <Modal
        centered
        title="Whoops!"
        onClose={() => {}}
        opened={typeof error !== "undefined"}
      >
        <Group noWrap>
          <IconAlertTriangle size="xl" color="red" />
          <Text>{error?.toString()}</Text>
        </Group>
      </Modal>
      <Group align="center">
        <h1>Generated Selectors</h1>
        <Table>
          <thead>
            <tr>
              <th>Occurrences</th>
              <th>Selector</th>
            </tr>
          </thead>
          <tbody>
            {results?.map((result) => {
              return (
                <tr key={result.selector}>
                  <td>
                    <Badge color="gray">{result.occurrences}</Badge>
                  </td>
                  <td>
                    <TextInput disabled value={result.selector} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
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
