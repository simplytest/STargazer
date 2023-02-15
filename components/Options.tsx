import { Accordion, Button, NumberInput, Radio, Switch } from '@mantine/core';
import { useContext } from 'react';
import { defaultSettings } from '../src/defaults/settings';
import { SettingsContext } from '../src/utils/settings';

function Options() {
  const {
    type,
    setType,
    gibberishTolerance,
    setGibberishTolerance,
    onlyUnique,
    setOnlyUnique,
    resultsToDisplay,
    setResultsToDisplay,
    scoreTolerance,
    setScoreTolerance,
  } = useContext(SettingsContext);

  return (
    <Accordion variant="separated">
      <Accordion.Item value="Options">
        <Accordion.Control>Options</Accordion.Control>
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
            <Radio value="xpath" label="XPath" />
            <Radio value="css" label="CSS" />
          </Radio.Group>
          <NumberInput
            min={0}
            max={1}
            mb={20}
            step={0.01}
            noClampOnBlur
            precision={3}
            stepHoldDelay={500}
            stepHoldInterval={0.1}
            label="Gibberish Tolerance"
            onChange={setGibberishTolerance}
            defaultValue={gibberishTolerance}
            description="(Lower = More Gibberish, Higher = Less Gibberish)"
          />
          <Switch
            mb={20}
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
            max={Infinity}
            step={1}
            label="Results to display"
            value={resultsToDisplay}
            onChange={setResultsToDisplay}
            description="Only show first N results"
          />
          <NumberInput
            mb={20}
            min={-Infinity}
            max={Infinity}
            step={1}
            label="Score Tolerance"
            value={scoreTolerance}
            onChange={setScoreTolerance}
            description="Only show results with scores above N"
          />
          <Button
            fullWidth
            onClick={() => {
              setType(defaultSettings.type);
              setOnlyUnique(defaultSettings.onlyUnique);
              setScoreTolerance(defaultSettings.scoreTolerance);
              setResultsToDisplay(defaultSettings.resultsToDisplay);
              setGibberishTolerance(defaultSettings.gibberishTolerance);
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
