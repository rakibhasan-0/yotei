import TimePicker from "../../components/Common/TimePicker/TimePicker"
import DatePicker from "../../components/Common/DatePicker/DatePicker"
import Button from "../../components/Common/Button/Button"
import Dropdown from "../../components/Common/List/Component"
import "./SessionCreate.css"
import { useNavigate } from "react-router-dom"
import { useContext, useEffect, useState } from "react"
import { AccountContext } from "../../context"
import { Link } from "react-router-dom"
import Divider from "../../components/Common/Divider/Divider"
import {toast, ToastContainer} from "react-toastify"

/**
 * A component for creating a session.
 * 
 * @author Chimera (dv21aag, c20lln)
 * @since 2023-05-03
 */
export default function SessionCreate() {
	const navigate = useNavigate()
	const {token} = useContext(AccountContext)
	const [date, setDate] = useState()
	const [time, setTime] = useState()
	const [groups, setGroups] = useState()
	const [group, setGroup] = useState()
	const [workouts, setWorkouts] = useState()
	const [workout, setWorkout] = useState()
	const [groupError, setGroupError] = useState()
	const [timeError, setTimeError] = useState()
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
			if (!response.ok) {
				throw new Error("Could not save session")
			}
			navigate(-1)
		} catch (ex) {
			toast.error("Kunde inte spara tillfälle")
			console.error(ex)
		}
	}

	return (
		<div className="container">
			<div className="row justify-content-center">
				<div className="col-md-8">

					<h1 style={{marginTop: "2rem"}}>Tillfälle</h1>
					<Divider option={"h2_left"} title={"Grupp"} />
					<Dropdown errorMessage={groupError} id={"session-dropdown"} text={group?.name || "Grupp"} centered={true}>
						{groups?.length > 0 ? groups.map((plan, index) => (
							<div className="dropdown-row" key={index} onClick={() => setGroup(plan)}>
								<p className="dropdown-row-text">{plan.name}</p>
							</div>
						)) : <div className="dropdown-row">
							<p className="dropdown-row-text">Kunde inte hitta några grupper</p>
						</div>}
					</Dropdown>
					
					<Divider option={"h2_left"} title={"Datum och Tid"} />
					{timeError && <p className="error-message">{timeError}</p>}
					<div className="wrap-centering" >
						<DatePicker onChange={e => setDate(e.target.value)} id={"session-datepicker"} />
						<TimePicker onChange={e => setTime(e.target.value)} id={"session-timepicker"} />
					</div>

					<Divider option={"h2_left"} title={"Pass"} />
					<Dropdown id={"session-dropdown"} text={workout?.name || "Sök befintligt pass"} centered={true}>
						<div className="dropdown-row" onClick={() => setWorkout(null)}>
							<p className="dropdown-row-text">Inget pass</p>
						</div>
						{workouts?.map((workout, index) => (
							<div className="dropdown-row" key={index} onClick={() => setWorkout(workout)}>
								<p className="dropdown-row-text">{workout.name}</p>
							</div>
						))}
					</Dropdown>

					<Divider option={"h2_middle"} title={"eller"} />
					<div className="wrap-centering create-button" >
						<Link to="/workout/create" style={{width: "150px"}}>
							<Button id={"session-create"}><p>Skapa pass</p></Button>
						</Link>
					</div>

					<div className="wrap-centering" >
						<Button onClick={() => navigate(-1)} id={"session-back"} outlined={true}><p>Tillbaka</p></Button> 
						<Button onClick={addSession} id={"session-save"}><p>Spara</p></Button>
					</div>
				</div>
			</div>
			<ToastContainer autoClose={5000} />
		</div>
	)
}
