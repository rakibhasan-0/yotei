import { useContext, useEffect, useState} from "react"
import { AccountContext } from "../../../context"
import WorkoutActivityList from "../../../components/Workout/WorkoutActivityList/WorkoutActivityList"
import "./WorkoutView.css"
import Tag from "../../../components/Common/Tag/Tag"
import Button from "../../../components/Common/Button/Button"
import { useNavigate, Link} from "react-router-dom"
import {useParams} from "react-router"
import { Pencil, Trash} from "react-bootstrap-icons"
import Review from "../../../components/Workout/WorkoutReview/ReviewFormComponent.jsx"
import ErrorState from "../../../components/Common/ErrorState/ErrorState"
import Spinner from "../../../components/Common/Spinner/Spinner"
import {HTTP_STATUS_CODES} from "../../../utils"
import {toast} from "react-toastify"
import PrintButton from "../../../components/Common/PrintButton/PrintButton"
import ConfirmPopup from "../../../components/Common/ConfirmPopup/ConfirmPopup"

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
 * @author Cyclops (Group 5) (2023-05-22)
 * @version 1.6
 */

export default function WorkoutView({id}) {
	const {workoutId} = useParams()
	const navigate = useNavigate()
	const context = useContext(AccountContext)
	const [showPopup, setShowPopup] = useState(false)
	const [workoutData, setWorkoutData] = useState(null)
	const [workoutUsers, setWorkoutUsers] = useState(null)
	const [showRPopup, setRShowPopup] = useState(false)
	const [errorStateMsg, setErrorStateMsg] = useState("")
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchData = async () => {
			const requestOptions = {
				headers: {"Content-type": "application/json", token: context.token}
			}
			const response = await fetch(`/api/workouts/detail/${workoutId}`, requestOptions)
			if(response.status != HTTP_STATUS_CODES.OK){
				setErrorStateMsg("Pass med ID '" + workoutId + "' existerar inte. Felkod: " + response.status)
				setLoading(false)
			} else {
				const json = await response.json()
				setWorkoutData(() => json)
				setLoading(false)
				setErrorStateMsg("")
			}
		}

		fetchData()
	}, []) // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		const fetchData = async () => {
			const requestOptions = {
				headers: {"Content-type": "application/json", token: context.token}
			}
			const response = await fetch(`/api/workouts/get/userworkout/${workoutId}`, requestOptions)

			if (response.status === HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR) {
				setError("Serverfel: Gick inte att hämta användare för passet. Felkod: " + response.status)
			} else if(response.status === HTTP_STATUS_CODES.NOT_FOUND) {
				setError("Passet existerar inte längre!")
			} else {
				const json = await response.json()
				setWorkoutUsers(() => json)
			}

		}

		fetchData()
	}, []) // eslint-disable-line react-hooks/exhaustive-deps

	return (
		loading ? <div className="mt-5"> <Spinner/> </div>
			: !workoutData ? <ErrorState message={errorStateMsg} onBack={() => navigate("/workout")} onRecover={() => window.location.reload(false)}/>
				:
				<div id={id}>
					{<ConfirmPopup popupText={"Radera pass"} id={"confirm-popup"} setShowPopup={setShowPopup} showPopup={showPopup} onClick={async () => deleteWorkout(workoutId, context, navigate, setShowPopup)}/>}
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
					{(workoutUsers !== null && workoutUsers.length > 0) && getWorkoutUsersContainer(workoutUsers)}
					{getButtons(navigate, setRShowPopup)}
				</div>
	)
}

function setError(msg){
	toast.error(msg, {
		position: "top-center",
		autoClose: 5000,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: false,
		progress: undefined,
		theme: "colored",
	})
}

function sortByCategories(workoutData) {

	const sortedCategories = workoutData.activityCategories.sort((a, b) => a.categoryOrder - b.categoryOrder)

	return sortedCategories
}

function getReviewContainer(showRPopup, setRShowPopup, workoutId){
	return (<Review isOpen={showRPopup} setIsOpen={setRShowPopup} workout_id={workoutId}/>)
}

async function deleteWorkout(workoutId, context, navigate, setShowPopup) {

	const requestOptions = {
		headers: {"Content-type": "application/json", token: context.token},
		method: "DELETE"
	}

	const response = await fetch(`/api/workouts/delete/${workoutId}`, requestOptions)
	if(response.status === HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR){
		setError("Något gick fel med att ansluta till servern")
	}else if(response.status === HTTP_STATUS_CODES.NOT_FOUND) {
		setError("Passet existerar inte längre!")
	} else {
		navigate("/workout")
	}
	setShowPopup(false)
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
					<div className="workout-detail-row-item">
						<div className="col workout-detail-column-item">
							<h1 className="font-weight-bold">{workoutData.name}</h1>
						</div>
					</div>
					<div className="d-flex justify-content-end align-items-center">
						<PrintButton workoutData={workoutData} />
						<Link className="ml-3" state={{workout: workoutData}} to={"/workout/edit"}>
							<Pencil
								size="24px"
								color="var(--red-primary)"
								style={{cursor: "pointer"}}
							/>
						</Link>
						<Trash
							className="ml-3 mr-3"
							size="24px"
							color="var(--red-primary)"
							style={{cursor: "pointer"}}
							onClick={() => setShowPopup(true)}
						/>
					</div>

					<div className="workout-detail-row-item mt-3">
						<div className="workout-detail-column-item">
							<h2 className="font-weight-bold mb-0">Författare</h2>
							<p>{workoutData.author.username}</p>
						</div>
						<div className="workout-detail-column-item workout-detail-column-item-right">
							<h2 className="font-weight-bold mb-0">Tidslängd</h2>
							<p>{workoutData.duration} min</p>
						</div>
					</div>

					<div className={"workout-detail-row-item"} id="no-print">
						<div className={"workout-detail-column-item"}>
							<h2 className="font-weight-bold mb-0">Skapad</h2>
							<p>{workoutData.created}</p>
						</div>
						<div className={"workout-detail-column-item workout-detail-column-item-right"}>
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
