import { setupServer } from "msw/node"
// eslint-disable-next-line jest/no-mocks-import
import { handlers } from "./__mocks__/handler"

// This configures a request mocking server with the request handlers.
export const server = setupServer(...handlers)