import React, { useContext, useEffect, useState } from "react"
import { Clock } from "react-bootstrap-icons"
import { AccountContext } from "../../../context"
import { useParams } from "react-router"

import Tag from "../../../components/Common/Tag/Tag"
import Gallery from "../../../components/Gallery/Gallery"
import ErrorState from "../../../components/Common/ErrorState/ErrorState"
import {setError as setErrorToast} from "../../../utils" 

/**
 * A component for displaying details about an exercise.
 * 
 * @author Chimera, Phoenix, Team Coconut, Team Durian, Team Orange, Team Kiwi
 * @since 2024-04-23
 * @version 2.2
 * @returns A page for displaying details about an exercise.
 */
export default function ExerciseDetailsPage() {
	const { ex_id } = useParams()
	const { token } = useContext(AccountContext)
	const [exercise, setExercise] = useState()
	const [tags, setTags] = useState()
	const [error, setError] = useState()



	async function fetchData() {
		fetch(`/api/exercises/${ex_id}`, {
			headers: { token }
		})
			.then(res => res.json())
			.then(data => setExercise(data))
			.catch(ex => {
				setError("Kunde inte hämta övning")
				console.error(ex)
			})


		fetch(`/api/tags/get/tag/by-exercise?exerciseId=${ex_id}`, {
			headers: { token }
		}).then(res => res.json())
			.then(data => setTags(data))
			.catch(ex => {
				setErrorToast("Kunde inte hämta taggar")
				console.error(ex)
			})
	}

	useEffect(() => {
		fetchData()
	},[token, ex_id])



	if (error) {
		return <ErrorState message={error} />
	}


	return (
		<div style={{ display: "flex", flexDirection: "column" }}>
			<title>Övningar</title>
			<h1 style={{textAlign: "left", wordWrap:"break-word"}}>{exercise?.name}</h1>
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
				<Gallery id={ex_id} />
			</div>

		</div>
	)
}