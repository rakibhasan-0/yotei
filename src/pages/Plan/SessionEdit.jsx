import TimePicker from "../../components/Common/TimePicker/TimePicker"
import DatePicker from "../../components/Common/DatePicker/DatePicker"
import Button from "../../components/Common/Button/Button"
import Dropdown from "../../components/Common/List/Dropdown"
import ConfirmPopup from "../../components/Common/ConfirmPopup/ConfirmPopup"
import styles from "./SessionEdit.module.css"
import { useNavigate, useParams } from "react-router-dom"
import { useContext, useEffect, useState } from "react"
import { AccountContext } from "../../context"
import { Link } from "react-router-dom"
import Divider from "../../components/Common/Divider/Divider"
import { Trash } from "react-bootstrap-icons"
import {toast} from "react-toastify"
import ErrorState from "../../components/Common/ErrorState/ErrorState"

/**
 * A component for editing a session.
 * 
 * @author Chimera (c19vbn, tfy17efe)
 * @since 2023-05-03
 */
export default function SessionEdit() {
	const navigate = useNavigate()
	const {token} = useContext(AccountContext)
	// eslint-disable-next-line no-unused-vars
	const [date, setDate] = useState("")
	const [time, setTime] = useState("")
	const [groups, setGroups] = useState()
	const [group, setGroup] = useState()
	const [workouts, setWorkouts] = useState()
	const [workout, setWorkout] = useState()
	const [showPopup, setShowPopup] = useState(false)
	const [error, setError] = useState()

	const params = useParams()

	// get groups
	useEffect(() => {
		(async () => {
			try {
				const response = await fetch("/api/plan/all", { headers: { token } })
				if (response.status === 404) {
					return
				}
				if (!response.ok) {
					throw new Error("Could not fetch groups")
				}
				setGroups(await response.json())
			} catch (ex) {
				toast.error("Kunde inte hämta alla grupper")
				console.error(ex)
			}
		})()
	}, [token])

	useEffect(() => {
		(async () => {
			try {
				const response = await fetch("/api/workouts/all", { headers: { token } })
				if (response.status === 204) {
					return
				}
				if (!response.ok) {
					throw new Error("Could not fetch workouts")
				}
				setWorkouts(await response.json())
			} catch (ex) {
				toast.error("Kunde inte hämta alla pass")
				console.error(ex)
			}
		})()
	}, [groups, token])

	useEffect(() => {
		(async () => {
			try {
				const response = await fetch("/api/session/get?id=" + params.session_id, { headers: { token } })
				if (response.status === 204) {
					return
				}
				if (!response.ok) {
					throw new Error("Could not fetch session")
				}
				let session = await response.json()
				if (groups && workouts) {
					setGroup(groups.find(group => group.id === session.plan))
					setWorkout(workouts.find(workout => workout.id === session.workout))
					setDate(session.date)
					setTime(session.time)
				}
		
			} catch (ex) {
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
			navigate(-1)
		} catch (ex) {
			toast.error("Kunde inte radera tillfälle")
			console.error(ex)
		}
	}

	const updateSession = async () => {
		try {
			const requestOptions = {
				method: "PUT",
				headers: {"Content-type": "application/json", token: token},
				body: JSON.stringify({
					text: "",
					time,
					workout : workout !== null ? workout.id : null,
					plan: group.id,
					date: date
				})
			}

			const response = await fetch(`/api/session/update?id=${params.session_id}`, requestOptions)
			if (!response.ok) {
				console.log(response)
				throw new Error("Could not update session")
			}
			navigate(-1)
		} catch (ex) {
			toast.error("Kunde inte spara det nya tillfället")
			console.error(ex)
		}
	}

	if (error) {
		return <ErrorState message={error} onBack={() => navigate("/plan")} />
	}

	return (
		<>
			<ConfirmPopup onClick={deleteSesssion} showPopup={showPopup} setShowPopup={setShowPopup} popupText={"Är du säker?"}></ConfirmPopup>
			<div className={styles.headerContainer}>
				<Trash className={styles.trashcanIcon} style={{opacity:"0%"} /*Exists for proper spacing*/}></Trash> 
				<h1 >Redigera Tillfälle</h1>
				<Trash className={styles.trashcanIcon} onClick={() => setShowPopup(true)}></Trash>
			</div>
			
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
				<Link to="/workout/create" style={{width: "150px"}}>
					<Button id={"session-create"}><p>Skapa pass</p></Button>
				</Link>
			</div>

			<div className={styles.wrapCentering} >
				<Button onClick={() => navigate(-1)} id={"session-back"} outlined={true}><p>Tillbaka</p></Button> 
				<Button onClick={updateSession} id={"session-save"}><p>Spara</p></Button>
			</div>
		</>
	)
}
