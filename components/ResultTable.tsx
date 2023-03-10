import { clipboard } from '@extend-chrome/clipboard';
import { ActionIcon, Alert, Badge, Center, Table, TextInput } from '@mantine/core';
import { useHover } from '@mantine/hooks';
import { IconCopy, IconDatabaseOff } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { highlightBySelector } from '../src/highlight';
import { Result } from '../src/types/generator';
import { findBySelector } from '../src/utils/dom';

function TableEntry({ result }: { result: Result }) {
  const color = (occurrences: number) => {
    if (occurrences === 1) {
      return 'green';
    }
    if (occurrences < 5) {
      return 'orange';
    }
    return 'red';
  };

  const [value, setValue] = useState(result.selector);
  const { hovered, ref } = useHover<HTMLTableRowElement>();
  const [occurrences, setOccurrences] = useState(result.occurrences);

  useEffect(() => {
    if (hovered) {
      highlightBySelector(value);
    }
  }, [hovered]);

  useEffect(() => {
    if (value !== result.selector) {
      highlightBySelector(value);
    }
  }, [value]);

  return (
    <tr ref={ref}>
      <td>
        <Badge color={color(occurrences)}>{occurrences}</Badge>
      </td>
      <td>
        <TextInput
          value={value}
          onChange={v => {
            setValue(v.currentTarget.value);
            findBySelector(v.currentTarget.value).then(setOccurrences);
          }}
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
  );
}

function ResultTable({ results }: { results: Result[] }) {
  const mapped = results.map(result => <TableEntry key={result.selector} result={result} />);

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
