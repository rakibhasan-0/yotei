import React from "react"

export const Roles = Object.freeze({
	other: "USER",
	admin: "ADMIN",
	editor: "EDITOR"
})

// eslint-disable-next-line no-unused-vars
export const AccountContext = React.createContext({token: "", role: "", userId: 0, permissions: [], username: "guest", setToken: (x) => {}})
//permissions is a list of user permissions (a list of ints, with macro for this in utils.js).
