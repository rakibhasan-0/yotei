import { useContext, useEffect, useState} from "react"
import { AccountContext } from "../../../context"
import WorkoutActivityList from "../../../components/Workout/WorkoutActivityList/WorkoutActivityList"
import "./WorkoutView.css"
import Tag from "../../../components/Common/Tag/Tag"
import Button from "../../../components/Common/Button/Button"
import { useNavigate, Link} from "react-router-dom"
import {useParams} from "react-router"
import Popup from "../../../components/Common/Popup/Popup"
import { Pencil, Trash, Printer} from "react-bootstrap-icons"
import Review from "../../../components/Workout/ReviewFormComponent.jsx"

/**
 * A page for creating workouts. The user can view the information
 * about a workout on this page. Activities linked to the workout
 * are displayed in lists in their respective category. Tags and
 * added user are also displayed.
 * 
 * Props:
 *      workoutId @type {int} - The ID of the workout.
 *      id        @type {int/string} - the id of the component
 *
 * @author Cyclops (Group 5) (2023-05-09)
 * @version 1.0
 */

export default function WorkoutView({id}) {
	const {workoutId} = useParams()
	const navigate = useNavigate()
	const context = useContext(AccountContext)
	const [showPopup, setShowPopup] = useState(false)
	const [workoutData, setWorkoutData] = useState(null)
	const [workoutUsers, setWorkoutUsers] = useState(null)
	const [showRPopup, setRShowPopup] = useState(false)

	useEffect(() => {
		const fetchData = async () => {
			const requestOptions = {
				headers: {"Content-type": "application/json", token: context.token}
			}
			const response = await fetch(`/api/workouts/detail/${workoutId}`, requestOptions)
			const json = await response.json()
			setWorkoutData(() => json)
		}

		fetchData()
	}, []) // eslint-disable-line react-hooks/exhaustive-deps
	
	useEffect(() => {
		const fetchData = async () => {
			const requestOptions = {
				headers: {"Content-type": "application/json", token: context.token}
			}
			const response = await fetch(`/api/workouts/get/userworkout/${workoutId}`, requestOptions)
			const json = await response.json()
			setWorkoutUsers(() => json)
		}

		fetchData()
	}, []) // eslint-disable-line react-hooks/exhaustive-deps

	return ( 
		workoutData && workoutUsers &&
		<div id={id} className="container px-0 col-lg-4 col-md-4">
			{getPopupContainer(showPopup, setShowPopup, workoutId, context, navigate)}

			{getReviewContainer(showRPopup, setRShowPopup, workoutId)}
			{getWorkoutInfoContainer(workoutData, setShowPopup)}
			{sortByCategories(workoutData).map((activityCategory) => (
				<div className="my-5" key={activityCategory.categoryOrder}>
					<WorkoutActivityList
						categoryName={activityCategory.categoryName} 
						activities={activityCategory.activities} 
						navigate={navigate}
						id={"WorkoutActivityList-" + activityCategory.categoryOrder}>	
					</WorkoutActivityList>
				</div>
			))}
			{workoutData.tags.length != 0 && getTagContainer(workoutData)}
			{workoutUsers.length > 0 && getWorkoutUsersContainer(workoutUsers)}
			{getButtons(navigate, setRShowPopup)}
		</div>
	)	
}

function sortByCategories(workoutData) {

	const sortedCategories = workoutData.activityCategories.sort((a, b) => a.categoryOrder - b.categoryOrder)

	return sortedCategories
}

function getPopupContainer(showPopup, setShowPopup, workoutId, context, navigate) {
	return (
		<Popup
			id={"confirm-popup"}
			title={"Ta bort pass"}
			isOpen={showPopup}
			setIsOpen={setShowPopup}
			width={95}
			maxWidth={400}
			height={40}
			maxHeight={250}
		>
			<p className="font-">Är du säker på att du vill ta bort detta pass?</p>
			<div className="row justify-content-center">
				<div className="d-flex col justify-content-end">
					<Button onClick={async () => deleteWorkout(workoutId, context, navigate)}>Ja</Button>
				</div>
				<div className="d-flex col justify-content-start">
					<Button onClick={() => setShowPopup(false)}>Nej</Button>
				</div>
			</div>
		</Popup>
	)
}

