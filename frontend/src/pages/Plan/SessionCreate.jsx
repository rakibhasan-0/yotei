import TimePicker from "../../components/Common/TimePicker/TimePicker"
import DatePicker from "../../components/Common/DatePicker/DatePicker"
import Button from "../../components/Common/Button/Button"
import Dropdown from "../../components/Common/List/Dropdown"
import styles from "./SessionCreate.module.css"
import { useNavigate } from "react-router-dom"
import { useContext, useEffect, useState } from "react"
import { AccountContext } from "../../context"
import { useLocation } from "react-router-dom"
import Divider from "../../components/Common/Divider/Divider"
import {setError as setErrorToast, setSuccess as setSuccessToast, canEditSessionsAndGroups} from "../../utils"
/**
 * A component for creating a session.
 * 
 * @author Chimera (dv21aag, c20lln), Team Durian (Group 3) (2024-04-23), Team Kiwi (2024-05-07), Team Mango (2024-05-28)
 * @since 2023-05-03
 * updated Team Mango (2024-05-28): changed so a user with permission to create session for own groups only can select own groups. 
 */
export default function SessionCreate({setIsBlocking}) {
	const { state } = useLocation()
	const navigate = useNavigate()
	const { token } = useContext(AccountContext)
	const [date, setDate] = useState(state?.session?.date)
	const [time, setTime] = useState(state?.session?.time)
	const [groups, setGroups] = useState()
	const [group, setGroup] = useState(state?.session?.group)
	const [workouts, setWorkouts] = useState()
	const [workout, setWorkout] = useState(state?.session?.workout)
	const [groupError, setGroupError] = useState()
	const [timeError, setTimeError] = useState()
	const context = useContext(AccountContext)

	
	useEffect(() => {
		// Check if any of the fields are filled
		setIsBlocking(date?.length > 0 || time?.length > 0 || group || workout)
	}, [date, time, group, workout])

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

				const json = await response.json()
				setGroups(json.filter(group => canEditSessionsAndGroups(context, group.userId)))

			} catch (ex) {
				setErrorToast("Kunde inte hämta alla grupper")
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
				setErrorToast("Kunde inte hämta alla pass")
				console.error(ex)
			}
		})()
	}, [token])

	const addSession = async () => {
		if (!group) {
			return setGroupError("Vänligen välj en grupp")
		}

		if (!time || !date) {
			return setTimeError("Vänligen välj tid och datum")
		}

		try {
			const response = await fetch("/api/session/add", {
				method: "POST",
				headers: { "Content-type": "application/json", token },
				body: JSON.stringify({
					date: date + `T${time}:00.000Z`,
					plan: group.id,
					workout: workout?.id,
					time
				})
			})
			if (response.ok) {
				setSuccessToast("Tillfället lades till.")
				navigate("/plan")
			}
			
		} catch (ex) {
			setErrorToast("Kunde inte spara tillfälle")
			console.error(ex)
		}
	}

	return (
		<>
			<title>Skapa tillfälle</title>
			<h1 style={{ marginTop: "2rem" }}>Tillfälle</h1>
			<Divider option={"h2_left"} title={"Grupp"} />
			<Dropdown errorMessage={groupError} id={"session-dropdown"} text={group?.name || "Grupp"} centered={true}>
				{groups?.length > 0 ? groups.map((plan, index) => (
					<div className={styles.dropdownRow} key={index} onClick={() => setGroup(plan)}>
						<p className={styles.dropdownRowText}>{plan.name}</p>
					</div>
				)) : <div className={styles.dropdownRow}>
					<p className={styles.dropdownRowText}>Kunde inte hitta några grupper</p>
				</div>}
			</Dropdown>

			<Divider option={"h2_left"} title={"Datum och Tid"} />
			{timeError && <p className="error-message">{timeError}</p>}
			<div className={styles.wrapCentering}>
				<DatePicker onChange={e => setDate(e.target.value)} id={"session-datepicker"} selectedDate={date} />
				<TimePicker onChange={e => setTime(e.target.value)} id={"session-timepicker"} selectedTime={time} />
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
				<Button onClick={async() => {
					await setIsBlocking(false)
					createWorkout()
				}} id={"session-create"}><p>Skapa pass</p></Button>

			</div>

			<div className={styles.wrapCentering} style={{ marginBottom: "2rem" }} >
				<Button onClick={() => navigate("/plan")} id={"session-back"} outlined={true}><p>Tillbaka</p></Button>
				<Button onClick={() => { setIsBlocking(false); addSession() }} id={"session-save"}><p>Spara</p></Button>
			</div>
		</>
	)

	async function createWorkout() {
		navigate("/workout/create", {
			state: {
				session: {
					group,
					date,
					time,
					workout
				},
				fromSession: true,
				fromCreate: true
			}
		})
	}
}