import { useContext, useEffect } from "react"
import { isAdminUser } from "./utils"
import { useNavigate } from "react-router"
import { AccountContext } from "./context"

/**
 * TODO: figure out what this file does AND document it here.
 * 
 * @author UNKNOWN, Team Mango
 * @updated 2024-05-22 Team Mango: Changed isAdmin check to new check.
 */

export default function AdminRoute({children}) {

	const token = useContext(AccountContext)
	const navigate = useNavigate()

	useEffect(() => {
		if(!isAdminUser(token)) {
			navigate(-1)
		}
	})

	if(isAdminUser(token)) {
		return (
			<div>
				{children}
			</div>
		)
	}

} 