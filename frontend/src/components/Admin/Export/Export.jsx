import React, {useContext} from "react"
import { AccountContext } from "../../../context"
import { setError, setSuccess } from "../../../utils"
import Button from "../../Common/Button/Button"
import style from "./Export.module.css"

export default function Export() {
	const context = useContext(AccountContext)

	return (
		<>
			<div className={`row ${style.exportButtonContainer}`}>
				<Button
					id="exercise-export"
					type="button"
					width={"100%"}
					onClick={() => export_("/api/export/exercises", "exercises")}>
					<h2>Exportera Övningar</h2>
				</Button>
			</div>
			<div className={`row ${style.exportButtonContainer}`}>
				<Button
					id="technique-export"
					type="button"
					width={"100%"}
					onClick={async () => export_("/api/export/techniques", "techniques")}>
					<h2>Exportera Tekniker</h2>
				</Button>
			</div>
		</>
	)

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
}

