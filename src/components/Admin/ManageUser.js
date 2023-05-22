import React from "react"
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import "./AdminComponent.css"
import Select from "react-select"
import { X } from "react-bootstrap-icons"
import { AccountContext } from "../../context"
import { reactSelectStyle } from "../../Globals/global_style"
import { Cookies } from "react-cookie"
import { decodeToken } from "react-jwt"
import { logOut, checkRole } from "/src/utils"
import { Roles } from "/src/context"


/**
 * Component made for the admin page. Made to handle the add user 
 * feature on the front-end..
 *
 *  @author Team Quattro Formaggi (Group 1)
 */
class ManageUser extends React.Component {


	/**
     * Constructor.
     * Maps functions.
     */
	constructor(props) {
		super(props)

		this.userSelectionRef = React.createRef()
		this.roleSelectionRef = React.createRef()
		this.prepareRegistration = this.prepareRegistration.bind(this)

		this.state = {value: "",
			name: this.props.name,
			desc: this.props.desc,
			time: this.props.time,
			users: this.props.users,
			fetchTagsFailed: false,
			allUsers: this.props.allUsers,
			gotUsers: false,
			newUserName: "",
			newUserPassword: "",
			newUserRole: null,
			changeUserRole: null,
			selectedUser: null
		}
		this.prepareRemove = this.prepareRemove.bind(this)
		this.prepareChangeRole = this.prepareChangeRole.bind(this)
		this.overlayCloseOnEscape = this.overlayCloseOnEscape.bind(this)
		this.overlayClose = this.overlayClose.bind(this)
		this.overlayOpen = this.overlayOpen.bind(this)
	}

	/**
     * When the components are ready fetch references to them, give initial values,
     * fetch users and add eventlistener.
     */
	componentDidMount() {
		this.registerUserUsernameInput = document.getElementById("register-user-username-input")
		this.registerUserPasswordInput = document.getElementById("register-user-password-input")
		this.registerAdminCheck = document.getElementById("register-admin-check")
		this.registerUserStatusLbl = document.getElementById("register-user-status-lbl")
		this.registerUserBtn = document.getElementById("register-user-btn")

		this.removeUserStatusLbl = document.getElementById("remove-user-status-lbl")
		this.removeUserBtn = document.getElementById("remove-user-btn")
		this.changeRoleStatusLbl = document.getElementById("change-role-status-lbl")
		this.changeRoleBtn = document.getElementById("change-role-btn")
        
		this.overlay = document.getElementById("overlay-admin")
		this.confirmLbl = document.getElementById("confirm-lbl")
		this.confirmUserInput = document.getElementById("confirm-user-input")
		this.confirmUserStatusLbl = document.getElementById("confirm-user-status-lbl")
		this.confirmUserBtn = document.getElementById("confirm-user-btn")

		if (this.state.gotUsers === false) {
			this.getUsers()
			this.setState({
				gotUsers: true
			})
		}
		document.addEventListener("keydown", this.overlayCloseOnEscape)
	}

	componentWillUnmount() {
		document.removeEventListener("keydown", this.overlayCloseOnEscape)
	}

