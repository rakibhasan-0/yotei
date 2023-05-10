import "./WorkoutFilter.css"
import Form from "react-bootstrap/Form"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import * as Icon from "react-bootstrap-icons"
import DatePicker from "react-date-picker"
import {useState} from "react"

/**
 * Filter component for workouts.
 * 
 * Props:
 *     prop1 @type {number}  - An id to identify the component
 *     prop2 @type {object}  - A props object containing state for the filter.
 *
 * Example usage:
 * 	   const [favOn, setFavOn] = useState(false);
 * 	   const [fromDate, setFromDate] = useState(null);
 * 	   const [toDate, setToDate] = useState(null);
 * 	   const props = {
 *         favOn: favOn,
 *         setFavOn: setFavOn,
 *         fromDate: fromDate,
 *         setFromDate: setFromDate,
 *         toDate: toDate,
 *         setToDate: setToDate
 *     }
 *     <WorkoutFilter id={0} state={props} />
 *
 * @author Cyclops 
 * @version 1.0
 * @since 2023-05-03
 */
export default function WorkoutFilter({id, state}) {
	const [validationText, setValidationText] = useState("")

	function setNewFromDate(newDateStr, setFromDate, toDate) {
		const newDate = new Date(newDateStr)
		if(toDate !== null && newDate.getTime() > toDate.getTime()){
			setValidationText("Fråndatum måste vara före tilldatum")
			return
		}
		setValidationText("")
		setFromDate(newDate)
	}
	
	function setNewToDate(newDateStr, setToDate, fromDate) {
		const newDate = new Date(newDateStr)
		if(fromDate !== null && newDate.getTime() < fromDate.getTime()){
			setValidationText("Tilldatum måste vara efter fråndatum")
			return
		}
		setValidationText("")
		setToDate(newDate)
	}

	return (
		<div id={id}>
			<Form>
				<fieldset className="title-border filter-fieldset">
					<legend className="title-border">Filtrering</legend>
					<Form.Group as={Row} className="mb-3">
						<Col xs={2}>
							<Form.Label>Från</Form.Label>
						</Col>
						<Col xs={4} md={2}>
							<DatePicker	
								showLeadingZeros={true}
								dateFormat="YYYY-MM-DD"
								calendarIcon={null}
								clearIcon={null}
								value={state.fromDate}
								onChange={(e) => setNewFromDate(e, state.setFromDate, state.toDate)}
								className="input-datepicker rounded p-2"
							/>
						</Col>
					</Form.Group>	
					<Form.Group as={Row} className="mb-3">
						<Col xs={2}>
							<Form.Label>Till</Form.Label>
						</Col>
						<Col xs={4} md={2}>
							<DatePicker	
								showLeadingZeros={true}
								dateFormat="YYYY-MM-DD"
								calendarIcon={null}
								clearIcon={null}
								value={state.toDate}
								onChange={(e) => setNewToDate(e, state.setToDate, state.fromDate)}
								className="input-datepicker rounded p-2"
							/>
						</Col>
					</Form.Group>
					<Form.Group as={Row} className="mb-3">
						<Col xs={2}>
							<Form.Label>Favoriter</Form.Label>
						</Col>
						
						<Col xs={4} md={2} className="star-col">
							{state.favOn 
								? <Icon.StarFill
									size={24}
									className="fav-on"
									onClick={() => state.setFavOn(!state.favOn)} 
								/>
								: <Icon.Star 
									size={24}
									onClick={() => state.setFavOn(!state.favOn)}
								/>
							}
						</Col>
					</Form.Group>
					<p style={{color:"#BE3B41"}}>{validationText}</p>
				</fieldset>
			</Form>
		</div>
	)
}