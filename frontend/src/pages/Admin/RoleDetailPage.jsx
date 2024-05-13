import { useParams, useNavigate } from "react-router"
import { useEffect, useState, useContext } from "react"
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
import RoleDelete from "../../components/Admin/Delete/RoleDelete"


/**
 * A component for displaying what permission a certain role has.
 * 
 * @author Team Mango (Group 4)
 * @since 2024-05-08
 * @version 1.0
 */

export default function RoleDetailPage() {
	const hasPreviousState = location.key !== "default"
	const { role_id } = useParams()
	const { token } = useContext(AccountContext)

	//const [roleName, setRoleName] = useState("")
	const navigate = useNavigate()
	const [role, setRole] = useState()
	const [permissions, setPermissions] = useState([])
	const [error, setError] = useState()
	const [loading, setIsLoading] = useState(true)
	const [showDeletePopup, setShowDeletePopup] = useState(false)
	


	useEffect(() => {
		fetch(`/api/roles/${role_id}`, {
			headers: { token }
		})
			.then(response => response.json())
			.then(data => {
				setRole(data)
			})
			.catch(ex => {
				setError("Kunde inte hämta roll")
				console.error(ex)
			})
	}, [role_id, token])

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
				text={role?.roleName || ""}
				type={"role"} 
				label= {"Namn på roll"} 
				onChange={console.log("Hello") /*(event) => setUserName(event.target.value)*/}
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
				<Button outlined={true} onClick={handleNavigation}><p>Tillbaka</p></Button>
				<Button onClick={console.log("hello")}><p>Spara</p></Button>
			</div>

			<div>
				<Popup
					title="Ta bort roll"
					isOpen={showDeletePopup}
					setIsOpen={setShowDeletePopup}
					style={{height: "unset"}}>
					<RoleDelete id={"role-delete-popup"} roleID={role_id} name={role?.roleName} setIsOpen={setShowDeletePopup} what={"Rollen"}/>
					{/* <ActivityDelete id={"exercise-delete-popup"} activityID={ex_id} name={exercise?.name} setIsOpen={setShowDeletePopup} what={"Övning"}/> */}
				</Popup>
			</div>
		</div>
        
	)
}