	/**
     * Defines the html for the component.
     */
	render() {
		return (
			<div>
				<Form className='mb-5'>
					<h2>Lägg till användare</h2>
					<Form.Group className='row mt-3'>
						<div className='admin-container container-fluid'>
							<Form.Control type='user' 
								placeholder='Användarnamn' 
								id='register-user-username-input' 
								onChange={(event) => this.setState({newUserName: event.target.value})}/>
						</div>
					</Form.Group>

					<Form.Group className='row mt-3 '>
						<div className='admin-container container-fluid'>
							<Form.Control type='password' 
								placeholder='Lösenord' 
								id='register-user-password-input'
								onChange={(event) => this.setState({newUserPassword: event.target.value})} />
						</div>
					</Form.Group>

					<Form.Group className='row mt-3 mb-3'>
						<div className='admin-container container-fluid'>
							<Select	id='new-user-role-select'
								className="dropdown-selection"
								options={Object.values(Roles)
									.map((role, index) => {
										return {label: this.capitalizeFirstLetter(role), value: index}
									})}
								placeholder='Välj roll'
								onChange={(role) => this.setState({newUserRole: role})}
								noOptionsMessage={() => "Hittade ingen roller"}
								isSearchable = {false}
								isClearable = {true}
								styles={reactSelectStyle}
							/>
						</div>
					</Form.Group>
					<Form.Group className='row'>
						<div className='admin-container container-fluid'>
							<p id='register-user-status-lbl' className='status-admin' ></p>
						</div>
					</Form.Group>
					<Form.Group className='row'>
						<Button id='register-user-btn' 
							className='btn btn-admin btn-color container-fluid'  
							onClick={this.prepareRegistration} 
							disabled={this.state.newUserName === ""
								|| this.state.newUserPassword === ""
								|| this.state.newUserRole === null}>
                            Lägg till användare
						</Button>
					</Form.Group>
				</Form>

				<Form className='mt-5' onSubmit={(e) => e.preventDefault()}>
					<h2>Hantera användare</h2>
					<Form.Group className='row mt-3 mb-3'>
						<div className='admin-container container-fluid'>
							<Select	id='choose-user-select'
								className="dropdown-selection"
								options={this.state.allUsers}
								ref={this.userSelectionRef}
								placeholder='Användare'
								onChange={(user) => this.setState({selectedUser: user ? user.value : null})}
								noOptionsMessage={() => "Hittade ingen användare"}
								isSearchable = {false}
								isClearable = {true}
								styles={reactSelectStyle}
							/>
						</div>
					</Form.Group>
					<Form.Group className='row mt-3 mb-3'>
						<div className='admin-container container-fluid'>
							<Select	id='change-user-role-select'
								className="dropdown-selection"
								ref={this.roleSelectionRef}
								options={Object.values(Roles)
									.map((role, index) => {
										return {label: this.capitalizeFirstLetter(role), value: index}
									})}
								filterOption={(role) => this.state.selectedUser && !checkRole(this.state.selectedUser, role.label)}
								placeholder={this.state.selectedUser === null ? "" : this.capitalizeFirstLetter(this.state.selectedUser.userRole)}
								onChange={(role) => this.setState({changeUserRole: role})}
								noOptionsMessage={() => "Hittade ingen roller"}
								isDisabled={this.state.selectedUser === null}
								isSearchable = {false}
								isClearable = {true}
								styles={reactSelectStyle}
							/>
						</div>
					</Form.Group>
					<Form.Group className='row'>
						<div className='admin-container container-fluid'>
							<p id='change-role-status-lbl' className='status-admin' ></p>
						</div>
					</Form.Group>
					<Form.Group className='row'>
						<Button id='change-role-btn' 
							className='btn-admin btn-color container-fluid'  
							onClick={this.prepareChangeRole}
							disabled={this.state.selectedUser === null || 
								this.state.changeUserRole === null} >
                            Ändra roll
						</Button>
					</Form.Group>
					<Form.Group className='row'>
						<div className='admin-container container-fluid'>
							<p id='remove-user-status-lbl' className='status-admin' ></p>
						</div>
					</Form.Group>
					<Form.Group className='row'>
						<Button id='remove-user-btn' 
							className='btn-admin btn-color container-fluid'  
							onClick={this.prepareRemove} 
							disabled={this.state.selectedUser === null} >
                            Ta bort användare
						</Button>
					</Form.Group>
				</Form>
				<div id='overlay-admin'>
					<div className='overlay-box center bg-light'>
						<X className='overlay-close' onClick={this.overlayClose} />
						<Form className='center'>
							<Form.Group className='row'>
								<div className='admin-container container-fluid'>
									<Form.Label id='confirm-lbl' className='float-left'>Ange användarnamnet igen</Form.Label>
									<Form.Control type='text'
										placeholder=''
										id='confirm-user-input'
										onChange={this.confirmButtonSet} />
								</div>
							</Form.Group>
							<Form.Group className='row'>
								<div className='admin-container container-fluid'>
									<p id='confirm-user-status-lbl' className='status-admin' > </p>
								</div>
							</Form.Group>
							<Form.Group className='row'>
								<Button id='confirm-user-btn' className='btn btn-admin btn-color container-fluid'>
                                    Bekräfta
								</Button>
							</Form.Group>
						</Form>   
					</div>
				</div>
			</div>
		)
	}

