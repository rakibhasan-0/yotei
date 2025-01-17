import TimePicker from "../../components/Common/TimePicker/TimePicker"
import DatePicker from "../../components/Common/DatePicker/DatePicker"
import Button from "../../components/Common/Button/Button"
import Dropdown from "../../components/Common/List/Dropdown"
import ConfirmPopup from "../../components/Common/ConfirmPopup/ConfirmPopup"
import styles from "./SessionEdit.module.css"
import { useNavigate, useParams } from "react-router-dom"
import { useContext, useEffect, useState } from "react"
import { AccountContext } from "../../context"
import { Link, useLocation } from "react-router-dom"
import Divider from "../../components/Common/Divider/Divider"
import { Trash } from "react-bootstrap-icons"
import {setError as setErrorToast} from "../../utils"
import ErrorState from "../../components/Common/ErrorState/ErrorState"
import { unstable_useBlocker as useBlocker } from "react-router-dom"
import { Spinner } from "react-bootstrap"

/**
 * A page for editing a session.
 * 
 * Version 2.1
 *     Edit forms can not be accessed until all session data is fetched
 * 
 * @author Chimera, Team 3 Durian Tomtato, Team Mango (Group 4)
 * @since 2023-05-03
 * @version 2.1
 * @returns A page for editing a session.
 * Updates: 2024-05-20: Fixed a bug where you could not edit the time or date of a session if there are no workouts set.
 *          2024-05-21: Fixed a bug where going back from 'WorkoutCreate' caused the site to crash by loading null values.

*/
export default function SessionEdit() {
	const { state } = useLocation()
	const navigate = useNavigate()
	const {token} = useContext(AccountContext)
	// eslint-disable-next-line no-unused-vars
	const [date, setDate] = useState(state?.session?.date)
	const [time, setTime] = useState(state?.session?.time)
	const [groups, setGroups] = useState()
	const [group, setGroup] = useState(state?.session?.group)
	const [workouts, setWorkouts] = useState()
	const [sessionId, setSessionId] = useState()
	const location = useLocation()
	const [workout, setWorkout] = useState(state?.session?.workout)
	const [showPopup, setShowPopup] = useState(false)
	const [error, setError] = useState()

	const [originalDate, setOriginalDate] = useState()
	const [originalTime, setOriginalTime] = useState()
	const [originalGroup, setOriginalGroup] = useState()
	const [originalWorkout, setOriginalWorkout] = useState()


	const [goBackPopup, setGoBackPopup] = useState(false)
	const [isBlocking, setIsBlocking] = useState(false)
	
	//Blockers that stops the page from loading the edit functionalities until all data is loaded
	const [isLoadingGroups, setIsLoadingGroups] = useState([false])
	const [isLoadingWorkouts, setIsLoadingWorkouts] = useState([false])
	const [isLoadingSession, setIsLoadingSession] = useState([false])


	const blocker = useBlocker(() => {
		if (isBlocking) {
			setGoBackPopup(true)
			return true
		}
		return false
	})

	useEffect(() => {
		// Check if any of the fields are filled
		setIsBlocking(date != originalDate || time != originalTime || group !== originalGroup || workout != originalWorkout)
	}, [date, time, group, workout])

	const params = useParams()

	// get groups
	useEffect(() => {
		(async () => {
			setIsLoadingGroups(true)
			try {
				const response = await fetch("/api/plan/all", { headers: { token } })
				if (response.status === 404) {
					setIsLoadingGroups(false)
					return
				}
				if (!response.ok) {
					setIsLoadingGroups(false)
					throw new Error("Could not fetch groups")
				}
				setGroups(await response.json())
				setIsLoadingGroups(false)
			} catch (ex) {
				setIsLoadingGroups(false)
				setErrorToast("Kunde inte hämta alla grupper")
				console.error(ex)
			}
		})()
	}, [token])

	useEffect(() => {
		const currentPath = location.pathname
		const parts = currentPath.split("/")
		const id = parts[parts.length - 1]
		setSessionId(id)
	}, [])

	useEffect(() => {
		(async () => {
			try {
				setIsLoadingWorkouts(true)
				const response = await fetch("/api/workouts/all", { headers: { token } })
				if (response.status === 204) {
					setIsLoadingWorkouts(false)
					return
				}
				if (!response.ok) {
					setIsLoadingWorkouts(false)
					throw new Error("Could not fetch workouts")
				}
				setWorkouts(await response.json())
				setIsLoadingWorkouts(false)
			} catch (ex) {
				setIsLoadingWorkouts(false)
				setErrorToast("Kunde inte hämta alla pass")
				console.error(ex)
			}
		})()
	}, [groups, token])

	useEffect(() => {
		(async () => {
			setIsLoadingSession(true)
			try {
				const response = await fetch("/api/session/get?id=" + params.session_id, { headers: { token } })
				if (response.status === 204) {
					setIsLoadingSession(false)
					return
				}
				if (!response.ok) {
					setIsLoadingSession(false)
					throw new Error("Could not fetch session")
				}
				let session = await response.json()
				if (groups && workouts) {
					setGroup(groups.find(group => group.id === session.plan))
					//if you come from create new during edit
					if(state == null){
						setWorkout(workouts.find(workout => workout.id === session.workout))
					}else if(state.session.workout){
						setWorkout(workouts.find(workout => workout.id === state.session.workout.id))
					}
					setDate(session.date)
					setTime(session.time)
					setOriginalDate(session.date)
					setOriginalTime(session.time)
					setOriginalGroup(groups.find(group => group.id === session.plan))
					setOriginalWorkout(workouts.find(workout => workout.id === session.workout))
				}
				setIsLoadingSession(false)
			} catch (ex) {
				setIsLoadingSession(false)
				setError("Kunde inte hämta tillfälle")
				console.error(ex)
			}
		})()
	}, [workouts, groups, params.session_id, token])

	const deleteSesssion = async () => {
		try {
			const requestOptions = {
				method: "DELETE",
				headers: { "Content-type": "application/json", "token": token },
			}
			const response = await fetch("/api/session/delete?id=" + params.session_id, requestOptions)
			if (!response.ok) {
				throw new Error("Could not delete session")
			}
			navigate("/plan")
		} catch (ex) {
			setErrorToast("Kunde inte radera tillfälle")
			console.error(ex)
		}
	}

	const updateSession = async () => {
		setIsBlocking(false)
		try {
			const requestOptions = {
				method: "PUT",
				headers: {"Content-type": "application/json", token: token},
				body: JSON.stringify({
					text: "",
					time,
					workout : workout ? workout.id : null,
					plan: group.id,
					date: date
				})
			}

			const response = await fetch(`/api/session/update?id=${params.session_id}`, requestOptions)
			if (!response.ok) {
				console.error(response)
				throw new Error("Could not update session")
			}
			navigate("/plan")
		} catch (ex) {
			setErrorToast("Kunde inte spara det nya tillfället")
			console.error(ex)
		}
	}

	if (error) {
		return <ErrorState message={error} onBack={() => navigate("/plan")} />
	}
	//Only loads a Spinner untill all data is fetched

	return (
		<>
			<ConfirmPopup onClick={deleteSesssion} showPopup={showPopup} setShowPopup={setShowPopup} popupText={"Är du säker?"}></ConfirmPopup>
			<div className={styles.headerContainer}>
				<Trash className={styles.trashcanIcon} style={{opacity:"0%"} /*Exists for proper spacing*/}></Trash> 
				<title>Redigera tillfälle</title>
				<h1 >Redigera Tillfälle</h1>
				<Trash className={styles.trashcanIcon} onClick={() => setShowPopup(true)}></Trash>
			</div>
			
			{(isLoadingGroups||isLoadingWorkouts||isLoadingSession) ? <Spinner/>:
				<>
					<Divider option={"h2_left"} title={"Grupp"} />
					<Dropdown id={"session-dropdown"} text={group?.name || "Grupp"} centered={true}>
						{groups?.map((plan, index) => (
							<div className={styles.dropdownRow} key={index} onClick={() => setGroup(plan)}>
								<p className={styles.dropdownRowText}>{plan.name}</p>
							</div>
						))}
					</Dropdown>
					
					<Divider option={"h2_left"} title={"Datum och Tid"} />
					<div className={styles.wrapCentering} >
						<DatePicker selectedDate={date} onChange={e => setDate(e.target.value)} id={"session-datepicker"} />
						<TimePicker selectedTime={time} onChange={e => setTime(e.target.value)} id={"session-timepicker"} />
					</div>

					<Divider option={"h2_left"} title={"Pass"} />
					<Dropdown id={"session-dropdown"} text={workout?.name || "Sök befintligt pass"} centered={true}>
						<div className={styles.dropdownRow} onClick={() => setWorkout(null)}>
							<p className={styles.dropdownRowText}>Inget pass</p>
						</div>
						{workouts?.map((workout, index) => (
							<div className={styles.dropdownRow} key={index} onClick={() => setWorkout(workout)}>
								<p className={styles.dropdownRowText}>{workout.name}</p>
							</div>
						))}
					</Dropdown>

					<Divider option={"h2_middle"} title={"eller"} />
					<div className={`${styles.wrapCentering} ${styles.createButton}`} >
						<Link to="/workout/create" style={{width: "150px"}} state={{
							session: {
								group,
								date,
								time,
								workout,
								sessionId
							},
							fromSession: true	
						}}>
							<Button id={"session-create"}><p>Skapa pass</p></Button>
						</Link>
					</div>

					<div className={styles.wrapCentering} style={{marginBottom: "2rem"}} >
						<Button onClick={() => navigate("/plan")} id={"session-back"} outlined={true}><p>Tillbaka</p></Button> 
						<Button onClick={updateSession} id={"session-save"}><p>Spara</p></Button>
					</div>
				</>
			}
			<ConfirmPopup
				showPopup={goBackPopup}
				setShowPopup={setGoBackPopup}
				popupText={"Är du säker på att du vill lämna sidan? Dina ändringar kommer inte att sparas."}
				confirmText="Lämna"
				backText="Avbryt"
				onClick={async () => {
					blocker.proceed()
				}}
			/>
		</>
	)
}
