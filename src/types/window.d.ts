export {};

declare global {
  interface Window {
    stargazer_marked?: HTMLElement[];
    stargazer_inspected?: HTMLElement;
  }
}
