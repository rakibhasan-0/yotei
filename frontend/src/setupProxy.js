/* eslint-disable no-undef */
const { createProxyMiddleware } = require("http-proxy-middleware")

module.exports = function(app) {
	if(process.env.USE_IMP_SERVER === "true") {
		app.use(
			["/api","/user"],
			createProxyMiddleware({
				//Changes the proxy host to target IMP dev server
				target: "http://imp.cs.umu.se:80",
				changeOrigin: true,
			})
		)
	} else {
		app.use(
			["/api","/user"],
			createProxyMiddleware({
				//Changes the proxy host to target IMP dev server
				target: "localhost:80",
				changeOrigin: true,
			})
		)
	}
}


