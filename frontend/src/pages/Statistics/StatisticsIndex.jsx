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
 * The StatisticsIndex component is responsible for the visualization
 * of a group's statistics. The user is able to filter the list of techniques
 * to include exercises and sort by belt, between dates and kihon techniques.
 * 
 * Example usage:
 *  <Statistics />
 * 
 * @returns A page with a group's statistics.
 * @author Team Coconut 
 * @since 2024-05-08
 * @version 1.0
 */
export default function Statistics() {

	const navigate = useNavigate()
	const { groupID } = useParams()
	const [group, setGroup] = useState(null)
	const [groupBelts, setGroupBelts] = useState([])
	const [groupLoading, setGroupLoading] = useState(true)
	const [listLoading, setListLoading] = useState(true)
	const { token } = useContext(AccountContext)
	const [groupActivities, setGroupActivities] = useState([])
	const [selectedBelts, setSelectedBelts] = useState(localStorage.getItem("statistics-filter-belts") ? JSON.parse(localStorage.getItem("statistics-filter-belts")) : [])
	const [numberofSessions, setNumberOfSessions] = useState()
	const [averageRating, setAverageRating] = useState()
	const [filter, setFilter] = useState(localStorage.getItem("statistics-filter") ? JSON.parse(localStorage.getItem("statistics-filter")) : {
		showExercises: false,
		showKihon: false,
	})
	const [rotate, setDescendingOrder] = useState(localStorage.getItem("statistics-filter-order") ? JSON.parse(localStorage.getItem("statistics-filter-order")) : false)

	// Creates two date objects, one two years before now and one with today's date.
	const twoYearsBeforeFromNow = new Date()
	twoYearsBeforeFromNow.setFullYear(twoYearsBeforeFromNow.getFullYear() - 2)
	const today = new Date()

	// State for storing the dates.
	const [dates, setDates] = useState(localStorage.getItem("statistics-filter-dates") ? JSON.parse(localStorage.getItem("statistics-filter-dates")) : {
		from: getFormattedDateString(twoYearsBeforeFromNow),
		to: getFormattedDateString(today),
	})



	/**
	*	Filters an activity based on belt colors and selected belt criteria.
 	*	This function checks if any of the activity's belt colors match the selected belts.
	*	A belt matches if it satisfies the 'child' condition (if applicable) and the belt name.
	*/	
	const filterActivityByBelt = (activity, selectedBelts) => {
		return activity.beltColors?.some(belt => {
			return selectedBelts.some(selectedBelt => {
				if (selectedBelt.child) {
					return belt.is_child === true && selectedBelt.name === belt.belt_name
				} else {
					return belt.is_child === false && selectedBelt.name === belt.belt_name
				}
			})
		})
	}

	/* 
		Filters the group's activities based on the selected belts.
		First it checks if selectedBelts is not empty, then it filters the groupActivities based on the selected belts.
		If the selectedBelts is empty, it instead shows all groupActivities. 
	*/
	const activities = selectedBelts.length > 0 ? 
		groupActivities.filter(activity => filterActivityByBelt(activity, selectedBelts))
		: groupActivities

	// Stores the selected belts data. 	
	function handleBeltToggle(isSelected, belt) {
		setSelectedBelts(prevSelected => {
			if (isSelected) {
				return [...prevSelected, belt]
			} else {
				return prevSelected.filter(b => b.id !== belt.id)
			}
		})
	}

	// Clears selected belts when user clears belts in the belts filter.
	function onBeltsClear() {
		setSelectedBelts([])
	}

	// Check if the format of the date is correct or not.
	function checkIfDateIsValid(date) {
		return /^[12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(date) && !isNaN(new Date(date).getTime())
	}

	// Fetches the group's data.
	useEffect(() => {
		async function fetchGroup() {
			try {
				setGroupLoading(true)
				const responseFromGroupNameAPI= await fetch("/api/plan/all", { headers: { token } })

				if (!responseFromGroupNameAPI.ok) {
					throw new Error("Failed to fetch group data")
				}
				
				if (responseFromGroupNameAPI.status === 200) {
					const groups = await responseFromGroupNameAPI.json()	
					const group = groups.find((group) => group.id === parseInt(groupID))
					setGroup(group)
					setGroupBelts(group.belts)
				}

			}
			catch (error) {
				console.error("Fetching error:", error)
			}
			finally {
				setGroupLoading(false)
			}
		}
		fetchGroup()
	}, [])

	useEffect(() => {
		// Fetches the group's activities and the group's name.
		async function fetchGroupActivitiesData() {	
			
			if(!checkIfDateIsValid(dates.from) || !checkIfDateIsValid(dates.to)) {
				return
			}
			
			// Creates a query string for the API by using URLSearchParams.
			const param = new URLSearchParams({
				kihon: filter.showKihon ? "true" : "false",
				showexercises: filter.showExercises ? "true" : "false",
				startdate: dates.from ? dates.from : "",
				enddate: dates.to ? dates.to : ""
			})

			try {
				setListLoading(true)
				const responseFromGroupDetailsAPI = await fetch(`/api/statistics/${groupID}?${param}`, {headers: { token }})

				if (responseFromGroupDetailsAPI.status === 200) {
					const data = await responseFromGroupDetailsAPI.json()
					setNumberOfSessions(data.numberOfSessions)
					setAverageRating(data.averageRating)
					setGroupActivities(rotate ? data.activities.reverse() : data.activities)
				} else if (responseFromGroupDetailsAPI.status === 204) {
					// If the response is 204, it means that there is no data to show for the selected filters.
					setGroupActivities([])
				}

				if (!responseFromGroupDetailsAPI.ok) {
					throw new Error("Failed to fetch group data")
				}
				
			}
			catch (error) {
				console.error("Fetching error:", error)
			}
			finally {
				setListLoading(false)
			}
		}
	
		fetchGroupActivitiesData()
	}, [groupID, token, filter, dates])


	useEffect(() => {
		localStorage.setItem("statistics-filter", JSON.stringify(filter))
	}, [filter])

	useEffect(() => {
		localStorage.setItem("statistics-filter-dates", JSON.stringify(dates))
	}, [dates])

	useEffect(() => {
		localStorage.setItem("statistics-filter-order", rotate)
	}, [rotate])

	useEffect(() => {
		localStorage.setItem("statistics-filter-belts", JSON.stringify(selectedBelts))
	}, [selectedBelts])

	// Handles the date changes and storing the dates state.
	function handleDateChanges(variableName, value) {
		const selectedDate = new Date(value)
		const toDate = new Date(dates.to)

		if (variableName == "from") {
			setDates( selectedDate > toDate ? { from: value, to: value } : { ...dates, from: value })
		} else {
			setDates({ ...dates, [variableName]: value })
		}
	}

	// When the 'show exercises' and 'show kihon' checkboxes are checked, the filter state is updated.
	function handleChanges(variableName, value) {
		setFilter({ ...filter, [variableName]: value })
	}

	// Changes the order of the group's activities. Default is ascending.
	function changeOrder() {
		setDescendingOrder(!rotate)
		setGroupActivities(groupActivities.reverse())
	}

	return (
		<div>
			<title>Statistik</title>
			{groupLoading ? (
				<Spinner />
			) : (
				<h1 id="statistics-header">
					{group ? `${group.name}` : "Gruppen hittades inte"}
				</h1>
			)}

			<div className={style.FilterAndSortContainer}>
				<FilterStatistics
					id="statistics-filter-container"
					exercises={filter.showExercises}
					kihon={filter.showKihon}
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
			{listLoading ? (
				<Spinner />
			) : (
				<div className="activitiesContainer" id="technique-exercise-list">
					{activities.length === 0 ? (
						<h5 style={{ fontSize: "25px" }}>Inga aktiviteter matchar det valda filtret</h5>
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

			)}
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
