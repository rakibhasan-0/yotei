import React, {useContext, useEffect, useState} from "react"
import { AccountContext } from "../../../context"
import { setError, setSuccess } from "../../../utils"
import Button from "../../Common/Button/Button"

import style from "./Export.module.css"

import Popup from "../../Common/Popup/Popup"

const WarningPopup = ({type,show,setShow}) => {
	const context = useContext(AccountContext)

	async function export_(url, name) {
		const requestOptions = {
			method: "GET",
			headers: {"Content-type": "application/json", token: context.token}
		}
		
		let response
		try {
			response = await fetch(url, requestOptions)
		} catch {
			setError("Serverfel: Gick inte att hämta användare för passet.")
			return
		}
		
	
		if(!response.ok) {
			setError("Något gick snett! Felkod: " + response.status)
			return
		}
		
		const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
			JSON.stringify(await response.json(), null, 4)
		)}`
		const link = document.createElement("a")
		link.href = jsonString
		link.download = name + ".json"
		link.click()

		name === "techniques" ? setSuccess("Export av tekniker lyckades!") : setSuccess("Export av övningar lyckades!") 
	}

	const initialPopupStateTechniques = {
		id : 'warning-exercise',
		onClick : () => export_("/api/export/exercises", "exercises"),
		popupText : 'Du kommer nu ladda ned alla övningar i JSON format',
		confirmText : 'Okej laddar ned övningar som JSON',
		backText : 'återvänder'
	}
	
	const initialPopupStateExercises = {
		id : 'warning-technique',
		onClick : () => export_("/api/export/techniques", "techniques"),
		popupText : 'Du kommer nu ladda ned alla tekniker i JSON format',
		confirmText : 'Okej laddar ned tekniker som JSON',
		backText : 'återvänder'
	}

	const [popupState, setPopupState] = useState(
		(type == 'technique') ? initialPopupStateTechniques : initialPopupStateExercises)
	
	return(
		<>
		<Popup
			title={'Är du säker?'}
			id={popupState.id}
			isOpen={show}
			setIsOpen={setShow}
			children={null}	
			isNested={true}
			style={{
				width: 'auto',
				height: 'auto'
			}}
			onClose={() => setShow(false)}
			zIndex={100}
		>
		<p>{popupState.popupText}</p>
		
		<div className={style.warningBtnContainer}>
		<Button
			className={style.warningBtn}
			onClick={() => {
			popupState.onClick()
			setShow(false)
			}}>
			Exportera
		</Button>
		<Button 
			className={style.warningBtn}
			onClick={() => setShow(false)}>
			Avbryt
		</Button>
		</div>
		
		</Popup>
		</>
	)
}

export default function Export() {
    const [exportData, setExportData] = useState({ showWarning: false })

    return (
        <>
            {exportData.showWarning && exportData.exportType !== undefined ?
                <WarningPopup
                    type={exportData.exportType}
                    show={exportData.showWarning}
                    setShow={(show) => setExportData({ ...exportData, showWarning: show })}
                /> : <></>
            }
            <div className={`row ${style.exportButtonContainer}`}>
                <Button
                    id="exercise-export"
                    outlined={true}
					isToggled={false}
                    width={"100%"}
					type="button"
					disabled={false}
                    onClick={() => setExportData({ showWarning: true, exportType: 'exercise' })}
                >
                    <h2>Exportera Övningar</h2>
                </Button>
            </div>
            <div className={`row ${style.exportButtonContainer}`}>
                <Button
                    id="technique-export"
                    outlined={true}
					isToggled={false}
                    width={"100%"}
					type="button"
					disabled={false}
                    onClick={() => setExportData({ showWarning: true, exportType: 'technique' })}
                >
                    <h2>Exportera Tekniker</h2>
                </Button>
            </div>
        </>
    )
}


