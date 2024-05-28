import { useState, useContext, useEffect } from "react"
import { useCookies } from "react-cookie"
import { AccountContext } from "../../../context"
import { Plus } from "react-bootstrap-icons"
import { canCreateAndEditActivity } from "../../../utils"
import { HTTP_STATUS_CODES } from "../../../utils"
import RoundButton from "../../../components/Common/RoundButton/RoundButton"
import styles from "./TechniqueWeaveIndex.module.css"
import SearchBar from "../../../components/Common/SearchBar/SearchBar"
import TechniquechainCard from "../../../components/Common/TechniquechainCard/TechniquechainCard"
import Spinner from "../../../components/Common/Spinner/Spinner"

/**
 * The technique weave index page.
 * 
 * !NOTE! 
 * This component is far from done and is not optimally implemented, 
 * it is left in this state due to time constraints and unclear specifications.
 * The decision on starting the implementation was made so that the users can test
 * something that maybe resembles what they are looking for. A complete remodel
 * might be a good idea...
 * !NOTE!
 * 
 * TODOS: Search, filter, open and view details of a weave, edit weave
 * 								delete weave
 * 
 * @author Team Durian
 * @version 1.0
 * @since 2024-05-20
 */

const TechniquechainIndex = ()=> {
	const context = useContext(AccountContext)
	//const cookieID = "techniquechain-filter-userId-"+context.userId
	// eslint-disable-next-line no-unused-vars
	const [techniqueWeaves, setTechniqueWeaves] = useState([])
	const [isLoading, setIsLoading] = useState(true)

	//const filterCookie = cookies[cookieID]
	//const [cookies, setCookie] = useCookies([cookieID])
	//const [searchBarText, setSearchBarText] = useState(filterCookie ? filterCookie.searchText : "")

	const detailURL = "/techniquechain/techniqueWeave_page/"


	/* 	const saveSearchText = () => {
		localStorage.setItem("searchText", searchBarText)
	} */

	useEffect(() => {
		getWeaves()
	}, [])

	const getWeaves = async () => {
		const requestOptions = {
			method: "GET",
			headers: { "Content-type": "application/json", "token": context.token }
		}

		const response = await fetch("/api/techniquechain/weave/all", requestOptions)
		if (response.status !== HTTP_STATUS_CODES.OK) {
			//Implement som error message/popup
			return null
		} else {
			const data = await response.json()
			setTechniqueWeaves(data)
			setIsLoading(false)
		}
	}
	//Implment functionality to open and show details of a weave
	return (
		<>
			<h1 id ={"teknikväv-header"}></h1>
			<SearchBar
				id={"searchbar-techniqueWeave"}
				placeholder={"Sök efter teknikvävar"}
			/>
			{isLoading &&
			<Spinner id={"create-weave-index-spinner"}></Spinner>}
			{!isLoading && techniqueWeaves.map( (techniqueWeave, index) =>
				<TechniquechainCard
					item={techniqueWeave.name}
					id={techniqueWeave.id}
					key={techniqueWeave.name}
					checkBox={false}
					detailURL={detailURL}
					index={index}
				/>
			)}
			{canCreateAndEditActivity(context) && (
				<RoundButton id={"technique-add-button"} linkTo={"/techniquechain/techniqueweavecreate/"}>
					<Plus className={styles["plus-icon"]} />
				</RoundButton>
			)}
			
		</>
	)
}
export default TechniquechainIndex