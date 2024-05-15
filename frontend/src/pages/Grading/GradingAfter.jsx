import React, { useState, useContext, useEffect} from "react"
import { useNavigate } from "react-router-dom"
import { AccountContext } from "../../context"
import UserBoxGrading from "../../components/Grading/UserBoxGrading"
import Button from "../../components/Common/Button/Button"
import styles from "./GradingBefore.module.css"
import { Printer } from "react-bootstrap-icons"
import { useParams } from "react-router-dom"

export default function GradingAfter() {
	const context = useContext(AccountContext)
	const { token} = context
	const { gradingId } = useParams()
	const navigate = useNavigate()
	const [grading, setGrading] = useState([])
	const[dateCreated, setDateCreated] = useState("")
	const [beltInfo, setBeltInfo] = useState({
		belt_name: "",
		color: "" 
	})
	//const gradingId = 1

	const updateDate = (dateString) => {
		const date = new Date(dateString)
		const hours = date.getHours()
		const minutes = date.getMinutes()
		const formattedHours = (hours < 10 ? "0" : "") + hours
		const formattedMinutes = (minutes < 10 ? "0" : "") + minutes
		const timeString = formattedHours + ":" + formattedMinutes
		setDateCreated(timeString)
	}

	const fetchGrading = () => {
		return fetch(`/api/examination/grading/${gradingId}`, {
			method: "GET",
			headers: { "token": token }
		})
			.then(response => {
				if (!response.ok) {
					throw new Error("Network response was not ok")
				}
				return response.json()
			})
	}
    
	const fetchBelts = () => {
		return fetch("/api/belts/all", {
			method: "GET",
			headers: { "token": token }
		})
			.then(response => {
				if (!response.ok) {
					throw new Error("Network response was not ok")
				}
				return response.json()
			})
	}

	const downloadPdf  =   () => {
		// fetch(`api/export/grading/${gradingId}`, {
		//     method: "GET",
		//     headers: { "Authorization": `Bearer ${token}` }  // Assuming the token is a bearer token
		// })
	}
    
	const navigateToGrading = () => {
		navigate("/grading")
    
	}
    
	const navigateBack = () => {
		navigate(`/grading/${gradingId}/2`)
	}

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [grading_data, belt_data] = await Promise.all([
					fetchGrading(),
					fetchBelts()
				])
				setGrading(grading_data)
				updateDate(grading_data.created_at)
				const matchingBelt = belt_data.find(belt => belt.id === grading_data.belt_id)
				if (matchingBelt) {
					setBeltInfo({
						belt_name: matchingBelt.name,
						color: "#" + matchingBelt.color
					})
				}
			} catch (error) {
				console.error("There was a problem with the fetch operation:", error)
			}
		}
		fetchData()
	}, [])

	return (
		<div className={styles.container}>
			<div>
				<div className={styles.topContainer}>
					<div className={styles.content}>
						<div style={{ backgroundColor: beltInfo.color, borderRadius: "0.3rem", padding: "0px" }}>
							<h2
								style={{ color : beltInfo.color === "#201E1F" ? "white" : "black" }}
							>{beltInfo.belt_name} bälte {dateCreated}</h2>
						</div>
					</div>
					<h1 style={{ fontFamily: "Open Sans", fontSize: "25px", paddingTop: "10px", paddingBottom: "10px" }}>Summering</h1>
				</div>
    
				<div className={styles.scrollableContainer}>
					{grading.examinees && grading.examinees.map((examinee) => (
						<UserBoxGrading
							key={examinee.examinee_id}
							id={examinee.examinee_id}
							name={examinee.name} />
					))}
				</div>
    
				<div className={styles.bottomContainer}>
					<div style={{ display: "flex", justifyContent: "flex-end", paddingTop: "10px" }}>
						<Button
							style={{
								backgroundColor: "#FFD700",
								borderRadius: "0.1rem",
								padding: "0px",
								height: "50px"
							}}
							width={"60px"}
							onClick={downloadPdf}
						>
							<Printer size={30} color="white" />
						</Button>
					</div>
    
					<div className={styles.buttonContainer} style={{ paddingTop: "10px" }}>
						<Button
							width="100%"
							outlined={true}
							onClick={navigateBack}
						>
							<p>Tillbaka</p>
						</Button>
						<Button
							width="100%"
							onClick={navigateToGrading}
						>
							<p>Spara och avsluta</p>
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}
