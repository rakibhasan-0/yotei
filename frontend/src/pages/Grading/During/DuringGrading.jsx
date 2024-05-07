import React, { useState, useEffect, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { AccountContext } from "../../../context"

export default function DuringGrading() {
	const navigate = useNavigate()
	const { examinationID } = useParams()
	const { token } = useContext(AccountContext)


	useEffect(() => {
		async function fetchData() {
			try {
				
			} catch (error) {
				
			} finally {
				
			}
		}

		// Call func here -fetchData()
	}, [token])

	return (
		<div>
			<h1>During Examination</h1>
            <p>Examination id: </p>
		</div>
	)
}