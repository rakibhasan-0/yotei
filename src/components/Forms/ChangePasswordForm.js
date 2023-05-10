import React, {useContext, useState} from "react"
import Button from "react-bootstrap/Button"
import {AccountContext} from "../../context"
import Form from "react-bootstrap/Form"


/**
 * Form for creating a new password
 * 
 * @author Team Quattro Formaggio (Group 1)
 */
export default function ChangePasswordForm() {

	const [statusColor, setStatusColor] = useState("green")
	const [statusMessage, setStatusMessage] = useState(null)
	const [newPassword, setNewPassword] = useState("")
	const [verifyNewPassword, setVerifyNewPassword] = useState("")
	const [password, setPassword] = useState("")
	const {token, userId} = useContext(AccountContext)


	/**
     * Clear the form
     */
	function clearForm() {
		setNewPassword("")
		setVerifyNewPassword("")
		setPassword("")
	}

	/**
     * Checks the HTTP status code for the login credentials.
     * @param {*} response the HTTP response.
     * @returns true if HTTP status code is 200, otherwise false.
     */
	function verifyPasswordChange(response) {
		if (!response.ok) {
			setStatusColor("#BE3B41")
			if (response.status === 500) {
				setStatusMessage("Internt fel. ")
			} else {
				response.text().then(text => {
					setStatusMessage(text)
				})
			}
			clearForm()
			return false
		}
		setStatusColor("green")
		setStatusMessage("Lösenord bytt!")
		clearForm()
		return true
	}

	/**
     * Is called when the change password button is clicked.
     * If user credentials are correct, the password will be changed.
     */
	async function changePasswordClicked() {
		const requestOptions = {
			headers: {"Content-type": "application/json", token},
			method: "PUT",
			body: JSON.stringify({newPassword: newPassword, verifyNewPassword: verifyNewPassword, oldPassword: password, id: userId})
		}
		const response = await fetch("/user/updatepassword", requestOptions)
		verifyPasswordChange(response)
	}

	/**
     * This function makes it possible to change password with "Enter" after entering info.
     * @param event
     */
	function handleKeyDown(event) {
		if (event.key === "Enter") {
			changePasswordClicked().then(() => {})
		}
	}

	return (
		<div>
			<Form style={{ maxWidth: 500}} className="change-username-form">
				<Form.Group className="mb-3" controlId="formBasicEmail">
					<Form.Label className="">Nuvarande lösenord</Form.Label>
					<Form.Control type="password" value={password} placeholder="" onChange={e => {setPassword(e.target.value)}}/>
				</Form.Group>

				<Form.Group className="mb-3" controlId="formBasicEmail">
					<Form.Label className="">Nytt lösenord</Form.Label>
					<Form.Control type="password" value={newPassword} placeholder="" onChange={e => {setNewPassword(e.target.value)}}/>
				</Form.Group>

				<Form.Group className="mb-3" controlId="formBasicPassword">
					<Form.Label className="">Upprepa lösenord</Form.Label>
					<Form.Control type="password" value={verifyNewPassword} placeholder="" onKeyDown={e => {handleKeyDown(e)}} onChange={e => {setVerifyNewPassword(e.target.value)}} />
				</Form.Group>

				<Button className="w-1 btn btn-color mt-3" onClick={changePasswordClicked} >
                    Byt lösenord
				</Button>
				{statusMessage ? <p style={{color: statusColor}}>{statusMessage}</p> : null}
			</Form>
		</div>
	)
}