function getReviewContainer(showRPopup, setRShowPopup, workoutId){
	return (showRPopup && setRShowPopup && <Review isOpen={showRPopup} setIsOpen={setRShowPopup} workout_id={workoutId}/>)
}

async function deleteWorkout(workoutId, context, navigate) {

	const requestOptions = {
		headers: {"Content-type": "application/json", token: context.token},
		method: "DELETE"
	}

	await fetch(`/api/workouts/delete/${workoutId}`, requestOptions)
	navigate("/workout")
}

function getTagContainer(workoutData) {
	return (
		<div className="container">
			<div className="row">
				<h2>Taggar</h2>
			</div>
			<div className="row">
				{
					workoutData.tags.map((tag, index) => {
						return (
							<div key={"tag" + index} className="mr-2"> 
								<Tag tagType={"default"} text={tag.name}></Tag>
							</div>
						)
					})	
				}
			</div>
		</div>	
	)
}

function getWorkoutUsersContainer(workoutUsers) {
	return (
		<div className="container mt-3">
			<div className="row">
				<h2>Användare</h2>
			</div>
			<div className="row">
				{
					workoutUsers.map((user, index) => {
						return (
							<div key={"wu" + index}>
								<Tag tagType={"default"} text={user.username}></Tag>
							</div>
						)
					})
				}
			</div>
		</div>
	)
}

function getButtons(navigate, setRShowPopup) {
	return (
		<div className="d-flex row justify-content-center">
			<div className="d-flex col mt-3 justify-content-end">
				<Button onClick={() => navigate("/workout")} outlined={true}>
					<p>Tillbaka</p>
				</Button>
			</div>
			<div className="d-flex col mt-3 justify-content-start">
				<Button onClick={() => setRShowPopup(true)} outlined={false}>
					<p>Utvärdering</p>
				</Button>
			</div>
		</div>
	)
}


function getWorkoutInfoContainer(workoutData, setShowPopup) {
	return (
		<>
			<div className="container px-0">
				<div className={"info"}>
					<div className="row-item">
						<div className="column-item">
							<h1 className="font-weight-bold text-truncate">{workoutData.name}</h1>
						</div>
						<div className="workout-detail-icon-container">
							<Printer
								size="24px"
								color="var(--red-primary)"
								style={{cursor: "pointer"}}	
							/>
							<Link state={{workout: workoutData}} to={"/workout/edit"}>
								<Pencil
									size="24px"
									color="var(--red-primary)"
									style={{cursor: "pointer"}}
								/>
							</Link>
							<Trash
								size="24px"
								color="var(--red-primary)"
								style={{cursor: "pointer"}}
								onClick={() => setShowPopup(true)}
							/>
						</div>					
					</div>
					
					<div className="row-item">
						<div className="column-item">
							<h2 className="font-weight-bold mb-0" id="no-print">Fullständigt namn</h2>
							<p className="properties" id="no-print">{workoutData.name}</p>
						</div>
					</div>
					
					<div className="row-item">
						<div className="column-item">
							<h2 className="font-weight-bold mb-0">Författare</h2>
							<p>{workoutData.author.username}</p>
						</div>
						<div className="column-item column-item-right">
							<h2 className="font-weight-bold mb-0">Tidslängd</h2>
							<p>{workoutData.duration} min</p>
						</div>
					</div>

					<div className={"row-item"} id="no-print">
						<div className={"column-item"}>
							<h2 className="font-weight-bold mb-0">Skapad</h2>
							<p>{workoutData.created}</p>
						</div>
						<div className={"column-item column-item-right"}>
							<h2 className="font-weight-bold mb-0 text-align-left">Senast ändrad</h2>
							<p>{workoutData.changed}</p>
						</div>
					</div>

					<h2 className="font-weight-bold mb-0">Beskrivning</h2>
					<p className="properties">{workoutData.description}</p>
				</div>
			</div>		
		</>
	)
}

