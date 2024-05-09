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
            addedActivities:[],
            checkedActivities:[],
            data: {
                activities: [
                    {
                        duration: 200,
						type: "exercise",
                        exercise:{
                            description: "En övning",
                            duration: 20,
                            id: 1,
                            name: "ÖvningEx",
                        },
                        technique: null,
                        isEditable: false,
                    },
                    {
                        duration: 2,
						type: "technique",
                        exercise:null,
                        technique:{
                            belts:[
                                {
                                    id: 9,
                                    name: "Blått",
                                    color: "1E9CE3",
                                    child: false,
                                },
                            ],
                            description: "",
                            id: 138,
                            name: "Kamae, neutral (5 Kyu)",
                            tags:[
                                {
                                    id: 67,
                                    name: "nybörjare",
                                },
                            ],
                        },
                        isEditable: false,
                    },
                ],
                author: {id: 1,username:"mega admin"},
                created_date: "2023-06-22",
                changed_date: "2024-07-23",
                description: "En ganska bra lista!",
                duration: 50,
                id: 1,//listId,
                isPrivate: true,
                name:" Olivers nice list ",
                users:[
                    {
                        userId: 1, username:"Admin",
                    },
                    {
                        userId: 2, username:"Editor",
                    },
                ],
            },
            numActivities: 2,
            originalData:{},
            popUpState:{
                currentlyEditing: {id: null,date:null},
                isOpened: false,
                types:{
                    activityPopup: false, chooseActivityPopup: false, editActivityPopup: false, freeTextPopup: false,
                },
            },
        }

		setWorkoutData(() => MockList)
		setWorkoutUsers(() => MockList.data.users)

		setLoading(false)
		setLoadingUser(false)
	}, [])
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
					popupText={'Är du säker att du vill radera passet "' + workoutData.data.name + '"?'}
					id={"confirm-popup"}
					setShowPopup={setShowPopup}
					showPopup={showPopup}
					onClick={async () => deleteWorkout(workoutId, context, navigate, setShowPopup)}
				/>
			}
			{getListInfoContainer(workoutData, null, context, userId, workoutUsers)}

			<h2 className="font-weight-bold mb-0 mt-5 text-left">Aktiviteter</h2>
			<SavedActivityList activities={workoutData} edit={false} />
			{workoutUsers !== null && workoutUsers.length > 0 && getWorkoutUsersContainer(workoutUsers)}
			{getButtons(navigate, setRShowPopup)}
		</div>
	)
}

async function deleteWorkout(workoutId, context, navigate, setShowPopup) {
	//Kolla från WorkoutView
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
							<Tag tagType={"default"} text={user.username}></Tag>
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
						<h1 className="font-weight-bold m-0">{workoutData.data.name}</h1>
					</div>
					<div className="d-flex justify-content-end align-items-center">
						<div className={styles.clickIcon}>{/*<PrintButton workoutData={workoutData} />*/}</div>
                        
						{(context.userId == workoutData.data.author.id || isAdmin(context)) && (
							<>
								<Link
									className="ml-3"
                                    					state={{ workout: workoutData, users: workoutData.data.users }}
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
							<p className="mb-0">{workoutData.data.isPrivate? "Privat": "Publik"}</p>
						</div>
						<div className={styles.workoutDetailColumnItem} style={{ paddingLeft: "37px" }}>
							<h2 className="font-weight-bold mb-0">Författare</h2>
							{<p className="mb-0">{workoutData.data.author.username}</p>}
						</div>
					</div>
					<div className="d-flex" id="no-print">
						<div className={styles.workoutDetailColumnItem}>
							<h2 className="font-weight-bold mb-0">Skapad</h2>
							<p className="mb-0">{workoutData.data.created_date}</p>
						</div>
						<div className={styles.workoutDetailColumnItem} style={{ paddingLeft: "37px" }}>
							<h2 className="font-weight-bold mb-0 text-align-left">Senast ändrad</h2>
							<p className="mb-0">{workoutData.data.changed_date}</p>
						</div>
					</div>
					<div className={styles.workoutDetailColumnItem}>
						<h2 className="font-weight-bold mb-0">Beskrivning</h2>
						<p className={styles.properties}>{workoutData.data.description}</p>
					</div>
				</div>
			</div>
            
		</>
	)
}
