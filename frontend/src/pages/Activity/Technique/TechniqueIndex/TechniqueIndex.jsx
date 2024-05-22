import { useState, useEffect, useContext } from "react"
import RoundButton from "../../../../components/Common/RoundButton/RoundButton"
import { AccountContext } from "../../../../context"
import styles from "./TechniqueIndex.module.css"
import { Plus, ThreeDotsVertical } from "react-bootstrap-icons"
import SearchBar from "../../../../components/Common/SearchBar/SearchBar"
import { getTechniques } from "../../../../components/Common/SearchBar/SearchBarUtils"
import useMap from "../../../../hooks/useMap"
import TechniqueFilter from "../../../../components/Common/Filter/TechniqueFilter"
import Popup from "../../../../components/Common/Popup/Popup"
import CreateTechnique from "../CreateTechnique/CreateTechnique"
import { useCookies } from "react-cookie"
import TechniqueCard from "../../../../components/Common/Technique/TechniqueCard/TechniqueCard"
import InfiniteScrollComponent from "../../../../components/Common/List/InfiniteScrollComponent"
import { canCreateAndEditActivity } from "../../../../utils"
import Spinner from "../../../../components/Common/Spinner/Spinner"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { AddToListPopupContent } from "../../../../components/Activity/AddToListPopupContent"

/**
 * The technique index page.
 * Fetches and displays the techniques.
 *
 * @author Medusa, Team Tomato (group 6), Team Mango (Group 4), Team Kiwi, Team Mango (2024-05-21)
 * @version 3.0
 * @since 2024-04-18
 * @update v3 (2024-05-02 Team Kiwi) removed header from html, also rerouted button from ./create to ./exercise/create
 * @update Team Mango (2024-05-21) changed check for adding technique to new user premission check.
 * @updated 2024-05-21
 */
