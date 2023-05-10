import { useState, useEffect, useContext } from "react"
import ActivityList from "../../../components/Activity/ActivityList"
import RoundButton from "../../../components/Common/RoundButton/RoundButton"
import { AccountContext } from "../../../context"
import "./TechniqueIndex.css"
import { Plus } from "react-bootstrap-icons"
import SearchBar from "../../../components/Common/SearchBar/SearchBar"
import { getTechniques } from "../../../components/Common/SearchBar/SearchBarUtils"
import useMap from "../../../hooks/useMap"
import TechniqueFilter from "../../../components/Common/Filter/TechniqueFilter"
import Popup from "../../../components/Common/Popup/Popup"
import CreateTechnique from "../CreateTechnique/CreateTechnique"

/**
 * The technique index page.
 * Fetches and displays the techniques.
 * 
 * @author Medusa
 * @version 1.0
 * @since 2023-05-03
 */
function TechniqueIndex() {
	const [techniques, setTechniques] = useState()
	const context = useContext(AccountContext)

	const [searchBarText, setSearchBarText] = useState("")
	const [map, mapActions] = useMap()
	const [tags, setTags] = useState([])
	const [suggestedTags, setSuggestedTags] = useState([])
	const [kihon, setKihon] = useState(false)
	const [belts, setBelts] = useState([])// eslint-disable-line
	const [showPopup, setShowPopup] = useState(false)


	useEffect(() => {
		// The selected belts are transformed from an array of belts objects to an array of strings, consisting of the belt names
		const args = {
			text: searchBarText,
			selectedBelts: belts.map(belt => belt.child ? belt.name + "-barn" : belt.name).join(","),
			kihon: kihon,
			selectedTags: tags,
		}

		getTechniques(args, context.token, map, mapActions, res => {
			setSuggestedTags(res.tagCompletion)
			setTechniques(res.results)
		})

	}, [searchBarText, belts, kihon, tags])

	return (
		<>
			<div>
				<Popup title="Skapa teknik" isOpen={showPopup} setIsOpen={setShowPopup}>
					<CreateTechnique setIsOpen={setShowPopup}/>
				</Popup>
			</div>
			<div className="container grid-striped">
				<SearchBar 
					id="searchbar-technique"
					placeholder="Sök efter tekniker"
					text={searchBarText}
					onChange={setSearchBarText}
					addedTags={tags}
					setAddedTags={setTags}
					suggestedTags={suggestedTags}
					setSuggestedTags={setSuggestedTags}
				/>
				<div style={{}}>
					<TechniqueFilter
						setBelts={setBelts}
						belts={belts}
						setKihon={kihon => {setKihon(kihon)}}
						kihon={kihon}
						id="test"
					/>
				</div>
			</div>
			{techniques !== undefined ?
				<ActivityList activities={techniques} apiPath={"techniques"}/>
				:
				null
			}
			<RoundButton onClick={() => setShowPopup(true)}>
				<Plus className="plus-icon" />
			</RoundButton>
		</>

	)

}

export default TechniqueIndex
