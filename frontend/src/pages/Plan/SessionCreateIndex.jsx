import { Modal } from "react-bootstrap"
import Tab from "react-bootstrap/Tab"
import Tabs from "react-bootstrap/Tabs"
import styles from "./SessionCreateIndex.module.css"
import { useEffect, useState} from "react"
import SessionCreate from "./SessionCreate"
import SessionsCreate from "./SessionsCreate"

/**
 * Index compontent for the sessionCreate page
 * SessionCreate or SessionsCreate are displayed with tabs
 * 
 * 
 * @author Team Kiwi
 * @since 2024-05-03
 */



export default function SessionCreateIndex(){


    const [key, setKey] = useState(sessionStorage.getItem("active_tab") || "session")

	useEffect(()=>{
		sessionStorage.setItem("active_tab", key)
	}, [key]) 



    return (
        <Modal.Body style={{padding: "0"}}>
            <Tabs activeKey={key} onSelect={(tab) => setKey(tab)} className={styles.tabs}>
                <Tab eventKey="session" title="Tillfälle" tabClassName={`nav-link ${styles.tab}`}>
                    <SessionCreate/>
                </Tab>
                <Tab  eventKey="sessions" title="Skapa flera tillfällen" tabClassName={`nav-link ${styles.tab}`}>
                    <SessionsCreate/>
                </Tab>

            </Tabs>
        </Modal.Body>
    )
}