import { Accordion, Button, createStyles, NumberInput, Radio, Switch } from '@mantine/core';
import { IconSettings } from '@tabler/icons-react';
import { useContext } from 'react';
import { defaultSettings } from '../src/settings/defaults';
import { SettingsContext } from '../src/settings/settings';

const useStyles = createStyles(theme => ({
  item: {
    border: '1px solid transparent',
    transform: 'scale(1.03)',
    position: 'relative',
    zIndex: 0,

    '&[data-active]': {
      backgroundColor: theme.fn.rgba(theme.colors.dark[6], 0.2),
      borderColor: theme.colors.dark[2],
    },
  },
}));

function Options() {
  const { type, setType, onlyUnique, setOnlyUnique, resultsToDisplay, setResultsToDisplay, setScoreTolerance } =
    useContext(SettingsContext);

  const { classes } = useStyles();

  return (
    <Accordion variant="separated" classNames={classes}>
      <Accordion.Item value="Options">
        <Accordion.Control icon={<IconSettings />}>Options</Accordion.Control>
        <Accordion.Panel>
          <Radio.Group
            mb={20}
            name="type"
            withAsterisk
            value={type}
            onChange={setType}
            label="Selector type"
            description="Your preferred selector type (Note: XPath is mightier than CSS)"
          >
            <Radio ml={5} mt={15} value="xpath" label="XPath" />
            <Radio ml={5} mt={10} value="css" label="CSS" />
          </Radio.Group>
          <Switch
            mt={5}
            mb={15}
            checked={onlyUnique}
            onChange={v => setOnlyUnique(v.currentTarget.checked)}
            onLabel="ON"
            offLabel="OFF"
            label="Hide Ambiguous"
            description="Hides selectors with more than one occurrence"
          />
          <NumberInput
            mb={20}
            min={1}
            step={1}
            max={Infinity}
            maxLength={10}
            value={resultsToDisplay}
            label="Results to display"
            description="Only show first N results"
            onChange={v => v && setResultsToDisplay(v)}
          />
          <Button
            fullWidth
            onClick={() => {
              setType(defaultSettings.type);
              setOnlyUnique(defaultSettings.onlyUnique);
              setScoreTolerance(defaultSettings.scoreTolerance);
              setResultsToDisplay(defaultSettings.resultsToDisplay);
            }}
          >
            Restore Defaults
          </Button>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}

export { Options };
