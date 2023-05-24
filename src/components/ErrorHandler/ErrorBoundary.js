import React from "react"
import { AccountContext } from "../../context"


/**
 * Component made for error-handling. 
 * Checks for any errors made by the application that would crash it, and stores them as an entry in the database
 * 
 * !NOTE! Error boundaries do not catch errors for:
 * 
 * Event handlers
 * 
 * Asynchronous code
 * 
 * Server-side rendering
 * 
 * Errors thrown in the error boundary itself
 * 
 *  @author Team 3 Dragon
 */

/**
* Makes an API call to store the caught error
* @param error, the error that was thrown and its information
* @param info, the stack-trace from the error
*/

/**
* Class for creating an error boundary to detect errors
*/
class ErrorBoundary extends React.Component {

	state = {
		hasError: false,
		error: "", 
		info: "",
		token: ""
	}

	constructor(props){
		super(props)
		this.state = {
			hasError: false, 
			error: "", 
			info: "",
			token: props.token
		}
		this.addErrorLog = this.addErrorLog.bind(this)
	}

   
	/**
    * Signals that an error has occured
    * @param error, the error that was thrown
    */
	static getDerivedStateFromError() {
		return {hasError: true}
	}

	/**
    * On component error, store its intel in a database
    * @param error, the error that was thrown and its information
    * @param info, the stack-trace from the error
    */
	componentDidCatch(error, info) {
		this.setState({
			error : error,
			info: info
		})
		this.addErrorLog(error, info)
	}

	/**
     * Returns todays date, in swedish
     * standard notation
     * @returns todays date
     */
	getTodaysDate(){
		const today = new Date()
		const dd = String(today.getDate()).padStart(2, "0")
		const mm = String(today.getMonth() + 1).padStart(2, "0") 
		const yyyy = today.getFullYear()

		const hh = String(today.getHours()).padStart(2, "0")
		const minutes = String(today.getMinutes()).padStart(2, "0")
		const ss = String(today.getSeconds()).padStart(2, "0")

		return yyyy + "-" + mm + "-" + dd + "T" + hh + ":" + minutes + ":" + ss
	}

	/**
     * Method for API call when Error Boundary is triggered.
     * @param error_input The error that was thrown.
	 * @param info_input An object with a componentStack key containing information about which component threw the error.
     */
	async addErrorLog(error_input, info_input) {

		const today = this.getTodaysDate()

		// Turn arguments into strings
		const error_string = JSON.stringify(error_input.message)
		const info_string = JSON.stringify(info_input)

		const requestOptions = {
			method: "POST",
			headers: {"Content-type": "application/json", "token": this.context.token},
			body: JSON.stringify({
				errorMessage: error_string, 
				infoMessage: info_string,
				errorDateTime: today
			}) // error and info
		}

		console.log("Request json: ", requestOptions.body)

		// Send and save
		try {
			const response = await fetch("/api/errorlogs/add", requestOptions) // ErrorLogController.java
			if (response.status === 201) {
				await response.json()
				this.forceUpdate()
			}
			else {
				console.log("Saving errorlog failed, response did not return ok", response.status)
			}
		} catch (error) {
			console.log("Error when saving errorlog")
			this.forceUpdate()
		}
	}




	/**
    * Either render a fallback prop on error
    * or the children (do nothing) on a non-error.
    */
	render() {
		if(this.state.hasError) {
			return(
				<div>
					<h1>Error</h1>
					<p>{this.state.error.message}</p>
					<p>{this.state.info.message}</p>
					<p>{this.state.info.componentStack}</p>
				</div>
			)       
		}
		return this.props.children
	}
}

ErrorBoundary.contextType = AccountContext 
export default ErrorBoundary