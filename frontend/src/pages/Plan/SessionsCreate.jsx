import { React, useState, useContext, useEffect } from "react"
import { AccountContext } from "../../context"
import { useNavigate } from "react-router"
import PlanForm from "../../components/Forms/PlanForm.jsx"
import styles from "./PlanCreate.module.css"
import {setError as setErrorToast, setSuccess as setSuccessToast} from "../../utils"
import { unstable_useBlocker as useBlocker } from "react-router"
import ConfirmPopup from "../../components/Common/ConfirmPopup/ConfirmPopup"
import { useLocation } from "react-router-dom"



/**
 * Page for creating multiple sessions for a group, similar to PlanCreate but enables the user to create
 * multiple session for a already existing group.
 * 
 * 
 * Contains a form for collecting the group selected, start & end dates.
 * As well as checkboxses indicating which day of the week to include
 * 
 * @author Team Kiwi
 * @since 2024-05-03
 */


export default function SessionsCreate(){
    const { state } = useLocation()
    const navigate = useNavigate()
    const { token } = useContext(AccountContext)

    const [groups, setGroups] = useState()
    const [group, setGroup] = useState(state?.session?.group)
    const [groupError, setGroupError] = useState()
    
    const [goBackPopup, setGoBackPopup] = useState(false)
	const [isBlocking, setIsBlocking] = useState(false)

	const blocker = useBlocker(() => {
		if (isBlocking) {
			setGoBackPopup(true)
			return true
		}
		return false
	})


    useEffect(() => {
		(async () => {
			try {
				const response = await fetch("/api/plan/all", { headers: { token } })
				if (response.status === 404) {
					return
				}
				if (!response.ok) {
					throw new Error("Could not fetch groups")
				}
				setGroups(await response.json())
			} catch (ex) {
				setErrorToast("Kunde inte hämta alla grupper")
				console.error(ex)
			}
		})()
	}, [token])



    return (
        <>
            <ConfirmPopup
				confirmText={"Lämna"}
				backText={"Avbryt"}
				id={"session-create-leave-page-popup"}
				showPopup={goBackPopup}
				onClick={blocker.proceed}
				setShowPopup={setGoBackPopup}
				popupText={"Är du säker på att du vill lämna sidan? Dina ändringar kommer inte att sparas."}
			/>
            <Dropdown errorMessage={groupError} id={"session-dropdown"} text={group?.name || "Grupp"} centered={true}>
				{groups?.length > 0 ? groups.map((plan, index) => (
					<div className={styles.dropdownRow} key={index} onClick={() => setGroup(plan)}>
						<p className={styles.dropdownRowText}>{plan.name}</p>
					</div>
				)) : <div className={styles.dropdownRow}>
					<p className={styles.dropdownRowText}>Kunde inte hitta några grupper</p>
				</div>}
			</Dropdown>
        
        </>
    )
}