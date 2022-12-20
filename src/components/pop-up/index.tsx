import { MantineProvider } from "@mantine/core";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import theme from "../theme";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
      <App />
    </MantineProvider>
  </React.StrictMode>
);
