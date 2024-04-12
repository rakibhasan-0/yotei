import { useContext, useEffect } from "react"
import { isAdmin } from "./utils"
import { useNavigate } from "react-router"
import { AccountContext } from "./context"

export default function AdminRoute({children}) {

	const token = useContext(AccountContext)
	const navigate = useNavigate()

	useEffect(() => {
		if(!isAdmin(token)) {
			navigate(-1)
		}
	})

	if(isAdmin(token)) {
		return (
			<div>
				{children}
			</div>
		)
	}

} 