	capitalizeFirstLetter(str) {
		let newStr = str.toUpperCase()
		return newStr.charAt(0) + newStr.slice(1).toLowerCase()
	}

	/**
    * Method gets all users from the database to the select component
    */
	async getUsers() {
		const requestOptions = {
			method: "GET",
			headers: { "Content-type": "application/json", "token": this.context.token },
		}
		try {
			this.userSelectionRef.current.setValue(null)
			const response = await fetch("/user/all", requestOptions)
			if (response.ok) {
				const data = await response.json()
				this.setState({
					allUsers: data.map((user) => {
						return { label: user.username, value: user }
					})
				})
                
			} else {
				this.setState({
					fetchUsersFailed: true
				})
			}

            
		} catch (error) {
			this.setState({
				fetchUsersFailed: true
			})
		}
	}

	/**
     * Sets up variables sush as currentStatusLabel, successMessage 
     * and the components confirmUserBtn, confirmLbl and confirmUserInput
     * appropriate so the the confirmation window will
     * show correctly and a user will be registered if everything is correct and the
     * confirm button is pressed.
     * @see confirmManage
     * @see responseUpdateStatus
     */
	prepareRegistration() {
		this.currentStatusLabel = this.registerUserStatusLbl
		this.successMessage = `${this.registerUserUsernameInput.value} är tillagd`
		this.confirmUserBtn.onclick = this.confirmRegistration.bind(this)
		this.confirmLbl.innerHTML = "Ange lösenordet igen"
		this.confirmUserInput.type = "password"
		this.overlayOpen()
	}

	/**
     * Sets up variables sush as currentStatusLabel, successMessage 
     * and the components confirmUserBtn, confirmLbl and confirmUserInput
     * appropriate so the the confirmation window will
     * show correctly and a user will be removed if everything is correct and the
     * confirm button is pressed.
     * @see confirmManage
     * @see responseUpdateStatus
     */
	prepareRemove() {
		this.currentStatusLabel = this.removeUserStatusLbl
		this.successMessage = `${this.state.selectedUser.username} är borttagen`
		this.confirmUserBtn.onclick = this.confirmManage.bind(this, `/user/remove/${this.state.selectedUser.userId}`, "DELETE")
		this.confirmLbl.innerHTML = "Ange användarnamnet igen"
		this.confirmUserInput.type = "text"
		this.overlayOpen()
	}

	/**
     * Sets up variables such as currentStatusLabel, successMessage 
     * and the components confirmUserBtn, confirmLbl and confirmUserInput
     * appropriate so the the confirmation window will
     * show correctly and a user will change role if everything is correct and the
     * confirm button is pressed.
     * @see confirmManage
     * @see responseUpdateStatus
     */
	prepareChangeRole() {
		this.currentStatusLabel = this.changeRoleStatusLbl
		this.successMessage = `${this.state.selectedUser.username} är nu ${this.state.changeUserRole.label}`
		this.confirmUserBtn.onclick = this.confirmManage.bind(this, `/user/${this.state.selectedUser.userId}/role/${this.state.changeUserRole.value}`, "POST")
		this.confirmLbl.innerHTML = "Ange användarnamnet igen"
		this.confirmUserInput.type = "text"
		this.overlayOpen()
        
	}

