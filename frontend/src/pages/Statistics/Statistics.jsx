import React, { useState, useEffect, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { AccountContext } from "../../context"
import Spinner from "../../components/Common/Spinner/Spinner"
import style from "./Statistics.module.css"
import Button from "../../components/Common/Button/Button"
import StatisticsPopUp from "./StatisticsPopUp"
import FilterStatistics from "./FilterStatistics"


export default function Statistics() {
	const navigate = useNavigate()
	const { groupID } = useParams()
	const [group, setGroup] = useState(null)
	const [loading, setLoading] = useState(true)
	const { token } = useContext(AccountContext)



	useEffect(() => {
		async function fetchGroupData() {
		
			try {
				console.log("Fetching group data for ID:", groupID)

				const response = await fetch("/api/plan/all", {headers: { token }})

				if (!response.ok) {
					throw new Error("Failed to fetch group data")
				}
				const data = await response.json()
				console.log("Group data:", data)
				const groupData = data.find((group) => group.id === parseInt(groupID))
				setGroup(groupData)
			} 
			catch (error) {
				console.error("Fetching error:", error) // proper handling of error should be implemented
			} 
			finally {
				setLoading(false)
			}
		}

		fetchGroupData()

	}, [groupID, token])

	return (
		<div>
			{loading ? (<Spinner />) : 
				(<h1 style={{ fontSize: "35px" }}>
					{group ? `${group.name}` : "Gruppen hittades inte"}
				</h1>)
			}

			<div className={style.FilterAndSortContainer}>
				<FilterStatistics />
				<StatisticsPopUp />
			</div>
			{/*here we will show the technique, exercise and color of the belts, number of the exercise 	
				we will use the TechniqueCard component to show the data ..../api/statistics/${groupID}
			*/}

			<div className={style.buttonContainer}>
				<Button width="25%" outlined={true} onClick={() => navigate(-1)}>
				<p>Tillbaka</p>
				</Button>
			</div>
    	</div>
	)

}
