import { useContext, useEffect, useState } from "react"
import SearchBar from "../../components/Common/SearchBar/SearchBar"
import { getWorkouts } from "../../components/Common/SearchBar/SearchBarUtils"
import FilterContainer from "../../components/Common/Filter/FilterContainer/FilterContainer"
import { useCookies } from "react-cookie"
import styles from "./FavouriteWorkoutList.module.css"
import { AccountContext } from "../../context"
import DatePicker, { getFormattedDateString } from "../../components/Common/DatePicker/DatePicker"
import {toast} from "react-toastify"
import WorkoutListItem from "../../components/Workout/WorkoutListItem"
import ErrorStateSearch from "../../components/Common/ErrorState/ErrorStateSearch.jsx"
import Spinner from "../../components/Common/Spinner/Spinner.jsx"
import {setError as setErrorToast} from "../../utils"
import Button from "../../components/Common/Button/Button"
import { useNavigate} from "react-router"

/**
 * Workout class. 
 * Creates the searchbar and the activitylist. Only returns the favourited
 *  workouts. Based on "WorkoutIndex.jsx"
 *
 * When a user puts an input into the search bar then it will filter the
 * activitylist after the current search term.
 *
 * @author Team Tomato (Group 6)
 * @since 2024-05-06
 */

export default function FavouriteWorkoutsList() {
	const { userId, token } = useContext(AccountContext)
	const [ workouts, setWorkouts ] = useState([])
	const [ searchText, setSearchText ] = useState("")
	const [ tags, setTags ] = useState([])
	const [ suggestedTags, setSuggestedTags ] = useState([])
	const [ cookies, setCookie ] = useCookies(["workout-filter"])
	const [ searchErrorMessage, setSearchErrorMessage ] = useState("")
	const [ loading, setLoading ] = useState(true)
	const navigate = useNavigate()
	// Some fucked up shit to get +/- 1 month from today.
	const today = new Date()
	const lastMonth = new Date(today)
	lastMonth.setMonth(today.getMonth() - 1)
	const nextMonth = new Date(today)
	nextMonth.setMonth(today.getMonth() + 1)

	const [ dates, setDates ] = useState({
		from: getFormattedDateString(lastMonth), 
		maxFrom: getFormattedDateString(nextMonth),
		to: getFormattedDateString(nextMonth),
		minTo: getFormattedDateString(lastMonth)
	})
	useEffect(fetchWorkouts, [dates.from, dates.maxFrom, dates.to, dates.minTo, searchText, token, userId, tags])
	return (
		<>
			<div id="search-area">
				<center>
					<title>Favoritpass</title>
					<h1>Favoritpass</h1>
					<SearchBar 
						id="WorkoutIndexSearchBar"
						placeholder="Sök efter pass" 
						text={searchText} 
						onChange={setSearchText}
						addedTags={tags}
						setAddedTags={setTags}
						suggestedTags={suggestedTags}
						setSuggestedTags={setSuggestedTags}
					/>
					<FilterContainer numFilters={0}>
						<div className={`container ${styles.filterContainer}` }>
							<div className="row align-items-center">
								<p className="m-0 col text-left">Från</p>
								<DatePicker className="col" selectedDate={dates.from} maxDate={dates.maxFrom} onChange={handleFromDateChange}/>
							</div>
							<div className="row align-items-center filter-row">
								<p className="m-0 col text-left">Till</p>
								<DatePicker className="col" selectedDate={dates.to} minDate={dates.minTo} onChange={handleToDateChange}/>
							</div>
						</div>
					</FilterContainer>
				</center>
			</div>
			{workouts.length !== 0 ?
				<div className="grid-striped">
					{workouts.map((workout) => {
						return (
							<WorkoutListItem
								key={workout.workoutID}
								workout={workout}
								favoriteCallback={toggleIsFavorite}
							/>)
					})}
				</div>
				: (loading ? <Spinner/> : <ErrorStateSearch id="error-search"
					message={searchErrorMessage}/>)
			}
			<div style={{ marginTop: "1rem", marginBottom:"1rem" }}>
				<Button outlined={true} onClick={() => navigate(-1)}><p>Tillbaka</p></Button>
			</div>
			<br/>
		</>
	)

	function handleFromDateChange(date) {
		setDates({
			...dates,
			from: `${date.target.value}`,
			minTo: `${date.target.value}`
		})
	}

	function handleToDateChange(date) {
		setDates({
			...dates,
			to: `${date.target.value}`,
			maxFrom: `${date.target.value}`
		})
	}

	function toggleIsFavorite(event, workout) {
		//Previously if(filterFavourites)
		setWorkouts(prevState => 
			prevState.filter(w => w.workoutID !== workout.workoutID)
		)
	}

	function setError(msg){
		if (toast.isActive("search-error")) return
		setErrorToast(msg, {
			position: "top-center",
			autoClose: 5000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true, 
			draggable: false,
			progress: undefined,
			theme: "colored",
			toastId: "search-error",
		})
	}

	function constructSearchErrorMessage(args) {
		const searchText = args.text.trim()
		const selectedTags = args.selectedTags
		let msg = "Kunde inte hitta "

		args.isFavorite ? msg += "något favoritmarkerat pass" : msg += "något pass"

		if (searchText !== "")
			msg += ` med namnet "${searchText}"`

		if (searchText !== "" && selectedTags.length !== 0)
			msg += " och"

		if (selectedTags.length !== 0)
			msg += ` med taggarna: ${selectedTags.join(", ")}`

		setSearchErrorMessage(msg)
	}

	function fetchWorkouts() {
		setLoading(true)
		const filterCookie = cookies["workout-filter"]
		let args
		if(filterCookie){
			args = {
				from: filterCookie.from,
				to: filterCookie.to,
				text: searchText,
				selectedTags: tags,
				id: userId,
				isFavorite: true
			}
		}
		else{
			args = {
				from: dates.from,
				to: dates.to,
				text: searchText,
				selectedTags: tags,
				id: userId,
				isFavorite: true
			}
			setCookie("workout-filter", {from: args.from, to: args.to, isFavorite: args.isFavorite, tags: tags}, {path: "/"})
		}
		getWorkouts(args, token, null, null, (response) => {
			if(response.error) {
				setError("Serverfel: Kunde inte ansluta till servern!")
			} else {
				if (response.results.length === 0) constructSearchErrorMessage(args)
				setWorkouts(response.results)
				setSuggestedTags(response.tagCompletion)
			}
			setLoading(false)
		})
	}
}
