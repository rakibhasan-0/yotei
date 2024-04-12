/**
 * Helperfile made for error-handling logic for components to use.
 *
 *  @author Team 3 Dragon
 */

/**
   * Returns todays date, in swedish
   * standard notation
   * @returns todays date
   */
export function getTodaysDate() {
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
export async function addErrorLog(error_input, info_input, token) {

	const today = getTodaysDate()

	// Turn arguments into strings
	const error_string = JSON.stringify(error_input.message)
	const info_string = JSON.stringify(info_input)

	const requestOptions = {
		method: "POST",
		headers: { "Content-type": "application/json", token: token },
		body: JSON.stringify({
			errorMessage: error_string,
			infoMessage: info_string,
			errorDateTime: today,
		}), // error and info
	}

	// Send and save
	try {
		const response = await fetch("/api/errorlogs/add", requestOptions) // ErrorLogController.java
		if (response.status === 201) {
			await response.json()
			// forceUpdate()
		} else {
			console.error(
				"Saving errorlog failed, response did not return ok",
				response.status,
			)
		}
	} catch (error) {
		console.error("Error when saving errorlog")
		// forceUpdate()
	}
}
