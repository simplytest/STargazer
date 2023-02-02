import { Accordion, NumberInput, Radio, Switch } from '@mantine/core';
import { SelectorOptions } from '../src/types/generator';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';

function Options({ options, setOptions }: { options: SelectorOptions; setOptions: (value: SelectorOptions) => void }) {
  const update = <T,>(key: keyof SelectorOptions, value: T) => {
    const copy = { ...options };
    (copy[key] as T) = value;
    setOptions(copy);
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
            name="type"
            withAsterisk
            value={options.type}
            label="Selector type"
            style={{ marginBottom: 20 }}
            onChange={v => update('type', v)}
            description="Your preferred selector type (Note: XPath is mightier than CSS)"
          >
            <Radio value="xpath" label="XPath" />
            <Radio value="css" label="CSS" />
          </Radio.Group>
          <NumberInput
            min={0}
            max={1}
            step={0.01}
            noClampOnBlur
            precision={3}
            stepHoldDelay={500}
            stepHoldInterval={0.1}
            style={{ marginBottom: 20 }}
            label="Gibberish Tolerance"
            defaultValue={options.gibberishTolerance}
            onChange={v => update('gibberishTolerance', v)}
            description="(Lower = More Gibberish, Higher = Less Gibberish)"
          />
          <Switch
            label="Hide Ambiguous"
            checked={options.onlyUnique}
            style={{ marginBottom: 20 }}
            description="Hides selectors with more than one occurrence"
            onChange={v => update('onlyUnique', v.currentTarget.checked)}
            onLabel="ON"
            offLabel="OFF"
          />
          <NumberInput
            min={1}
            max={Infinity}
            step={1}
            label="Results to display"
            value={options.resultsToDisplay}
            description="Only show first N results"
            onChange={v => update('resultsToDisplay', v)}
          />
          <NumberInput
            min={-Infinity}
            max={Infinity}
            step={1}
            label="Score Tolerance"
            value={options.scoreTolerance}
            description="Only show results with scores above N"
            onChange={v => update('scoreTolerance', v)}
          />
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}

export { Options };
