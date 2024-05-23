import { useContext, useEffect, useState } from "react"
import SearchBar from "../../components/Common/SearchBar/SearchBar"
import { getWorkouts } from "../../components/Common/SearchBar/SearchBarUtils"
import FilterContainer from "../../components/Common/Filter/FilterContainer/FilterContainer"
import StarButton from "../../components/Common/StarButton/StarButton"
import styles from "./WorkoutIndex.module.css"
import { AccountContext } from "../../context"
import RoundButton from "../../components/Common/RoundButton/RoundButton"
import { Plus } from "react-bootstrap-icons"
import {toast} from "react-toastify"
import WorkoutListItem from "../../components/Workout/WorkoutListItem"
import ErrorStateSearch from "../../components/Common/ErrorState/ErrorStateSearch.jsx"
import Spinner from "../../components/Common/Spinner/Spinner.jsx"
import {isAdminUser, setError as setErrorToast} from "../../utils"
import { useCookies } from "react-cookie"
import { canCreateWorkouts } from "../../utils"

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
 * @author Team Kiwi (Group 2) (2024-05-08)
 * @author Team Mango (Group 4)
 * Removed option to filter by date created
 * Fixed so that search text is set and saved 
 * (2024-05-16) Fixed so that favorites filter is saved when redirecting 
 * @since May 16, 2023
 * @version 1.2
 */

export default function WorkoutIndex() {
	const { userId, token } = useContext(AccountContext)
	const [ workouts, setWorkouts ] = useState([])
	const [ searchText, setSearchText ] = useState("")
	const [ tags, setTags ] = useState([])
	const [ suggestedTags, setSuggestedTags ] = useState([])
	const [ searchErrorMessage, setSearchErrorMessage ] = useState("")
	const [ loading, setLoading ] = useState(true)
	const [ filterFavorites, setFilterFavorites ] = useState(false)
	const [ cookies, setCookie ]= useCookies(["previousPath"])
	const [ initialized, setInitialized ] = useState(false)

	const context = useContext(AccountContext) //For permissions.
	
	// store search text and filter favorites
	useEffect(() =>{
		setSearchText(sessionStorage.getItem("searchText") || "")
		let temp = sessionStorage.getItem("filterFavorites") || false
		temp = temp === "true" // casting to a boolean as sessionStorage returns a string
		setFilterFavorites(temp) 
		setInitialized(true) // Blocking writing to sessionStorage or fetching workouts before getting storage is done
	}, [])

	// set the search text
	useEffect(() => {
		sessionStorage.setItem("searchText", searchText)
	}, [searchText])

	// set the filter for favorites
	useEffect(() => {
		sessionStorage.setItem("filterFavorites", filterFavorites)
	}, [filterFavorites])

	// Update workouts 
	useEffect(() => {
		if(initialized) {
			fetchWorkouts()
		}
	// fecthWorkouts in dependency array causes recursion
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [filterFavorites, searchText, token, userId, tags, initialized])

	useEffect(() => {
		setCookie("previousPath", "/workout", {path: "/"})
	}, [setCookie, cookies.previousPath])
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
					<FilterContainer id="workout-filter" title="Filtrering"  numFilters={filterFavorites ? 1 : 0}>
						<div className={`container ${styles.filterContainer}` }>
							<div className="row align-items-center filter-row">
								<p className="m-0 col text-left">Favoriter</p>
								<div className="col" id="filter-favorites" style={{ maxWidth: "60px" }}>							
									<StarButton id= "workout-star-id" toggled={filterFavorites} onClick={toggleFilterFavorite}/>
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
			
			{
				isAdminUser(context) || canCreateWorkouts(context) ?
					<RoundButton linkTo="/workout/create" id="CreateWorkoutButton">
						<Plus />
					</RoundButton>
					: <></>
			}
		</>
	)


	function toggleFilterFavorite() {
		setFilterFavorites((prev) => !prev)
	}

	function toggleIsFavorite(event, workout) {
		if(filterFavorites) {
			setWorkouts(prevState => 
				prevState.filter((w) => w.workoutID !== workout.workoutID)
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
		let args = {
			text: searchText,
			selectedTags: tags,
			id: userId,
			isFavorite: filterFavorites
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
