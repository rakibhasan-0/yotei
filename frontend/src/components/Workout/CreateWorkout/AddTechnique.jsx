import { React, useState, useEffect, useContext, useRef } from "react"
import { AccountContext } from "../../../context"
import useMap from "../../../hooks/useMap"
import SearchBar from "../../Common/SearchBar/SearchBar"
import { getTechniques } from "../../Common/SearchBar/SearchBarUtils"
import TechniqueFilter from "../../Common/Filter/TechniqueFilter"
import CheckBox from "../../Common/CheckBox/CheckBox"
import TechniqueCard from "../../Common/Technique/TechniqueCard/TechniqueCard"
import RoundButton from "../../Common/RoundButton/RoundButton"
import { ChevronRight } from "react-bootstrap-icons"
import ErrorStateSearch from "../../Common/ErrorState/ErrorStateSearch"
import style from "./AddActivity.module.css"
import InfiniteScrollComponent from "../../Common/List/InfiniteScrollComponent"

/**
 *  
 * @author Team Durian
 * @since 2024-05-21
 */
function AddTechnique({ id, setShowActivityInfo }) {

	const { token } = useContext(AccountContext)

	/**
	 * Used to cache techniques and exercises that are fetched from the backend.
	 * This map is used as a parameter when using getTechniques method.
	 */
	const [map, mapActions] = useMap()


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
	 * Keeps track of which activities that are checked/selected by the user.
	 */
	const [hasLoadedData, setHasLoadedData] = useState(false)

	const sortOptions = [
		{ label: "Namn: A-Ö", cmp: (a, b) => { return a.name.localeCompare(b.name) } },
		{ label: "Namn: Ö-A", cmp: (a, b) => { return -a.name.localeCompare(b.name) } },
		{ label: "Tid: Kortast först", cmp: (a, b) => { return a.duration - b.duration } },
		{ label: "Tid: Längst först", cmp: (a, b) => { return b.duration - a.duration } }
	]
	const [sort, setSort] = useState(sortOptions[0])

	const searchCount = useRef(0)

	useEffect(() => {
		setSearchTechText(sessionStorage.getItem("searchTechText") || "")
		setKihon(sessionStorage.getItem("kihon") || false)
		setSort(getJSONSession("sort") || sortOptions[0])
	}, [])

	useEffect(() => {
		setJSONSession("selectedBelts", selectedBelts)
	}, [selectedBelts])


	useEffect(() => {
		sessionStorage.setItem("kihon", kihon)
	}, [kihon])

	useEffect(() => {
		sessionStorage.setItem("searchTechText", searchTechText)
	}, [searchTechText])

	useEffect(() => {
		setJSONSession("selectedTechTags", selectedTechTags)
	}, [selectedTechTags])


	function setJSONSession(key, value) {
		sessionStorage.setItem(key, JSON.stringify(value))
	}

	function getJSONSession(key) {
		JSON.parse(sessionStorage.getItem(key))
	}

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

	function clearSelectedBelts() {
		setSelectedBelts([])
	}

	return (
		<div id={id}>
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
					activities={techniques} searchCount={searchCount.current}
				>
					{techniques.map((technique, key) => (
						<TechniqueCard
							id={"technique-list-item-" + technique.techniqueID}
							checkBox={
								<CheckBox
									checked={false}
									onClick={() => console.log("ah")}
								/>
							}
							technique={technique}
							key={key}
						/>
					))}
				</ InfiniteScrollComponent>)
			}
			{/* Spacing so the button doesn't cover an ExerciseListItem */}
			<br /><br /><br />

			{1 > 0 &&
					<RoundButton onClick={() => console.log("ye")}>
						<ChevronRight width={30} />
					</RoundButton>
			}
		</div>
	)
}
export default AddTechnique