import { useContext, useEffect, useState } from "react"
import SearchBar from "../../components/Common/SearchBar/SearchBar"
import { getWorkouts } from "../../components/Common/SearchBar/SearchBarUtils"
import useMap from "../../hooks/useMap"
import FilterContainer from "../../components/Common/Filter/FilterContainer/FilterContainer"
import StarButton from "../../components/Common/StarButton/StarButton"

import ActivityList from "../../components/Activity/ActivityList"
import "./WorkoutIndex.css"
import { AccountContext } from "../../context"
import DatePicker, { getFormattedDateString } from "../../components/Common/DatePicker/DatePicker"
import RoundButton from "../../components/Common/RoundButton/RoundButton"
import { Plus } from "react-bootstrap-icons"

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

export default function WorkoutIndex({detailURL}) {
	const { userId, token } = useContext(AccountContext)
	const [ workouts, setWorkouts ] = useState()
	const [ filterFavorites, setFilterFavorites ] = useState(false)
	const [ searchText, setSearchText ] = useState("")
	const [ tags, setTags ] = useState([])
	const [ suggestedTags, setSuggestedTags ] = useState([])
	const [ cache, cacheActions ] = useMap()

	// Some fucked up shit to get +/- 1 month from today.
	const today = new Date()
	const lastMonth = new Date(today)
	lastMonth.setMonth(today.getMonth() - 1)
	const nextMonth = new Date(today)
	nextMonth.setMonth(today.getMonth() + 1)

	const [ dates, setDates ] = useState({
		from: getFormattedDateString(lastMonth), 
		to: getFormattedDateString(nextMonth)
	})

	useEffect(fetchWorkouts, [dates.from, dates.to, filterFavorites, searchText, token, userId, cache, cacheActions, tags])
	return (
		<div id="workout-page-content" className="container p-0 col-lg-8 col-md-10 col-sm-12 align-content-center">
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
							<div className="row row-cols-2 align-items-center filter-row">
								<p className="m-0 col text-left">Från</p>
								<DatePicker className="col" selectedDate={dates.from} onChange={handleFromDateChange}/>
							</div>
							<div className="row row-cols-2 align-items-center filter-row">
								<p className="m-0 col text-left">Till</p>
								<DatePicker className="col" selectedDate={dates.to} onChange={handleToDateChange}/>
							</div>
							<div className="row row-cols-2 align-items-center filter-row">
								<p className="m-0 col text-left">Favoriter</p>
								<div className="col" id="filter-favorites">
									<StarButton toggled={filterFavorites} onClick={toggleFilterFavorite}/>
								</div>
							</div>
						</div>
					</FilterContainer>
				</center>
			</div>
			{workouts && 
				<ActivityList id="workout-list" activities={workouts} apiPath={"workouts"} detailURL={detailURL} favoriteCallback={toggleIsFavorite}/>}
			<RoundButton linkTo={"/workout/create"}>
				<Plus />
			</RoundButton>
		</div>
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

	function fetchWorkouts() {
		let args = {
			from: dates.from,
			to: dates.to,
			text: searchText,
			selectedTags: tags,
			id: userId,
			isFavorite: filterFavorites
		}
		getWorkouts(args, token, cache, cacheActions, (response) => {
			if(response) {
				setWorkouts(response.results)
				setSuggestedTags(response.tagCompletion)
			}
		})
	}
}