import Button from "../../Common/Button/Button"
import styles from "./RoleDelete.module.css"
import ErrorState  from "../../Common/ErrorState/ErrorState"
import { useContext, useEffect, useState,} from "react"
import { AccountContext } from "../../../context"
import { useLocation, useNavigate } from "react-router"
import { toast } from "react-toastify" 

/**
 * RoleDelete is a popup page that allows a user with the admin role to delete
 * other roles and all their permissions. 
 * 
 * Props:
 *     	id @type {string} - Should be set to a unique roleID to identify the component
 *		roleID @type {string} - ID for the role
 *		name @type {string} - The name for the role
 *     	setIsOpen @type {useState} - Must be passed by parent to allow the popup
 *			to close itself
 *
 * Example usage:
 *
 * const [showDeletePopup, setShowDeletePopup] = useState(false)
 * ........ 
 *		<Popup
 * 			title="Ta bort roll"
 *			isOpen={showDeletePopup}
 *			setIsOpen={setShowDeletePopup}>
 *			<RoleDelete id={"role-delete-popup"} roleID={roleId 
 *				name={role.name} setIsOpen={showDeletePopup}/>
 *		</Popup>
 *
 * @author Team Mango (Group 4)
 * @version 1.0
 * @since 2024-05-13
 */
export default function RoleDelete({ id, roleID, name, setIsOpen }) {
	
	const {token} = useContext(AccountContext)
	const [deleteButtonDisabled, setDeleteButtonDisabled] = useState(true)
	const [hasError, setHasError] = useState(false)
	const navigate = useNavigate()
	const location = useLocation()
	const hasPreviousState = location.key !== "default"

	useEffect(() => {
		setDeleteButtonDisabled(false)
	}, [])

	async function cascadeDelete(roleID, token) {
		let url = "/api/roles/"
		url += roleID

		const requestOptions = {
			method: "DELETE",
			headers: { "Content-Type": "application/json", "token": token }, 
		}
		
		await fetch(url, requestOptions)
			.then(async data => {
				await data.json()
			
			}).catch(() => 
				setHasError(true)
			)

	}


	function constructButtons() {
		return <div className={styles.buttonGroup}>
			<Button
				id={"technique-delete-abort"}
				outlined={true}
				disabled={false}
				width="100%"
				onClick={() => {setIsOpen(false)}}>
				<p>Avbryt</p></Button>
			
			<Button
				id={"technique-delete-confirm"}
				outlined={false}
				disabled={deleteButtonDisabled}
				width="100%"
				onClick={async () => {
					cascadeDelete(roleID, token)
					toast.success(`Rollen ${name} har tagits bort`)
					handleNavigation()
				}}>
				<p>Ta bort</p></Button>
		</div>
	}



	if (hasError) {
		return <ErrorState 
			message={"Ett nätverksfel inträffade. Kontrollera din anslutning"}
			onBack={handleNavigation}
			id={"activity-delete-errorstate"}
		/>
	}

	const handleNavigation = () => {
		if(hasPreviousState) {
			navigate(-1)
		}
		else{
			navigate("/admin")
		}
	}

	return <div className={styles.popupContainer} id={id}>
		<p>Är du säker på att du vill ta bort rollen <b>{name}?</b></p>
		{ constructButtons() }

	</div>
}