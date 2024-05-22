import { useState, useEffect, useContext, useCallback } from "react"


import { AccountContext } from "../../../../context"

import Tag from "../../../../components/Common/Tag/Tag"
import BeltIcon from "../../../../components/Common/BeltIcon/BeltIcon"



import styles from "./TechniqueDetail.module.css"
import ErrorState from "../../../../components/Common/ErrorState/ErrorState"
import Spinner from "../../../../components/Common/Spinner/Spinner"
import Gallery from "../../../../components/Gallery/Gallery"





/**
 * The detail page for a technique in a mini popup window. Without edit, delete and print buttons.
 * Taken from TechniqueDetail file
 * 
 * @param id: The id used for fetching techniques.
 * Version 1
 * 
 * @author Team Kiwi
 * @version 1
 * @since 2024-05-22
 */
function TechniqueDetailMini({ id }) {

	const { token } = useContext(AccountContext)
	const [technique, setTechnique] = useState()
	const [error, setError] = useState("")
	const [loading, setLoading] = useState(true)


	// Belt sorting order, Adult easiest -> Adult hardest -> Child easiest -> Child hardest
	const order = [3, 5, 7, 9, 11, 13, 14, 15, 16, 4, 6, 8, 10, 12]
	const beltSort = (a, b) => {
		const indexA = order.indexOf(a.id)
		const indexB = order.indexOf(b.id)

		if (indexA === -1) return 1
		if (indexB === -1) return -1

		return indexA - indexB
	}

	const handleGet = useCallback(() => {
		setLoading(true)
		setError("")
		fetch("/api/techniques/" + 300, { headers: { token } })
			.then(async res => {
				if (!res.ok) {
					// Quick fix with + " " because old API returns empty body on 404.
					setError(await res.text() + " ")
					setLoading(false)
					return
				}
				const technique = await res.json()
				setTechnique(technique)
				setLoading(false)
			})
			.catch(() => {
				setError("Ett nätverksfel inträffade. Kontrollera din internetuppkoppling.")
				setLoading(false)
			})
	}, [id, token])

	useEffect(() => handleGet(), [handleGet, id, token])

	
	if (error != "") return <ErrorState
		message={error}
		onRecover={handleGet}
	/>

	if (loading) {
		console.log("y")
		return <div className={styles["technique-detail-center-spinner"]}><Spinner /></div>
	}

	return (
		<>
			<div className={styles["technique-detail-container"]} id={id == undefined ? "technique" : id}>
				<title>Tekniker</title>
			

				<div className={styles["technique-detail-belts-container"]}>
					{technique.belts ? ( 
						technique.belts.filter(belt => !belt.child).sort(beltSort).map(belt => <BeltIcon key={belt.name} belt={belt} />)
					) : (
						<p>Inga bälten kunde hittas för denna teknik.</p>
					)}
				</div>
				<div className={styles["technique-detail-belts-container"]}>
					{(
						technique.belts.filter(belt => belt.child).sort(beltSort).map(belt => <BeltIcon key={belt.name} belt={belt} />)
					)}
				</div> 
				
				<h2>Beskrivning</h2>
				{technique.description ? (
					<p style={{whiteSpace: "pre-wrap", wordBreak: "break-word"}}>{technique.description}</p>
				) : (
					<p style={{ fontStyle: "italic", color: "var(--gray)" }}>Beskrivning saknas.</p>
				)}
				<h2>Taggar</h2>
				<div className={styles["technique-detail-tag-container"]}>
					{technique.tags ? (
						technique.tags.map(tag => <Tag key={tag.id} text={tag.name} tagType="default" />)
					) : (
						<p>Denna teknik saknar taggar.</p>
					)
					}
				</div>
		
				<Gallery id={id} />
				
			</div>
		</>
	)
}

export default TechniqueDetailMini
