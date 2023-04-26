import React from "react"
import "../../pages/Exercise/ExerciseCreate.css"
import Creatable from "react-select/creatable"
import {AccountContext} from "../../context"
import "./ValidationFormStyle.css"
import AlertWindow from "../Common/AlertWindow"


/**
 * This class is to be used as a form for adding and editing techniques.
 *
 * @author Grupp 6 (Calskrove) (2022-05-19), Grupp 5 (Verona) (2022-05-16)
 */
class TechniqueForm extends React.Component {
	/**
     * Basic constructor for component.
     *
     * @param {exerciseCallback} props Handler for information updates sent from parent.
     */
	constructor(props) {
		super(props)
		this.state = {
			value: "",
			name: this.props.name,
			desc: this.props.desc,
			tags: this.props.tags,
			existingTags: this.props.tags,
			show: false,
			resetTitle: this.props.resetTitle,
			fetchTagsFailed: false,
			allTags: this.props.allTags,
			gotTags: false
		}
	}

	/**
     * Fetches all the tags from the database initially.
     */
	componentDidMount() {
		if (this.state.gotTags === false) {
			this.getTags()
			this.setState({gotTags: true})
		}
		this.handleChange(this.state)
	}

	/**
     * Method updates the state of the component with the tags that are currently selected.
     * @param inputValue an array of the tags that are currently selected
     */
	handleCreate = (inputValue) => {
		this.setState({tags: inputValue})
		this.handleChange(this.state)
	}

	/**
     * Allows the parent to update its states whenever information is updated.
     * @param changeObject The updated information.
     */
	handleChange(changeObject) {
		this.props.techniqueCallback(changeObject)
		this.setState(changeObject)
	}

	/**
     * Gets all tags from the server
     */
	async getTags() {
		const requestOptions = {
			method: "GET",
			headers: {"Content-type": "application/json", "token": this.context.token},
		}
		try {
			const response = await fetch("/api/tags/all", requestOptions)
			if (response.ok) {
				const data = await response.json()
				this.setState({
					allTags: data.map((tags) => {
						return {label: tags.name, value: tags.id}
					})
				})
			} else {
				this.setState({fetchTagsFailed: true})
				this.forceUpdate()
			}
		} catch (error) {
			console.log("Error at technique insert")
			this.setState({fetchTagsFailed: true})
			this.forceUpdate()
		}
	}

	/**
     * Reloads the page which resets the forms
     */
	handleFormReset = () => {
		window.location.reload()
	}

	/**
     * Hide the alert window
     */
	handleClose = () => {
		this.setState({show: false})
		this.forceUpdate()
	}
	/**
     * Display the alert window
     */
	handleShow = () => {
		this.setState({show: true})
		this.forceUpdate()
	}

	/**
     * Renders the technique form.
     *
     * @returns A form for creating/updating technique.
     */
	render() {
		return (

			<form className="d-flex flex-column">
				{/*An alert window that shows up when trying to clear*/}
				<AlertWindow
					title={this.state.resetTitle}
					body={"Är du säker på att du vill " + 
                    
                    /* Add an 'a' to the end of the first word in the resetTitle if there is none. This is primarily to handle the case
                    of the title 'Återställ allt' where the body should be 'Är du [...] du vill återställa allt? */
                    (this.state.resetTitle.toString().toLowerCase().substring(0, this.state.resetTitle.toString().indexOf(" ")).endsWith("a")?this.state.resetTitle.toString().toLowerCase():this.state.resetTitle.toString().toLowerCase().substring(0, this.state.resetTitle.toString().indexOf(" ")) + "a" +
                    this.state.resetTitle.toString().toLowerCase().substring(this.state.resetTitle.toString().indexOf(" "), this.state.resetTitle.toString().length)) + "?"}
                    
					yesText={this.state.resetTitle}
					noText={"Avbryt"}
					show={this.state.show}
					callback={()=>this.handleFormReset()}
					hideFunc={()=>this.handleClose()}
				/>

				{/*Ask the user if it wants to clear the page. Function will call for a reload.*/}
				<input
					className="btn btn-color btn-form"
					type="button"
					onClick={
						((this.state.name === undefined || this.state.name === "")
                            && (this.state.desc === undefined || this.state.desc === "")) ?
							() => console.log("No need to clear empty forms") :
							() => this.handleShow()
					}
					value={this.state.resetTitle}
				/>
				{/*Ask the user for the name of the technique*/}
				<label htmlFor="name">
                    Namn på teknik:
					<input
						name="name"
						id="name"
						type="text"
						placeholder="Namn"
						className={this.props.okName ? "form-control" : "form-control is-invalid"}
						value={this.props.name}
						onChange={(e) => this.handleChange({name: e.target.value})}
						required
					/>
				</label>
				{/*Ask the user for a description of the technique*/}
				<label htmlFor="desc">
                    Beskrivning av teknik:
					<textarea
						name="desc"
						id="desc"
						type="text"
						placeholder="Beskrivning"
						className={"form-control"}
						value={this.props.desc}
						onChange={(e) => this.handleChange({desc: e.target.value})}
						required
					/>
				</label>

				{/*Ask the user for the tags for the exercise*/}
				<label>
                    Sök efter taggar att lägga till
				</label>
				< Creatable
					options={this.state.allTags}
					placeholder="Taggar"
					formatCreateLabel={(inputText) => `Skapa "${inputText}"`}
					value={this.state.tags}
					isMulti
					onChange={this.handleCreate}
				/>
			</form>
		)
	}
}

TechniqueForm.contextType = AccountContext
export default TechniqueForm
