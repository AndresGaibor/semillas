import type { StorybookConfig } from "@storybook/react-vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  framework: "@storybook/react-vite",
  addons: ["@storybook/addon-a11y", "@storybook/addon-docs", "@storybook/addon-vitest"],
  staticDirs: ["../public"],
  tags: {
    experimental: { defaultFilterSelection: "exclude" },
    deprecated: { defaultFilterSelection: "exclude" },
  },
  async viteFinal(baseConfig) {
    baseConfig.plugins = (baseConfig.plugins ?? []).flat().filter((plugin) => {
      const nombrePlugin =
        typeof plugin === "object" && plugin !== null && "name" in plugin
          ? String((plugin as { name?: string }).name ?? "").toLowerCase()
          : "";

      return !nombrePlugin.includes("pwa");
    });

    baseConfig.resolve = {
      ...baseConfig.resolve,
      alias: {
        ...baseConfig.resolve?.alias,
        "@": path.resolve(__dirname, "../src"),
        "virtual:pwa-register": path.resolve(__dirname, "./pwa-register-mock.ts"),
      }
    };

    return baseConfig;
  }
};

export default config;
