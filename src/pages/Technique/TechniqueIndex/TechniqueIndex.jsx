import { useState, useEffect, useContext } from "react"
import ActivityList from "../../../components/Activity/ActivityList"
import RoundButton from "../../../components/Common/RoundButton/RoundButton"
import { AccountContext } from "../../../context"
import "./TechniqueIndex.css"
import { Plus } from "react-bootstrap-icons"
import SearchBar from "../../../components/Common/SearchBar/SearchBar"
import { getTechniques } from "..//..//..//components/Common/SearchBar/SearchBarUtils"
import useMap from "..//..//..//hooks/useMap"
import TechniqueFilter from "../../../components/Common/Filter/TechniqueFilter"

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
	const [map, mapActions] = useMap()
	const [tags, setTags] = useState([])
	const [suggestedTags, setSuggestedTags] = useState([])
	const [kihon, setKihon] = useState(false)
	const [belts, setBelts] = useState([])// eslint-disable-line

	useEffect(() => {handleChange({target: {value: ""}})}, [])//rör inte, permantent lösning

	function removedDuplicates(array) {
		return [...new Set(array)]
	}

	function removeUsedTags(array) {
		let arr1 = array
		let arr2 = tags
		let difference = arr1.filter(x => arr2.indexOf(x) === -1)
		return difference
	}

	function repair(array) {
		return removeUsedTags(removedDuplicates(array))
	}
	
	function handleChange(event) {
		console.log(tags)
		const args = {
			text: event.target.value,
			selectedBelts: belts,
			kihon: kihon,
			selectedTags: tags,
		}
		getTechniques(args, context.token, map, mapActions, res => {
			setSuggestedTags(repair(res.tagCompletion))
			setTechniques(res.results)
		})
		return event.target.value
	} 
	return (
		<>
			<div className="container grid-striped">
				<SearchBar 
					id="searchbar-technique"
					placeholder="Sök efter tekniker"
					onChange={handleChange}
					addedTags={tags}
					setAddedTags={setTags}
					suggestedTags={suggestedTags}
					setSuggestedTags={setSuggestedTags}
				/>
				<div style={{wid: "0xp"}}>
					<TechniqueFilter
						setBelts={() => belts.map(belt => belt.child ? belt.name + "-barn" : belt.name)}
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
			<RoundButton linkTo={"/technique/create"}>
				<Plus className="plus-icon" />
			</RoundButton>
		</>

	)

}

export default TechniqueIndex
