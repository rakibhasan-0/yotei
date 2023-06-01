import React, { useEffect, useState, useContext, useCallback } from "react"
import Button from "../Common/Button/Button"
import Popup from "../Common/Popup/Popup"
import { AccountContext } from "../../context"
import DatePicker from "../Common/DatePicker/DatePicker"
import "./ErrorLogsDisplay.css"
import {Trash} from "react-bootstrap-icons"
import ConfirmPopup from "../Common/ConfirmPopup/ConfirmPopup"

/**
 * An errorlog display component for displaying caught client side errors by clicking a button.
 *
 * Props:
 *     id @type {number}  - The id of the component (for testing)
 *
 * Example usage:
 *
 * <ErrorLogsDisplay id={1} />
 *
 * @author Team Dragon (Grupp 3)
 * @version 1.0
 * @since 2023-06-25
 */
function ErrorLogsDisplay() {
	const [errors, setErrors] = useState([])
	const [dateErrors, setDateErrors] = useState([])
	const [showPopup, setShowPopup] = useState(false)
	const [showConfirmPopup, setShowConfirmPopup] = useState(false)
	const [dataExists, setDataExists] = useState(false)
	const [date, setDate] = useState("")
	const context = useContext(AccountContext)

	const dateChangeHandler = (event) => {
		setDate(event.target.value)
	}

	const popupTitle = (
		<React.Fragment>
			<div className="error-title">Error-loggar</div>
			<div className="datepicker-wrapper">
				<DatePicker
					style={{ marginLeft: "100px"}}
					selectedDate={date}
					onChange={dateChangeHandler}
					id={"test-datepicker"}
				/>
			</div>
			<Trash style={{marginLeft: "250px", fontSize: "45px", color: "var(--red-primary)"} }onClick={() => setShowConfirmPopup(true)} />
		</React.Fragment>
	)

	/**
   * Update the error logs on client side startup rendering
   */
	useEffect(() => {
		setDateErrors([])
		filterErrorToDates()
	}, [date, showPopup])

	useEffect(() => {
		getErrorLogs()
	}, [])

	/**
   * Store the errors that were caught the same date in the date picker option and store them in an array
   */
	function filterErrorToDates() {
		errors.map((error) => {
			let realDate = new Date(date)
			let realDateComp =
			realDate.getFullYear() +
			"-" +
			(realDate.getMonth() + 1) +
			"-" +
			realDate.getDate()

			if (ISOdateToYearMonthDayDate(error.errorDateTime) === realDateComp) {
				setDateErrors((dateErrors) => [...dateErrors, error])
			}
		})
	}

	/**
   * Turns an ISO8601 date into a date string representation in the format YYYY-MM-DD-HH:MM
   * @param {string} ISOdate - the date in ISO format to be converted to a string in the format YYYY-MM-DD-HH:MM
   * @returns the date in the format YYYY-MM-DD-HH:MM
   */
	function ISOdateToYearMonthDayDate(ISOdate) {
		let parsedDate = new Date(Date.parse(ISOdate))
		return (
			parsedDate.getFullYear() +
      "-" +
      (parsedDate.getMonth() + 1) +
      "-" +
      parsedDate.getDate()
		)
	}

	/**
   * Fetch the error logs from the server automatically when the component is mounted and the token is updated
   * @returns the error logs from the server
   */
	const getErrorLogs = useCallback(async () => {
		const requestOptions = {
			method: "GET",
			headers: {
				"Content-type": "application/json",
				token: context.token,
			},
		}
		try {
			const response = await fetch("/api/errorlogs/all", requestOptions)

			if (response.ok) {
				const data = await response.json()
				setErrors([])
				setErrors((errors) => [...errors, ...data])
				setDataExists(true)
			}
		} catch (error) {
			console.log(error)
		}
	}, [])

	/**
   * Fetch the error logs from the server automatically when the component is mounted and the token is updated
   * @returns the error logs from the server
   */
	const deleteAllErrorLogs = useCallback(async () => {
		const requestOptions = {
			method: "DELETE",
			headers: {
				"Content-type": "application/json",
				token: context.token,
			},
		}
		try {
			const response = await fetch("/api/errorlogs/remove", requestOptions)

			if (response.ok) {
				setErrors([])
				setDateErrors([])
			}
		} catch (error) {
			console.log(error)
		}
	}, [])

	

	/**
   * Function for rendering the popup listing the error logs
   *
   * @param {boolean} IsOpen boolean that indicates if the popup should be open or closed
   * @param {boolean} setIsOpen function that updates the state of the popup
   * @returns a popup that displays the error logs with the error message, error info and date of the error
   */
	function PopupContent({ isOpen, setIsOpen }) {
		return (
			<Popup
				id="test-popup"
				title={popupTitle}
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				width={80}
				height={65}
			>
				{dataExists ? (
					<div>
						<table className="errorlog-table">
							<thead>
								<tr>
									<th className="th">Error Message</th>
									<th className="th">Info Message</th>
									<th className="th">Date</th>
								</tr>
							</thead>
							<tbody>
								{date
									? dateErrors.map((log, index) => (
										<tr key={index}>
											<td className="td">{log.errorMessage}</td>
											<td className="td">
												{/* {JSON.parse(log.infoMessage).componentStack} */}
												{log.infoMessage}
											</td>
											<td className="td">
												{ISOdateToYearMonthDayDate(log.errorDateTime)}
											</td>
										</tr>
									))
									: errors.map((log, index) => (
										<tr key={index}>
											<td className="td">{log.errorMessage}</td>
											<td className="td">
												{/* {JSON.parse(log.infoMessage).componentStack} */}
												{log.infoMessage}
											</td>
											<td className="td">
												{ISOdateToYearMonthDayDate(log.errorDateTime)}
											</td>
										</tr>
									))}
							</tbody>
						</table>
					</div>
				) : (
					<h1>No available logs to display!</h1>
				)}
		
			</Popup>
		)
	}

	return (
		<div
			className="div-1"
			style={{ marginTop: 10, marginRight: "auto", marginLeft: "auto" }}
		>
			<Button id="errorlogsdisplay-button" width="100%" onClick={() => setShowPopup(true)}>
				<h2>Error-loggar</h2>
			</Button>
			<PopupContent isOpen={showPopup} setIsOpen={setShowPopup} />
			<ConfirmPopup
				showPopup={showConfirmPopup}
				popupText={"Är du säker på att du vill ta bort alla error-loggar?"}
				setShowPopup={setShowConfirmPopup}
				onClick={deleteAllErrorLogs}
				confirmText={"Ta bort"}
			></ConfirmPopup>
		</div>
	)
}
export default ErrorLogsDisplay
