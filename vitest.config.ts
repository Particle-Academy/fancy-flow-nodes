import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Nodes that touch a surface are tested against a real document rather than
    // a mock that agrees with whatever we wrote.
    environment: "jsdom",
  },
});
