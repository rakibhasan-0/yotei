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
	const [trashVisible, setTrashVisible] = useState(false)

	const [allMap, setAllMap] = useState(new Map())
	const [selectedMap, setSelectedMap] = useState(new Map())
	const [firstSelectedMap, setFirstSelectedMap] = useState(new Map())
	

	const blocker = useBlocker(() => {
		if (isBlocking) {
			setGoBackPopup(true)
			return true
		}
		return false
	})

	const editRole = async () => {
		setIsBlocking(false)
		const mapToList = Array.from(selectedMap.keys())
		
		const params = new URLSearchParams({
			newPermissionIds: mapToList
		})

		const response = await fetch(`/api/roles/${role_id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json", token },
			body: JSON.stringify({ roleName })
		})

		if (!response.ok) {
			if(response.status === 400) {
				setErrorToast("Namnet på rollen är upptaget")
			}
			setErrorToast("Kunde inte ändra rollens namn")
			return
		}

		const response2 = await fetch(`/api/permissions/role/${role_id}/edit/permissions?${params}`,
			{
				method: "PUT",
				headers: { "Content-Type": "application/json", token }
			}
		)

		if (!response2.ok) {
			setErrorToast("Kunde inte ändra rollens rättigheter")
			return
		}
		navigate("/admin")
	}

	useEffect(() => {
		for (let [key] of allMap) {
			if (selectedMap.get(key) !== firstSelectedMap.get(key)) {
				setIsBlocking(true)
				return
			}
		}
		setTrashVisible(originalRoleName === "admin")
		setIsBlocking(roleName !== originalRoleName)
	}, [roleName, originalRoleName, selectedMap, firstSelectedMap, allMap])

	const fetchRole = useCallback(async () => {
		setIsLoading(true)

		const response = await fetch(`/api/roles/${role_id}`, { 
			method: "GET",
			headers: { token } })

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
				const response = await fetch("/api/permissions/", {
					method: "GET",
					headers: { token } })
				if (!response.ok) {
					setIsLoading(false)
					throw new Error("Kunde inte hämta all rättigheter")
				}
				const json = await response.json()
				console.log(json)

				const response2 = await fetch(`/api/permissions/role/${role_id}`, {
					method: "GET",
					headers: { token } })
				if (!response2.ok) {
					setIsLoading(false)
					throw new Error("Kunde inte hämta rollens rättigheter")
				}		

				json.forEach(permission => {
					setAllMap(allMap.set(permission.permissionId, permission))
				})

				setPermissions(json)
				setIsLoading(false)

				if (response2.status === 204) {
					setIsLoading(false)
					return
				} else {
					const json2 = await response2.json()

					json2.forEach(permission => {
						addToMap("selectedMap", permission.permissionId, permission)
						addToMap("firstSelectedMap", permission.permissionId, permission)
						
						handleButtonToggle(permission.permissionId, true)
					})
				}
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

	function handleButtonToggle(permissionId, onInitLoad) {
		let permission = allMap.get(permissionId)
		if(onInitLoad) {
			permission.newToggledState = !permission.newToggledState
		} else {
			permission.newToggledState = !permission.newToggledState
			if (permission.newToggledState) {
				addToMap("selectedMap", permissionId, permission)
			} else {
				removeFromMap(permissionId)
			}

		}

	}

	const addToMap = (map, permissionId, permission) => {
		if (map === "selectedMap") {
			setSelectedMap(prevMap => {
				const newMap = new Map(prevMap)
				newMap.set(permissionId, permission)
				return newMap
			})
		} else {
			setFirstSelectedMap(prevMap => {
				const newMap = new Map(prevMap)
				newMap.set(permissionId, permission)
				return newMap
			})
		}
	}

	const removeFromMap = (permissionId) => {
		setSelectedMap(prevMap => {
			const newMap = new Map(prevMap)
			newMap.delete(permissionId)
			return newMap
		})
	}


	return (
		<div>
			{trashVisible ? "" : (
				<Trash
					onClick={() => setShowDeletePopup(true)}
					size="24px"
					style={{ color: "var(--red-primary)", position: "absolute", right: "2rem", top: "rem"}}
				/>
			)}	
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
							toggled={selectedMap.has(permission.permissionId) }
							changeToggled={() => handleButtonToggle(permission.permissionId, false)}
						/>
					))}
				</div>
			)}

			<div style={{ marginTop: "1rem", display: "flex", justifyContent: "space-between", width: "100%" }}>
				<Button 
					outlined={true} 
					onClick={handleNavigation}>
					<p>Tillbaka</p>
				</Button>
				<Button 
					onClick={editRole}>
					<p>Spara</p>
				</Button>
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
					<RoleDelete id={"role-delete-popup"} roleID={role_id} name={roleName} setIsOpen={setShowDeletePopup}/>
				</Popup>
			</div>
		</div>
        
	)
}