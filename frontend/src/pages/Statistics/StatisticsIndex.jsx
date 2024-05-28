import React, { useState, useEffect, useContext} from "react"
import { useParams, useNavigate } from "react-router-dom"
import { AccountContext } from "../../context"
import Spinner from "../../components/Common/Spinner/Spinner"
import style from "./Statistics.module.css"
import Button from "../../components/Common/Button/Button"
import TechniqueCard from "../../components/Common/Technique/TechniqueCard/TechniqueCard"
import StatisticsPopUp from "./StatisticsPopUp"
import FilterStatistics from "./FilterStatistics"
import {getFormattedDateString} from "../../components/Common/DatePicker/DatePicker"
import GradingStatisticsPopup from "./GradingStatisticsPopup"
import SortingArrowButton from "../../components/Common/SortingArrowButton/SortingArrowButton"

/**
 * 
 * Component is responsible for the visualization of the statistics for a group.
 * It shows the techniques and statistics for the selected group. The user will be able to filter
 * the list of techniques and exercise based on the selected belts, dates, kihon. 
 * 
 * Example usage:
 *  <Statistics />
 * 
 * @returns A page with statistics for a group.
 * @author Team Coconut 
 * @since 2024-05-08
 * @version 1.0
 */
export default function Statistics() {

	const navigate = useNavigate()
	const { groupID } = useParams()
	const [group, setGroup] = useState(null)
	const [groupBelts, setGroupBelts] = useState([])
	const [loading, setLoading] = useState(true)
	const { token } = useContext(AccountContext)
	const [groupActivities, setGroupActivities] = useState([])
	const [selectedBelts, setSelectedBelts] = useState([])
	const [numberofSessions, setNumberOfSessions] = useState()
	const [averageRating, setAverageRating] = useState()
	const [filter, setFilter] = useState({
		showExercises: false,
		showKihon: false,
	})
	const [order, setDescendingOrder] = useState(false)
	const [rotate, setRotate] = useState(false)

	// creates two date objects, one two years before now and one with today's date
	const twoYearsBeforeFromNow = new Date()
	twoYearsBeforeFromNow.setFullYear(twoYearsBeforeFromNow.getFullYear() - 2)
	const today = new Date()

	// state for storing the dates
	const [dates, setDates] = useState({
		from: getFormattedDateString(twoYearsBeforeFromNow),
		to: getFormattedDateString(today),
	})

	// filters the groups activities based on the selected belts.
	// first it checks if the selectedBelts is not empty, then it filters the groupActivities based on the selected belts.
	// if the selectedBelts is empty, it will show all groupActivities. 
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

	// function stores the selected belts data. 	
	function handleBeltToggle(isSelected, belt) {
		setSelectedBelts(prevSelected => {
			if (isSelected) {
				return [...prevSelected, belt]
			} else {
				return prevSelected.filter(b => b.id !== belt.id)
			}
		})
	}

	// function clears selected belts when user clears belts in belts filter.
	function onBeltsClear() {
		setSelectedBelts([])
	}

	// regex function to check if the format of the date is correct or not.
	function checkIfDateIsValid(date) {
		return /^[12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(date) && !isNaN(new Date(date).getTime())
	}

	useEffect(() => {

		// function fetches groups activities and groups name.
		async function fetchGroupActivitiesData() {	
			
			if(!checkIfDateIsValid(dates.from) || !checkIfDateIsValid(dates.to)) {
				return
			}
			
			// by utilizing the URLSearchParams, we can easily create a query string for the API.
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
					setNumberOfSessions(data.numberOfSessions)
					setAverageRating(data.averageRating)
					setGroupActivities(data.activities)
					resetOrderIcon()
				} else if (responseFromGroupDetailsAPI.status === 204) {
					// if response is 204, there is no data to show for the selected filters.
					setGroupActivities([])
				}

				if (!responseFromGroupDetailsAPI.ok || !responseFromGroupNameAPI.ok) {
					throw new Error("Failed to fetch group data")
				}
				
				if(responseFromGroupNameAPI.status === 200) {
					const groups = await responseFromGroupNameAPI.json()	
					const group = groups.find((group) => group.id === parseInt(groupID))
					setGroup(group)
					setGroupBelts(group.belts)
				}

			} catch (error) {
				console.error("Fetching error:", error)
			} finally {
				setLoading(false)
			}
		}
	
		fetchGroupActivitiesData()
	}, [groupID, token, filter, dates])


	// function is responsible for handling date changes and storing dates state.
	function handleDateChanges(variableName, value) {
		const selectedDate = new Date(value)
		const toDate = new Date(dates.to)

		if (variableName == "from") {
			setDates( selectedDate > toDate ? { from: value, to: value } : { ...dates, from: value })
		} else {
			setDates({ ...dates, [variableName]: value })
		}
	}

	// when user checks checkbox for showing exercises and kihon, this function will be called 
	// and it will update the filter state.
	function handleChanges(variableName, value) {
		setFilter({ ...filter, [variableName]: value })
	}

	// Resets the order icon to ascending order. Called in the useEffect when the group activities are fetched.
	function resetOrderIcon() {
		setRotate(false)
	}

	// function is responsible for changing the order of the group activities.
	// initially, order is ascending, when user clicks the button, order changes to descending.
	function changeOrder() {
		setDescendingOrder(!order)
		setGroupActivities(groupActivities.reverse())
		setRotate(!rotate)
	}

	return (
		<div>
			<title>Statistik</title>
			{loading ? (
				<Spinner />
			) : (
				<h1 id="statistics-header">
					{group ? `${group.name}` : "Gruppen hittades inte"}
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

				<SortingArrowButton id="sorting-button" changeOrder={changeOrder} rotate={rotate} />

				<div className={style.activitiesTextContainer}>
					<h5>Aktiviteter</h5>
				</div>
	
				<GradingStatisticsPopup 
					id="grading-statistics-container" 
					groupID={groupID} 
					belts={groupBelts}
					datesTo={dates.to}
					datesFrom={dates.from}

				/>

				<StatisticsPopUp
					groupActivities={activities}
					dates={dates}
					averageRating={averageRating}
					numberOfSessions={numberofSessions}
				/>
			</div>

			<div className="activitiesContainer" id="technique-exercise-list">
				{activities.length === 0 ? (
					<h5 style={{ fontSize: "25px" }}>Inga aktiviteter hittades</h5>
				) : (
					activities.map((activity, index) => (
						<TechniqueCard
							key={index}
							technique={activity}
							checkBox={false}
							id={activity.activity_id}
							popUp={true}
						/>
					))
				)}
			</div>

			<div style={{ height: "70px" }}></div>
			<div className={style.buttonContainer}>

				<Button
					width="25%"
					outlined={true}
					onClick={() => navigate(-1)}
					id="statistics-back-button"
				>
					<p>Tillbaka</p>
				</Button>

			</div>
		</div>
	)
}	
