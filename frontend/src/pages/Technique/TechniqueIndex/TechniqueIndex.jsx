import { useState, useEffect, useContext } from "react"
import RoundButton from "../../../components/Common/RoundButton/RoundButton"
import { AccountContext } from "../../../context"
import "./TechniqueIndex.module.css"
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
import { Link } from "react-router-dom"

/**
 * The technique index page.
 * Fetches and displays the techniques.
 * 
 * @author Medusa
 * @version 1.0
 * @since 2023-05-03
 */
export default function TechniqueIndex() {
	const [techniques, setTechniques] = useState([])
	const context = useContext(AccountContext)
	const [cookies, setCookie] = useCookies(["technique-filter-userId-"+context.userId])

	const [kihon, setKihon] = useState(false)
	const [belts, setBelts] = useState([])// eslint-disable-line

	const [searchBarText, setSearchBarText] = useState("")
	const [map, mapActions] = useMap()
	const [tags, setTags] = useState([])
	const [suggestedTags, setSuggestedTags] = useState([])
	const [showPopup, setShowPopup] = useState(false)
	const [loading, setIsLoading] = useState(true)

	useEffect(() => {
		const filterCookie = cookies["technique-filter-userId-"+context.userId]
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

		// The selected belts are transformed from an array of belts objects to an array of strings, consisting of the belt names
		const args = {
			text: searchBarText,
			selectedBelts: belts?.map(belt => belt.child ? belt.name + "-barn" : belt.name).join(","),
			kihon: kihon,
			selectedTags: tags,
		}
		setCookie("technique-filter-userId-"+context.userId, {belts: belts, kihon: kihon, tags: tags}, {path: "/"})

		if(args.selectedTags.find(tag => tag === "kihon waza") === undefined) {
			setKihon(false)
		} else if (!kihon && args.selectedTags.find(tag => tag === "kihon waza")) {
			setKihon(true)
		}

		getTechniques(args, context.token, map, mapActions, res => {
			setSuggestedTags(res.tagCompletion)
			setTechniques(res.results)
			setIsLoading(false)
		})


	}, [showPopup, searchBarText, belts, kihon, tags, context.token, map, mapActions])

	return (
		<>
			<Popup
				title="Skapa teknik"
				isOpen={showPopup}
				setIsOpen={setShowPopup}
			>
				<CreateTechnique setIsOpen={setShowPopup} />
			</Popup>

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
						<Plus className="plus-icon" />
					</RoundButton>
				</Link>
			}
		</>
	)

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
}