export default function TechniqueIndex() {
	const [techniques, setTechniques] = useState([])
	const context = useContext(AccountContext)
	const cookieID = "technique-filter-userId-" + context.userId
	const [cookies, setCookie] = useCookies([cookieID])
	const filterCookie = cookies[cookieID]
	const [kihon, setKihon] = useState(false)
	const [belts, setBelts] = useState([]) // eslint-disable-line
	const [searchBarText, setSearchBarText] = useState(filterCookie ? filterCookie.searchText : "")
	const [map, mapActions] = useMap()
	const [tags, setTags] = useState(filterCookie ? filterCookie.tags : [])
	const [suggestedTags, setSuggestedTags] = useState([])
	const [showPopup, setShowPopup] = useState(false)
	const [showMorePopup, setShowMorePopup] = useState(false)
	const [loading, setIsLoading] = useState(true)
	const location = useLocation()
	const clearSearchText = location.state && location.state.clearSearchText
	const navigate = useNavigate()
	const [selectedTechniqueId, setSelectedTechniqueId] = useState(null)

	useEffect(() => {
		if (filterCookie) {
			setBelts(filterCookie.belts)
			setKihon(filterCookie.kihon)
			setTags(filterCookie.tags)
		}
	}, []) // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (showPopup === true) {
			map.clear()
			return
		}
		setCookie(cookieID, { belts: belts, kihon: kihon, tags: tags, searchText: searchBarText }, { path: "/" })

		// The selected belts are transformed from an array of belts objects to an array of strings, consisting of the belt names
		const args = {
			text: searchBarText,
			selectedBelts: belts?.map(belt => {
				if (belt.child) {
					return belt.name + "-barn"
				} else if (belt.inverted) {
					return belt.name + "-inverted"
				} else {
					return belt.name
				}
			}).filter(Boolean).join(","), // Filter out any falsy values
			kihon: kihon,
			selectedTags: tags,
		}

		if (args.selectedTags.find((tag) => tag === "kihon waza") === undefined) {
			setKihon(false)
		} else if (!kihon && args.selectedTags.find((tag) => tag === "kihon waza")) {
			setKihon(true)
		}

		getTechniques(args, context.token, map, mapActions, (res) => {
			if (!res.error) {
				setSuggestedTags(res.tagCompletion)
				setTechniques(res.results)
				localStorage.removeItem("searchText", searchBarText)
			}
			setIsLoading(false)
		})
	}, [showPopup, searchBarText, belts, kihon, tags, context.token, map, mapActions])

	useEffect(() => {
		navigate(location.pathname, {})
	}, [location.pathname, navigate])

	useEffect(() => {
		const searchText = localStorage.getItem("searchText")
		if (searchText) {
			if (clearSearchText) {
				localStorage.removeItem("searchText")
			} else {
				setSearchBarText(searchText)
			}
		}
	}, [clearSearchText])

	const saveSearchText = () => {
		localStorage.setItem("searchText", searchBarText)
	}

	function handleBeltChanged(checked, belt) {
		setBelts((prev) => {
			if (!checked) {
				return prev.filter((b) => b.id !== belt.id)
			} else {
				return [...prev, belt]
			}
		})
	}

	function clearSelectedBelts() {
		setBelts([])
	}

	function handleKihonChanged(newKihon) {
		if (newKihon) {
			setKihon(newKihon)
			if (tags.find((tag) => tag === "kihon waza") === undefined) {
				setTags((current) => [...current, "kihon waza"])
			}
		} else {
			setKihon(newKihon)
			setTags((current) => current.filter((tag) => tag !== "kihon waza"))
		}
	}
	
	const handleMoreClicked = (id) => {
		setSelectedTechniqueId(id)
		//Open pop up
		setShowMorePopup(!showMorePopup)
	}

	return (
		<>
			<Popup title="Skapa teknik" isOpen={showPopup} setIsOpen={setShowPopup}>
				<CreateTechnique setIsOpen={setShowPopup} />
			</Popup>
			<h1 id={"teknik-header"}></h1>
			<div>
				<SearchBar
					onBlur={saveSearchText}
					id="searchbar-technique"
					placeholder="Sök efter tekniker"
					text={searchBarText}
					onChange={setSearchBarText}
					addedTags={tags}
					setAddedTags={setTags}
					suggestedTags={suggestedTags}
					setSuggestedTags={setSuggestedTags}
				></SearchBar>

				<div>
					<TechniqueFilter
						belts={belts}
						onBeltChange={handleBeltChanged}
						kihon={kihon}
						onKihonChange={handleKihonChanged}
						id="test"
						onClearBelts={clearSelectedBelts}
						filterWhiteBelt={true}
					></TechniqueFilter>
				</div>

				{loading ? (
					<Spinner />
				) : (
					<InfiniteScrollComponent>
						{techniques
							?.filter((technique) => {
								if (searchBarText?.length > 0) {
									return technique.name.toLowerCase().includes(searchBarText.toLowerCase())
								}
								return true
							})
							.map((technique, key) => (
								<div className={styles["technique-row"]} key={key}>
									<div className={styles["techniqueCard-container"]}>
										<TechniqueCard marginTop={5} key={key} technique={technique} checkBox={false} />
									</div>
									<Link variant="link" style={{ marginTop: "10px" }} onClick={() => handleMoreClicked(technique.techniqueID)}>
										<ThreeDotsVertical color="black" size={24} />
									</Link>
								</div>
							))}
					</InfiniteScrollComponent>
				)}
			</div>
			<Popup title="Lägg till i lista" isOpen={showMorePopup} setIsOpen={setShowMorePopup}>
				<AddToListPopupContent techExerID={{ techniqueId: selectedTechniqueId, exerciseId: null }} />
			</Popup>

			{/* Spacing so the button doesn't cover a techniqueCard */}
			<br />
			<br />
			<br />
			<br />
			<br />

			
			{canCreateAndEditActivity(context) && (
				<Link to={"technique/create"}>
					<RoundButton id="technique-add-button">
						<Plus className={styles["plus-icon"]} />
					</RoundButton>
				</Link>
			)}
		</>
	)
}
