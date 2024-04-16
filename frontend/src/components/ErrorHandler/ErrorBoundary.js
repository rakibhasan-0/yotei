import React from "react"
import { AccountContext } from "../../context"
import { addErrorLog } from "./ErrorLogic"
import ErrorState from "../../components/Common/ErrorState/ErrorState"


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
 * Class for creating an error boundary to detect errors
 */
class ErrorBoundary extends React.Component {
	state = {
		hasError: false,
		error: "",
		info: "",
		token: "",
	}

	constructor(props){
		super(props)
		this.state = {
			hasError: false, 
			error: "", 
			info: "",
			token: props.token
		}
		//addErrorLog = addErrorLog.bind(this)
	}

	/**
   * Signals that an error has occured
   * @param error, the error that was thrown
   */
	static getDerivedStateFromError() {
		return { hasError: true }
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
		addErrorLog(error, info, this.context.token)
	}

	/**
    * Either render a fallback prop on error
    * or the children (do nothing) on a non-error.
    */
	render() {
		if(this.state.hasError) {
			return(
				<div>
					<ErrorState message={this.state.error.message + JSON.stringify(this.state.info)}/>
				</div>
			)       
		}
		return this.props.children
	}
}

ErrorBoundary.contextType = AccountContext
export default ErrorBoundary
