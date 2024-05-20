import { useState , useContext, useEffect} from "react"
import { Modal } from "react-bootstrap"
import Tab from "react-bootstrap/Tab"
import Tabs from "react-bootstrap/Tabs"
import styles from "./TechniquechainIndex.module.css"

export default function TechniquechainIndex() {

	const [key, setKey] = useState(sessionStorage.getItem("active-tab") || "technique")

	return (
		<Modal.Body style={{ padding: "0" }}>
			<Tabs eventKey={key} onSelect={(tab) => setKey(tab)} className={styles.tabs}>
				<Tab eventKey="technique" title="Teknikkedjor" tabClassName={`nav-link ${styles.tab}`}>
					hello
				</Tab>
				<Tab  eventKey="exercise" title="Teknikvävar" tabClassName={`nav-link ${styles.tab}`}>
					hello2
				</Tab>
			</Tabs>
		</Modal.Body>
	)
}