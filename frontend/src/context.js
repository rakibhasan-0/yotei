import React from "react"

export const Roles = Object.freeze({
	other: "USER",
	admin: "ADMIN",
	editor: "EDITOR"
})

// eslint-disable-next-line no-unused-vars
export const AccountContext = React.createContext({token: "", role: "", userId: 0, setToken: (x) => {}})
