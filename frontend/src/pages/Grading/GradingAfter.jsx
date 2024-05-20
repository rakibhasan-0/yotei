import React, { useState, useContext, useEffect} from "react"
import { useNavigate } from "react-router-dom"
import { AccountContext } from "../../context"
import UserBoxGrading from "../../components/Grading/UserBoxGrading"
import Button from "../../components/Common/Button/Button"
import styles from "./GradingBefore.module.css"
import { Printer } from "react-bootstrap-icons"
import { useParams } from "react-router-dom"

/**
 * Page to show all examinees for a grading after the grading has been completed.
 * 
 * @author Team Pomegranate(ens20lpn)
 * @version 1.0
 * @since 2024-05-15
 */
export default function GradingAfter() {
	const context = useContext(AccountContext)
	const { token} = context
	const { gradingId } = useParams()
	const hasPreviousState = location.key !== "default"

	const navigate = useNavigate()
	const [grading, setGrading] = useState([])
	const [beltInfo, setBeltInfo] = useState({
		belt_name: "",
		color: "" 
	})

	/**
	 * Function to fetch the grading from the backend.
	 * @returns {Promise} The grading data.
	 * @since 2024-05-15
	 */
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
    
	/**
	 * Function to fetch the belts from the backend.
	 * @returns {Promise} The belt data.
	 * @since 2024-05-15
	 */
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

	/**
	 * Function to download the grading as a pdf.
	 */
	const downloadPdf  =   () => {
		// fetch(`api/export/grading/${gradingId}`, {
		//     method: "GET",
		//     headers: { "Authorization": `Bearer ${token}` }  // Assuming the token is a bearer token
		// })
	}

	/**
	 * Function to navigate to the start of the grading.
	 */
	const navigateToGrading = () => {
		navigate("/grading")
    
	}
    
	/**
	 * Function to navigate back to the examination page.
	 */
	const navigateBack = () => {
		if (hasPreviousState) {
			navigate(-1)
		} else {
			navigate("/grading")
		}
	}

	/**
	 * Fetches the grading and belt data when the component mounts.
	 */
	useEffect(() => {
		const fetchData = async () => {
			try {
				const [grading_data, belt_data] = await Promise.all([
					fetchGrading(),
					fetchBelts()
				])
				setGrading(grading_data)
				const matchingBelt = belt_data.find(belt => belt.id === grading_data.beltId)
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
				<div>
					<div>
						<div style={{ backgroundColor: beltInfo.color, borderRadius: "0.3rem", padding: "10px", textAlign: "center", justifyContent: "center", alignItems: "center", display: "flex", position: "relative" }}>
							<span
								style={{ color : beltInfo.color === "#201E1F" ? "white" : "black", fontWeight: "bold" }}
							>{grading.title}</span>
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
