import { useContext, useEffect, useState} from "react"
import { AccountContext } from "../../../context"
import WorkoutActivityList from "../../../components/Workout/WorkoutActivityList/WorkoutActivityList"

import styles from "./WorkoutView.module.css"
import Tag from "../../../components/Common/Tag/Tag"
import Button from "../../../components/Common/Button/Button"
import { useNavigate, Link} from "react-router-dom"
import {useParams} from "react-router"
import { Pencil, Trash} from "react-bootstrap-icons"
import Review from "../../../components/Workout/WorkoutReview/ReviewFormComponent.jsx"
import ErrorState from "../../../components/Common/ErrorState/ErrorState"
import Spinner from "../../../components/Common/Spinner/Spinner"
import {HTTP_STATUS_CODES, setError, setSuccess, isAdmin} from "../../../utils"
import PrintButton from "../../../components/Common/PrintButton/PrintButton"
import ConfirmPopup from "../../../components/Common/ConfirmPopup/ConfirmPopup"

/**
 * A page for viewing workouts. The user can view the information
 * about a workout on this page. Activities linked to the workout
 * are displayed in lists in their respective category. Tags and
 * added user are also displayed.
 *
 * Props:
 *      workoutId @type {int} - The ID of the workout.
 *      id        @type {int/string} - the id of the component
 *
 * @author Cyclops (Group 5) (2023-05-22)
 * @author Durian  (Group 3) (2024-04-23)
 * @version 1.6
 * 
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
	const {userId} = useContext(AccountContext)

	useEffect(() => {
		const fetchData = async () => {
			const requestOptions = {
				headers: {"Content-type": "application/json", token: context.token}
			}

			const response = await fetch(`/api/workouts/detail/${workoutId}`, requestOptions).catch(() => {
				setErrorStateMsg("Serverfel: Kunde inte ansluta till servern.")
				setLoading(false)
				return
			})

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

			const response = await fetch(`/api/workouts/get/userworkout/${workoutId}`, requestOptions).catch(() => {
				setError("Serverfel: Gick inte att hämta användare för passet. Felkod: " + response.status)
				setLoading(false)
				return
			})

			if(response.status === HTTP_STATUS_CODES.NOT_FOUND) {
				setError("Passet existerar inte längre!")
			} else if (response.status != HTTP_STATUS_CODES.OK){
				setError("Något gick snett! Felkod: " + response.status)
				return
			}
			const json = await response.json()
			setWorkoutUsers(() => json)


		}

		fetchData()
	}, []) // eslint-disable-line react-hooks/exhaustive-deps

	return (
		loading ? <div className="mt-5"> <Spinner/> </div>
			: !workoutData ? <ErrorState message={errorStateMsg} onBack={() => navigate("/workout")} onRecover={() => window.location.reload(false)}/>
				:
				<div id={id} className="container px-0">
					{<ConfirmPopup popupText={"Är du säker att du vill radera passet \"" + workoutData.name + "\"?"} id={"confirm-popup"} setShowPopup={setShowPopup} showPopup={showPopup} onClick={async () => deleteWorkout(workoutId, context, navigate, setShowPopup)}/>}
					{getReviewContainer(showRPopup, setRShowPopup, workoutId)}
					{getWorkoutInfoContainer(workoutData, setShowPopup, context, userId)}
					{sortByCategories(workoutData).map((activityCategory) => (
						<div key={activityCategory.categoryOrder}>
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

	const response = await fetch(`/api/workouts/delete/${workoutId}`, requestOptions).catch(() => {
		setError("Serverfel: Kunde inte ansluta till servern.")
		return
	})

	if(response.status === HTTP_STATUS_CODES.NOT_FOUND){
		setError("Passet existerar inte längre!")
		return
	}else if(response.status === HTTP_STATUS_CODES.BAD_REQUEST) {
		setError("Kunde inte ta bort pass med id: '" + workoutId + "'.")
		return
	} else if (response.status != HTTP_STATUS_CODES.OK){
		setError("Något gick snett! Felkod: " + response.status)
		return
	}

	setSuccess("Pass borttagen!")
	navigate("/workout")
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
							<div key={"wu" + index} className="mr-2">
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
			<div className="d-flex col mb-3 mt-3 justify-content-start">
				<Button onClick={() => navigate(-1)} outlined={true}>
					<p>Tillbaka</p>
				</Button>
			</div>
			<div className="d-flex col mb-3 mt-3 justify-content-end">
				<Button onClick={() => setRShowPopup(true)} outlined={false}>
					<p>Utvärdering</p>
				</Button>
			</div>
		</div>
	)
}


function getWorkoutInfoContainer(workoutData, setShowPopup, context, userId) {
	return (
		<>
			<div className="container px-0">
				<div className={styles.info}>
					<div className={`d-flex col ${styles.workoutDetailColumnItem} p-0`}>
						<title>Pass</title>
						<h1 className="font-weight-bold m-0">{workoutData.name}</h1>
					</div>
					<div className="d-flex justify-content-end align-items-center">
						<div className={styles.clickIcon}>
							<PrintButton workoutData={workoutData}/>
						</div>
						{ (userId == workoutData.author.user_id || isAdmin(context)) &&
						<>
							<Link className="ml-3" state={{workout: workoutData}} to={"/workout/edit"}>
								<Pencil
									size="24px"
									color="var(--red-primary)"
									style={{cursor: "pointer"}}
									id={"edit_pencil"}
								/>
							</Link>
							<Trash
								className="ml-3 mr-3"
								size="24px"
								color="var(--red-primary)"
								style={{cursor: "pointer"}}
								onClick={() => setShowPopup(true)}
							/>
						</>
						}
					</div>

					<div className="d-flex">
						<div className={styles.workoutDetailColumnItem}>
							<h2 className="font-weight-bold mb-0">Författare</h2>
							<p className="mb-0">{workoutData.author.username}</p>
						</div>
						<div className={styles.workoutDetailColumnItem} style={{paddingLeft:"37px"}}>
							<h2 className="font-weight-bold mb-0">Tidslängd</h2>
							{workoutData.duration > 1? (
								<p className="mb-0">{workoutData.duration} min</p> ):( 
								<p className="mb-0">-</p>
							)
							}
						</div>
					</div>

					<div className="d-flex" id="no-print">
						<div className={styles.workoutDetailColumnItem}>
							<h2 className="font-weight-bold mb-0">Skapad</h2>
							<p className="mb-0">{workoutData.created}</p>
						</div>
						<div className={styles.workoutDetailColumnItem} style={{paddingLeft:"37px"}}>
							<h2 className="font-weight-bold mb-0 text-align-left">Senast ändrad</h2>
							<p className="mb-0">{workoutData.changed}</p>
						</div>
					</div>
					<div className={styles.workoutDetailColumnItem}>
						<h2 className="font-weight-bold mb-0">Beskrivning</h2>
						<p className={styles.properties}>{workoutData.description}</p>
					</div>
				</div>
			</div>
		</>
	)
}
