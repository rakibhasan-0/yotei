/* eslint-disable no-undef */
const { createProxyMiddleware } = require("http-proxy-middleware")

module.exports = function(app) {
		app.use(
			["/api","/user"],
			createProxyMiddleware({
				//Changes the proxy host to target IMP dev server
				target: "localhost:80",
				changeOrigin: true,
			})
		)
}


