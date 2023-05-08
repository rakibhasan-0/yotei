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
const backendURL = "http://localhost:" + process.env.GATEWAY_PORT + "/user/verify"

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
	testDir: "./sys-test",
	timeout: 20000,
	expect: {
		timeout: 15000,
	},
	globalTimeout: 3000000,
	fullyParallel: false,
	workers: process.env.CI ? 1 : 4,
	forbidOnly: !!process.env.CI,
	maxFailures: process.env.CI ? 3 : undefined,
	retries: process.env.CI ? 2 : 0,
	reporter: process.env.CI ? [ ["list"], ["junit", { outputFile: "results.xml" }] ] : "list",
	use: {
		baseURL: frontendURL,
		trace: "on-first-retry",
	},

	/* Configure projects for major browsers */
	projects: [
		{
			name: "Mobile Chrome",
			use: { ...devices["Pixel 5"] },
		}
	],

	/* Start frontend & backend before tests */
	webServer: [
		{
			command: "./run-system.sh",
			env: systestEnv,
			url: backendURL,
			timeout: 60 * 1000,
			reuseExistingServer: !process.env.CI,
		},
		{
			command: "npm start",
			env: systestEnv,
			url: frontendURL,
			timeout: 60 * 1000,
			reuseExistingServer: !process.env.CI,
		}
	],
})
