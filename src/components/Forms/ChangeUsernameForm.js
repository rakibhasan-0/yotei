import React from "react"
import Button from "react-bootstrap/Button"

import { useState, useContext } from "react"
import Form from "react-bootstrap/Form"
import {AccountContext} from "../../context"

/**
 * Form for changing username
 * 
 * @author Team Quattro Formaggio (Group 1)
 */
export default function ChangeUsernameForm() {

	const [statusColor, setStatusColor] = useState("green")
	const [statusMessage, setStatusMessage] = useState(null)
	const [newUsername, setNewUsername] = useState("")
	const [password, setPassword] = useState("")
	const {token, userId} = useContext(AccountContext)


	/**
     * Clear the form
     */
	function clearForm() {
		setNewUsername("")
		setPassword("")
	}

	/**
     * Checks the HTTP status code for the login credentials.
     * If an error occurs, the ErrorMsg is set to display an appropriate message to the user.
     * @param {*} response the HTTP response.
     * @returns true if HTTP status code is 200, otherwise false.
     */
	function verifyNameChange(response) {
		if (!response.ok) {
			setStatusColor("#BE3B41")
			if (response.status === 500) {
				setStatusMessage("Internt fel.")
			} else {
				response.text().then(text => {
					setStatusMessage(text)
				})
			}
			return false
		}
		setStatusColor("green")
		setStatusMessage("Användarnamn bytt!")
		clearForm()
		return true
	}

	/**
     * Is called when the change username button is clicked.
     * If user credentials are correct, the username will be changed.
     */
	async function changeUsernameClicked() {
		const requestOptions = {
			headers: {"Content-type": "application/json", token},
			method: "PUT",
			body: JSON.stringify({newUsername: newUsername, password: password, id: userId})
		}
		const response = await fetch("/user/updatename", requestOptions)
		verifyNameChange(response)
	}

	/**
     * This function makes it possible to change username with "Enter" after entering password.
     * @param event
     */
	function handleKeyDown(event) {
		if (event.key === "Enter") {
			changeUsernameClicked().then(() => {})
		}
	}

	return (
		<div>
			<Form style={{ maxWidth: 500}} className="change-username-form">
				<Form.Group className="mb-3" controlId="formBasicEmail">
					<Form.Label className="">Nytt användarnamn</Form.Label>
					<Form.Control type="user" value={newUsername} placeholder="" onChange={e => {setNewUsername(e.target.value)}}/>
				</Form.Group>

				<Form.Group className="mb-3" controlId="formBasicPassword">
					<Form.Label className="">Lösenord</Form.Label>
					<Form.Control type="password" value={password} placeholder="" onKeyDown={e => {handleKeyDown(e)}} onChange={e => {setPassword(e.target.value)}} />
				</Form.Group>

				<Button className="w-1 btn btn-color mt-3" onClick={changeUsernameClicked} >
                    Byt användarnamn
				</Button>
				{statusMessage ? <p style={{color: statusColor}}>{statusMessage}</p> : null}
			</Form>
		</div>
	)
}