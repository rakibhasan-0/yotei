import React from "react"

export const Roles = Object.freeze({
	admin: "ADMIN",
	editor: "EDITOR",
	other: "USER"
})

// eslint-disable-next-line no-unused-vars
export const AccountContext = React.createContext({token: "", role: "", userId: 0, setToken: (x) => {}})
