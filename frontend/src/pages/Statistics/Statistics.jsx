import React, { useState, useEffect, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { AccountContext } from "../../context"
import Spinner from "../../components/Common/Spinner/Spinner"
import style from "./Statistics.module.css"
import Button from "../../components/Common/Button/Button"
import TechniqueCard from "../../components/Common/Technique/TechniqueCard/TechniqueCard"
import StatisticsPopUp from "./StatisticsPopUp"
import FilterStatistics from "./FilterStatistics"
import {getFormattedDateString} from "../../components/Common/DatePicker/DatePicker"

/**
 * 
 *  The work is on progress for the statistics page.
 * 
 */

export default function Statistics() {

	const navigate = useNavigate()
	const { groupID } = useParams()
	const [groupName, setGroupName] = useState(null)
	const [loading, setLoading] = useState(true)
	const { token } = useContext(AccountContext)
	const [groupActivities, setGroupActivities] = useState([])
	const [selectedBelts, setSelectedBelts] = useState([])
	const [filter, setFilter] = useState({
		showExercises: false,
		showKihon: false,
	})


	// creating a date object for two years before from now and today's date
	const twoYearsBeforeFromNow = new Date()
	twoYearsBeforeFromNow.setFullYear(twoYearsBeforeFromNow.getFullYear() - 2)
	const today = new Date()

	// state for storing the dates
	const [dates, setDates] = useState({
		from: getFormattedDateString(twoYearsBeforeFromNow),
		to: getFormattedDateString(today),
	})

	// filtering the group activities based on the selected belts. 
	const activities =	
	selectedBelts.length > 0	
		? groupActivities.filter((activity) =>
			activity.beltColors?.some((belt) =>	
				selectedBelts.some((selectedBelt) =>	
					selectedBelt.child	
						? belt.is_child == true && selectedBelt.name === belt.belt_name
						:	selectedBelt.name === belt.belt_name && belt.is_child == false
				)
			)
		)
		: groupActivities



	function handleBeltToggle(isSelected, belt) {
		setSelectedBelts(prevSelected => {
			if (isSelected) {
				return [...prevSelected, belt]
			} else {
				return prevSelected.filter(b => b.id !== belt.id)
			}
		})
	}


	function onBeltsClear() {
		setSelectedBelts([])
	}
	

	function checkIfDateIsValid(date) {
		return /^[12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(date) && !isNaN(new Date(date).getTime())
	}

	useEffect(() => {

		async function fetchGroupActivitiesData() {	
			if(!checkIfDateIsValid(dates.from) || !checkIfDateIsValid(dates.to)) {
				return
			}
			
			const param = new URLSearchParams({
				kihon: filter.showKihon ? "true" : "false",
				showexercises: filter.showExercises ? "true" : "false",
				startdate: dates.from ? dates.from : "",
				enddate: dates.to ? dates.to : ""
			})

			
		
			try {
				setLoading(true)
				const responseFromGroupNameAPI= await fetch("/api/plan/all", { headers: { token } })
				const responseFromGroupDetailsAPI = await fetch(`/api/statistics/${groupID}?${param}`, {headers: { token }})

				if(responseFromGroupDetailsAPI.status === 200) {
					const data = await responseFromGroupDetailsAPI.json()
					setGroupActivities(data.activities)
				}

				if (!responseFromGroupDetailsAPI.ok || !responseFromGroupNameAPI.ok) {
					throw new Error("Failed to fetch group data")
				}
				
				const groups = await responseFromGroupNameAPI.json()	
				const name = groups.find((group) => group.id === parseInt(groupID))
				setGroupName(name)
				
			}
			catch (error) {
				console.error("Fetching error:", error) // proper error handling will be added later
			}
			finally {
				setLoading(false)
			}
		}
	
		fetchGroupActivitiesData()

	}, [groupID, token, filter, dates])


	function handleDateChanges(variableName, value) {

		const newDate = new Date(value)	
		const endDate = new Date(dates.to)
		
		if(variableName === "from"){
			setDates(newDate > endDate ? {from: dates.from, to: dates.to} : {...dates, from: value})
		}

		else if(variableName === "to") {
			setDates({ ...dates, [variableName]: value })			
		}

	}


	function handleChanges(variableName, value) {
		setFilter({ ...filter, [variableName]: value })
	}

	return (
		<div>
			<title>Statistik</title>
			{loading ? (
				<Spinner />
			) : (
				<h1 style={{ fontSize: "35px" }} id = "statistics-header" >
					{groupName ? `${groupName.name}` : "Gruppen hittades inte"}
				</h1>
			)}

			<div className={style.FilterAndSortContainer}>
				<FilterStatistics
					id="statistics-filter-container"
					onToggleExercise={(value) => handleChanges("showExercises", value)}
					onToggleKihon={(value) => handleChanges("showKihon", value)}
					onDateChanges={handleDateChanges}
					onToggleBelts={handleBeltToggle}
					onClearBelts={onBeltsClear}
					belts={selectedBelts}
					dates={dates}
				/>

				<StatisticsPopUp groupActivities ={groupActivities} filteredActivities = {activities} dates ={dates} />
			</div>

			<div className="activitiesContainer" id="technique-exercise-list">
				{	activities.length === 0 ? <h5 style={{ fontSize: "25px" }}>Inga aktiviteter hittades</h5> :
					activities.map((activity, index) => (
						<TechniqueCard key={index} technique={activity} checkBox={false} id={activity.activity_id} />
					))
				}
			</div>

			<div className={style.buttonContainer}>
				<Button width="25%" outlined={true} onClick={() => navigate(-1) } id ="statistics-back-button">
					<p>Tillbaka</p>
				</Button>
			</div>
		</div>
	)
}	
