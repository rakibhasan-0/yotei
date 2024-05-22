import { React, useState, useEffect, useContext, useRef } from "react"
import { AccountContext } from "../../../context"
import Tab from "react-bootstrap/Tab"
import Tabs from "react-bootstrap/Tabs"
import Modal from "react-bootstrap/Modal"
import useMap from "../../../hooks/useMap"
import SearchBar from "../../Common/SearchBar/SearchBar"
import { getTechniques, getExercises, getLists, getListContent } from "../../Common/SearchBar/SearchBarUtils"
import TechniqueFilter from "../../Common/Filter/TechniqueFilter"
import CheckBox from "../../Common/CheckBox/CheckBox"
import TechniqueCard from "../../Common/Technique/TechniqueCard/TechniqueCard"
import ExerciseListItem from "../../Common/ExerciseCard/ExerciseListItem"
import RoundButton from "../../Common/RoundButton/RoundButton"
import { ChevronRight } from "react-bootstrap-icons"
import ErrorStateSearch from "../../Common/ErrorState/ErrorStateSearch"
import style from "./AddActivity.module.css"
import { WorkoutCreateContext } from "./WorkoutCreateContext"
import { WORKOUT_CREATE_TYPES } from "./WorkoutCreateReducer"
import InfiniteScrollComponent from "../../Common/List/InfiniteScrollComponent"
import FilterContainer from "../../Common/Filter/FilterContainer/FilterContainer"
import { useCookies } from "react-cookie"
import ListPicker from "./ListPicker.jsx"
import DropDown from "../../Common/List/Dropdown"
import NewSorter from "../../Common/Sorting/NewSorter.jsx"
import ListItem from "./ListItem.jsx"

/**
 * This component is used to add activities to a workout. It contains three tabs, 
 * one for techniques, one for exercises and one for lists.
 * 
 * What is an activity? In this case an activity is either a technique or an exercise.
 * 
 * @param {string} id A unique id of the component (Testing purposes)
 * @param {function} setShowActivityInfo Callback function to report selected activities
 * 
 * @author Kraken (Grupp 7), Team Coconut, Team Kiwi, Team Tomato
 * @since 2024-04-19
 * @updated 2024-04-22 Kiwi, Fixed so searchbar is not cleared unless component is closed, also so the active tab will show
 * @updated 2024-04-23 Kiwi, Kihon checkbox is now saved when clicking and redirecting to a technique.
 * @updated 2024-05-02 Kiwi, Fixed search so that current response won't be concatenated with previous.
 * @updated 2024-05-13 Kiwi, Added Automatic scrolling and Removal of activities from popup
 * @updated 2024-05-20 Tomato, Added search function for activity lists.  
 */
