import TimePicker from "../../components/Common/TimePicker/TimePicker"
// import DatePicker from "../../components/Common/DatePicker/DatePicker"
import Button from "../../components/Common/Button/Button"
import Dropdown from "../../components/Common/List/Component"
import ConfirmPopup from "../../components/Common/ConfirmPopup/ConfirmPopup"
import "./SessionEdit.css"
import { useNavigate, useParams } from "react-router-dom"
import { useContext, useEffect, useState } from "react"
import { AccountContext } from "../../context"
import { Link } from "react-router-dom"
import Divider from "../../components/Common/Divider/Divider"
import { Trash } from "react-bootstrap-icons"

/**
 * A component for editing a session.
 * 
 * @author Chimera (c19vbn, tfy17efe)
 * @since 2023-05-03
 */
export default function SessionEdit() {
	const navigate = useNavigate()
	const {token} = useContext(AccountContext)
	const [date, setDate] = useState("")
	const [time, setTime] = useState("")
	const [groups, setGroups] = useState()
	const [group, setGroup] = useState()
	const [workouts, setWorkouts] = useState()
	const [workout, setWorkout] = useState()
	const [showPopup, setShowPopup] = useState(false)

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
				alert("Kunde inte hämta alla grupper")
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
				alert("Kunde inte hämta alla pass")
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
				alert("Kunde inte hämta tillfälle")
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
			alert("Kunde inte radera tillfälle")
			console.error(ex)
		}
	}

	const updateSession = async () => {
		console.log(date)
		try {
			const requestOptions = {
				method: "PUT",
				headers: {"Content-type": "application/json", token: token},
				body: JSON.stringify({
					text: "",
					time,
					workout : workout !== null ? workout.id : null,
					plan: group.id,
					// date: date + `T${time}:00.000Z`
				})
			}
			console.log(requestOptions.body)

			const response = await fetch(`/api/session/update?id=${params.session_id}`, requestOptions)
			if (!response.ok) {
				console.log(response)
				throw new Error("Could not update session")
			}
			navigate(-1)
		} catch (ex) {
			alert("Kunde inte spara det nya tillfället")
			console.error(ex)
		}
	}

	return (
		<div className="container">
			<div className="row justify-content-center">
				<div className="col-md-8">

					<ConfirmPopup onClick={deleteSesssion} showPopup={showPopup} setShowPopup={setShowPopup}></ConfirmPopup>
					<div className="header-container">
						<Trash className="trashcan-icon" style={{opacity:"0%"} /*Exists for proper spacing*/}></Trash> 
						<h1 >Redigera Tillfälle</h1>
						<Trash className="trashcan-icon" onClick={() => setShowPopup(true)}></Trash>
					</div>
					
					<Divider option={"h2_left"} title={"Grupp"} />
					<Dropdown id={"session-dropdown"} text={group?.name || "Grupp"} centered={true}>
						{groups?.map((plan, index) => (
							<div className="dropdown-row" key={index} onClick={() => setGroup(plan)}>
								<p className="dropdown-row-text">{plan.name}</p>
							</div>
						))}
					</Dropdown>
					
					<Divider option={"h2_left"} title={"Datum och Tid"} />
					<div className="wrap-centering" >
						<TimePicker selectedTime={time} onChange={e => setTime(e.target.value)} id={"session-timepicker"} />
						{/* <DatePicker selectedDate={date} onChange={e => setDate(e.target.value)} id={"session-datepicker"} /> */}
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

					<Divider option={"h2_middle"} title={"Eller"} />
					<div className="wrap-centering create-button" >
						<Link to="/workout/create" style={{width: "150px"}}>
							<Button id={"session-create"}><p>Skapa pass</p></Button>
						</Link>
					</div>

					<div className="wrap-centering" >
						<Button onClick={() => navigate(-1)} id={"session-back"} outlined={true}><p>Tillbaka</p></Button> 
						<Button onClick={updateSession} id={"session-save"}><p>Spara</p></Button>
					</div>
				</div>
			</div>
		</div>
	)
}
