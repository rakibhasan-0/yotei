import { defineConfig, devices } from "@playwright/test"
import { config } from "dotenv"
/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
config()

// We never want to run system-tests on IMP.
const systestEnv = {
	...process.env,
	"USE_IMP_SERVER": "false",
}
const frontendURL = "http://localhost:" + process.env.FRONTEND_PORT
const testServer = "http://5dv214vt24-test.cs.umu.se"

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
	testDir: "./sys-test/test-files",
	timeout: 20000,
	expect: {
		timeout: 15000,
	},
	globalTimeout: 3000000,
	fullyParallel: false,
	workers: 4, // Since system computer in CI pipeline has 4 cores.
	forbidOnly: !!process.env.CI,
	maxFailures: process.env.CI ? 3 : undefined,
	retries: process.env.CI ? 2 : 0,
	reporter: process.env.CI ? [ ["list"], ["junit", { outputFile: "results.xml" }] ] : "list",
	use: {
		baseURL: process.env.CI ? testServer : frontendURL,
		trace: "on-first-retry",
	},

	/**
	 * Configure projects for major browsers. 
   * Some projects are commented out because they cause arbitrary tests to fail due to timeout issues. 
	 * This needs to be further investigated if one wants to run the system tests in multiple different browsers.
	 */
	projects: [
    /* Test against desktop browsers */
    // {
    //   name: 'chromium',
    //   use: { ...devices['Desktop Chrome'] },
    // },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
    // /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },
		{
      name: 'MobileChrome',
      use: { ...devices['Pixel 5'] },
    },
	],

	/* Start frontend & backend before tests */
	webServer: [
		{
			command: "npm start",
			env: systestEnv,
			url: process.env.CI ? testServer : frontendURL,
			timeout: 60 * 1000,
			reuseExistingServer: true,
		}
	],
})
