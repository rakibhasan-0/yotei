import React from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import './AdminComponent.css'
import Select from 'react-select'
import { X } from 'react-bootstrap-icons'
import { AccountContext } from '../../context';
import { reactSelectStyle } from '../../Globals/global_style'

/**
 * Component made for the admin page. Made to handle the add user 
 * feature on the front-end.
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

        this.registerButtonSet = this.registerButtonSet.bind(this)
        this.prepareRegistration = this.prepareRegistration.bind(this)

        this.state = {value: '',
                      name: this.props.name,
                      desc: this.props.desc,
                      time: this.props.time,
                      users: this.props.users,
                      fetchTagsFailed: false,
                      allUsers: this.props.allUsers,
                      gotUsers: false
                  }
        this.prepareRemove = this.prepareRemove.bind(this)
        this.manageButtonsSet = this.manageButtonsSet.bind(this)
        this.prepareChangeRole = this.prepareChangeRole.bind(this)
        this.confirmButtonSet = this.confirmButtonSet.bind(this)
        this.overlayCloseOnEscape = this.overlayCloseOnEscape.bind(this)
        this.overlayClose = this.overlayClose.bind(this)
        this.overlayOpen = this.overlayOpen.bind(this)
    }

    /**
     * When the components are ready fetch references to them, give initial values,
     * fetch users and add eventlistener.
     */
    componentDidMount() {
        this.registerUserUsernameInput = document.getElementById('register-user-username-input')
        this.registerUserPasswordInput = document.getElementById('register-user-password-input')
        this.registerAdminCheck = document.getElementById('register-admin-check')
        this.registerUserStatusLbl = document.getElementById('register-user-status-lbl')
        this.registerUserBtn = document.getElementById('register-user-btn')
        this.registerUserBtn.disabled = true

        this.removeUserStatusLbl = document.getElementById('remove-user-status-lbl')
        this.removeUserBtn = document.getElementById('remove-user-btn')
        this.changeRoleStatusLbl = document.getElementById('change-role-status-lbl')
        this.changeRoleBtn = document.getElementById('change-role-btn')
        this.changeRoleBtn.disabled = true
        this.removeUserBtn.disabled = true
        
        this.overlay = document.getElementById('overlay-admin')
        this.confirmLbl = document.getElementById('confirm-lbl')
        this.confirmUserInput = document.getElementById('confirm-user-input')
        this.confirmUserStatusLbl = document.getElementById('confirm-user-status-lbl')
        this.confirmUserBtn = document.getElementById('confirm-user-btn')
        this.confirmUserBtn.disabled = true

        if (this.state.gotUsers === false) {
            this.getUsers()
            this.setState({
                gotUsers: true
            })
        }
        document.addEventListener('keydown', this.overlayCloseOnEscape)
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.overlayCloseOnEscape)
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
                            <Form.Label className='float-left'>Användarnamn</Form.Label>
                            <Form.Control type='user' 
                                placeholder='' 
                                id='register-user-username-input'
                                onChange={this.registerButtonSet} />
                        </div>
                    </Form.Group>

                    <Form.Group className='row mt-3 '>
                        <div className='admin-container container-fluid'>
                            <Form.Label className='float-left'>Lösenord</Form.Label>
                            <Form.Control type='password' 
                                placeholder='' 
                                id='register-user-password-input' 
                                onChange={this.registerButtonSet} />
                        </div>
                    </Form.Group>

                    <Form.Group className='row mt-3'>
                        <div className='admin-container container-fluid'>
                            <Form.Label className='float-left'>Admin</Form.Label>
                            <Form.Check id='register-admin-check' className='float-left' />
                        </div>
                    </Form.Group>
                    <Form.Group className='row'>
                        <div className='admin-container container-fluid'>
                            <p id='register-user-status-lbl' className='status-admin' ></p>
                        </div>
                    </Form.Group>
                    <Form.Group className='row'>
                        <Button id='register-user-btn' className='btn btn-admin btn-color container-fluid'  
                            onClick={this.prepareRegistration} >
                            Lägg till användare
                        </Button>
                    </Form.Group>
                </Form>

                <Form className='mt-5'>
                    <h2>Hantera användare</h2>
                    <Form.Group className='row mt-3 mb-3'>
                        <div className='admin-container container-fluid'>
                            <Select
                                id='choose-user-select'
                                ref={ref => {
                                    this.chooseUserSelect = ref
                                }}
                                options={this.state.allUsers}
                                placeholder='Användare'
                                onChange={this.manageButtonsSet}
                                noOptionsMessage={() => `Hittade ingen användare`}
                                isSearchable
                                isClearable
                                styles={reactSelectStyle}
                            />
                        </div>
                    </Form.Group>
                    <Form.Group className='row'>
                        <div className='admin-container container-fluid'>
                            <p id='remove-user-status-lbl' className='status-admin' ></p>
                        </div>
                    </Form.Group>
                    <Form.Group className='row'>
                        <Button id='remove-user-btn' className='btn-admin btn-color container-fluid'  
                            onClick={this.prepareRemove} >
                            Ta bort användare
                        </Button>
                    </Form.Group>
                    <Form.Group className='row'>
                        <div className='admin-container container-fluid'>
                            <p id='change-role-status-lbl' className='status-admin' ></p>
                        </div>
                    </Form.Group>
                    <Form.Group className='row'>
                        <Button id='change-role-btn' className='btn-admin btn-color container-fluid'  
                            onClick={this.prepareChangeRole} >
                            Ändra roll
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

    /**
    * Method gets all users from the database to the select component
    */
    async getUsers() {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-type': 'application/json', 'token': this.context.token },
        }
        try {
            const response = await fetch('/user/all', requestOptions)
            if (response.ok) {
                const data = await response.json()
                this.setState({
                    allUsers: data.map((users) => {
                        return { label: users.username, value: users }
                    })
                })
            } else {
                this.setState({
                    fetchUsersFailed: true
                })
            }
        } catch (error) {
            console.log('Error at exercise insert')
            this.setState({
                fetchUsersFailed: true
            })
        }
    }

    /**
     * The register button sets to disabled if nothing is written in either the username or password
     * field associated with user registration.
     */
    registerButtonSet() {
        if (this.registerUserPasswordInput.value === '' || this.registerUserUsernameInput.value === '') {
            this.registerUserBtn.disabled = true
        }
        else {
            this.registerUserBtn.disabled = false
        }
    }
    
    /**
     * The confirmation button sets to disabled if nothing is written in the confirm text input.
     */
    confirmButtonSet() {
        if (this.confirmUserInput.value === '') {
            this.confirmUserBtn.disabled = true
        }
        else {
            this.confirmUserBtn.disabled = false
        }
    }

    /**
     * The buttons associated with deleting users and changing roles are set according to the
     * selected value in the select component. Both text and availability are set.
     * @param {Options<any>} inputValue the value that will be set on the select component
     */
    manageButtonsSet(inputValue) {
        if (inputValue === null) {
            this.changeRoleBtn.innerHTML = 'Ändra roll'
            this.changeRoleBtn.disabled = true
            this.removeUserBtn.disabled = true
        }
        else {
            if (inputValue.value.userRole === 'ADMIN') {
                this.changeRoleBtn.innerHTML = 'Ta bort admin status'
            }
            else {
                this.changeRoleBtn.innerHTML = 'Lägg till admin status'
            }
            this.changeRoleBtn.disabled = false
            this.removeUserBtn.disabled = false
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
        this.confirmLbl.innerHTML = 'Ange lösenordet igen'
        this.confirmUserInput.type = 'password'
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
        this.successMessage = `${this.chooseUserSelect.getValue()[0].value.username} är borttagen`
        this.confirmUserBtn.onclick = this.confirmManage.bind(this, 'remove', 'DELETE')
        this.confirmLbl.innerHTML = 'Ange användarnamnet igen'
        this.confirmUserInput.type = 'text'
        this.overlayOpen()
    }

    /**
     * Sets up variables sush as currentStatusLabel, successMessage 
     * and the components confirmUserBtn, confirmLbl and confirmUserInput
     * appropriate so the the confirmation window will
     * show correctly and a user will change role if everything is correct and the
     * confirm button is pressed.
     * @see confirmManage
     * @see responseUpdateStatus
     */
    prepareChangeRole() {
        this.currentStatusLabel = this.changeRoleStatusLbl
        if (this.chooseUserSelect.getValue()[0].value.userRole === 'ADMIN') {
            this.successMessage = `${this.chooseUserSelect.getValue()[0].value.username} är inte längre admin`
        }
        else {
            this.successMessage = `${this.chooseUserSelect.getValue()[0].value.username} är nu admin`
        }
        this.confirmUserBtn.onclick = this.confirmManage.bind(this, 'changerole', 'POST')
        this.confirmLbl.innerHTML = 'Ange användarnamnet igen'
        this.confirmUserInput.type = 'text'
        this.overlayOpen()
    }

    /**
     * Function called when the confirm button is pressed and after prepareRegistration has run.
     * It will prepare an appropriate message for sending to the API.
     * @see prepareRegistration
     */
    confirmRegistration() {
        if (this.registerUserPasswordInput.value !== this.confirmUserInput.value) {
            this.changeStatus(this.confirmUserStatusLbl, 'Fel lösenord', '#f00')
            return
        }
        else if(!this.validateUsername(this.registerUserUsernameInput.value)){
            //Username contains unvalid characters, see validateUsername method
            this.changeStatus(this.confirmUserStatusLbl, "Otillåtna tecken i användarnamnet. "
                + "Kan innehålla 0-9, a-ö (versaler och gemener), _ och -", '#f00')
            return
        }
        else {
            const data = {
                'username' : this.registerUserUsernameInput.value,
                'password' : this.registerUserPasswordInput.value,
                'userRole' : + !this.registerAdminCheck.checked
            }
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', token: this.context.token},
                body: JSON.stringify(data)
            }
            const path = `/user/register`
            this.sendData(path, requestOptions)
            this.registerUserUsernameInput.value = ''
            this.registerUserPasswordInput.value = ''
            this.registerButtonSet()
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
    confirmManage(action, method) {
        if (this.chooseUserSelect.getValue()[0].label !== this.confirmUserInput.value) {
            this.changeStatus(this.confirmUserStatusLbl, 'Fel användarnamn', '#f00')
            return
        }
        const requestOptions = {
            method: method,
            headers: { 'Content-Type': 'application/json', token: this.context.token}
        }
        //Encode the username as it will be sent in URI
        const path = "/user/"+ action + "/" +
            encodeURIComponent(this.chooseUserSelect.getValue()[0].value.username)

        this.sendData(path, requestOptions)
        this.chooseUserSelect.setValue(null)
        this.overlayClose()
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
     * @param {JSON} response response from the back-end
     * @see prepareRegistration
     * @see prepareRemove
     * @see prepareChangeRole
     */
    responseUpdateStatus(response){
        if (response.ok) {
            this.changeStatus(this.currentStatusLabel , this.successMessage, '#0f0')
        }
        else {
            if (response.status === 404) {
                this.changeStatus(this.currentStatusLabel, 'Server hittades inte', '#f00')
            }
            else {
                response.text().then(text => {
                    this.changeStatus(this.currentStatusLabel, text, '#f00')
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
        if (e.key === 'Escape') {
            this.overlayClose()
        }
    }

    /**
     * Opens the overlay with the confirm window.
     */
    overlayOpen() {
        this.overlay.style.visibility = 'visible'
    }

    /**
     * Closes the overlay with the confirm window.
     * The window is reset too.
     */
    overlayClose() {
        this.overlay.style.visibility = 'hidden'
        this.confirmUserInput.value = ''
        this.confirmUserBtn.disabled = true
        this.changeStatus(this.confirmUserStatusLbl, '', '#fff')
    }
}

ManageUser.contextType = AccountContext;

export default ManageUser