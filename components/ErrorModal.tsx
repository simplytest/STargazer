import { Group, Text } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IconAlertTriangle } from '@tabler/icons-react';

interface ErrorModalProps<C> {
  error: C;
}

export function ErrorModal<C>({ error }: ErrorModalProps<C>) {
  return (
    <Group noWrap>
      <Group align="center">
        <IconAlertTriangle size={16} color="red" />
      </Group>
      <Text>{error.toString()}</Text>
    </Group>
  );
}
export function showError<C>(error: C) {
  openModal({
    title: 'Whoops!',
    children: <ErrorModal error={error} />,
  });
}
