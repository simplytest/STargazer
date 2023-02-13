import { Group, Modal, Text } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';
import { useState } from 'react';

function ErrorModal({ error, persistent }: { error: unknown; persistent?: boolean }) {
  const [open, setOpen] = useState(true);

  return (
    <Modal
      centered
      opened={open}
      title="Whoops!"
      withCloseButton={!persistent}
      onClose={() => setOpen(persistent || !open)}
    >
      <Group noWrap>
        <Group align="center">
          <IconAlertTriangle size={16} color="red" />
        </Group>
        <Text>{error.toString()}</Text>
      </Group>
    </Modal>
  );
}

export { ErrorModal };
