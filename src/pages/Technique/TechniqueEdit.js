import React from "react"
import "../Exercise/ExerciseCreate.css"
import TechniqueForm from "../../components/Forms/TechniqueForm"
import {AccountContext} from "../../context"
import GoBackButton from "../../components/Common/GoBackButton"
import EditGallery from "../../components/Gallery/EditGallery"

/**
 * The page for editing existing techniques.
 *
 * @author Calskrove (2022-05-19), Verona (2022-05-16)
 */
class TechniqueEdit extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			id: -1,
			name: "",
			desc: "",
			tags: [],
			existingTags: [],
			wait: true,
			editFailed: false,              //indicates if edit failed
			addTagfailed: false,
			removeTagFailed: false,
			linkTagFailed: false,
			failed: false,
			errorName: "", //stores name for technique that failed to be edited
			storedName: "",
			storedDesc: "",
			clickedButton: false,
			okName: true,
			okDesc: true,
			isChanged: false,  // icChanged and callBack values are used so we don't get an
			callBack: false   // alert when not changing anything in the technique.
		}

		this.editTechnique = this.editTechnique.bind(this)
		this.handleCallback = this.handleCallback.bind(this)
	}

	/**
     * Whenever the component updates, get the information for the id in pathname.
     */
	componentDidMount() {
		this.getTechniqueAndTags()
	}

	/**
     * Fetches the technique that corresponds to the id in the pathname. Also
     * fetches the tags related to the technique. This information is then set
     * in the state.
     */
	async getTechniqueAndTags() {
		const requestOptions = {
			method: "GET",
			headers: {"Content-type": "application/json", token: this.context.token},
		}

		// Grab the last part of the path, i.e the ID.
		const id = window.location.pathname.substring(window.location.pathname.lastIndexOf("/") + 1)
		let techniqueJson
		let filteredTags

		try {
			// Fetch the information for the id and update the state to contain the information for it.
			const response = await fetch(`/api/techniques/${id}`, requestOptions)
			techniqueJson = await response.json()
		} catch (error) {
			alert("Could not find details about the technique")
			console.log("error", error)
		}

		try {
			const tagsResponse = await fetch("/api/tags/all", requestOptions)
			const allTagsJson = await tagsResponse.json()

			const tagIdResponse = await fetch(`/api/tags/get/tag/by-technique?techId=${id}`, requestOptions)
			const tagIdJson = await tagIdResponse.json()
			filteredTags = allTagsJson.filter((tag) => tagIdJson.map(obj => obj.tagId).includes(tag.id)).map((tags) => {
				return {label: tags.name, value: tags.id}
			})
		} catch (error) {
			alert("Could not find tags for the technique")
			console.log("error", error)
		}
		this.setState({
			name: techniqueJson.name,
			desc: techniqueJson.description,
			tags: filteredTags,
			existingTags: filteredTags,
			id: id,
			wait: false
		})
	}

	/**
     * Call this when an edit request (PUT) should be sent to the API.
     * @param {*} e The event that caused editTechnique.
     */
	async editTechnique() {
		this.setState({clickedButton: true})

		if (this.state.name !== undefined) {
			this.setState({storedName: this.state.name})
		} else {
			this.setState({storedName: ""})
		}

		if (this.state.desc !== undefined) {
			this.setState({storedDesc: this.state.desc})
		} else {
			this.setState({storedDesc: ""})
		}

		const requestOptions = {
			method: "PUT",
			headers: {"Content-type": "application/json", token: this.context.token},
			body: JSON.stringify({
				id: this.state.id,
				name: this.state.name,
				description: this.state.desc,
			})
		}

		const response = await fetch("/api/techniques/", requestOptions)
		try {
			if (!response.ok) {
				this.setState({failed: true})
				console.log("response not OK")
				this.setState({editFailed: true})   
				this.setState({errorName: this.state.name})   //store the name of technique that could not be edited
				this.forceUpdate()
			}
		} catch (error) {
			this.setState({failed: true})
			console.log("error")
			this.setState({editFailed: true})   
			this.setState({errorName: this.state.name})         //store the name of technique that could not be edited
			this.forceUpdate()
		}
		await this.addTag(this.state.id)
	}

	/**
    * API call when adding a tag to a technique. Also creates the tag
    * if it does not exist in the database.
    * @param id is the id of the tag that is to be added
    * 
    * @returns the id of the technique that has been created
    */
	async addTag(id) {
		let tag_id = null
		for (let i = 0; i < this.state.tags.length; i++) {
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
						this.setState({addTagfailed: false})
						this.forceUpdate()
					} else {
						this.setState({failed: true})
						this.setState({addTagfailed: true})
						this.forceUpdate()
					}
				} catch (error) {
					this.setState({failed: true})
					console.log("Error at tag insert")
					this.setState({addTagfailed: true})
					this.forceUpdate()
				}
			} else {
				tag_id = this.state.tags[i].value
			}
			if (!this.state.existingTags.includes(this.state.tags[i])) {
				await this.linkTechniqueTag(id, tag_id)
			}
		}
		for (let i = 0; i < this.state.existingTags.length; i++) {
			if (!this.state.tags.includes(this.state.existingTags[i])) {
				await this.removeTag(id, this.state.existingTags[i].value)
			}
		}
		if (!this.state.failed) {
			window.location.href = "/technique"
		}
	}

	/**
     * API call when removing a tag from a technique.
     * @param {*} tech_id the id of the technique with the tag to be removed
     * @param {*} tag_id the id of the tag to be removed
     */
	async removeTag(tech_id, tag_id) {
		const requestOptions = {
			method: "DELETE",
			headers: {"Content-type": "application/json", "token": this.context.token},
			body: JSON.stringify({"techId": tech_id})
		}

		try {
			const response = await fetch(`/api/tags/remove/technique?tag=${tag_id}`, requestOptions)
			if (response.ok) {
				this.setState({removeTagFailed: false})
				this.forceUpdate()
			} else {
				this.setState({failed: true})
				this.setState({removeTagFailed: true})
				this.forceUpdate()
			}
		} catch (error) {
			this.setState({failed: true})
			console.log("Error at tag link")
			this.setState({removeTagFailed: true})
			this.forceUpdate()
		}
	}

	/**
    * API call when linking a tag to a technique.
    * @param tech_id the id of the technique that the tag is added to
    * @param tag_id the id of the tag that is added to the technique
    */
	async linkTechniqueTag(tech_id, tag_id) {
		const requestOptions = {
			method: "POST",
			headers: {"Content-type": "application/json", "token": this.context.token},
			body: JSON.stringify({"techId": tech_id})
		}

		try {
			const response = await fetch("/api/tags/add/technique?tag=" + tag_id, requestOptions)
			if (response.ok) {
				this.setState({linkTagFailed: false})
				this.forceUpdate()
			} else {
				this.setState({failed: true})
				this.setState({linkTagFailed: true})
				this.forceUpdate()
			}
		} catch (error) {
			this.setState({failed: true})
			console.log("Error at tag link")
			this.setState({linkTagFailed: true})
			this.forceUpdate()
		}
	}

	/**
     * Handle information being updated in TechniqueForm.
     * @param formData Updated data.
     */
	handleCallback(formData) {
		if (this.state.callBack) {
			this.setState({isChanged: true})
		}
		this.setState({callBack: true})
		this.setState(formData)
	}

	/**
     * A function that will validate the users input on name. If the input is
     * invalid it will send a signal to the form and change the input style.
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
				this.setState({clickedButton: false})
				this.setState({okName: true})
			}
			this.setState({clickedButton: false})
		}
		return this.state.okName
	}

	/**
     * A function that will validate the users input on description.
     * If the input is invalid it will send a signal to the form and change
     * the input style.
     *
     * @returns Boolean
     */
	checkDesc() {
		if (this.state.okDesc === false) {
			if (this.state.desc !== "" && this.state.desc !== undefined) {
				this.setState({okDesc: true})
			}
		}

		if (this.state.clickedButton === true) {
			if (this.state.storedDesc === "") {
				this.setState({okDesc: false})
			} else {
				this.setState({clickedButton: false})
				this.setState({okDesc: true})
			}
			this.setState({clickedButton: false})
		}
		return this.state.okDesc
	}

	/**
     * Render - The main meat of the class, containing the general functionality.
     * The function is executed when going to or refreshing the page.
     * @returns A page for editing a technique.
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

		let failedAlert    //should be true if edit failed
		if (this.state.editFailed) {
			failedAlert = <div className="alert alert-danger"
				role="alert">
                Tekniken {this.state.errorName} kunde ej ändras
			</div>
		}

		if (this.state.addTagfailed) {
			failedAlert = <div className="alert alert-danger"
				role="alert">
                Taggen {this.state.errorName} kunde ej läggas till
			</div>
		}

		if (this.state.removeTagFailed) {
			failedAlert = <div className="alert alert-danger"
				role="alert">
                Taggen {this.state.errorName} kunde ej tas bort
			</div>
		}

		if (this.state.linkTagFailed) {
			failedAlert = <div className="alert alert-danger"
				role="alert">
                Taggen {this.state.errorName} kunde ej länkas till tekniken
			</div>
		}


		return (
			<div className="container">
				<div className="row justify-content-center">
					<div className="col-md-8">
						<EditGallery exerciseId={this.state.id}/>
						<h2 className="display-4 text-center"><strong>Uppdatera teknik</strong></h2>
						{/*Form to get input from user*/}

						<TechniqueForm techniqueCallback={this.handleCallback} name={this.state.name}
							desc={this.state.desc} tags={this.state.tags}
							okName={this.checkName()} okDesc={this.checkDesc()}
							resetTitle={"Återställ allt"}/>
						{/*Button for the form. Calls the function addTechnique. Retrieve the users input*/}
						<button className="btn btn-color btn-done" type='button' onClick={(e) => this.editTechnique(e)}>
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

TechniqueEdit.contextType = AccountContext

export default TechniqueEdit
