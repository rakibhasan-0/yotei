import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { AccountContext } from '../../context';

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
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [cookies, setCookies] = useCookies(['token']) 
    const navigate = useNavigate()
    const {token, setToken} = useContext(AccountContext)

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
                setCookies('token', token, {secure: false, maxAge: 1200, path: '/'})
                setToken(token)
            })
            return true
        }
    }

    /**
     * Redirects the user to the home page if the user has previously logged in.
     */
    useEffect(() => {
        if(cookies.token){
            navigate('/home')
        }
    })

    /**
     * Is called when the login button is clicked.
     * If user credentials are correct, the user is redirected to the home page.
     */
    async function loginClicked() {
        const requestOptions = {
            headers: {'Content-type': 'application/json', token},
            method: "POST",
            body: JSON.stringify({username: username, password: password})
        };
        const response = await fetch(`/user/verify`, requestOptions)
        
        if(loginIsOk(response)) {
            navigate("/home")
        } 
    }

    /**
     * This function makes it possible to log in with "Enter".
     * Only works if password field is active.
     * @param event
     */
    function handleKeyDown(event) {
        if (event.key === 'Enter') {
            loginClicked().then(r => {})
        }
    }
    
    return (             
        <div style={{ maxWidth: 600}} className="center">
            <img style={{ maxWidth: 500}} src="/ubk-logga.jpg" alt="This is the logo for UBK" className="center mb-5"/>
            <div className="card bg-light center" style={{ maxWidth: 550}}>
                <Form style={{ maxWidth: 500}} className="center pt-4 pb-4 pr-4 pl-4">
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label className="float-left">Användarnamn TEST DEPLOY</Form.Label>
                        <Form.Control type="user" value={username} placeholder="Användarnamn" onChange={e => {setUsername(e.target.value)}}/>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label className="float-left">Lösenord</Form.Label>
                        <Form.Control type="password" value={password} placeholder="Lösenord" onKeyDown={e => {handleKeyDown(e)}} onChange={e => {setPassword(e.target.value)}} />
                    </Form.Group>
                    <div className="row">

                        {/* SPACER */}
                        <div className="col-7"/>

                        <div className="col-5">
                            <Button className="w-100 btn btn-color float-right" onClick={loginClicked} >
                            Logga in
                            </Button>
                        </div>
                    </div>
                    {errorMsg ? <p style={{color: 'red'}}>{errorMsg}</p> : null}
                </Form>                
            </div>
        </div>
    )
}

export default Login