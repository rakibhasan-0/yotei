import { useParams, useNavigate,  } from "react-router"
import { unstable_useBlocker as useBlocker } from "react-router"
import { useEffect, useState, useContext, useCallback } from "react"
import { Trash } from "react-bootstrap-icons"
import { AccountContext } from "../../context"
import { setError as setErrorToast } from "../../utils"


import Divider from "../../components/Common/Divider/Divider"
import InputTextFieldBorderLabel from "../../components/Common/InputTextFieldBorderLabel/InputTextFieldBorderLabel"
import PermissionCard from "../../components/Common/RoleCard/PermissionListItem"
import Button from "../../components/Common/Button/Button"
import ErrorState from "../../components/Common/ErrorState/ErrorState"
import Spinner from "../../components/Common/Spinner/Spinner"
import Popup from "../../components/Common/Popup/Popup"
import ConfirmPopup from "../../components/Common/ConfirmPopup/ConfirmPopup"
import RoleDelete from "../../components/Admin/Delete/RoleDelete"


/**
 * A component for displaying what permission a certain role has.
 * 
 * @author Team Mango (Group 4)
 * @since 2024-05-08
 * @version 1.0
 */

export default function RoleEdit() {
	const hasPreviousState = location.key !== "default"
	const { role_id } = useParams()
	const { token } = useContext(AccountContext)

	const [roleName, setRoleName] = useState("")
	const [originalRoleName, setOriginalRoleName] = useState("")
	const navigate = useNavigate()
	const [permissions, setPermissions] = useState([])
	const [error, setError] = useState()
	const [loading, setIsLoading] = useState(true)
	const [showDeletePopup, setShowDeletePopup] = useState(false)
	const [isBlocking, setIsBlocking] = useState(false)
	const [goBackPopup, setGoBackPopup] = useState(false)
	const [isToggled, setIsToggled] = useState(false)
	

	const blocker = useBlocker(() => {
		if (isBlocking) {
			setGoBackPopup(true)
			return true
		}
		return false
	})

	const editRole = async () => {
		setIsBlocking(false)
		const response = await fetch("/api/permissions/role/add",
			{
				method: "POST",
				headers: { "Content-Type": "application/json", token },
				body: JSON.stringify({
					role_id: role_id,
					permission_id: permissions.permissionId
				})
			})

		if (!response.ok) {
			console.log(permissions.permissionId)
			setErrorToast("Kunde inte ändra roll")
			return
		}
		navigate("/admin")
	}

	useEffect(() => {
		setIsBlocking(roleName !== originalRoleName)
	}, [roleName, originalRoleName])

	const fetchRole = useCallback(async () => {
		setIsLoading(true)

		const response = await fetch(`/api/roles/${role_id}`, { headers: { token } })

		if (!response.ok) {
			setError("Kunde inte hämta roll")
			setIsLoading(false)
			return
		}

		const role = await response.json()

		setRoleName(role.roleName)
		setOriginalRoleName(role.roleName)

		setIsLoading(false)
	}, [role_id, token])

	useEffect(() => {
		fetchRole()
	}, [fetchRole])

	useEffect(() => {
		(async () => {
			try {
				const response = await fetch("/api/permissions", { headers: { token } })
				if (!response.ok) {
					setIsLoading(false)
					throw new Error("Kunde inte hämta rättigheter")
				}
				const json = await response.json()
				console.log(json)
				setPermissions(json)
				setIsLoading(false)
			} catch (ex) {
				setErrorToast("Kunde inte hämta rättigheter")
				setIsLoading(false)
				console.error(ex)
			}
		})()
	}, [token])
	
	if (error) {
		return <ErrorState message={error} onBack={() => navigate("/admin")} />
	}

	const handleNavigation = () => {
		if (hasPreviousState) {
			navigate("/admin")
		} else {
			navigate("/plan")
		}
	}

	function handleButtonToggle(newToggledState) {
		if (isToggled === newToggledState) {
			console.log("toggled")
		}
		console.log(newToggledState)
		setIsToggled(newToggledState)
	}

	return (
		<div>
			<Trash
				onClick={() => setShowDeletePopup(true)}
				size="24px"
				style={{ color: "var(--red-primary)", position: "absolute", right: "2rem", top: "rem"}}
			/>	
			<Divider option={"h2_left"} title={"Redigera roll"} /> 
			<br/>
			<InputTextFieldBorderLabel 
				id={"register-user-username-input"} 
				text={roleName}
				type={"role"} 
				label= {"Namn på roll"} 
				onChange={e => setRoleName(e.target.value)}
			/>

			{loading ? <Spinner /> : (
				<div>
					{ permissions.map((permission, index) => (
						<PermissionCard
							item={permission.permissionName}
							key={index}
							id={permission.permissionId}
							changeToggled={() => handleButtonToggle(permission.permissionId)}
						/>
					))}
				</div>
			)}

			<div style={{ marginTop: "1rem", display: "flex", justifyContent: "space-between", width: "100%" }}>
				<Button outlined={true} onClick={handleNavigation}><p>Tillbaka</p></Button>
				<Button onClick={editRole}><p>Spara</p></Button>
			</div>

			<ConfirmPopup
				showPopup={goBackPopup}
				setShowPopup={setGoBackPopup}
				popupText={"Är du säker på att du vill lämna sidan? Dina ändringar kommer inte att sparas."}
				confirmText="Lämna"
				backText="Avbryt"
				onClick={async () => {
					blocker.proceed()
				}}
			/>

			<div>
				<Popup
					title="Ta bort roll"
					isOpen={showDeletePopup}
					setIsOpen={setShowDeletePopup}
					style={{height: "unset"}}>
					<RoleDelete id={"role-delete-popup"} roleID={role_id} name={roleName} setIsOpen={setShowDeletePopup} what={"Rollen"}/>
				</Popup>
			</div>
		</div>
        
	)
}