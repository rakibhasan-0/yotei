import React, {useState} from "react"
import ActivityList from "../../components/Activity/ActivityList"
import EditButton from "../../components/Common/EditButton"
import "./WorkoutView.css"
import { AccountContext } from "../../context"
import {useParams} from "react-router-dom"
import FavoriteButton from "../../components/Common/StarButton/StarButton"
import PrintButton from "../../components/Common/PrintButton"
import ReviewForm from "../../components/Workout/ReviewFormComponent"
import GoBackButton from "../../components/Common/GoBackButton"
import DuplicateButton from "../../components/Common/DuplicateButton"
import {ButtonGroup, Collapse, Dropdown} from "react-bootstrap"
import Button from "../../components/Common/Button/Button"
import Modal from "react-bootstrap/Modal"

/**
 * Wrapper for using "useParams()" in a class component
 * @param WorkoutView component to wrap
 * @returns {function(*)} wrapped component
 */
function withParams(WorkoutView) {

	// eslint-disable-next-line react/display-name
	return props => <WorkoutView {...props} params={useParams()} />
}

/**
 * Class for viewing a single workout.
 *
 * @author Team Capricciosa (Group 2), Kebabpizza (Group 8) Verona (Grupp 5)
 * @version 1.0
 */
class WorkoutView extends React.Component {

	workoutID = this.props.params.workoutID
	constructor (props, context) {
		super(props)
		this.context = context

		this.state = {
			id: 0,
			name: "namn",
			desc: "beskrivning",
			duration: 20,
			created: "",
			changed: "",
			date: "",
			activities: [],
			tags: [],
			comments: ["test"],
			users: [],
			authorID: -1,
			authorName: "",
			favorite: false,
			isOpen: false
		}

		this.getFavorite()
	}

	openModal = () => this.setState({ isOpen: true })
	closeModal = () => this.setState({ isOpen: false })

	async getAddedUserWorkouts(requestOptions){
		await fetch(`/api/workouts/get/userworkout/${this.workoutID}`, requestOptions)
			.then(res => res.json())
			.then((data) => {
				data.forEach( (user) => {
					this.state.users.push( {
						label: user.username,
						value: user.user_id
					})
				})
			})
	}

	/**
     * Checks if the workout is created by the current user or if the current user is an admin.
     *
     * @returns True if the current user is an admin or is the creator of the workout and false otherwise.
     */
	isCreatorOrAdmin() {
		return this.context.role === "ADMIN" || this.state.authorID === this.context.userId
	}

	/**
     * Creates a page for showing information about a specific workout. Shows
     * title description, activities, tags and comments.
     *
     * @returns The page showing info about a specific workout.
     */
	render() {
		// Sort the activities on order
		this.state.activities.sort((a, b) => a.order > b.order ? 1 : -1)

		return (

			<div className="workout dynamic-width">
				<div className="header">
					<div className="left-box" id="no-print"> <FavoriteButton workoutId={ this.state.id } initState={this.state.favorite}/> </div>
					<div className="middle-box">
						<h5 className={"title"}>{this.state.name}</h5>
					</div>
					<div className="right-box" id="no-print">
						<Dropdown as={ButtonGroup}>

							{/* An alert window that shows up when trying to delete */}
							<Modal show={this.state.isOpen} onHide={this.closeModal} dialogClassName="deleteModal">
								<Modal.Header>
									<Modal.Title>Ta bort pass</Modal.Title>
								</Modal.Header>
								<Modal.Body>Är du säker på att du vill ta bort passet?</Modal.Body>
								<Modal.Footer>
									<Button
										onClick={() => this.deleteWorkout()}>
                                        Ta bort pass
									</Button>
									<Button
										onClick={this.closeModal}>
                                        Avbryt
									</Button>
								</Modal.Footer>
							</Modal>

							{/* An edit button */}
							{this.isCreatorOrAdmin() ? <EditButton className={"edit-button"} workout={this.state} linkTo={"/workout/edit"}/> : null}

							{/* Dropdown menu for buttons */}
							<Dropdown.Toggle className={"toggle"} split variant="white" id="dropdown-split-basic" />
							<Dropdown.Menu>
								<Dropdown.Item className={"item"}>
									<PrintButton className={"print-button"} linkTo=""/>
								</Dropdown.Item>
								<Dropdown.Item className={"item"}>
									<DuplicateButton workout={this.state} linkTo="/workout/create"/>
								</Dropdown.Item>
								<Dropdown.Item>
									{/* A delete button. SAIFPROBLEM!*/}
									<img className="btn btn-edit container-fluid" onClick={this.openModal} src="/trashcan.svg" alt="trashcan icon"/>
								</Dropdown.Item>
							</Dropdown.Menu>
						</Dropdown>
					</div>
				</div>

				<div className={"info"}>
					<h6 className="font-weight-bold" id="no-print">Fullständigt namn:</h6>
					<p className="font-italic properties" id="no-print">{this.state.name}</p>

					<div className={"row-item"}>
						<div className={"column-item"}>
							{/*<h6 className="font-weight-bold">Datum:</h6><p className="font-italic">{this.state.date}</p>*/}
							<h6 className="font-weight-bold">Författare:</h6><p className="font-italic">{this.state.authorName}</p>
						</div>
						<div className={"column-item column-item-right"}>
							<h6 className="font-weight-bold">Tidslängd:</h6><p className="font-italic">{this.state.duration} min</p>
						</div>
					</div>

					<div className={"row-item"} id="no-print">
						<div className={"column-item"}>
							<h6 className="font-weight-bold">Skapad:</h6><p className="font-italic">{this.state.created}</p>
						</div>
						<div className={"column-item column-item-right"}>
							<h6 className="font-weight-bold">Senast ändrad:</h6><p className="font-italic">{this.state.changed}</p>
						</div>
					</div>

					<h6 className="font-weight-bold">Beskrivning:</h6>
					<p className="font-italic properties">{this.state.desc}</p>
				</div>

				<ActivityList activities={this.state.activities} apiPath="workouts/activities"/>

				<div className="container row mt-3">
					<p className="mr-1 font-weight-bold">Taggar:</p>
					{this.state.tags.map((tag) => (
						<p className="mx-2 tag" key={tag}>{tag}</p>
					))}
				</div>

				<div className="container row mt-3" id="no-print">
					<p className="mr-1 font-weight-bold">Tillagda användare:</p>
					{this.state.users.map((users) => (
						<p className="mx-2 tag" key={users.label}>{users.label}</p>
					))}
				</div>

				<div className={"review-area"} id="no-print">
					<ToggleReview workoutID={this.workoutID}/>
				</div>

				<div className="container row mt-3" id="no-print">
					<GoBackButton confirmationNeeded={false}/>
				</div>
			</div>
		)
	}

