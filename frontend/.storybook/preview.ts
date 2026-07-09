/// <reference types="vite/client" />

import type { Preview } from "@storybook/react-vite";
import "../src/styles.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    backgrounds: {
      default: "Crema",
      values: [
        { name: "Crema", value: "#F7F4EC" },
        { name: "Blanco", value: "#ffffff" },
        { name: "Verde profundo", value: "#123B2C" }
      ]
    },
    viewport: {
      defaultViewport: "mobile1"
    },
    layout: "padded"
  }
};

export default preview;
