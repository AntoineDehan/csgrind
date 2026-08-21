import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    env: {
      NODE_ENV: "test",
      DATABASE_URL: "postgresql://test:test@localhost:5432/test",
      JWT_SECRET: "test-only-secret-long-enough-for-validation",
      STEAM_REALM: "http://localhost:3000",
      STEAM_RETURN_URL: "http://localhost:3000/steam/return",
      STEAM_API_KEY: "test-only-steam-api-key",
      MAIL_FROM: "CSGrind <test@example.com>",
    },
  },
});
