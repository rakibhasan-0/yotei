// src/setupTests.js
// eslint-disable-next-line jest/no-mocks-import
import { server } from "./server.js"
import fetch, {Request, Response, Headers} from "node-fetch"

if(!globalThis.fetch) {
	globalThis.fetch = fetch
	globalThis.Request = Request
	globalThis.Response = Response
	globalThis.Headers = Headers
}

// Establish API mocking before all tests.
beforeAll(() => server.listen())
// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers())
// Clean up after the tests are finished.
afterAll(() => server.close())