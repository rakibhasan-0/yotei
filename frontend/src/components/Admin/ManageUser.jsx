import React, { useState, useEffect, useContext } from "react"
import Button from "../Common/Button/Button"
import styles from "./AdminComponent.module.css"
import { AccountContext } from "../../context"
import Divider from "../Common/Divider/Divider"
import InputTextFieldBorderLabel from "../../components/Common/InputTextFieldBorderLabel/InputTextFieldBorderLabel"
import Dropdown from "../../components/Common/List/Dropdown"
import {setError as setErrorToast, setSuccess as setSuccessToast} from "../../utils"


/**
 * Component made for the admin page. Made to handle the add user 
 * feature on the admin page.
 *
 *  @author Chimera (Group 4), Team Mango (Group 4), Team Durian (Group 3)
 *  @version 3.0
 *  @since 2024-05-16
 *  @returns Component for handling adding a user meant to be used on another page.
 */

export default function ManageUser() {
	const {token} = useContext(AccountContext)

	// User management
	const [users, setUsers] = useState()
	const [user, setUser] = useState()
	const [mgmError, setMgmError] = useState()
	const [manageUserRole, setManageUserRole] = useState()
	const [mgmConfirmUser, setMgmConfirmUser] = useState()
	
	// Adding users
	const [usernameError, setUsernameError] = useState()
	const [passwordError, setPasswordError] = useState()
	const [userNameInput, setUserName] = useState("")	
	const [passwordInput, setPasswordInput] = useState("")	
	const [confirmPasswordInput, setConfirmPasswordInput] = useState("")
	const [roleInput, setRoleInput] = useState()
	
	const [roles, setRoles] = useState([])

	const addUser = async () => {
		setUsernameError("")
		setPasswordError("")
		if (!userNameInput.match(/^([-a-zA-Z0-9_åöäÅÄÖ]+)$/)) {
			return setUsernameError("Ogiligt användarnamn")
		}
		if (passwordInput !== confirmPasswordInput) {
			return setPasswordError("Lösenorden matchar inte")
		}
		const response = await fetch("/api/users", {
			method: "POST",
			headers: { "Content-Type": "application/json", token },
			body: JSON.stringify({
				username: userNameInput,
				password: passwordInput,
				userRole: 0,
				roleId: roleInput.index
			})
		})
		if (!response.ok) {
			return setErrorToast(await response.text())
		}
		const user = await response.json()
		setUsers(prev => {
			return [...prev, user]
		})
		setRoleInput(undefined)
		setUserName("")
		setPasswordInput("")
		setConfirmPasswordInput("")
		setSuccessToast("Användare tillagd")
	}
	
	const removeUser = async () => {
		setMgmError("")
		if (mgmConfirmUser !== user.username) {
			return setMgmError("Användarnamn matchar inte")
		}
		const response = await fetch(`/api/users/${user.userId}`, {
			method: "DELETE",
			headers: { "Content-Type": "application/json", token }	
		})
		if (!response.ok) {
			return setErrorToast("Kunde inte ta bort användare")
		}
		setSuccessToast("Användare borttagen")
		setUsers(prev => {
			return prev.filter(u => u.userId !== user.userId)
		})
		setUser(undefined)
		setManageUserRole(undefined)
		setMgmConfirmUser("")
		setSuccessToast("Användare borttagen")
	}

	const mutateUser = async () => {
		setMgmError("")
		if (mgmConfirmUser !== user.username) {
			return setMgmError("Användarnamn matchar inte")
		}
		const response = await fetch(`/api/users/${user.userId}/setrole/${manageUserRole.index}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json", token }	
		})
		if (!response.ok) {
			return setErrorToast("Kunde inte ändra roll för användare")
		}
		setUser(undefined)
		setManageUserRole(undefined)
		setMgmConfirmUser("")
		setSuccessToast("Användarroll ändrad")
	}

	useEffect(() => {
		fetch("/api/users", {
			headers: { "Content-Type": "application/json", token }
		}).then(async response => {
			if (!response.ok) {
				return setErrorToast("Kunde inte hämta användare")
			}
			const json = await response.json()
			setUsers(json)
		})

		fetch("/api/roles", { 
			headers: { token } 
		}).then(async response => {
			if (!response.ok) {
				return setErrorToast("Kunde inte hämta roller")
			}
			const json = await response.json()
			setRoles(json)
		})
	}, [token])

	return (
		<div>
			<Divider option={"h2_left"} title={"Lägg till användare"} />
			<div className='mb-2' style={{height: 0.5}} />
			<InputTextFieldBorderLabel errorMessage={usernameError} id={"register-user-username-input"} text={userNameInput} type={"user"} label= {"Användarnamn"} onChange={(event) => setUserName(event.target.value)}/>
			<div className='mb-2' />
			<InputTextFieldBorderLabel errorMessage={passwordError} id={"register-user-password-input"} text={passwordInput} type={"password"} label={"Lösenord"} onChange={(event) => setPasswordInput(event.target.value)}/>
			<div className='mb-2' />
			<InputTextFieldBorderLabel id={"register-user-password-confirm-input"} type={"password"} text={confirmPasswordInput} label={"Bekräfta lösenord"} onChange={(event) => setConfirmPasswordInput(event.target.value)}/>
			<div className='mb-2' />
			<Dropdown 
				id={"admin-new-user-pick-role"} centered={true} 
				text={roleInput?.role || "Välj roll"}>
				{roles?.map((role, index) => (
					<div 
						className={styles.dropdownRow} 
						key={index} 
						onClick={() => setRoleInput({role: role.roleName, index: role.roleId})}>
						<p className={styles.dropdownRowText}>{role.roleName}</p>
					</div>
				))}
			</Dropdown>
			<div className='d-flex justify-content-center'>
				<Button disabled={!userNameInput || !passwordInput || !confirmPasswordInput || !roleInput} id='register-user-btn' width={"100%"} onClick={addUser}>
					Lägg till användare
				</Button>
			</div>
			
			<Divider option={"h2_left"} title={"Hantera användare"} /> 
			<Dropdown 
				id={"admin-new-user-pick-role"} 
				centered={true} 
				text={user?.username || "Välj användare"}>
				{users?.map((user, index) => (
					<div className={styles.dropdownRow} key={index} onClick={() => {
						setUser(user)
					}}>
						<p className={styles.dropdownRowText}>{user.username}</p>
					</div>
				))}
			</Dropdown>
			<div className='mb-3' />
			<InputTextFieldBorderLabel errorMessage={mgmError} id = {"confirm-username-input"} text={mgmConfirmUser} type={"user"} label= {"Bekräfta användarnamn"} onChange={(event) => setMgmConfirmUser(event.target.value)}/>
			<div className='mb-2' />
			<Dropdown 
				centered={true} 
				text={manageUserRole?.role || "Välj roll"}>
				{user ? roles?.map((role, index) => (
					<div className={styles.dropdownRow} key={index} onClick={() => setManageUserRole({role: role.roleName, index: role.roleId })}>
						<p className={styles.dropdownRowText}>{role.roleName}</p>
					</div>
				)) : <div className={styles.dropdownRow}>
					<p className={styles.dropdownRowText}>Välj användare först</p>
				</div>}
			</Dropdown>
			<Button disabled={!user || !manageUserRole || !mgmConfirmUser} width={"100%"} onClick={mutateUser}>
				Ändra rättigheter	
			</Button>
			<div className='mb-2' />
			<Button disabled={!user || !mgmConfirmUser} width={"100%"} onClick={removeUser}>
					Ta bort användare
			</Button>
			
		</div>	
	)
}
