import { useContext, useEffect, useState } from "react"
import SearchBar from "../../components/Common/SearchBar/SearchBar"
import { getWorkouts } from "../../components/Common/SearchBar/SearchBarUtils"
import FilterContainer from "../../components/Common/Filter/FilterContainer/FilterContainer"
import StarButton from "../../components/Common/StarButton/StarButton"
import { useCookies } from "react-cookie"
import styles from "./WorkoutIndex.module.css"
import { AccountContext } from "../../context"
import DatePicker, { getFormattedDateString } from "../../components/Common/DatePicker/DatePicker"
import RoundButton from "../../components/Common/RoundButton/RoundButton"
import { Plus } from "react-bootstrap-icons"
import {toast} from "react-toastify"
import WorkoutListItem from "../../components/Workout/WorkoutListItem"
import ErrorStateSearch from "../../components/Common/ErrorState/ErrorStateSearch.jsx"
import Spinner from "../../components/Common/Spinner/Spinner.jsx"
import {setError as setErrorToast} from "../../utils"

/**
 * Workout class. 
 * Creates the searchbar and the activitylist.
 *
 * When a user puts an input into the search bar then it will filter the
 * activitylist after the current search term.
 *
 * @author Team Cyclops (Group 5)
 * @author Team Tomato (Group 6)
 * @author Team Durian (Group 3) (2024-04-23)
 * @author Team Tomato (Group 6)
 * @since May 9, 2023
 * @version 1.2
 */

export default function WorkoutIndex() {
	const { userId, token } = useContext(AccountContext)
	const [ workouts, setWorkouts ] = useState([])
	const [ searchText, setSearchText ] = useState("")
	const [ tags, setTags ] = useState([])
	const [ suggestedTags, setSuggestedTags ] = useState([])
	const [ cookies, setCookie ] = useCookies(["workout-filter"])
	const [ searchErrorMessage, setSearchErrorMessage ] = useState("")
	const [ loading, setLoading ] = useState(true)


	const [ filterFavorites, setFilterFavorites ] = useState(false)
	useEffect(fetchWorkouts, [filterFavorites, searchText, token, userId, tags])
	return (
		<>
			<div id="search-area">
				<center>
					<title>Pass</title>
					<h1>Pass</h1>
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
			<br/>
			<RoundButton linkTo="/workout/create">
				<Plus />
			</RoundButton>
		</>
	)


	function toggleFilterFavorite() {
		setFilterFavorites(!filterFavorites)
	}

	function toggleIsFavorite(event, workout) {
		if(filterFavorites) {
			setWorkouts(prevState => 
				prevState.filter(w => w.workoutID !== workout.workoutID)
			)
		}
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
				text: searchText,
				selectedTags: tags,
				id: userId,
				isFavorite: filterCookie.isFavorite
			}
			
		}
		else{
			args = {
				text: searchText,
				selectedTags: tags,
				id: userId,
				isFavorite: filterFavorites
			}
			setCookie("workout-filter", {isFavorite: args.isFavorite, tags: tags}, {path: "/"})
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
