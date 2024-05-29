import { useState, useContext } from "react"
import { Modal } from "react-bootstrap"
import TechniqueWeaveIndex from "./TechniqueWeave/TechniqueWeaveIndex"
import Tab from "react-bootstrap/Tab"
import Tabs from "react-bootstrap/Tabs"
import styles from "./TechniquechainIndex.module.css"
import Techniquechain from "./Techniquechain/Techniquechain.jsx"
import { isAdminUser, hasBetaAccess } from "../../utils.js"
import { AccountContext } from "../../context.js"


/**
 * The technique index page.
 * Fetches and displays the techniquechains/techniqueweaves.
 * 
 * @author Durian Team 3
 * @version 1.0
 * @since 2024-05-20
 */
export default function TechniquechainIndex() {

	const [key, setKey] = useState(sessionStorage.getItem("active-tab") || "technique")
	const context = useContext(AccountContext)
	
	if(!isAdminUser(context) && !hasBetaAccess(context)){
		window.location.replace("/404")
		return null
	}
	
	return (
		<Modal.Body style={{ padding: "0" }}>
			<title>Tekniktrådar</title>
			<Tabs eventKey={key} onSelect={(tab) => setKey(tab)} className={styles.tabs}>
				<Tab eventKey="technique" title="Tekniktrådar" tabClassName={`nav-link ${styles.tab}`}>
					<Techniquechain/>
				</Tab>
				<Tab  eventKey="weave" title="Teknikvävar" tabClassName={`nav-link ${styles.tab}`}>
					<TechniqueWeaveIndex/>
				</Tab>
			</Tabs>
		</Modal.Body>
	)
}