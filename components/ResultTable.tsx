import { clipboard } from '@extend-chrome/clipboard';
import { ActionIcon, Alert, Badge, Center, Table, TextInput } from '@mantine/core';
import { IconCopy, IconDatabaseOff } from '@tabler/icons';
import { Result } from '../src/types/generator';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';

function ResultTable({ results }: { results: Result[] }) {
  const color = (occurrences: number) => {
    if (occurrences === 1) {
      return 'green';
    }
    if (occurrences < 5) {
      return 'orange';
    }
    return 'red';
  };

  const mapped = results.map(result => (
    <tr key={result.selector}>
      <td>
        <Badge color={color(result.occurrences)}>{result.occurrences}</Badge>
      </td>
      <td>
        <TextInput
          disabled
          value={result.selector}
          rightSection={
            <ActionIcon
              onClick={async () => {
                await clipboard.writeText(result.selector);
              }}
            >
              <IconCopy />
            </ActionIcon>
          }
        />
      </td>
    </tr>
  ));

  return mapped.length > 0 ? (
    <Table>
      <thead>
        <tr>
          <th>Occurrences</th>
          <th>Selector</th>
        </tr>
      </thead>
      <tbody>{mapped}</tbody>
    </Table>
  ) : (
    <div style={{ width: '100%' }}>
      <Center>
        <Alert icon={<IconDatabaseOff size={16} />} title="Nothing to see here!" color="yellow">
          We could not generate any selectors for the given element...
        </Alert>
      </Center>
    </div>
  );
}

export { ResultTable };
