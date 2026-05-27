import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  use: {
    baseURL: 'http://localhost:4200',
  },
  webServer: [
    {
      command: './gradlew quarkusDev',
      port: 8080,
      timeout: 180_000,
      cwd: './backend',
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'npm start',
      port: 4200,
      timeout: 120_000,
      cwd: './frontend',
      reuseExistingServer: !process.env.CI,
    },
  ],
});
