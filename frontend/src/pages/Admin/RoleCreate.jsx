import { useNavigate, unstable_useBlocker as useBlocker } from "react-router"
import { useEffect, useState, useContext } from "react"
import { AccountContext } from "../../context"
import { isAdminUser, setError as setErrorToast } from "../../utils"
import { toast } from "react-toastify"

import Divider from "../../components/Common/Divider/Divider"
import InputTextFieldBorderLabel from "../../components/Common/InputTextFieldBorderLabel/InputTextFieldBorderLabel"
import PermissionCard from "../../components/Common/RoleCard/PermissionListItem"
import Button from "../../components/Common/Button/Button"
import Spinner from "../../components/Common/Spinner/Spinner"
import ConfirmPopup from "../../components/Common/ConfirmPopup/ConfirmPopup"


/**
 * A component for displaying what permission a certain role has.
 * 
 * @author Team Mango (Group 4)
 * @since 2024-05-08
 * @version 1.0
 */

export default function RoleCreate() {
	const hasPreviousState = location.key !== "default"
	const { token } = useContext(AccountContext)
	const context = useContext(AccountContext)


	const [roleName, setRoleName] = useState("")
	const [originalRoleName, setOriginalRoleName] = useState("")
	const navigate = useNavigate()
	const [permissions, setPermissions] = useState([])
	const [loading, setIsLoading] = useState(true)
	const [goBackPopup, setGoBackPopup] = useState(false)
	const [isBlocking, setIsBlocking] = useState(false)
	const [errorMessage, setErrorMessage] = useState("")

	const [allMap, setAllMap] = useState(new Map())
	const [selectedMap, setselectedMap] = useState(new Map())

	
	useEffect(() => {
		(async () => {
			try {
				const response = await fetch("/api/permissions", { headers: { token } })
				if (!response.ok) {
					setIsLoading(false)
					throw new Error("Kunde inte hämta rättigheter")
				}
				const json = await response.json()
				json.forEach(permission => {
					setAllMap(allMap.set(permission.permissionId, permission))
				})
				setPermissions(json)
				setIsLoading(false)
			} catch (ex) {
				setErrorToast("Kunde inte hämta rättigheter")
				setIsLoading(false)
				console.error(ex)
			}
		})()
		setOriginalRoleName(roleName)
	}, [token])

	
	useEffect(() => {
		setIsBlocking(roleName != originalRoleName || selectedMap.size > 0)
	}, [roleName, originalRoleName, selectedMap])

	const blocker = useBlocker(() => {
		if (isBlocking) {
			setGoBackPopup(true)
			return true
		}
		return false
	})
	
	if (!isAdminUser(context)) {
		window.location.replace("/404")
		return null
	}

	const handleNavigation = () => {
		if (hasPreviousState) {
			navigate("/admin")
		} else {
			navigate("/plan")
		}
	}

	const handleRoleAdd = () => {
		if (checkInput() === true) {
			setIsBlocking(false)
			addRole()
		}
	}

	const checkInput = () => {
		if (roleName === "") {
			setErrorMessage("Rollen måste ha ett namn")
			return false
		} else {
			setErrorMessage("")
		}
		return true
	}

	async function addRole() {
		setErrorMessage("")
		if (!roleName.match(/^([-a-zA-Z0-9_åöäÅÄÖ]+)$/)) {
			return setErrorMessage("Ogiligt rollnamn")
		}
		const response = await fetch("/api/roles", {
			method: "POST",
			headers: { "Content-Type": "application/json", token},
			body: JSON.stringify({
				roleName: roleName
			})
		})
		if (!response.ok) {
			if (response.status === 400) {
				setErrorMessage("Rollnamn finns redan")
			} else {
				setErrorMessage("Kunde inte skapa roll")
				console.error("Kunde inte skapa roll")
			}
		} 
		const responseJson = await response.json()

		const mapToList = Array.from(selectedMap.keys())
		
		const params = new URLSearchParams({
			newPermissionIds: mapToList
		})

		const response2 = await fetch(`/api/permissions/role/${responseJson.roleId}/edit/permissions?${params}`,
			{
				method: "PUT",
				headers: { "Content-Type": "application/json", token }
			}
		)

		if (!response2.ok) {
			console.log(response.text)
			console.log(mapToList)
			setErrorMessage("Kunde inte ändra rollens rättigheter")
			return
		}

		toast.success("Rollen har skapats")
		navigate("/admin")
	}

	function handleButtonToggle(permissionId) {
		let permission = allMap.get(permissionId)
		permission.newToggledState = !permission.newToggledState
		if (permission.newToggledState) {
			addToMap(permissionId, permission)
		} else {
			removeFromMap(permissionId)
		}
	}

	const addToMap = (permissionId, permission) => {
		setselectedMap(prevMap => {
			const newMap = new Map(prevMap)
			newMap.set(permissionId, permission)
			return newMap
		})
	}

	const removeFromMap = (permissionId) => {
		setselectedMap(prevMap => {
			const newMap = new Map(prevMap)
			newMap.delete(permissionId)
			return newMap
		})
	}

	return (
		<div>
			<Divider option={"h2_left"} title={"Skapa roll"} /> 
			<br/>
			<InputTextFieldBorderLabel 
				id={"register-user-username-input"} 
				text={roleName}
				type={"role"} 
				label= {"Namn på roll"} 
				onChange={(event) => {
					setRoleName(event.target.value)
					setIsBlocking(true)
					
				}}
				errorMessage={errorMessage}
			/>

			{loading ? <Spinner /> : (
				<div>
					{ permissions.slice(1).map((permission, index) => (
						<PermissionCard
							item={permission.permissionName}
							key={index + 1}
							id={permission.permissionId}
							toggled={selectedMap.has(permission.permissionId)}
							changeToggled={() => handleButtonToggle(permission.permissionId)}
						/>
					))}
				</div>
			)}

			<div style={{ marginTop: "1rem", display: "flex", justifyContent: "space-between", width: "100%" }}>
				<Button 
					outlined={true} 
					onClick={() => {
						handleNavigation()

					}}>
					<p>Tillbaka</p>
				</Button>
				<Button 
					onClick={() => {
						handleRoleAdd()
					}}
				>
					<p>Lägg till</p>
				</Button>
			</div>

			<ConfirmPopup
				popupText="Du har osparade ändringar. Är du säker att du lämna?"
				showPopup={goBackPopup}
				setShowPopup={setGoBackPopup}
				confirmText="Lämna"
				backText="Avbryt"
				onClick={
					async () => {
						blocker.proceed()
					}
				}
			/>

		</div>
        
        
	)
}