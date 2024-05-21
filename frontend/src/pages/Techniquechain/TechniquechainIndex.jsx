import { useState, useEffect, useContext } from "react"
import { Modal } from "react-bootstrap"
import TechniqueWeaveIndex from "./TechniqueWeave/TechniqueWeaveIndex"
import Tab from "react-bootstrap/Tab"
import Tabs from "react-bootstrap/Tabs"
import styles from "./TechniquechainIndex.module.css"
import Techniquechain from "./Techniquechain/Techniquechain.jsx"


import { AccountContext } from "../../context"


/**
 * The technique index page.
 * Fetches and displays the techniques.
 * 
 * @author Durian Team 3
 * @version 1.0
 * @since 2024-05-20
 */
export default function TechniquechainIndex() {



	const context = useContext(AccountContext)



	const [key, setKey] = useState(sessionStorage.getItem("active-tab") || "technique")

	useEffect(() => {

		const list = {parentWeaveId: 1, nodeName: "test nod 1", description: "kollar om det funkar", techniqueId: 1, attacker: false, partisipant: 1, connected_to: [1,2]}

		const requestOptions = {
			method: "POST",
			headers: { "token": context.token },
			body: JSON.stringify(list)
		}

		console.log(requestOptions)

		fetch("/api/techniquechain/node/create", requestOptions)
			.then(response => {
				if(!response.ok) {
					console.log("respone not ok")
				}
				console.log(response)
				return response.json()
			})
			.catch(() => {
				console.log("nått gick fel!")
			})
	

	}, [])
	
	return (
		<Modal.Body style={{ padding: "0" }}>
			<title>Teknikkedjor</title>
			<Tabs eventKey={key} onSelect={(tab) => setKey(tab)} className={styles.tabs}>
				<Tab eventKey="technique" title="Teknikkedjor" tabClassName={`nav-link ${styles.tab}`}>
					<Techniquechain/>
				</Tab>
				<Tab  eventKey="exercise" title="Teknikvävar" tabClassName={`nav-link ${styles.tab}`}>
					<TechniqueWeaveIndex/>
				</Tab>
			</Tabs>
		</Modal.Body>
	)
}