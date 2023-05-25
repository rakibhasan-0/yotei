import React, {useRef, useContext} from "react"
import { AccountContext } from "../../../context"
import Button from "../../Common/Button/Button"
import { Upload } from "react-bootstrap-icons"
import { setError, setSuccess } from "../../../utils"

import styles from "./Import.module.css"

export default function Import() {
	const context = useContext(AccountContext)
	const ref = useRef(null)

	return (
		<div className={"row justify-content-center"}>
			<input
				className={styles.fileInput}
				type="file"
				ref={ref}
				onChange={readFileData}>
			</input>
			<Button id="importButton"
				className="d-flex justify-content-between align-items-between"
				type="button"
				onClick={() => ref.current.click()}
				width="100%">
				<Upload className="mr-3" size={"1.4rem"}/>
				<h2>Importera</h2>
			</Button>
		</div>
	)

	function readFileData(e) {
		const file = e.target.files[0]
		const reader = new FileReader()
		reader.readAsText(file)
		reader.onloadend = () => {
			let data
			try {
				data = JSON.parse(reader.result)
			} catch {
				reportFileError(file.name, "Icke en giltig importfil, måste vara JSON", e)
				return [null, null]
			}

			if(!data.exercises && !data.techniques) {
				reportFileError(file.name, "ogiltigt format av importfilen", e)
				return [null, null]
			}
            
			importData(reader.result, Boolean(data.techniques), e)
		}
	}

	function reportFileError(filename, msg, event) {
		setError(filename + ": " + msg)
		event.target.value = null
	}

	function importData(fileData, isTechnique, e) {
		if(!fileData) {
			return
		}

		const endpoint = isTechnique ? "techniques" : "exercises"
		const requestOptions = {
			method: "POST",
			headers: { "Content-Type": "application/json", token: context.token},
			body: fileData
		}
		fetch("/api/import/" + endpoint, requestOptions)
			.then(response => {
				if(!response.ok) {
					throw new Error(response.status)
				}
				return response.json()
			})
			.then(data => {
				e.target.value = null
				if(data?.length > 0) {
					setSuccess("Import av " + endpoint + " lyckades med konflikter. Se konsolen för detaljer.")
					console.error("följande " + endpoint + " importerades inte pga namnkonflikter: " + JSON.stringify(data))
					return
				}
				setSuccess("Import av " + endpoint + " lyckades.")
				
			})
			.catch(() => {
				e.target.value = null
				setError("Misslyckades med att importera " + endpoint)
			})
	}
}