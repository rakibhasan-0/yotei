import { Modal } from "react-bootstrap"
import Tab from "react-bootstrap/Tab"
import Tabs from "react-bootstrap/Tabs"
import styles from "./SessionCreateIndex.module.css"
import { useEffect, useState} from "react"
import SessionCreate from "./SessionCreate"
import SessionsCreate from "./SessionsCreate"
import { unstable_useBlocker as useBlocker } from "react-router"
import ConfirmPopup from "../../components/Common/ConfirmPopup/ConfirmPopup"

/**
 * Index compontent for the sessionCreate page
 * SessionCreate or SessionsCreate are displayed with tabs
 * 
 * 
 * @author Team Kiwi
 * @since 2024-05-03
 */



export default function SessionCreateIndex(){

	const [isBlocking, setIsBlocking] = useState(false)
	const [goBackPopup, setGoBackPopup] = useState(false)
	const [key, setKey] = useState(sessionStorage.getItem("active_tab") || "session")

	useEffect(()=>{
		sessionStorage.setItem("active_tab", key)
	}, [key]) 

	/**
     * Blocker is defined here and used as a paremeter to the SessionCreate and SessionsCreate tabs.
     */
	const blocker = useBlocker(() => {
		if (isBlocking) {
			setGoBackPopup(true)
			return true
		}
		return false
	})

	return (
		<Modal.Body style={{padding: "0"}}>
			<Tabs activeKey={key} onSelect={(tab) => setKey(tab)} className={styles.tabs}>
				<Tab eventKey="session" title="Skapa tillfälle" tabClassName={`nav-link ${styles.tab}`}>
					<SessionCreate setIsBlocking={setIsBlocking}/>
				</Tab>
				<Tab  eventKey="sessions" title="Skapa flera tillfällen" tabClassName={`nav-link ${styles.tab}`}>
					<SessionsCreate setIsBlocking={setIsBlocking}/>
				</Tab>
			</Tabs>
			<ConfirmPopup
				confirmText={"Lämna"}
				backText={"Avbryt"}
				id={"session-create-leave-page-popup"}
				showPopup={goBackPopup}
				onClick={blocker.proceed}
				setShowPopup={setGoBackPopup}
				popupText={"Är du säker på att du vill lämna sidan? Dina ändringar kommer inte att sparas."}
			/>
		</Modal.Body>
	)
}