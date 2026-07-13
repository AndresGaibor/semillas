import { defineConfig } from "vitest/config";
import storybookTest from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";

export default defineConfig(async () => ({
  plugins: [await storybookTest({ configDir: ".storybook", storybookScript: "bun run storybook" })],
  test: {
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [{ browser: "chromium" }],
    },
  },
}));
