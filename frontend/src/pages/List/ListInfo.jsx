import { useContext, useEffect, useState } from "react"
import { AccountContext } from "../../context"
import SavedActivityList from "../../components/SavedList/SavedListInfo/SavedListComponent"

import styles from "./ListInfo.module.css"
import Tag from "../../components/Common/Tag/Tag"
import Button from "../../components/Common/Button/Button"
import { useNavigate, Link } from "react-router-dom"
import { useParams } from "react-router"
import { Pencil, Trash } from "react-bootstrap-icons"
import ErrorState from "../../components/Common/ErrorState/ErrorState"
import Spinner from "../../components/Common/Spinner/Spinner"
import { HTTP_STATUS_CODES, setError, setSuccess, isAdmin } from "../../utils"
import PrintButton from "../../components/Common/PrintButton/PrintButton"
import ConfirmPopup from "../../components/Common/ConfirmPopup/ConfirmPopup"

/**
 * A page for viewing lists. The user can view the information
 * about a lists on this page. Activities linked to the list
 * are displayedy. Added user are also displayed.
 *
 * Props:
 *      workoutId @type {int} - The ID of the workout.
 *      id        @type {int/string} - the id of the component
 *
 * @author Team Tomato (6)
 * @since 2024/05/03
 *
 * @version 1.6
 *
 */

export default function ListInfo({ id }) {
	const { workoutId } = useParams()
	const navigate = useNavigate()
	const context = useContext(AccountContext)
	const [showPopup, setShowPopup] = useState(false)
	const [workoutData, setWorkoutData] = useState(null)
	const [workoutUsers, setWorkoutUsers] = useState(null)
	const [showRPopup, setRShowPopup] = useState(false)
	const [errorStateMsg, setErrorStateMsg] = useState("")
	const [loading, setLoading] = useState(true)
	const [loadingUser, setLoadingUser] = useState(true)
	const { userId } = useContext(AccountContext)

	useEffect(() => {
		const MockList = {
			list_id: 1,
			list_name: "TestList",
			state: "Private",
			amountOfWorkouts: 3,
			author: "Oliver",
			author_id: 1,
			description: "Behövs ens detta",
			created_date: "2024-04-13",
			changed_date: "2024-05-03",
			list_users: ["1", "Hugo", "Willy"],
			list: [
				{
					id: 1,
					type: "technique",
					duration: 5,
					technique: { name: "Kniv i magen! Mycket ont", description: "Beskv1" },
				},
				{
					id: 2,
					type: "exercise",
					duration: 10,
					exercise: {
						name: "Kniv i foten! Mycket ont",
						description: "Beskv2 kdlfjad lalkdsflkd fjldksfjldfkslsdkjlsdkfjdlskjdfls",
					},
				},
				{
					id: 3,
					type: "technique",
					duration: 15,
					technique: { name: "Knip i magen! Mycket ont", description: "" },
				}, //Har inte description!
			],
		}
		setWorkoutData(() => MockList)
		setWorkoutUsers(() => MockList.list_users)
		setLoading(false)
		setLoadingUser(false)
	}, [])
	//{console.log(workoutData)}

	return loading || loadingUser ? (
		<div className="mt-5">
			{" "}
			<Spinner />{" "}
		</div>
	) : !workoutData ? (
		<ErrorState
			message={errorStateMsg}
			onBack={() => navigate("/profile")}
			onRecover={() => window.location.reload(false)}
		/>
	) : (
		<div id={id} className="container px-0">
			{
				<ConfirmPopup
					popupText={'Är du säker att du vill radera passet "' + workoutData.name + '"?'}
					id={"confirm-popup"}
					setShowPopup={setShowPopup}
					showPopup={showPopup}
					onClick={async () => deleteWorkout(workoutId, context, navigate, setShowPopup)}
				/>
			}
			{getListInfoContainer(workoutData, null, context, userId, workoutUsers)}
			{
				/*sortByCategories(workoutData).map((activityCategory) => (
						<div key={activityCategory.categoryOrder}>
							<WorkoutActivityList
								categoryName={activityCategory.categoryName}
								activities={activityCategory.activities}
								navigate={navigate}
								id={"WorkoutActivityList-" + activityCategory.categoryOrder}>
							</WorkoutActivityList>
						</div>
                    ))*/
				//}
				/*
					{workoutData.tags.length != 0 && getTagContainer(workoutData)}
                    */
			}
			<h2 className="font-weight-bold mb-0 mt-5 text-left">Aktiviteter</h2>
			<SavedActivityList activities={workoutData} />
			{workoutUsers !== null && workoutUsers.length > 0 && getWorkoutUsersContainer(workoutUsers)}
			{getButtons(navigate, setRShowPopup)}
		</div>
	)
}

