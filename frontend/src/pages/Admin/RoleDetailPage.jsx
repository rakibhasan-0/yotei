import { /*useParams,*/ useNavigate } from "react-router"

//import { useState } from "react"
import { Trash } from "react-bootstrap-icons"

import Divider from "../../components/Common/Divider/Divider"
import InputTextFieldBorderLabel from "../../components/Common/InputTextFieldBorderLabel/InputTextFieldBorderLabel"
import PermissionCard from "../../components/Common/RoleCard/PermissionListItem"
import Button from "../../components/Common/Button/Button"

/**
 * A component for displaying what permission a certain role has.
 * 
 * @author Team Mango (Group 4)
 * @since 2024-05-08
 * @version 1.0
 */

export default function RoleDetailPage() {
	//const { role_id } = useParams()
	//const [userName, setUserName] = useState("")
	const navigate = useNavigate()
	const hasPreviousState = location.key !== "default"
	

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
				onClick={console.log("delete")}
				size="24px"
				style={{ color: "var(--red-primary)", position: "absolute", right: "2rem", top: "rem"}}
			/>	
			<Divider option={"h2_left"} title={"Redigera roll"} /> 
			<br/>
			<InputTextFieldBorderLabel 
				id={"register-user-username-input"} 
				type={"role"} 
				label= {"Namn på roll"} 
				onChange={console.log("Hello") /*(event) => setUserName(event.target.value)*/}
			/>
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
		</div>
        
	)
}