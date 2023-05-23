import { useContext, useEffect, useState } from "react"
import SearchBar from "../../components/Common/SearchBar/SearchBar"
import { getWorkouts } from "../../components/Common/SearchBar/SearchBarUtils"
import useMap from "../../hooks/useMap"
import FilterContainer from "../../components/Common/Filter/FilterContainer/FilterContainer"
import StarButton from "../../components/Common/StarButton/StarButton"
import { useCookies } from "react-cookie"

import "./WorkoutIndex.css"
import { AccountContext } from "../../context"
import DatePicker, { getFormattedDateString } from "../../components/Common/DatePicker/DatePicker"
import RoundButton from "../../components/Common/RoundButton/RoundButton"
import { Plus } from "react-bootstrap-icons"
import {toast} from "react-toastify"
import WorkoutListItem from "../../components/Workout/WorkoutListItem"
import ErrorStateSearch from "../../components/Common/ErrorState/ErrorStateSearch.jsx"
import Spinner from "../../components/Common/Spinner/Spinner.jsx"

/**
 * Workout class. 
 * Creates the searchbar and the activitylist.
 *
 * When a user puts an input into the search bar then it will filter the
 * activitylist after the current search term.
 *
 * @author Team Cyclops (Group 5)
 * @since May 9, 2023
 * @version 1.0
 */

export default function WorkoutIndex() {
	const { userId, token } = useContext(AccountContext)
	const [ workouts, setWorkouts ] = useState([])
	const [ searchText, setSearchText ] = useState("")
	const [ tags, setTags ] = useState([])
	const [ suggestedTags, setSuggestedTags ] = useState([])
	const [ cache, cacheActions ] = useMap()
	const [ cookies, setCookie ] = useCookies(["workout-filter"])
	const [ searchErrorMessage, setSearchErrorMessage ] = useState("")
	const [ loading, setLoading ] = useState(false)

	// Some fucked up shit to get +/- 1 month from today.
	const today = new Date()
	const lastMonth = new Date(today)
	lastMonth.setMonth(today.getMonth() - 1)
	const nextMonth = new Date(today)
	nextMonth.setMonth(today.getMonth() + 1)

	const [ filterFavorites, setFilterFavorites ] = useState(false)
	const [ dates, setDates ] = useState({
		from: getFormattedDateString(lastMonth), 
		to: getFormattedDateString(nextMonth)
	})

	useEffect(() => {
		const filterCookie = cookies["workout-filter"] 
		if(filterCookie) {
			setDates({from: filterCookie.from, to: filterCookie.to})
			setFilterFavorites(filterCookie.isFavorite)
			setTags(filterCookie.tags)
		}
	}, []) // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(fetchWorkouts, [dates.from, dates.to, filterFavorites, searchText, token, userId, cache, cacheActions, tags])
	return (
		<>
			<div id="search-area">
				<center>
					<h1>Pass</h1>
					<SearchBar 
						id="searchbar-workouts" 
						placeholder="Sök" 
						text={searchText} 
						onChange={setSearchText}
						addedTags={tags}
						setAddedTags={setTags}
						suggestedTags={suggestedTags}
						setSuggestedTags={setSuggestedTags}
					/>
					<FilterContainer >
						<div id="filter-container" className="container">
							<div className="row align-items-center">
								<p className="m-0 col text-left">Från</p>
								<DatePicker className="col" selectedDate={dates.from} onChange={handleFromDateChange}/>
							</div>
							<div className="row align-items-center filter-row">
								<p className="m-0 col text-left">Till</p>
								<DatePicker className="col" selectedDate={dates.to} onChange={handleToDateChange}/>
							</div>
							<div className="row align-items-center filter-row">
								<p className="m-0 col text-left">Favoriter</p>
								<div className="col" id="filter-favorites" style={{ maxWidth: "60px" }}>
									<StarButton toggled={filterFavorites} onClick={toggleFilterFavorite}/>
								</div>
							</div>
						</div>
					</FilterContainer>
				</center>
			</div>
			{workouts.length !== 0 ?
				<div className="grid-striped mt-3">
					{workouts.map((workout, index) => {
						return (
							<WorkoutListItem
								key={index}
								workout={workout}
								favoriteCallback={toggleIsFavorite}
							/>)
					})}
				</div>
				: (loading ? <Spinner/> : <ErrorStateSearch id="error-search"
					message={searchErrorMessage}/>)
			}
			<RoundButton linkTo="/workout/create">
				<Plus />
			</RoundButton>
		</>
	)

	function handleFromDateChange(date) {
		setDates({
			...dates,
			from: `${date.target.value}`
		})
	}

	function handleToDateChange(date) {
		setDates({
			...dates,
			to: `${date.target.value}`
		})
	}

	function toggleFilterFavorite() {
		setFilterFavorites(!filterFavorites)
	}

	function toggleIsFavorite(event, workout) {
		workout.favourite = !workout.favourite
	}

	function setError(msg){
		if (toast.isActive("search-error")) return
		toast.error(msg, {
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
		let args = {
			from: dates.from,
			to: dates.to,
			text: searchText,
			selectedTags: tags,
			id: userId,
			isFavorite: filterFavorites
		}

		setCookie("workout-filter", {from: args.from, to: args.to, isFavorite: args.isFavorite, tags: tags}, {path: "/"})
		getWorkouts(args, token, cache, cacheActions, (response) => {
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