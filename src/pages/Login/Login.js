import React from "react"
import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { useCookies } from "react-cookie"
import { AccountContext } from "../../context"
import Button from "../../components/Common/Button/Button"
import InputTextFieldBorderLabel from "../../components/Common/InputTextFieldBorderLabel/InputTextFieldBorderLabel"

/**
 * This is the login page, it is the first page the user will see
 * when opening the program. Navigates to homepage
 * when user logs in. If user credentials are incorrect,
 * an appropriate error message is displayed.
 * 
 * @author Team Verona (Group 5), Team Hot Pepper (Group 7) (28/4)
 * @version 1.0
 */
function Login() {
	const [errorMsg, setErrorMsg] = useState(null)
	const [username, setUsername] = useState("")
	const [password, setPassword] = useState("")
	const [cookies, setCookies] = useCookies(["token"])
	const navigate = useNavigate()
	const { token, setToken } = useContext(AccountContext)
	const currentPath = window.location.pathname

	/**
	 * Checks the HTTP status code for the login credentials.
	 * If an error occurs, the ErrorMsg is set to display an appropriate message to the user.
	 * @param {*} response the HTTP response.
	 * @returns true if HTTP status code is 200, otherwise false.
	 */
	function loginIsOk(response) {
		if (!response.ok) {
			if (response.status === 400) {
				setErrorMsg("Felaktigt användarnamn eller lösenord.")
			} else if (response.status === 406) {
				setErrorMsg("Fyll i alla fält.")
			} else if (response.status === 500) {
				setErrorMsg("Internt fel.")
			}
			return false
		}

		if (response.status === 200) {
			response.text().then(token => {
				//No expiry date set for the cookie so it will be deleted when the browser is closed
				setCookies("token", token, { secure: false, path: "/" })
				setToken(token)
			})
			return true
		}
	}

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
		const requestOptions = {
			headers: { "Content-type": "application/json", token },
			method: "POST",
			body: JSON.stringify({ username: username, password: password })
		}
		const response = await fetch("/user/verify", requestOptions)

		if (loginIsOk(response)) {
			if (currentPath === "/" || currentPath === "" || currentPath === undefined) {
				navigate("/plan")
			} else {
				navigate(currentPath)
			}
		}
	}

	/**
	 * This function makes it possible to log in with "Enter".
	 * Only works if password field is active.
	 * @param event
	 */
	function handleKeyDown(event) {
		if (event.key === "Enter") {
			loginClicked().then(() => { })
		}
	}

	return (
		<div style={{ maxWidth: 360 }} className="center2">
			<img style={{ maxWidth: 300 }} src="/ubk-logga.jpg" alt="This is the logo for UBK" className="center mb-5" />
			<div style={{ width: 320 }}>
				<div>
					<InputTextFieldBorderLabel id={"username-input"} type={"user"} label= {"Användarnamn"} onChange={e => {setUsername(e.target.value)}}></InputTextFieldBorderLabel>
					<div style={{height: "29px"}}></div>
					<InputTextFieldBorderLabel id={"password-input"} type={"password"} label={"Lösenord"} onChange={e => {setPassword(e.target.value)}} onKeyUp={e => {handleKeyDown(e)}}></InputTextFieldBorderLabel>
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
					{errorMsg ? <p style={{ color: "red" }}>{errorMsg}</p> : null}
				</div>
			</div>
		</div>
	)
}
export default Login