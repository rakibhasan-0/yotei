import React from "react"
import { useState, useEffect, useContext,useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useCookies } from "react-cookie"
import { AccountContext } from "../../context"
import Button from "../../components/Common/Button/Button"
import InputTextFieldBorderLabel from "../../components/Common/InputTextFieldBorderLabel/InputTextFieldBorderLabel"
import {setError as setErrorToast} from "../../utils"


/**
 * This is the login page, it is the first page the user will see
 * when opening the program. Navigates to homepage
 * when user logs in. If user credentials are incorrect,
 * an appropriate error message is displayed.
 * 
 * @author Team Verona (Group 5), Team Hot Pepper (Group 7) (28/4), Dragon (2023-05), Team Durian (Group 3) (2024-04-23)
 * @version 2.0
 */
export default function Login() {
	const [username, setUsername] = useState("")
	const [password, setPassword] = useState("")
	const [cookies, setCookies] = useCookies(["token"])
	const navigate = useNavigate()
	const { token, setToken } = useContext(AccountContext)
	const currentPath = window.location.pathname
	const passwordField = useRef(null)

	/**
	 * Redirects the user to the given link if the user has previously logged in.
	 */
	useEffect(() => {
		if (cookies.token) {
			if (currentPath === "/" || currentPath === "" || currentPath === undefined) {
				navigate("/plan")
			} else {
				navigate(currentPath)
			}
		}
	})

	/**
	 * Is called when the login button is clicked.
	 * If user credentials are correct, the user is redirected to the home page.
	 */
	async function loginClicked() {
		const controller = new AbortController()
		const id = setTimeout(() => {
			controller.abort()
			setErrorToast("Anslutning till servern misslyckades.")
		}, 5 * 1000)
		const response = await fetch("/api/users/verify", {
			headers: { "Content-type": "application/json", token },
			method: "POST",
			body: JSON.stringify({ username: username, password: password }),
			signal: controller.signal
		})
		clearTimeout(id)
		if (!response.ok) {
			if (response.status === 400) {
				setErrorToast("Felaktigt användarnamn eller lösenord.")
			} else if (response.status === 406) {
				setErrorToast("Fyll i alla fält")
			} else if (response.status === 500) {
				setErrorToast("Något gick fel på servern")
			} else {
				setErrorToast("Ett okänt fel har uppstått")
			}
			return
		}
		response.text().then(token => {
			setCookies("token", token, { secure: false, path: "/" })
			setToken(token)
			// Redirect
			if (currentPath === "/" || currentPath === "" || currentPath === undefined) {
				return navigate("/plan")				
			}
			navigate(currentPath)
		})
	}

	/**
	 * This function makes it possible to log in with "Enter".
	 * Only works if password field is active.
	 * @param event
	 */
	function loginIfClickedEnter(event) {
		if (event.key === "Enter") {
			loginClicked().then(() => { })
		}
	}

	/**
	 * Focuses the Password-field if the keypress was an Enter
	 * @param event 
	 */
	function focusPassword(event){
		if (event.key === "Enter") {
			passwordField.current.focus()
		}
	}


	return (
		
		<div style={{ maxWidth: 360 }} className="center2">
			<img style={{ maxWidth: 300 }} src="/ubk-logga.jpg" alt="This is the logo for UBK" className="center mb-5" />
			<div style={{ width: 320 }}>
				<div>
				<title>Logga in</title>
					<InputTextFieldBorderLabel 
						id={"username-input"} 
						type={"user"} 
						label= {"Användarnamn"} 
						onChange={e => {setUsername(e.target.value)}} 
						onKeyUp={e =>{focusPassword(e)}}>
					</InputTextFieldBorderLabel>
					<div style={{height: "29px"}}></div>
					<InputTextFieldBorderLabel 
						id={"password-input"} 
						ref={passwordField} //Used to be able to focus the input inside the InputTextField
						type={"password"} 
						label={"Lösenord"} 
						onChange={e => {setPassword(e.target.value)}}
						onKeyUp={e => {loginIfClickedEnter(e)}}>
					</InputTextFieldBorderLabel>
					<div style={{height: "29px"}}></div>
					<div className="row">

						{/* SPACER */}
						<div className="col-7" />

						<div className="col-5">
							<Button id={"login-button"} onClick={loginClicked}>
								Logga in
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