	/**
     * Fetches the information about the workout from the database and sets the state.
     */
	componentDidMount() {
		const requestOptions = {
			headers: { "Content-type": "application/json", token: this.context.token }
		}

		this.getWorkout(requestOptions)
		this.getFavorite()

		this.getAddedUserWorkouts(requestOptions)
		// Get the activities of the workout
		fetch(`/api/workouts/activities/all/${this.workoutID}`, requestOptions)
			.then(res => res.json())
			.then((data) => {
				this.setState({activities: data})
			})

			.catch(console.log)

		this.getTags()
	}

	/**
     * Fetches the workout associated with the id in pathname and sets the state accordingly.
     */
	async getWorkout(requestOptions) {
		fetch(`/api/workouts/workout/${this.workoutID}`, requestOptions)
			.then(res => res.json())
			.then((data) => {
				this.setState({id: data.id, name: data.name, desc: data.desc, duration: data.duration, created: data.created, changed: data.changed, date: data.date, authorID: data.author, favorite: this.state.favorite})
				this.getAuthorName(requestOptions, data.author)
			})
			.catch(console.log)
	}

	/**
     * Gets the author name from the databse through the user API using authorID.
     *
     * @param {*} requestOptions Parameters for the API call.
     * @param {*} authorID Integer ID for the author.
     */
	async getAuthorName(requestOptions, authorID) {
		fetch(`/user/getname/${authorID}`, requestOptions)
			.then(res => res.json())
			.then((data) => {
				this.setState({authorName: data.username})
			})
	}

	getFavorite() {
		const requestOptions = {
			headers: {"Content-type": "application/json", token: this.context.token}
		}
		fetch(`/api/workouts/favorites/${this.context.userId}/${this.workoutID}`, requestOptions)
			.then(data => data.json())
			.then(response => {
				this.setState({...this.state, favorite: response})
			})
	}

	/**
     * Fetches the tags for the specific workout and sets the states for tags.
     */
	async getTags(){
		const requestOptions = {
			method: "GET",
			headers: { "Content-type": "application/json" , token: this.context.token},
		}

		let mappedTags
		//Get tags to the workout
		const allTags = await fetch("/api/tags/all", requestOptions)
		const allTagsJSON  = await allTags.json()
		const tagResponse = await fetch(`/api/tags/get/tag/by-workout?workId=${this.workoutID}`, requestOptions)
		const tagJSON = await tagResponse.json()
		mappedTags = allTagsJSON.filter((tag) => tagJSON.map(obj => obj.tag).includes(tag.id)).map((tags) =>{
			return tags.name
		})
		this.setState({
			tags:mappedTags
		})
	}

	/**
     * Deletes the current workout and its links to activities from the database.
     */
	async deleteWorkout() {
		this.closeModal()
		const requestOptions = {
			headers: { "Content-type": "application/json", token: this.context.token },
			method: "DELETE"
		}

		// Delete related users to the workout
		this.state.users.forEach( async (user) => {
			await fetch(`/api/workouts/remove/workout/${this.workoutID}/user/${user.value}`, requestOptions)
		})

		// Delete the workout and its linked activities
		await fetch(`/api/workouts/delete_full_workout/${this.workoutID}`, requestOptions)
		window.location.href = "/workout"
	}

}

function ToggleReview(props) {
	const [open, setOpen] = useState(false)
	return (
		<>
			<Button
				onClick={() => setOpen(!open)}
				aria-controls="example-collapse-text"
				aria-expanded={open}
				size={"lg"}
				type={"submit"}
				variant={"secondary"}
				className={"review-button btn-color"}
			>
                Visa utvärderingar
			</Button>
			<Collapse in={open}>
				<div className={"opened-review-area"}> {<ReviewForm workoutID = {props.workoutID}/>} </div>
			</Collapse>
		</>
	)
}



WorkoutView.contextType = AccountContext

export default withParams(WorkoutView)
