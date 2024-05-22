import React, { useState, useContext, useEffect} from "react"
import { useNavigate } from "react-router-dom"
import { AccountContext } from "../../context"
import UserBoxGrading from "../../components/Grading/UserBoxGrading"
import Button from "../../components/Common/Button/Button"
import styles from "./GradingBefore.module.css"
import { Download } from "react-bootstrap-icons"
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
	const navigate = useNavigate()
	const [grading, setGrading] = useState([])
	const[totalAmountOfTechniques, setTotalAmountOfTechniques] = useState("")
	const[fetchedResult, setFetchedResult] = useState([])
	const [beltInfo, setBeltInfo] = useState({
		belt_name: "",
		color: "" 
	})
	const [fetchedBelt, setFetchedBelt] = useState([])
	const [ isGrading, setIsGrading ] = useState(false)
	const [ isBelt, setIsBelt ] = useState(false)
	const [ isExaminee, setIsExaminee ] = useState(false)

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
	 * Function that fetchs all of the results of each examinee.
	 * @returns {Promise} The belt data.
	 * @since 2024-05-15
	 */
	const fetchExamineeResult = () => {
		return fetch(`/api/examination/examresult/grading/${gradingId}`, {
			method: "GET",
			headers: { "token": token }
		}).then(response => {
			if(!response.ok){
				throw new Error("Network response was not ok")
			}
			return response.json()
		})
	}

	/**
	 * Function that fetchs all of the results of each examinee.
	 * @returns {Promise} The belt data.
	 * @since 2024-05-15
	 */
	const fetchPdf = async () => {
		console.log("Fetching PDF with grading id:", gradingId)
		try {
			const response = await fetch(`/api/examination/exportpdf/${gradingId}`, {
				method: "GET",
				headers: { "token": token }
			})
	
			if (!response.ok) {
				throw new Error("Network response was not ok")
			}
	
			const base64String = await response.text()
			const byteCharacters = atob(base64String) // Decode base64 string
			const byteNumbers = new Array(byteCharacters.length)
			for (let i = 0; i < byteCharacters.length; i++) {
				byteNumbers[i] = byteCharacters.charCodeAt(i)
			}
			const byteArray = new Uint8Array(byteNumbers)
			const blob = new Blob([byteArray], {type: "application/pdf"}) // Create a blob from the byte array
			console.log("Blob created:", blob)
			return blob
		} catch (error) {
			console.error("Error fetching PDF:", error)
			return null
		}
	}
	
	/**
	 * Function that creates a PDF by the result of the examination and downloads it.
	 * @returns {void}
	 */
	const downloadPdf = async () => {
		const pdfBlob = await fetchPdf()
		if (pdfBlob) {
			const url = window.URL.createObjectURL(pdfBlob)
			console.log("URL created:", url)
			const link = document.createElement("a")
			link.href = url
			link.setAttribute("download", "filename.pdf")
			document.body.appendChild(link)
			link.click()
			setTimeout(() => { 
				window.URL.revokeObjectURL(url)
				link.remove()
			}, 100)
			window.URL.revokeObjectURL(url)
			link.remove()
			
		}
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
		navigate(`/grading/${gradingId}/2`)
	}

	/**
	 * Fetches the grading and belt data when the component mounts.
	 */
	useEffect(() => {
		
		const fetchData = async () => {
			try {
				const [grading_data, belt_data, result_data] = await Promise.all([
					fetchGrading(),
					fetchBelts(),
					fetchExamineeResult()
				])
				
				setIsGrading(true)
				setGrading(grading_data)

				setIsBelt(true)
				setFetchedBelt(belt_data)

				setIsExaminee(true)
				setTotalAmountOfTechniques(result_data.totalTechniques)
				setFetchedResult(result_data)

			} catch (error) {
				console.error("There was a problem with the fetch operation:", error)
			}
		}
		fetchData()

	}, [])

	useEffect(() => {
		if(isGrading && isBelt && isExaminee){
			const matchingBelt = fetchedBelt.find(belt => belt.id === grading.beltId)
			if (matchingBelt) {
				setBeltInfo({
					belt_name: matchingBelt.name,
					color: "#" + matchingBelt.color
				})
			}
			setIsBelt(false)
			setIsGrading(false)
			setIsExaminee(false)
		}
	}, [grading, beltInfo, fetchedResult, isGrading, isBelt, isExaminee, fetchedBelt])

	return (
		<div className={styles.container}>
			<div>
				<div className={styles.topContainer}>
					<div className={styles.content}>
						<div style={{ backgroundColor: beltInfo.color, borderRadius: "0.3rem", padding: "0px" }}>
							<h2
								style={{ color : beltInfo.color === "#201E1F" ? "white" : "black" }}
							>{beltInfo.belt_name} bälte</h2>
						</div>
					</div>
					<h1 style={{ fontFamily: "Open Sans", fontSize: "25px", paddingTop: "10px", paddingBottom: "10px" }}>Summering</h1>
				</div>
    
				<div className={styles.scrollableContainer}>
					{fetchedResult.examineeResults && fetchedResult.examineeResults.map((examinee) => (
						<UserBoxGrading
							key={examinee.id}
							id={examinee.id}
							name={examinee.name}
							passedTechniques={examinee.passedTechniques}
							totalAmountOfTechniques={totalAmountOfTechniques}
						/>
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
							<Download size={30} color="white" />
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
