import { Badge, Group, Stack, Text } from "@mantine/core";

function App() {
  return (
    <Stack align="center" style={{ padding: "10px" }}>
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

export default App;