async function deleteWorkout(workoutId, context, navigate, setShowPopup) {
	//Kolla från WorkoutView
}

function getTagContainer(workoutData) {
	return (
		<div className="container">
			<div className="row">
				<h2>Taggar</h2>
			</div>
			<div className="row">
				{workoutData.tags.map((tag, index) => {
					return (
						<div key={"tag" + index} className="mr-2">
							<Tag tagType={"default"} text={tag.name}></Tag>
						</div>
					)
				})}
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
				{workoutUsers.map((user, index) => {
					return (
						<div key={"wu" + index} className="mr-2">
							{/* Här kommer vi behöva ändra om så att en user blir ett objekt :)  */}
							<Tag tagType={"default"} text={user}></Tag>
						</div>
					)
				})}
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
		</div>
	)
}

function getListInfoContainer(workoutData, setShowPopup, context) {
	return (
		<>
			<div className="container px-0">
				<div className={styles.info}>
					<div className={`d-flex col ${styles.workoutDetailColumnItem} p-0`}>
						<title>Pass</title>
						<h1 className="font-weight-bold m-0">{workoutData.list_name}</h1>
					</div>
					<div className="d-flex justify-content-end align-items-center">
						<div className={styles.clickIcon}>{/*<PrintButton workoutData={workoutData} />*/}</div>
						{(context.userId == workoutData.author.user_id || isAdmin(context)) && (
							<>
								<Link
									className="ml-3"
                                    {...console.log("Workout data that is sent:")}
                                    {...console.log(workoutData)}
									state={{ workout: workoutData, users: workoutData.list_users }}
									to={"/list/editList"}
								>
									<Pencil
										size="24px"
										color="var(--red-primary)"
										style={{ cursor: "pointer" }}
										id={"edit_pencil"}
									/>
								</Link>
								<Trash
									className="ml-3 mr-3"
									size="24px"
									color="var(--red-primary)"
									style={{ cursor: "pointer" }}
									onClick={() => setShowPopup(true)}
								/>
							</>
						)}
					</div>

					<div className="d-flex">
						<div className={styles.workoutDetailColumnItem}>
							<h2 className="font-weight-bold mb-0">Synlighet</h2>
							<p className="mb-0">{workoutData.state}</p>
						</div>
						<div className={styles.workoutDetailColumnItem} style={{ paddingLeft: "37px" }}>
							<h2 className="font-weight-bold mb-0">Författare</h2>
							{<p className="mb-0">{workoutData.author}</p>}
						</div>
					</div>

					<div className="d-flex" id="no-print">
						<div className={styles.workoutDetailColumnItem}>
							<h2 className="font-weight-bold mb-0">Skapad</h2>
							<p className="mb-0">{workoutData.created_date}</p>
						</div>
						<div className={styles.workoutDetailColumnItem} style={{ paddingLeft: "37px" }}>
							<h2 className="font-weight-bold mb-0 text-align-left">Senast ändrad</h2>
							<p className="mb-0">{workoutData.changed_date}</p>
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
