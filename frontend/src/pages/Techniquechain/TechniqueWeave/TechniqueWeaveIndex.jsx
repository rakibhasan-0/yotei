import { useState, useContext } from "react"
import RoundButton from "../../../components/Common/RoundButton/RoundButton"
import styles from "./TechniqueWeaveIndex.module.css"
import { Plus } from "react-bootstrap-icons"
import { AccountContext } from "../../../context"
import SearchBar from "../../../components/Common/SearchBar/SearchBar"
import TechniquechainCard from "../../../components/Common/TechniquechainCard/TechniquechainCard"

/**
 * The technique weave index page.
 * ADD DESC
 * 
 * @author Team Durian
 * @version 1.0
 * @since 2024-05-20
 */

const TechniquechainIndex = ()=> {
	const context = useContext(AccountContext)
	const [techniqueWeaves, setTechniqueWeaves] = useState([{name: "testväv",id: 1 },{name: "testväv2", id: 2}])
	return (
		<>
			<h1 id ={"teknikväv-header"}></h1>
			<SearchBar
				id={"searchbar-techniqueWeave"}
				placeholder={"Sök efter teknikvävar"}
			/>
			{techniqueWeaves.map( (techniqueWeave) => 
				<TechniquechainCard
					item={techniqueWeave.name}
					id={techniqueWeave.id}
					key={techniqueWeave.name}
					checkBox={false}
				/>
			)}
			
			<RoundButton id={"technique-add-button"} linkTo={"techniqueweavecreate"}>
				<Plus className={styles["plus-icon"]} />
			</RoundButton>
		</>
	)
}
export default TechniquechainIndex