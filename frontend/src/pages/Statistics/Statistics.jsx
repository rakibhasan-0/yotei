import React, { useState, useEffect, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { AccountContext } from "../../context"
import Spinner from "../../components/Common/Spinner/Spinner"
import style from "./Statistics.module.css"
import Button from "../../components/Common/Button/Button"
import TechniqueCard from "../../components/Common/Technique/TechniqueCard/TechniqueCard"
import StatisticsPopUp from "./StatisticsPopUp"
import FilterStatistics from "./FilterStatistics"

/**
 * 
 *  The work is on progress for the statistics page.
 * 
 */

export default function Statistics() {

	const navigate = useNavigate()
	const { groupID } = useParams()
	const [groupName, setGroupName] = useState(null)
	const [loading, setLoading] = useState(true)
	const { token } = useContext(AccountContext)
	const [groupActivities, setGroupActivities] = useState([])
	const [selectedBelts, setSelectedBelts] = useState([])

	//console.log("From Dates:", dateFormatter(twoYearsAfterFromNow))


	const activities = selectedBelts.length > 0 ? groupActivities.filter((activity) =>
		activity.beltColors.some((belt) =>
			selectedBelts.some(
				(selectedBelt) => selectedBelt.name === belt.belt_name
			)))
		: groupActivities


	function handleBeltToggle(isSelected, belt) {
  		setSelectedBelts(prevSelected => {
			if (isSelected) {
				return [...prevSelected, belt]
			} else {
				return prevSelected.filter(b => b.id !== belt.id)
			}
		})
	}

	function onBeltsClear() {
		setSelectedBelts([])
	}
	

	const [filter, setFilter] = useState({
		showExercises: false,
		showKihon: false,
		startDate: null,
		endDate: null, // by deafult it will be today's date.
	})


	function dateFormatter(date) {
		const dateInput = new Date(date);
		console.log("DateInput:___", dateInput);
		const year = dateInput.getFullYear();
		const month = String(dateInput.getMonth() + 1).padStart(2, "0");
		const day = String(dateInput.getDate()).padStart(2, "0");
		return `${year}-${month}-${day}`;
	}


	useEffect(() => {
		async function fetchGroupActivitiesData() {
			
			//console.log("Filter: startDate", filter.startDate)
			//console.log("Filter: endDate", filter.endDate)
			console.log("Selected belts tags: ", selectedBelts)
			console.log("Group activities: ", groupActivities)

			const param = new URLSearchParams({
				kihon: filter.showKihon ? "true" : "false",
				showexercises: filter.showExercises ? "true" : "false",
				startdate: filter.startDate? filter.startDate : "",
				enddate: filter.endDate? filter.endDate : ""
			})

			console.log("Param:", param.toString())

			try {
				setLoading(true)
				const responseFromGroupNameAPI= await fetch("/api/plan/all", { headers: { token } })
				const responseFromGroupDetailsAPI = await fetch(`/api/statistics/${groupID}?${param}`, {headers: { token }})

				if (!responseFromGroupDetailsAPI.ok || !responseFromGroupNameAPI.ok) {
					throw new Error("Failed to fetch group data")
				}

				const data = await responseFromGroupDetailsAPI.json()
				const groups = await responseFromGroupNameAPI.json()
				
				const name = groups.find((group) => group.id === parseInt(groupID))

				setGroupName(name)

				//console.log("Group Name:", name)
				setGroupActivities(data.activities)
				//console.log("Group Activities:", data)
			}
			catch (error) {
				console.error("Fetching error:", error) // proper error handling will be added later
			}
			finally {
				setLoading(false);
			}
		}
	
		fetchGroupActivitiesData()

	}, [groupID, token, filter])


	function handleDateChanges(variableName, value) {

		const newDate = value
		//console.log("New Date Selected:", newDate); 
		const isValidDate = /^[12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(value) && !isNaN(new Date(value).getTime());

		//console.log("VariableName:", variableName)
		//console.log("Value:", value)
	
		const startDate = new Date(filter.startDate)
		//console.log("Start Date:", startDate)

		const endDate = new Date(filter.endDate)
		//console.log("End Date:", endDate)

		if(variableName === "from") {
			console.log("hello from is clicked")
			
			if(isValidDate) {
				setFilter(newDate > endDate ? {startDate: dateFormatter(value), endDate: dateFormatter(value)} :
												{...filter, startDate: dateFormatter(value)})
			}
			// if the value is not correct YYYY-MM-DD format then it will not update the state			
		}

		if(variableName === "to") {
			console.log("hello to is clicked")
			if(isValidDate){
				setFilter(newDate < startDate ? {startDate: dateFormatter(value), endDate: dateFormatter(value)} : 
												{...filter, endDate: dateFormatter(value)})	
			}

		}

	}


	function handleChanges(variableName, value) {
		setFilter({ ...filter, [variableName]: value })
	}

	return (
		<div>
			<title>Statistik</title>
			{loading ? (
				<Spinner />
			) : (
				<h1 style={{ fontSize: "35px" }}>
				{groupName ? `${groupName.name}` : "Gruppen hittades inte"}
				</h1>
			)}

			<div className={style.FilterAndSortContainer}>
				<FilterStatistics
				onToggleExercise={(value) => handleChanges("showExercises", value)}
				onToggleKihon={(value) => handleChanges("showKihon", value)}
				onDateChanges={handleDateChanges}
				date={filter}
				onToggleBelts={handleBeltToggle}
				onClearBelts={onBeltsClear}
				belts={selectedBelts}
				/>

				<StatisticsPopUp />
			</div>

				<div className="activitiesContainer">
					{
						activities.map((activity, index) => (
							<TechniqueCard key={index} technique={activity} checkBox={false} id={activity.activity_id} />
						))
					}

				</div>

			<div className={style.buttonContainer}>
				<Button width="25%" outlined={true} onClick={() => navigate(-1)}>
				<p>Tillbaka</p>
				</Button>
			</div>
		</div>
  	)
}
