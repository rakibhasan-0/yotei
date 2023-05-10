import React from "react"
import "./ExerciseCreate.css"
import ExerciseForm from "../../components/Forms/ExerciseForm"
import {AccountContext} from "../../context"
import GoBackButton from "../../components/Common/GoBackButton"

/**
 * Class for editing an exercise.
 *
 * @author Calskrove (2022-05-19), Verona (2022-05-16)
 */
class ExerciseEdit extends React.Component {
	constructor(props) {
		super(props)
		this.state = {

			id: -1,
			name: "",
			desc: "",
			time: "",
			tags: [],               //tags that should on exercise after edit
			existingTags: [],       //tags that were present in the exercise already
			wait: true,
			editFailed: false,      //should be true if last attempt at edit failed
			errorName: "",           //stores description of why edit did not work
			storedName: "",
			storedTime: "",
			tagAddFailed: false,
			tagRemoveFailed: false,
			tagLinkFailed: false,
			clickedButton: false,
			okName: true,
			okTime: true,
			isChanged: false,  // icChanged and callBack values are used so we don't get an
			callBack: false   // alert when not changing anything in the exercise.
		}

		this.editExercise = this.editExercise.bind(this)
		this.handleCallback = this.handleCallback.bind(this)
	}

	/**
     * When component updates, gets information about the exercise with the id in the pathname.
     */
	componentDidMount() {
		this.getExerciseAndTags()
	}

	/**
     * Returns the information about the exercise and its tags with the id in the pathname.
     */
	async getExerciseAndTags() {
		const requestOptions = {
			method: "GET",
			headers: {"Content-type": "application/json", token: this.context.token},
		}
		let id = window.location.pathname.substring(window.location.pathname.lastIndexOf("/") + 1)
		let exerciseJson
		let filteredTags
		try {
			const response = await fetch(`/api/exercises/${id}`, requestOptions)
			exerciseJson = await response.json()
		} catch (error) {
			alert("Could not find details about the exercise")
			console.log("error", error)
		}

		try {
			const tagsResponse = await fetch("/api/tags/all", requestOptions)
			const allTagsJson = await tagsResponse.json()

			const tagIdResponse = await fetch(`/api/tags/get/tag/by-exercise?exerciseId=${id}`, requestOptions)
			const tagIdJson = await tagIdResponse.json()
			filteredTags = allTagsJson.filter((tag) => tagIdJson.map(obj => obj.tagId).includes(tag.id)).map((tags) => {
				return {label: tags.name, value: tags.id}
			})
		} catch (error) {
			alert("Could not find tags for the exercise")
			console.log("error", error)
		}
		this.setState({
			name: exerciseJson.name, desc: exerciseJson.description,
			time: exerciseJson.duration, id: id, tags: filteredTags, wait: false, existingTags: filteredTags
		})

	}


	/**
     * Is called when an edit request (PUT) is sent to the API.
     *
     * @param {*} e The event that caused editExercise.
     */
	async editExercise() {
		this.setState({clickedButton: true})

		if (this.state.name !== undefined) {
			this.setState({storedName: this.state.name})
		} else {
			this.setState({storedName: ""})
		}

		this.setState({storedTime: this.state.time})

		const requestOptions = {
			method: "PUT",
			headers: {"Content-type": "application/json", token: this.context.token},
			body: JSON.stringify({
				id: this.state.id,
				name: this.state.name,
				description: this.state.desc,
				duration: this.state.time,
			})
		}

		const response = await fetch("/api/exercises/update", requestOptions)
		try {
			if (!response.ok) {
				console.log("response not OK")
				this.setState({editFailed: true})
				this.setState({errorName: this.state.name})     //store the name of exercise that could not be edited
				this.forceUpdate()
			}
		} catch (error) {
			console.log("error")
			this.setState({editFailed: true})
			this.setState({errorName: this.state.name})     //store the name of exercise that could not be edited
			this.forceUpdate()
		}
		await this.addTag(this.state.id)
		if (!(this.state.tagAddFailed || this.state.editFailed || this.state.tagRemoveFailed || this.state.tagLinkFailed)) {
			window.location.href = "/exercise"
		}

	}

	/**
     * Method for API-call when creating a tag.
     * @returns the id of the exercise that has been created
     */
	async addTag(id) {
		let tag_id = null
		for (var i = 0; i < this.state.tags.length; i++) {
			if (this.state.tags[i].__isNew__) {
				const requestOptions = {
					method: "POST",
					headers: {"Content-type": "application/json", "token": this.context.token},
					body: JSON.stringify({name: this.state.tags[i].label})
				}
				try {
					const response = await fetch("/api/tags/add", requestOptions)
					if (response.ok) {
						const data = await response.json()
						tag_id = data.id
						this.forceUpdate()
					} else {
						this.setState({tagAddFailed: true})
						this.setState({errorName: this.state.tags[i].label})
						this.forceUpdate()
					}
				} catch (error) {
					alert("Error at tag insert")
					this.setState({tagAddFailed: true})
					this.setState({errorName: this.state.tags[i].label})
					this.forceUpdate()
				}
			} else {
				tag_id = this.state.tags[i].value
			} //Link only if it's a tag that already didn't get linked
			if (!this.state.existingTags.includes(this.state.tags[i])) {
				await this.linkExerciseTag(id, tag_id, this.state.tags[i].label)
			}
		} // Remove tags that are not present anymore
		for (i = 0; i < this.state.existingTags.length; i++) {
			if (!this.state.tags.includes(this.state.existingTags[i])) {
				await this.removeTag(id, this.state.existingTags[i].value, this.state.existingTags[i].label)
			}
		}
	}

