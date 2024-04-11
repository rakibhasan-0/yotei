import { rest } from "msw"

export const handlers = [
	rest.all("http://localhost/api/*", async (req, res, ctx) => {
		return res(ctx.status(200), ctx.json([]))
	}),
	rest.all("http://localhost/api/users/*", async (req, res, ctx) => {
		return res(ctx.status(200), ctx.json([]))
	})
]