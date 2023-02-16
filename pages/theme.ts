import { MantineThemeOverride } from '@mantine/core';

const theme: MantineThemeOverride = {
  loader: 'dots',
  colorScheme: 'dark',
  primaryColor: 'orange',
  colors: {
    dark: [
      '#FFFFFF',
      '#C5CBDF',
      '#909998',
      '#262D48',
      '#242845',
      '#242845',
      '#252C45',
      '#181A25',
      '#1D1A2C',
      '#1D1331',
    ],
    orange: [
      '#F26633',
      '#F46A37',
      '#F96632',
      '#F36430',
      '#F86736',
      '#EE6B38',
      '#F46A37',
      '#FF6633',
      '#EE6331',
      '#ff612c',
    ],
    yellow: [
      '#FEEDB3',
      '#FEE799',
      '#FEE180',
      '#FEDB66',
      '#FED54D',
      '#FDCF33',
      '#FDC91A',
      '#FDC300',
      '#E4B000',
      '#CA9C00',
    ],
    green: [
      '#b3e6e5',
      '#99dedd',
      '#80d6d4',
      '#66cdcb',
      '#4dc5c3',
      '#33bdba',
      '#1ab4b2',
      '#00ACA9',
      '#009b98',
      '#008a87',
    ],
  },
};

export default theme;
