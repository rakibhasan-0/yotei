import { useState, useEffect, useContext } from "react"
import RoundButton from "../../../components/Common/RoundButton/RoundButton"
import { AccountContext } from "../../../context"
import styles from "./TechniqueIndex.module.css"
import { Plus } from "react-bootstrap-icons"
import SearchBar from "../../../components/Common/SearchBar/SearchBar"
import { getTechniques } from "../../../components/Common/SearchBar/SearchBarUtils"
import useMap from "../../../hooks/useMap"
import TechniqueFilter from "../../../components/Common/Filter/TechniqueFilter"
import Popup from "../../../components/Common/Popup/Popup"
import CreateTechnique from "../CreateTechnique/CreateTechnique"
import { useCookies } from "react-cookie"
import TechniqueCard from "../../../components/Common/Technique/TechniqueCard/TechniqueCard"
import InfiniteScrollComponent from "../../../components/Common/List/InfiniteScrollComponent"
import { isAdmin } from "../../../utils"
import Spinner from "../../../components/Common/Spinner/Spinner"
import { Link, useLocation, useNavigate} from "react-router-dom"

/**
 * The technique index page.
 * Fetches and displays the techniques.
 * 
 * @author Medusa, Team Tomato (group 6), Team Durian (Group 3) (2024-04-23)
 * @version 2.0
 * @since 2024-04-18
 */
export default function TechniqueIndex() {
	const [techniques, setTechniques] = useState([])
	const context = useContext(AccountContext)
	const cookieID = "technique-filter-userId-"+context.userId
	const [cookies, setCookie] = useCookies([cookieID])
	const filterCookie = cookies[cookieID]
	const [kihon, setKihon] = useState(false)
	const [belts, setBelts] = useState([])// eslint-disable-line
	const [searchBarText, setSearchBarText] = useState(filterCookie ? filterCookie.searchText : "")
	const [map, mapActions] = useMap()
	const [tags, setTags] = useState(filterCookie ? filterCookie.tags : [])
	const [suggestedTags, setSuggestedTags] = useState([])
	const [showPopup, setShowPopup] = useState(false)
	const [loading, setIsLoading] = useState(true)
	const location = useLocation()
	const clearSearchText = location.state && location.state.clearSearchText
	const navigate = useNavigate()

	useEffect(() => {
		if(filterCookie) {
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
		setCookie(cookieID, {belts: belts, kihon: kihon, tags: tags, searchText: searchBarText}, {path: "/"})

		// The selected belts are transformed from an array of belts objects to an array of strings, consisting of the belt names
		const args = {
			text: searchBarText,
			selectedBelts: belts?.map(belt => belt.child ? belt.name + "-barn" : belt.name).join(","),
			kihon: kihon,
			selectedTags: tags,
		}

		if(args.selectedTags.find(tag => tag === "kihon waza") === undefined) {
			setKihon(false)
		} else if (!kihon && args.selectedTags.find(tag => tag === "kihon waza")) {
			setKihon(true)
		}

		getTechniques(args, context.token, map, mapActions, res => {
			if(!res.error) {
				setSuggestedTags(res.tagCompletion)
				setTechniques(res.results)
			}
			setIsLoading(false)
		})


	}, [showPopup, searchBarText, belts, kihon, tags, context.token, map, mapActions])

	useEffect(() => {
		navigate(location.pathname, {})
	}, [location.pathname, navigate])

	useEffect(() => {
		const searchText = localStorage.getItem("searchText")
		if(searchText) {
			if (clearSearchText) {
				localStorage.removeItem("searchText")
			}
			else{
				setSearchBarText(searchText)
			}
		}
		
	}, [clearSearchText])

	function handleBeltChanged(checked, belt) {
		setBelts(prev => {
			if(!checked) {
				return prev.filter(b => b.id !== belt.id)
			}
			else {
				return [...prev, belt]
			}
		})
	}

	function clearSelectedBelts() {
		setBelts([])
	}

	function handleKihonChanged(newKihon) {
		if(newKihon) {
			setKihon(newKihon)
			if(tags.find(tag => tag === "kihon waza") === undefined) {
				setTags(current => [...current, "kihon waza"])
			}
		} else {
			setKihon(newKihon)
			setTags(current => current.filter(tag => tag !== "kihon waza"))
		}
	}

	return (
		<>
			<Popup
				title="Skapa teknik"
				isOpen={showPopup}
				setIsOpen={setShowPopup}
			>
				<CreateTechnique setIsOpen={setShowPopup} />
			</Popup>

			<title>Tekniker</title>
			<h1>Tekniker</h1>

			<div>
				<SearchBar
					id="searchbar-technique"
					placeholder="Sök efter tekniker"
					text={searchBarText}
					onChange={setSearchBarText}
					addedTags={tags}
					setAddedTags={setTags}
					suggestedTags={suggestedTags}
					setSuggestedTags={setSuggestedTags}>
				</SearchBar>

				<div>
					<TechniqueFilter
						belts={belts}
						onBeltChange={handleBeltChanged}
						kihon={kihon}
						onKihonChange={handleKihonChanged}
						id="test"
						onClearBelts={clearSelectedBelts}
						filterWhiteBelt={true}>
					</TechniqueFilter>
				</div>

				{loading ? <Spinner /> : <InfiniteScrollComponent>
					{techniques?.map((technique, key) =>
						<TechniqueCard
							key={key}
							technique={technique}
							checkBox={false}>
						</TechniqueCard>)}
				</InfiniteScrollComponent>}
			</div>

			{/* Spacing so the button doesn't cover a techniqueCard */}
			<br/><br/><br/><br/><br/>
			
			{isAdmin(context) &&
				<Link to={"create"}>
					<RoundButton id="technique-add-button">
						<Plus className={styles["plus-icon"]} />
					</RoundButton>
				</Link>
			}
		</>
	)
}
