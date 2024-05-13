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
import ConfirmPopup from "../../components/Common/Popup/Popup"


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
	const navigate = useNavigate()
	const [permissions, setPermissions] = useState([])
	const [loading, setIsLoading] = useState(true)
	const [showMiniPopup, setShowMiniPopup] = useState(false)
	const [isBlocking, setIsBlocking] = useState(false)
	const [errorMessage, setErrorMessage] = useState("")
	

	useEffect(() => {
		(async () => {
			try {
				const response = await fetch("/api/permissons", { headers: { token } })
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


	const handleNavigation = () => {
		if (hasPreviousState) {
			navigate("/admin")
		} else {
			navigate("/plan")
		}
	}

	const blocker = useBlocker(() => {
		if (isBlocking) {
			setShowMiniPopup(true)
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
		const response = await fetch("/api/roles", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				token
			},
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
						/>
					))}
				</div>
			)}
			<PermissionCard
				item={"dummy permission1"}
				key={"exercise.id"}
				id={"exercise.id"}
			/>
			<PermissionCard
				item={"dummy permission2"}
				key={"exercise.id"}
				id={"exercise.id"}
			/>
			<PermissionCard
				item={"dummy permission3"}
				key={"exercise.id"}
				id={"exercise.id"}
			/>
			<PermissionCard
				item={"dummy permission4"}
				key={"exercise.id"}
				id={"exercise.id"}
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
				showPopup={showMiniPopup}
				setShowPopup={setShowMiniPopup}
				confirmText="Lämna"
				backText="Avbryt"
				onClick={blocker.proceed}
			/>

		</div>
        
        
	)
}