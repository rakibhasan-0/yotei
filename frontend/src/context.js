import React from "react"

/**
 * @author Team Durian (Group 3) + unknown
 * @since 2024-05-16
 * @version 3.0
 * @updated 2024-05-22
 *
 * @returns a page for managing the user's account
 */

export const Roles = Object.freeze({
	other: "USER",
	admin: "ADMIN",
	editor: "EDITOR"
})

// eslint-disable-next-line no-unused-vars
export const AccountContext = React.createContext({token: "", role: "", userId: 0, permissions: [], username: "guest", setToken: (x) => {}})
//permissions is a list of user permissions (a list of ints, with macro for this in utils.js).
