import { useState, useContext, useEffect } from "react"
import { AccountContext } from "../../../context"
import { Plus } from "react-bootstrap-icons"
import { hasBetaAccess, isAdminUser } from "../../../utils"
import { HTTP_STATUS_CODES } from "../../../utils"
import RoundButton from "../../../components/Common/RoundButton/RoundButton"
import styles from "./TechniqueWeaveIndex.module.css"
import SearchBar from "../../../components/Common/SearchBar/SearchBar"
import TechniquechainCard from "../../../components/Common/TechniquechainCard/TechniquechainCard"
import Spinner from "../../../components/Common/Spinner/Spinner"

/**
 * Landing page for the weave tab.
 * 
 * !NOTE! 
 * This component is far from done and is not optimally implemented, 
 * it is left in this state due to time constraints and unclear specifications.
 * The decision on starting the implementation was made so that the users can test
 * something that maybe resembles what they are looking for.
 * !NOTE!
 * 
 * TODOS: Search, filter, open and view details of a weave, edit weave
 * 				delete weave
 * 
 * @author Team Durian
 * @version 1.0
 * @since 2024-05-20
 */

const TechniquechainIndex = ()=> {
	const context = useContext(AccountContext)
	const [techniqueWeaves, setTechniqueWeaves] = useState([])
	const [isLoading, setIsLoading] = useState(true)
	const detailURL = "/techniquechain/techniqueWeave_page/"


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
			{(isAdminUser(context) || hasBetaAccess(context)) && (
				<RoundButton id={"technique-add-button"} linkTo={"/techniquechain/techniqueweavecreate/"}>
					<Plus className={styles["plus-icon"]} />
				</RoundButton>
			)}
			
		</>
	)
}
export default TechniquechainIndex