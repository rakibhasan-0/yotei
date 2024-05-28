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
 * That component is responsible for the visualization of the statistics for a group.
 * It shows the techniques and statistics for the selected group. The user will be able to filter
 * the list of techniques and exercise based on the selected belts, dates, kihon. 
 * 
 * 
 * example usage:
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


	// creating a date object for two years before from now and today's date
	const twoYearsBeforeFromNow = new Date()
	twoYearsBeforeFromNow.setFullYear(twoYearsBeforeFromNow.getFullYear() - 2)
	const today = new Date()

	// state for storing the dates
	const [dates, setDates] = useState(localStorage.getItem("statistics-filter-dates") ? JSON.parse(localStorage.getItem("statistics-filter-dates")) : {
		from: getFormattedDateString(twoYearsBeforeFromNow),
		to: getFormattedDateString(today),
	})

	// filtering the group activities based on the selected belts.
	// first it checks if the selectedBelts is not empty, then it filters the groupActivities based on the selected belts.
	// if the selectedBelts is empty, it will show all the groupActivities. 
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


	// that function store the selected belts data. 	
	function handleBeltToggle(isSelected, belt) {
		setSelectedBelts(prevSelected => {
			if (isSelected) {
				return [...prevSelected, belt]
			} else {
				return prevSelected.filter(b => b.id !== belt.id)
			}
		})
	}

	// it clears the selected belts when user decide to clear the belts in the belts filter.
	function onBeltsClear() {
		setSelectedBelts([])
	}
	

	// it is a regex function to check if the format of the date is correct or not.
	function checkIfDateIsValid(date) {
		return /^[12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(date) && !isNaN(new Date(date).getTime())
	}

	useEffect(() => {
		async function fetchGroup(){
			try {
				setGroupLoading(true)
				const responseFromGroupNameAPI= await fetch("/api/plan/all", { headers: { token } })

				if (!responseFromGroupNameAPI.ok) {
					throw new Error("Failed to fetch group data")
				}
				
				if(responseFromGroupNameAPI.status === 200) {
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
	},[])

	useEffect(() => {

		// that function is responsible for fetching the group activities and group name.
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
				setListLoading(true)
				const responseFromGroupDetailsAPI = await fetch(`/api/statistics/${groupID}?${param}`, {headers: { token }})

				if(responseFromGroupDetailsAPI.status === 200) {
					const data = await responseFromGroupDetailsAPI.json()
					setNumberOfSessions(data.numberOfSessions)
					setAverageRating(data.averageRating)
					setGroupActivities(rotate ? data.activities.reverse() : data.activities)
				}else if (responseFromGroupDetailsAPI.status === 204) {
					// if the response is 204, it means that there is no data to show for the selected filters.
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

	// that function is responsible for handling the date changes and storing the dates state.
	function handleDateChanges(variableName, value) {
		const selectedDate = new Date(value)
		const toDate = new Date(dates.to)

		if (variableName == "from") {
			setDates( selectedDate > toDate ? { from: value, to: value } : { ...dates, from: value })
		} else {
			setDates({ ...dates, [variableName]: value })
		}
	}

	// when the user selects the checkbox for the showing exercises and kihon, that function will be called 
	// and it will update the filter state.
	function handleChanges(variableName, value) {
		setFilter({ ...filter, [variableName]: value })
	}

	// Resets the order icon to ascending order. Called in the useEffect when the group activities are fetched.
	function resetOrderIcon() {
		setOrder(false)
	}

	// that function is responsible for changing the order of the group activities.
	// initially, the order is increasing, when the user clicks on the button, the order will be descending.
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
