import { Accordion, Button, NumberInput, Radio, Switch } from '@mantine/core';
import { SelectorOptions } from '../src/types/generator';
import { defaultOptions } from '../src/utils/options';

function Options({ options, setOptions }: { options: SelectorOptions; setOptions: (value: SelectorOptions) => void }) {
  const update = <T,>(key: keyof SelectorOptions) => {
    return (value: T) => {
      const copy = { ...options };
      (copy[key] as T) = value;
      setOptions(copy);
    };
  };

  if (!options) {
    return;
  }

  return (
    <Accordion variant="separated">
      <Accordion.Item value="Options">
        <Accordion.Control>Options</Accordion.Control>
        <Accordion.Panel>
          <Radio.Group
            mb={20}
            name="type"
            withAsterisk
            value={options.type}
            label="Selector type"
            onChange={update('type')}
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
            onChange={update('gibberishTolerance')}
            defaultValue={options.gibberishTolerance}
            description="(Lower = More Gibberish, Higher = Less Gibberish)"
          />
          <Switch
            mb={20}
            label="Hide Ambiguous"
            checked={options.onlyUnique}
            description="Hides selectors with more than one occurrence"
            onChange={v => update('onlyUnique')(v.currentTarget.checked)}
            onLabel="ON"
            offLabel="OFF"
          />
          <NumberInput
            mb={20}
            min={1}
            max={Infinity}
            step={1}
            label="Results to display"
            value={options.resultsToDisplay}
            onChange={update('resultsToDisplay')}
            description="Only show first N results"
          />
          <NumberInput
            mb={20}
            min={-Infinity}
            max={Infinity}
            step={1}
            label="Score Tolerance"
            value={options.scoreTolerance}
            onChange={update('scoreTolerance')}
            description="Only show results with scores above N"
          />
          <Button fullWidth onClick={() => setOptions(defaultOptions)}>
            Restore Defaults
          </Button>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}

export { Options };
