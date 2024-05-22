import React, { useCallback, useContext, useEffect, useState } from "react"
import { Clock } from "react-bootstrap-icons"
import { AccountContext } from "../../../context"

import Tag from "../../../components/Common/Tag/Tag"
import Gallery from "../../../components/Gallery/Gallery"
import ErrorState from "../../../components/Common/ErrorState/ErrorState"
import {setError as setErrorToast} from "../../../utils" 
import Spinner from "../../../components/Common/Spinner/Spinner"

import styles from "./ExerciseDetailMini.module.css"

/**
 * A component for displaying details about an exercise in a mini pop up, without the edit, delete and print buttons.
 * Taken from ExerciseDetailsPage file.
 * 
 * @author Team Kiwi
 * @since 2024-05-22
 * @version 2.2
 * @returns A page for displaying details about an exercise.
 */
export default function ExerciseDetailMini({id}) {
	const { token } = useContext(AccountContext)
	const [exercise, setExercise] = useState()
	const [tags, setTags] = useState()
	const [error, setError] = useState("")
	const [loading, setLoading] = useState(true)

	const fetchData = useCallback(() => {
		setLoading(true)
		
		fetch(`/api/exercises/${300}`, { headers: { token } })
			.then(async res => {
				if (!res.ok) {
					// Quick fix with + " " because old API returns empty body on 404.
					setError(await res.text() + " ")
					setLoading(false)
					return
				}
				const exercise = await res.json()
				setExercise(exercise)
				setLoading(false)
			})

		fetch(`/api/tags/get/tag/by-exercise?exerciseId=${id}`, { headers: { token } })
			.then(async res => {
				if (!res.ok) {
					// Quick fix with + " " because old API returns empty body on 404.
					setErrorToast(await res.text() + " ")
					setLoading(false)
					return
				}
				const data = await res.json()
				setTags(data)
				setLoading(false)
			})
	}, [id, token] )

	useEffect(() =>  fetchData() ,[fetchData,token, id])


	if (error != "")  return <ErrorState 
		message={error} 
		onRecover= {fetchData} 
	/>


	if (loading) { 
		console.log("x")
		return <div className={styles["exercise-detail-center-spinner"]}><Spinner /></div>
	}

	return (
		<div style={{ display: "flex", flexDirection: "column" }}>
			<div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
				<div className="d-flex align-items-center">
					<Clock />
					<p style={{ marginBottom: "0", marginLeft: "5px" }}>{exercise?.duration} min</p>
				</div>
			
			</div>

			<h2 style={{ fontWeight: "bold", display: "flex", flexDirection: "row", alignItems: "left", marginTop: "5px", alignContent: "left" }}>Beskrivning</h2>
			<p style={{ textAlign: "left", whiteSpace: exercise?.description ? "pre-line" : "normal", fontStyle: !exercise?.description ? "italic" : "normal", color: !exercise?.description ? "var(--gray)" : "inherit" }}>
				{exercise?.description || "Beskrivning saknas."}
			</p>


			{tags?.length > 0 && (
				<>
					<h2 style={{ fontWeight: "bold", display: "flex", flexDirection: "row", alignItems: "left"}}>Taggar</h2>
					<div style={{ display: "flex", flexWrap: "wrap", marginBottom: "4px", gap: "10px" }}>
						{tags.map((tag, index) => (
							<Tag key={index} tagType={"default"} text={tag.tagName} />
						))}
					</div>
				</>
			)}

			<div>
				<Gallery id={id} />
			</div>

		</div>
	)
}