import { useNavigate, unstable_useBlocker as useBlocker } from "react-router"
import { useEffect, useState, useContext } from "react"
import { AccountContext } from "../../context"
import { setError as setErrorToast } from "../../utils"
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

	const [roleName, setRoleName] = useState("")
	const [originalRoleName, setOriginalRoleName] = useState("")
	const navigate = useNavigate()
	const [permissions, setPermissions] = useState([])
	const [loading, setIsLoading] = useState(true)
	const [goBackPopup, setGoBackPopup] = useState(false)
	const [isBlocking, setIsBlocking] = useState(false)
	const [isToggled, setIsToggled] = useState(false)
	const [errorMessage, setErrorMessage] = useState("")
	

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
		setOriginalRoleName(roleName)
	}, [token])

	useEffect(() => {
		setIsBlocking(roleName != originalRoleName)
	}, [roleName, originalRoleName])


	const handleNavigation = () => {
		if (hasPreviousState) {
			navigate("/admin")
		} else {
			navigate("/plan")
		}
	}

	const blocker = useBlocker(() => {
		if (isBlocking) {
			setGoBackPopup(true)
			return true
		}
		return false
	})


	const handleRoleAdd = () => {
		if (checkInput() === true) {
			setIsBlocking(false)
			addRole()
			console.log("Role added")
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
				roleName: roleName,
				permissions: permissions
			})
		})
		if (!response.ok) {
			setErrorMessage("Kunde inte skapa roll")
			console.error("Kunde inte skapa roll")
		} else {
			toast.success("Rollen har skapats")
			navigate("/admin")
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
					{ permissions.map((permission, index) => (
						<PermissionCard
							item={permission.permissionName}
							key={index}
							id={permission.permissionId}
							toggled={isToggled}
							changeToggled={() => handleButtonToggle(permission.permissionId)}
						/>
					))}
				</div>
			)}
			<PermissionCard
				item={"dummy permission1"}
				key={"exercise.id1"}
				id={"exercise.id1"}
				toggled={isToggled}
				changeToggled={handleButtonToggle}
			/>
			<PermissionCard
				item={"dummy permission2"}
				key={"exercise.id2"}
				id={"exercise.id2"}
				toggled={isToggled}
				changeToggled={handleButtonToggle}
			/>
			<PermissionCard
				item={"dummy permission3"}
				key={"exercise.id3"}
				id={"exercise.i3d"}
				toggled={isToggled}
				changeToggled={handleButtonToggle}
			/>
			<PermissionCard
				item={"dummy permission4"}
				key={"exercise.id4"}
				id={"exercise.id4"}
			/>

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
						setIsBlocking(false)
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
						setIsToggled(false)
						blocker.proceed()
					}
				}
			/>

		</div>
        
        
	)
}