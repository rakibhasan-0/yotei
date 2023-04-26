import React from "react"
import Button from "react-bootstrap/Button"
import { AccountContext } from "../../context"
import Form from "react-bootstrap/Form"
import "./AdminComponent.css"

/**
 * Component made for the admin page. Made to handle the export 
 * feature on the front-end.
 *
 *  @author Team Quattro Formaggi (Group 1), Team Calzone (Group 4)
 */

class Export extends React.Component {
	/**
     * Constructor.
     * Maps functions.
     */
	constructor(props) {
		super(props)
		this.exportExercises = this.exportExercises.bind(this)
		this.exportTechniques = this.exportTechniques.bind(this)
	}
    
	/**
     * When the components are ready fetch references to them.
     */
	componentDidMount() {
		this.statusExportExercise = document.getElementById("status-export-exercise")
		this.statusExportTechnique = document.getElementById("status-export-technique")
	}

	/**
     * Defines the html for the component.
     */
	render() {
		return (
			<Form className='mt-5'>
				<h2>Export</h2>
				<Form.Group className="row">
					<div className='admin-container container-fluid'>
						<p id='status-export-exercise' className='status-admin' ></p>
					</div>
				</Form.Group>
				<Form.Group className="row">
					<Button className="btn btn-admin btn-color container-fluid"
						type="button"
						onClick={this.exportExercises}>
                    Exportera Övningar
					</Button>
				</Form.Group>
				<Form.Group className="row">
					<div className='admin-container container-fluid'>
						<p id='status-export-technique' className='status-admin' ></p>
					</div>
				</Form.Group>
				<Form.Group className="row">
					<Button className="btn btn-admin btn-color container-fluid"
						type="button"
						onClick={this.exportTechniques}>
                    Exportera Tekniker
					</Button>
				</Form.Group>
			</Form>
		)
	}

	/**
     * On click method for 'Exportera Övningar' button.
     * Exports Exercise data to .json file.
     * @see exportData
     */
	async exportExercises() {
		await this.export("/api/export/exercises", "exercises")
	}


	/**
     * On click method for 'Exportera Tekniker' button.
     * Exports Technique data to .json file.
     * @see exportData
     */
	async exportTechniques() {
		await this.export("/api/export/techniques", "techniques")
	}

	async export(url, name) {
		const requestOptions = {
			method: "GET",
			headers: {token: this.context.token}
		}
		const statusLabel = this.chooseStatusLabel(name === "exercises")

		const response = await fetch(url, requestOptions)
		if(response.ok === false){
			this.responseUpdateStatus(response, statusLabel)
			return
		}

		const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
			JSON.stringify(await response.json(), null, 4)
		)}`
		const link = document.createElement("a")
		link.href = jsonString
		link.download = name + ".json"
		link.click()
	}

	/**
     * Chooses a label to display statuses depending on given boolean
     * @param {Boolean} activityIsExercises if the activity type is exercises
     * @returns a HTML element for which should display statuses.
     */
	chooseStatusLabel(activityIsExercises) {
		return activityIsExercises ? this.statusExportExercise : this.statusExportTechnique
	}

	/**
     * Handles status messages for responses.
     * @param {Response} response response from request.
     * @param {HTMLParagraphElement} statusLabel display the status.
     */
	responseUpdateStatus(response, statusLabel){
		if (response.ok) {
			this.changeStatus(statusLabel, "", "#fff")
		}
		else {
			if (response.status === 404) {
				this.changeStatus(statusLabel, "Server hittades inte", "#f00")
			}
			else {
				this.changeStatus(statusLabel, "Misslyckades med att exportera", "#f00")
			}
		}
	}

	/**
     * Changes text and color on a status label.
     * @param {HTMLParagraphElement} statusLabel status label to change.
     * @param {String} text text to set on the status label.
     * @param {String} color color(rgb hex) to set on the status label.
     */
	changeStatus(statusLabel, text, color) {
		statusLabel.innerHTML = text
		statusLabel.style.color = color
	}
}

Export.contextType = AccountContext

export default Export