function AddActivity({ id, setShowActivityInfo }) {

	const { token } = useContext(AccountContext)
	const { workoutCreateInfo, workoutCreateInfoDispatch } = useContext(WorkoutCreateContext)
	const { checkedActivities } = workoutCreateInfo

	/**
	 * Used to cache techniques and exercises that are fetched from the backend.
	 * This map is used as a parameter when using getTechniques method.
	 */
	const [map, mapActions] = useMap()
	const [key, setKey] = useState("technique")
	const [tabCookie, setCookie] = useCookies(["active-tab"])


	/**
	 * States related to keeping track of which techniques
	 * to display, and the search text, selected belts, kihon 
	 * value and selected tags.
	 */
	const [techniques, setTechniques] = useState([])
	const [searchTechText, setSearchTechText] = useState("")
	const [fetchedTech, setFetchedTech] = useState(false)
	const [selectedBelts, setSelectedBelts] = useState(() => {
		const savedBelts = sessionStorage.getItem("selectedBelts")
		return savedBelts ? JSON.parse(savedBelts) : []
	})

	const [kihon, setKihon] = useState(false)
	const [selectedTechTags, setSelectedTechTags] = useState(() => {
		const savedTags = sessionStorage.getItem("selectedTechTags")
		return savedTags ? JSON.parse(savedTags) : []
	})
	const [suggestedTechTags, setSuggestedTechTags] = useState([])

	/**
	 * States related to keeping track of which exercises
	 * to display, and the search text and selected tags.
	 */
	const [exercises, setExercises] = useState([])
	const [searchExerText, setSearchExerText] = useState("")
	const [selectedExerTags, setSelectedExerTags] = useState(() => {
		const savedExerTags = sessionStorage.getItem("selectedExerTags")
		return savedExerTags ? JSON.parse(savedExerTags) : []
	})
	const [suggestedExerTags, setSuggestedExerTags] = useState([])
	const [fetchedExer, setFetchedExer] = useState(false)

	const [activeTab, setActiveTab] = useState("")

	/**
	 * States related to keeping track of which lists
	 * to display, and the search text.
	 */
	const [lists, setLists] = useState([])
	const [fetchedLists, setFetchedLists] = useState(false)
	const [searchListText, setSearchListText] = useState("")
	const [listContents, setListContents] = useState([])  
	const [listUpdate, setListUpdate] = useState(0)
	const [listFilter, setListFilter] = useState([])


	/**
	 * Keeps track of which activities that are checked/selected by the user.
	 */
	const [hasLoadedData, setHasLoadedData] = useState(false)

	const sortOptionsExercise = [
		{ label: "Namn: A-Ö", cmp: (a, b) => { return a.name.localeCompare(b.name) } },
		{ label: "Namn: Ö-A", cmp: (a, b) => { return -a.name.localeCompare(b.name) } },
		{ label: "Tid: Kortast först", cmp: (a, b) => { return a.duration - b.duration } },
		{ label: "Tid: Längst först", cmp: (a, b) => { return b.duration - a.duration } }
	]
	const [sortExercise, setSortExercise] = useState(sortOptionsExercise[0])
	const [cookies, setCookies] = useCookies(["exercise-filter"])
	const [visibleExercises, setVisibleExercises] = useState([])
	const { userId: currentUserId } = useContext(AccountContext)
	const [listCheckboxStatus, setListCheckboxStatus] = useState({})

	const sortOptionsLists = [
		{ 
			label: "Mina - Delade - Publika", 
			cmp: (a, b) => {
				// "Mina" - prioritize items where the current user is the author
				if (a.author.userId === currentUserId && b.author.userId !== currentUserId) {
					return -1
				}
				if (b.author.userId === currentUserId && a.author.userId !== currentUserId) {
					return 1
				}
			
				// "Delade" - prioritize items that are not authored by the current user and are hidden
				if (a.hidden && !b.hidden && a.author.userId !== currentUserId && b.author.userId === currentUserId) {
					return -1
				}
				if (b.hidden && !a.hidden && b.author.userId !== currentUserId && a.author.userId === currentUserId) {
					return 1
				}
			
				// "Publika" - prioritize items that are not authored by the current user and are not hidden
				if (!a.hidden && a.author.userId !== currentUserId && (b.hidden || b.author.userId === currentUserId)) {
					return -1
				}
				if (!b.hidden && b.author.userId !== currentUserId && (a.hidden || a.author.userId === currentUserId)) {
					return 1
				}
			
				// If items are equal in terms of the above conditions, sort them by name
				return a.name.localeCompare(b.name)
			}
		},
		{ label: "Namn: A-Ö", cmp: (a, b) => { return a.name.localeCompare(b.name) } },
		{ label: "Namn: Ö-A", cmp: (a, b) => { return -a.name.localeCompare(b.name) } },
		{ label: "Senast skapad", cmp: (a, b) => { return new Date(b.date) - new Date(a.date) } },
		{ label: "Äldst", cmp: (a, b) => { return new Date(a.date) - new Date(b.date) } }
	]
	const [sortLists, setSortLists] = useState(sortOptionsLists[0])
	const [filterCount, setFilterCount] = useState(0)
	const [listToToggle, setListToToggle] = useState(null)


	const searchCount = useRef(0)

	/**
	 * Makes sure the data in the search bar is stored when choosing between techniques and exercises
	 * also when redirected to and from info on techniques and exercises.
	 * Also makes sure we return to the tab we where on before, either excerises or techniques
	 */
	useEffect(() => {
		setSearchTechText(sessionStorage.getItem("searchTechText") || "")
		setSearchExerText(sessionStorage.getItem("searchExerText") || "")
		setSearchListText(sessionStorage.getItem("searchListText") || "")
		setActiveTab(getJSONSession("activeTab") || "technique")
		setKihon(sessionStorage.getItem("kihon") || false)
		setSortExercise(getJSONSession("sort") || sortOptionsExercise[0])
	}, [])


	useEffect(() =>
		sessionStorage.setItem("sort", JSON.stringify(sortExercise))
	)


	useEffect(() => {
		setJSONSession("selectedBelts", selectedBelts)
	}, [selectedBelts])


	useEffect(() => {
		sessionStorage.setItem("kihon", kihon)
	}, [kihon])


	useEffect(() => {
		setJSONSession("selectedTechTags", selectedTechTags)
	}, [selectedTechTags])


	useEffect(() => {
		setJSONSession("selectedExerTags", selectedExerTags)
	}, [selectedExerTags])


	useEffect(() => {
		setJSONSession("activeTab", activeTab)
	}, [activeTab])


	useEffect(() => {
		sessionStorage.setItem("searchTechText", searchTechText)
	}, [searchTechText])


	useEffect(() => {
		sessionStorage.setItem("searchExerText", searchExerText)
	}, [searchExerText])

	useEffect(() => {
		sessionStorage.setItem("searchListText", searchListText)
	}, [searchListText])


	useEffect(() => {
		if (listCheckboxStatus) return 

		const initialCheckboxStatus = {}
		lists.forEach(list => {
			initialCheckboxStatus[list.id] = false
		})
		setListCheckboxStatus(initialCheckboxStatus)
	}, [lists])


	// This calls the onAllActivitiesToggle function when the listContents state is updated and runs only when the checkbox to toggle all activities in a list is pressed.
	useEffect(() => {
		if (listToToggle) {
			onAllActivitiesToggle(listToToggle)
			setListToToggle(null) // Reset listToToggle
		}
	}, [listContents])


	function setJSONSession(key, value) {

		sessionStorage.setItem(key, JSON.stringify(value))
	}

	function getJSONSession(key) {

		JSON.parse(sessionStorage.getItem(key))
	}


	useEffect(() => {
		//sessionStorage.getItem(sort) // A work in progress to go from Cookies to sessionStorage!

		const filterCookie = cookies["exercise-filter"]
		if (filterCookie) {
			setSelectedExerTags(filterCookie.tags)
			let cachedSort = sortOptionsExercise.find(option => filterCookie.sort === option.label)
			setSortExercise(cachedSort ? cachedSort : sortOptionsExercise[0])
		}
	}, [])

	useEffect(setExerciseList, [exercises, sortExercise, searchExerText])

	useEffect(() => {
		const activeTab = tabCookie["active-tab"]
		if (activeTab) {
			setKey(activeTab)
		}
	}, [])

	useEffect(() => {
		setCookie("active-tab", key, { path: "/" })
	}, [key])

	useEffect(() => {
		if (hasLoadedData) return

		const tempTechniques = []
		const tempExercises = []

		checkedActivities.forEach(checkedActivity => {
			if (checkedActivity.type === "technique") {
				tempTechniques.push(checkedActivity)
			} else {
				tempExercises.push(checkedActivity)
			}
		})

		//setTechniques(tempTechniques)//TODO THIS IS A PROBLEM CHILD MAN
		//setExercises(tempExercises)
		setHasLoadedData(true)
	}, [hasLoadedData, checkedActivities])


	/**
	 * Fetches lists when the component is mounted or when the
	 * search text are changed.
	 */
	useEffect(() => {
		if (!hasLoadedData) return

		setFilterCount(listFilter.length)
		setFetchedLists(false)
		setLists(lists)
		fetchingList()
	}, [searchListText, hasLoadedData, listUpdate, sortLists, listFilter])


	/**
	 * Fetches techniques when the component is mounted or when the 
	 * search text, selected belts, kihon value or selected tags are changed.
	 */
	useEffect(() => {
		if (!hasLoadedData) return
		setFetchedTech(false)
		setTechniques(techniques.filter(
			technique => checkedActivities.some(
				checkedActivity => checkedActivity.techniqueID === technique.techniqueID
			)
		))
		searchTechniques()
	}, [searchTechText, selectedBelts, kihon, selectedTechTags, hasLoadedData])

	/**
	 * Fetches exercises when the component is mounted or when the
	 * search text or selected tags are changed.
	 */
	useEffect(() => {
		if (!hasLoadedData) return

		setFetchedExer(false)
		setExercises(exercises.filter(
			exercise => checkedActivities.some(
				checkedActivity => checkedActivity.id === exercise.id
			)
		))
		searchExercises()
	}, [searchExerText, selectedExerTags, hasLoadedData])




	/**
	 * Function for handling when a belt has been picked from the BeltPicker.
	 * Returns an object that is a list of the selected belts.
	 * 
	 * @param {bool} checked Boolean if the checkbox for the selected belt was already pressed.
	 * @param {object} belt Object that is an list of the selected belts from the BeltPicker.
	 */
	function handleBeltChanged(checked, belt) {
		setSelectedBelts(prev => {
			if (!checked) {
				return prev.filter(b => b.id !== belt.id)
			}
			else {
				return [...prev, belt]
			}
		})
	}

	/**
	 * Function for handling the kihon checkbox in the TechniqueFilter.
	 * Also adds/removes the kihon tag when the checkbox is checked/unchecked
	 * 
	 * @param {bool} newKihon True/False if the kihon is selected or not.
	 */
	function handleKihonChanged(newKihon) {
		if (newKihon) {
			setKihon(newKihon)
			if (selectedTechTags.find(tag => tag === "kihon waza") === undefined) {
				setSelectedTechTags(current => [...current, "kihon waza"])
			}
		} else {
			setKihon(newKihon)
			setSelectedTechTags(current => current.filter(tag => tag !== "kihon waza"))
		}
	}

	/**
	 * Handles selecting or deselecting a checkbox for an activity.
	 */
	const onActivityToggle = (activity, type) => {
		activity.type = type
		workoutCreateInfoDispatch({ type: WORKOUT_CREATE_TYPES.TOGGLE_CHECKED_ACTIVITY, payload: activity })
	}

	const onActivityToggleAllTrue = (listId) => {
		workoutCreateInfoDispatch({ type: WORKOUT_CREATE_TYPES.CHECK_ALL_ACTIVITIES, payload: listContents[listId] })
	}

	const onActivityToggleAllFalse = (listId) => {
		workoutCreateInfoDispatch({ type: WORKOUT_CREATE_TYPES.UNCHECK_ALL_ACTIVITIES, payload: listContents[listId] })
	}

	const onAllActivitiesToggle = (listId) => {
		if (!listCheckboxStatus[listId]) {
			onActivityToggleAllFalse(listId)
		} else {
			onActivityToggleAllTrue(listId)
		}
	}

	/**
	 * Fetches techniques from the backend, either from cache or by a new API-call. 
	 * But first, the selected belts are filtered and parsed to be used in the request. 
	 * 
	 * When new techniques are fetched, the results are filtered to not include
	 * techniques that are checked/selected by the user. Those techniques are
	 * kept in the state to be displayed.
	 */
	const searchTechniques = () => {
		searchCount.current++

		if (selectedTechTags.find(tag => tag === "kihon waza") === undefined) {
			setKihon(false)
		}
		const filteredBelts = []

		selectedBelts.forEach(function (arrayItem) {
			var x = arrayItem.name
			if (arrayItem.child == true) {
				x = x + "-barn"
			}
			filteredBelts.push(x)
		})
		//setCookiesExer("techniques-filter", { sort: sort.label }, { path: "/" })

		const args = {
			text: searchTechText,
			selectedBelts: filteredBelts,
			kihon: kihon,
			selectedTags: selectedTechTags
		}

		getTechniques(args, token, map, mapActions, (result) => {
			if (!result.results) return

			const res = result.results//.filter((technique) => !checkedActivities.some(a => a.type === "technique" && a.techniqueID === technique.techniqueID))
			setTechniques([...res])
			setSuggestedTechTags(result.tagCompletion)
			setFetchedTech(true)
		})
	}

	/**
	 * Fetches exercises from the backend, either from cache or by a new API-call.
	 * 
	 * When new exercises are fetched, the results are filtered to not include
	 * exercises that are checked/selected by the user. Those exercises are
	 * kept in the state to be displayed.
	 */
	const searchExercises = () => {
		searchCount.current++
		setCookies("exercise-filter", { tags: selectedExerTags, sort: sortExercise.label }, { path: "/" })
		const args = {
			text: searchExerText,
			selectedTags: selectedExerTags,
		}
		getExercises(args, token, map, mapActions, (result) => {
			if (!result.results) return

			const res = result.results//.filter(exercise => !checkedActivities.some(a => a.type === "exercise" && a.id === exercise.id))
			setExercises([...res])
			setSuggestedExerTags(result.tagCompletion)
			setFetchedExer(true)
		})
	}

	/**
	 * Sets the exercise list by sorting the exercises and updating the visible list state. 
	 * Also updates the exercise filter cookie.
	 */
	function setExerciseList() {
		setCookies("exercise-filter", { tags: selectedExerTags, sort: sortExercise.label }, { path: "/" })
		if (exercises && searchExerText === "") {
			const sortedList = [...exercises].sort(sortExercise.cmp)
			setVisibleExercises(sortedList)
		}
		else {
			const temp = [...exercises ?? []]
			setVisibleExercises(temp)
		}
	}

	function clearSelectedBelts() {
		setSelectedBelts([])
	}


	/**
	 * Sets the active filters.
	 * 
	 * @param {*} newListFilter The array of filters to be set.
	 */
	const handleListFilterChange = (newListFilter) => {
		setListFilter(newListFilter)
	}

	/**
	 * Fetches the lists from the backend, either from cache or by a new API-call.
	 */
	function fetchingList() {
		let author = false
		let hidden = false
		let shared = false
		if (listFilter.some(opt => opt.label === "Mina listor")) author = true
		if (listFilter.some(opt => opt.label === "Publika listor")) hidden = true
		if (listFilter.some(opt => opt.label === "Delade med mig")) shared = true
		
		const args = {
			text: searchListText,
			isAuthor: author,
			hidden: hidden,
			isShared: shared
		}

		getLists(args, token, map, mapActions, (result) => {
			if (result.error) return
			
			// Extract the fields from each item in the result used in displaying the list.
			const lists = result.results.map(item => ({

				id: item.id,
				name: item.name,
				author: {
					userId: item.author.userId,
					username: item.author.username
				},
				hidden: item.hidden,
				date: item.date
			}))
			
			setLists(lists.sort(sortLists.cmp))
			setFetchedLists(true)
		})
	}

	/**
	 * Fetches the content from a list given the ID of the same list. 
	 * @param {Integer} listID 
	 */
	function fetchingListContent(listID, callback) {
		const args = {
			id: listID
		}

		getListContent(args, token, map, mapActions, (result) => {
			if (result.error) return

			const listContent = result.activities.map(item => {
				if (item.type === "technique") {
					return {
						techniqueID: listID + "-technique-" + item.id,
						name: item.name,
						type: "technique",
						description: item.description,
						beltColors: [{
							belt_color: item.belts[0].color,
							belt_name: item.belts[0].name,
							is_child: item.belts[0].child
						}],
						tags: item.tags,
						path:  item.id
					}
				}
				else {
					return {
						id: listID + "-exercise-" + item.id,
						name: item.name,
						type: "exercise",
						description: item.description,
						duration: item.duration,
						path: item.id
					}
				}
			})

			setListContents(prevState => ({
				...prevState,
				[listID]: listContent
			}))

			setListUpdate(listUpdate + 1)

			if (callback) {
				callback()
			}
		})
	}
	
	
	return (
		<div id={id}>
			<Modal.Body style={{ padding: "0" }}>
				<Tabs activeKey={key} onSelect={(k) => setKey(k)} className={style.tabs}>
					<Tab eventKey="technique" title="Tekniker" tabClassName={`nav-link ${style.tab}`}>
						<div className={style.searchBar}>
							<SearchBar
								id="technique-search-bar"
								placeholder="Sök efter tekniker"
								text={searchTechText}
								onChange={setSearchTechText}
								addedTags={selectedTechTags}
								setAddedTags={setSelectedTechTags}
								suggestedTags={suggestedTechTags}
								setSuggestedTags={setSuggestedTechTags}
							/>
						</div>
						<TechniqueFilter
							belts={selectedBelts}
							onBeltChange={handleBeltChanged}
							kihon={kihon}
							onKihonChange={handleKihonChanged}
							onClearBelts={clearSelectedBelts}
							id="test"
							filterWhiteBelt={true}>
						</TechniqueFilter>

						{(techniques.length === 0 && fetchedTech) ?
							<ErrorStateSearch id="add-activity-no-technique" message="Kunde inte hitta tekniker" />
							:
							(<InfiniteScrollComponent
								activities={techniques} activeKey={key} searchCount={searchCount.current}
							>
								{techniques.map((technique, key) => (
									<TechniqueCard
										id={"technique-list-item-" + technique.techniqueID}
										checkBox={
											<CheckBox
												checked={checkedActivities.some(a => a.techniqueID === technique.techniqueID)}
												onClick={() => onActivityToggle(technique, "technique")}
											/>
										}
										technique={technique}
										key={key}
									/>
								))}
							</ InfiniteScrollComponent>)
						}

					</Tab>
					<Tab eventKey="exercise" title="Övningar" tabClassName={style.tab}>
						<div className={style.searchBar}>
							<SearchBar
								id="exercise-search-bar"
								placeholder="Sök efter övningar"
								text={searchExerText}
								onChange={setSearchExerText}
								addedTags={selectedExerTags}
								setAddedTags={setSelectedExerTags}
								suggestedTags={suggestedExerTags}
								setSuggestedTags={setSuggestedExerTags}
							/>
						</div>

						<NewSorter onSortChange={setSortExercise} id="ei-sort" selected={sortExercise} options={sortOptionsExercise} />

						{(exercises.length === 0 && fetchedExer) ?
							<ErrorStateSearch id="add-activity-no-exercise" message="Kunde inte hitta övningar" />
							:
							<InfiniteScrollComponent
								activities={visibleExercises} activeKey={key} searchCount={searchCount.current}
							>
								{visibleExercises.map((exercise, key) => (
									<ExerciseListItem
										id={exercise.id}
										text={exercise.duration + " min"}
										detailURL={"/exercise/exercise_page/"}
										checkBox={
											<CheckBox
												checked={checkedActivities.some(a => a.id === exercise.id)}
												onClick={() => onActivityToggle(exercise, "exercise")}
												id={`ExerciseListItemCheckBox-${ exercise.id }`}
											/>
										}
										item={exercise.name}
										key={key}
										index={key}
									/>
								))}
							</InfiniteScrollComponent>
						}
					</Tab>
					<Tab eventKey="lists" title="Listor" tabClassName={`nav-link ${style.tab}`}>
						<div className={style.searchBar}>
							<SearchBar
								id="lists-search-bar"
								placeholder="Sök efter listor"
								text={searchListText}
								onChange={setSearchListText}
							/>

							<NewSorter onSortChange={setSortLists} id="ei-sort" selected={sortLists} options={sortOptionsLists} />


							<FilterContainer id="ei-filter" title="Filtrering" numFilters={filterCount}>
								<ListPicker onFilterChange={handleListFilterChange} />
							</FilterContainer>


							<div className={style.scrollComponentOuterDiv}>
								{(lists.length === 0 && fetchedLists) ?
									<ErrorStateSearch id="add-activity-no-list" message="Kunde inte hitta någon lista" />
									:
									(<InfiniteScrollComponent activities={lists}>
										{lists.map(list => {
											const isChecked = !!listCheckboxStatus[list.id]
											return (

												<DropDown
													text={list.name}
													autoClose={false}
													id={list.id}
													onClick={() => fetchingListContent(list.id)}
													key={list.id}
													checkBox={
														<CheckBox
															checked={isChecked}
															onClick={() => {
																fetchingListContent(list.id, () => {
																	setListToToggle(list.id)
																})
																setListCheckboxStatus(prevState => ({
																	...prevState,
																	[list.id]: !isChecked
																}))
															}}
														/>
													}
													style={{ display: "flex", alignItems: "center", margin: "5px 15px 5px 15px" }}
												>

													<div style={{ borderTop: "1px solid black" }}>
														{listContents[list.id]?.map((item, index) => {
															if(item.type === "technique") {
																return (
																	<ListItem
																		id={"technique-list-item-" + item.techniqueID}
																		item={item}
																		checkBox={
																			<CheckBox 
																				checked={checkedActivities.some(a => a.techniqueID === item.techniqueID)}
																				onClick={() => onActivityToggle(item, "technique")}
																			/>
																		}
																		key={index}
																		index={index}
																	>

																	</ListItem>
																)
															
															} else if(item.type === "exercise") {
																return (
																	<ListItem
																		id={item.id}
																		item={item}
																		checkBox={
																			<CheckBox 
																				checked={checkedActivities.some(a => a.id === item.id)}
																				onClick={() => onActivityToggle(item, "exercise")}
																			/>
																		}
																		key={index}
																		index={index}
																	>
																	</ListItem>
																)
															} else {
																return null
															}
														}
														)}

													</div>
												</DropDown>
											)}
										)}

									</InfiniteScrollComponent>)
								}
							</div>
						</div>
					</Tab>
				</Tabs>

				{/* Spacing so the button doesn't cover an ExerciseListItem */}
				<br /><br /><br />

				{checkedActivities.length > 0 &&
					<RoundButton onClick={() => setShowActivityInfo(checkedActivities)} id="AddCheckedActivitiesButton">
						<ChevronRight width={30} />
					</RoundButton>
				}

			</Modal.Body>
		</div>
	)
}
export default AddActivity