	/** Method to remove a tag from an exercise (does not remove the tag itself).
     *
     * @param {Exercise id} ex_id
     * @param {tag id} tag_id
     */
	async removeTag(ex_id, tag_id, tag_name) {
		const requestOptions = {
			method: "DELETE",
			headers: {"Content-type": "application/json", "token": this.context.token},
			body: JSON.stringify({"exerciseId": ex_id})
		}
		try {
			const response = await fetch(`/api/tags/remove/exercise?tag=${tag_id}`, requestOptions)
			if (response.ok) {
				this.setState({tagRemoveFailed: false})
				this.forceUpdate()
			} else {
				this.setState({tagRemoveFailed: true})
				this.setState({errorName: tag_name})
				alert("Failed to remove tag")
				this.forceUpdate()
			}
		} catch (error) {
			alert("Error when removing tag")
			this.setState({errorName: tag_name})
			this.setState({tagRemoveFailed: true})
			this.forceUpdate()
		}
	}

	/**
     * Method for API-call when creating a tag.
     * @returns the id of the exercise that has been created
     */
	async linkExerciseTag(ex_id, tag_id, tag_name) {
		const requestOptions = {
			method: "POST",
			headers: {"Content-type": "application/json", "token": this.context.token},
			body: JSON.stringify({"exerciseId": ex_id})
		}
		try {
			const response = await fetch("/api/tags/add/exercise?tag=" + tag_id, requestOptions)
			if (response.ok) {
				this.setState({tagLinkFailed: false})
				this.forceUpdate()
			} else {
				this.setState({tagLinkFailed: true})
				this.setState({errorName: tag_name})
				this.forceUpdate()
			}
		} catch (error) {
			alert("Error at tag link")
			this.setState({tagLinkFailed: true})
			this.setState({errorName: tag_name})
			this.forceUpdate()
		}
	}

	/**
     * Handle information being updated in ExerciseForm.
     *
     * @param formData Updated data.
     */
	handleCallback(formData) {
		//Will skip changing the boolean at load
		if (this.state.callBack) {
			this.setState({isChanged: true})
		}
		this.setState({callBack: true})
		this.setState(formData)
	}

	/**
     * A function that will validate the users input on the name of the exercise.
     * If the input is invalid it will send a signal to the form and change
     * the input style.
     *
     * @returns Boolean
     */
	checkName() {
		if (this.state.okName === false) {
			if (this.state.name !== "" && this.state.name !== undefined) {
				this.setState({okName: true})
			}
		}

		if (this.state.clickedButton === true) {
			if (this.state.storedName === "") {
				this.setState({okName: false})
			} else {
				this.setState({okName: true})
			}
			this.setState({clickedButton: false})
		}
		return this.state.okName
	}

	/**
     * A function that will validate the users input on the time set for the exercise.
     * If the input is invalid it will send a signal to the form and change
     * the input style.
     *
     * @returns Boolean
     */
	checkTime() {
		if (this.state.okTime === false) {
			if (this.state.time >= 0) {
				this.setState({okTime: true})
			}
		}

		if (this.state.clickedButton === true) {
			if (this.state.storedTime < 0) {
				this.setState({okTime: false})
			} else {
				this.setState({okTime: true})
			}
		}
		return this.state.okTime
	}

	/**
     * Render - The main meat of the class, containing the general functionality.
     * The function is executed when going to or refreshing the page.
     * @returns A page for editing an exercise.
     */
	render() {
		// If the information has not yet been retrieved, tell the user that the page is loading.
		// Load the page otherwise.
		if (this.state.wait) {
			return (<h2>Loading...</h2>)
		}
		if (this.state.name == null) {
			window.location.href = "/nopage"
		}

		let failedAlert
		if (this.state.editFailed) {
			failedAlert = <div className="alert alert-danger" role="alert">
                Övningen {this.state.errorName} kunde ej ändras
			</div>
		}
		if (this.state.tagAddFailed) {
			failedAlert = <div className="alert alert-danger" role="alert">
                Taggen {this.state.errorName} kunde ej skapas
			</div>
		}
		if (this.state.tagLinkFailed) {
			failedAlert = <div className="alert alert-danger" role="alert">
                Taggen {this.state.errorName} kunde ej läggas till i övningen
			</div>
		}
		if (this.state.tagRemoveFailed) {
			failedAlert = <div className="alert alert-danger" role="alert">
                Taggen {this.state.errorName} kunde ej tas bort från övningen
			</div>
		}

		return (

			<div className="container">
				<div className="row justify-content-center">
					<div className="col-md-8">
						<h2 className="display-4 text-center"><strong>Uppdatera övning</strong></h2>
						{/*Form to get input from user*/}
						<ExerciseForm exerciseCallback={this.handleCallback} name={this.state.name}
							desc={this.state.desc}
							time={this.state.time} tags={this.state.tags} okName={this.checkName()}
							okTime={this.checkTime()} resetTitle={"Återställ allt"}/>
						{/*Button for the form. Calls the function addExercise. Retrieve the users input*/}
						<button className="btn btn-color btn-done" type='button' onClick={(e) => this.editExercise(e)}>
                            Spara
						</button>
						<GoBackButton confirmationNeeded={this.state.isChanged}/>
						{failedAlert}
					</div>
				</div>
			</div>
		)
	}

}

ExerciseEdit.contextType = AccountContext

export default ExerciseEdit