	/**
     * Function called when the confirm button is pressed and after prepareRegistration has run.
     * It will prepare an appropriate message for sending to the API.
     * @see prepareRegistration
     */
	confirmRegistration() {
		if (this.state.newUserPassword !== this.confirmUserInput.value) {
			this.changeStatus(this.confirmUserStatusLbl, "Fel lösenord", "#f00")
			return
		}
		else if(!this.validateUsername(this.state.newUserName)){
			//Username contains unvalid characters, see validateUsername method
			this.changeStatus(this.confirmUserStatusLbl, "Otillåtna tecken i användarnamnet. "
                + "Kan innehålla 0-9, a-ö (versaler och gemener), _ och -", "#f00")
			return
		}
		else {
			const data = {
				"username" : this.state.newUserName,
				"password" : this.state.newUserPassword,
				"userRole" : this.state.newUserRole ? this.state.newUserRole.value : 0
			}
			const requestOptions = {
				method: "POST",
				headers: { "Content-Type": "application/json", token: this.context.token},
				body: JSON.stringify(data)
			}
			const path = "/user/register"
			this.sendData(path, requestOptions)
			this.setState({
				newUserName: "",
				newUserPassword: ""
			})
			this.overlayClose()
		}
	}

	/**
     * Validate that a username is valid (does not contain problematic characters) using regex.
     * @param {String} userName
     */
	validateUsername(userName){
		return userName.match(/^([-a-zA-Z0-9_åöäÅÄÖ]+)$/)
	}


	/**
     * Function called when the confirm button is pressed and after prepareRemove or prepareChangeRole has run.
     * It will prepare an appropriate message for sending to the API.
     * @see prepareRemove
     * @see prepareChangeRole
     */
	async confirmManage(path, method) {
		const cookie = new Cookies().get("token")
		const affectedUser = this.state.selectedUser
        
		if (affectedUser.username !== this.confirmUserInput.value) {
			this.changeStatus(this.confirmUserStatusLbl, "Fel användarnamn", "#f00")
			return
		}
		const requestOptions = {
			method: method,
			headers: { "Content-Type": "application/json", token: this.context.token}
		}

		//Send the request
		const response = await fetch(path, requestOptions)
        
		//Update GUI and avaliable users
		this.responseUpdateStatus(response)
		this.roleSelectionRef.current.setValue(null)
		this.getUsers()
		this.overlayClose()

		//Fetch name of current user
		var currentUserName = decodeToken(cookie).username

		//If the action affected the currently logged in account, log out and redirect!
		if(response.ok && affectedUser === currentUserName){
			logOut()
		}
	}
    
	/**
     * Sends data to the back-end.
     * @param {String} path path to API to send data to
     * @param {JSON} requestOptions data to send to the API
     */
	async sendData(path, requestOptions) {
		var response = await fetch(path, requestOptions)
		this.responseUpdateStatus(response)
		this.getUsers()
	}

	/**
     * Sets a status text to a status label set in any of the prepare functions.
     * The status is according to the response from back-end.
     * Returns true if status was ok and false if status was not
     * @param {JSON} response response from the back-end
     * @see prepareRegistration
     * @see prepareRemove
     * @see prepareChangeRole
     */
	responseUpdateStatus(response){
		if (response.ok) {
			this.changeStatus(this.currentStatusLabel , this.successMessage, "#0f0")
		}
		else {
			if (response.status === 404) {
				this.changeStatus(this.currentStatusLabel, "Server hittades inte", "#f00")
			}
			else {
				response.text().then(text => {
					this.changeStatus(this.currentStatusLabel, text, "#f00")
				})
			}
		}
	}
    
	/**
     * Sets a status text to a label by given parameters.
     * @param {HTMLElement} statusLabel the label to set the text to
     * @param {String} text the status text
     * @param {String} color the text color
     */
	changeStatus(statusLabel, text, color) {
		statusLabel.innerHTML = text
		statusLabel.style.color = color
	}

	/**
     * Function made for the key press eventlistener created in componentDidMount
     * to make the overlay close on escape press.
     * @param {*} e key press event
     * @see componentDidMount
     * @see overlay
     */
	overlayCloseOnEscape(e) {
		if (e.key === "Escape") {
			this.overlayClose()
		}
	}

	/**
     * Opens the overlay with the confirm window.
     */
	overlayOpen() {
		this.overlay.style.visibility = "visible"
	}

	/**
     * Closes the overlay with the confirm window.
     * The window is reset too.
     */
	overlayClose() {
		this.overlay.style.visibility = "hidden"
		this.confirmUserInput.value = ""
		this.changeStatus(this.confirmUserStatusLbl, "", "#fff")
	}
}

ManageUser.contextType = AccountContext

export default ManageUser