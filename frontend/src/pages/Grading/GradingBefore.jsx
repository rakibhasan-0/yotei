/* eslint-disable indent */
import React, { useState, useEffect, useContext } from "react"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import Button from "../../components/Common/Button/Button"
import styles from "./GradingBefore.module.css"
import { AccountContext } from "../../context"
import AddExaminee from "../../components/Common/AddExaminee/AddExaminee"
import EditableListItem from "../../components/Common/EditableListItem/EditableListItemGrading"
import { LockFill, Link } from "react-bootstrap-icons"

import PopupSmall from "../../components/Common/Popup/PopupSmall"

import { HTTP_STATUS_CODES, canHandleGradings, isAdminUser, scrollToElementWithId } from "../../utils"
import { setError as setErrorToast } from "../../utils"
import EditableInputTextField from "../../components/Common/EditableInputTextField/EditableInputTextField"

/**
 * Page to add examinees and make pairs out of the added examinees for a grading.
 * 
 * @author Team Pomegranate, Team Mango
 * @version 1.0
 * @since 2024-05-02
*/


export default function GradingBefore() {

	const location = useLocation()
	const navigate = useNavigate()
	const { gradingId } = useParams()

	const hasPreviousState = location.key !== "default"
	const [beltColor, setBeltColor] = useState()

	const context = useContext(AccountContext)
	const { token } = context

	const [examinees, setExaminees] = useState([])
	const [pairs, setPair] = useState([])
	const [checkedExamineeIds, setCheckedExamineeIds] = useState([])
	const [redirect, setRedirect] = useState(false)
	const [gradingName, setGradingName] = useState("")
	const containsSpecialChars = str => /[^\w äöåÅÄÖ-]/.test(str)
	const [showPopup, setShowPopup] = useState(false)

	let numberOfPairs = 0


	// this is for the automatically pair creation
	const [lastAddedExaminee, setLastAddedExaminee] = useState({})
	const [automaticallyPairCreation, setAutomaticallyPairCreation] = useState(false)
	
	const [gradingStep, setGradingStep] = useState(1)



	/**
	 * Get method for the grading information. 
	 * @returns JSON response
	 */
	const getGradingProtocol = () => {
		return fetch(`/api/examination/grading/${gradingId}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"token": token
			},
		})
			.then(response => {
				if (!response.ok) {
					throw new Error("Network response was not ok")
				}
				return response.json()
			})
	}

	/**
	 * Update step for the grading process. 
	 * @param {String} grading_data 
	 * @returns status code
	 */
	const updateStep = (grading_data) => {
		delete grading_data.examinees
		grading_data.step = 2

		return fetch("/api/examination/grading", {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				"token": token
			},
			body: JSON.stringify(grading_data),

		})
			.then(response => {
				if (!response.ok) {
					throw new Error("Network response was not ok")
				}
				return response.status

			})
	}

	/**
	 * Validets so the name of tag is not containing any illegal characters 
	 * or if the name is empty or if the name of the tag already exists. 
	 * @param {String} name The name of the tag to be validated. 
	 * @returns Nothing if the name is valid, otherwise, the errortext. 
	 */
	const validateInput = (name) => {
		if (name == "") {
			return "Ange ett namn, det får inte vara tomt"
		}
		else if (containsSpecialChars(name)) {
			return "Endast tecken A-Ö tillåts"
		}
		return ""
	}

	/**
	 * Validets so the name of tag is not containing any illegal characters 
	 * or if the name is empty or if the name of the tag already exists. 
	 * @param {String} name The name of the tag to be validated. 
	 * @returns Nothing if the name is valid, otherwise, the errortext. 
	 */
	const validateGradingName = (name) => {
		if (name.length > 30) {
			return "Namnet får inte vara längre än 30 karaktärer"
		}
		return ""
	}

	/**
	 * Gets todays date
	 * @returns Todays date as a string
	 */
	function getTodaysDate() {
		var today = new Date()
		var dd = String(today.getDate()).padStart(2, "0")
		var mm = String(today.getMonth() + 1).padStart(2, "0")
		var yyyy = today.getFullYear()

		return yyyy + "-" + mm + "-" + dd
	}

	/**
	 * This effects called when you enter the page first time
	 */
	useEffect(() => {

		const fetchData = async () => {
			
			try {
				const [data] = await Promise.all([
					getGrading(token).catch(() => setErrorToast("Kunde inte hämta examinationen. Kontrollera din internetuppkoppling.")),
				])

				// set belt color
				const [beltData] = await Promise.all([
					getBeltColor(data.beltId, token).catch(() => setErrorToast("Kunde inte hämta bältesfärgen. Kontrollera din internetuppkoppling.")),
				])
				setBeltColor("#" + beltData)


				
	
				//const data = await getGrading(token)
				//	.catch(() => setErrorToast("Kunde inte hämta examinationen. Kontrollera din internetuppkoppling."))
	
				// Set the step so we know how to navigate back, what type of route it should choose, in function @handleNavigation
				setGradingStep(data.step)
	
				// check if title is added already
				if (data.title !== "default") {
					setGradingName(data.title)
				}
	
				// check if the grading is comming from the during process. 
				let shouldBeLocked = false
	
				// If the process is during, all examinees that are already added should be locked to modifications
				if (data.step === 2) {
					shouldBeLocked = true
				}
	
				// check if there is any examinees already added
				const exsistingPairs = await getAllPairOfExaminees(token)
					.catch(() => setErrorToast("Kunde inte hämta befintliga par. Kontrollera din internetuppkoppling."))

				// if there exsists pairs in this grading already
				if (exsistingPairs.length !== 0) {
					// convert the pairs to the local format so the pairs can be displayed for the user
					const convertedToLocalPairs = exsistingPairs.map(pair => {
						if (pair.examinee_1 !== null && pair.examinee_2 !== null) {
	
							return [{ id: pair.examinee_1.id, name: pair.examinee_1.name, pairId: pair.pair_id, isLocked: shouldBeLocked },
							{ id: pair.examinee_2.id, name: pair.examinee_2.name, pairId: pair.pair_id, isLocked: shouldBeLocked }]
						} else {
							// if we come in here there is a lonly examinee in a pair.
							return undefined
						}
					}).filter(Boolean)
	
					setPair(convertedToLocalPairs)
	
					const convertedToAloneLocalPairs = exsistingPairs.map(pair => {
						if (pair.examinee_1 !== null && pair.examinee_2 === null) {
	
							//check if we are comming from during process, then this pair should be locked
							if (!shouldBeLocked) {
	
								// remove the pair 
								deletePair(pair.pair_id, token)
	
							}
							return { id: pair.examinee_1.id, name: pair.examinee_1.name, isLocked: shouldBeLocked }
						} else {
							// if we come in here the pair consists of two.
							return undefined
						}
					}).filter(Boolean)
					setExaminees(convertedToAloneLocalPairs)
					
				}
			} catch (error) {	
				console.error("Misslyckades skicka vidare till nästa steg i gradering:", error)
			}
		}
		fetchData()

	}, [])

	useEffect(() => {
		console.log(beltColor)
	}, [beltColor])

	/**
	 * Help function to activate the useEffect function to start the navigation
	 * to the next step in the grading process
	 */
	function startRedirection() {
		setRedirect(true)
	}

	/**
	 * Handle the navigation back to the previous visited route
	 */
	async function handleNavigation() {

		// add lonly examinees as pairs
		await Promise.all(examinees.map(examinee => {
			// check to see if the examinee is locked. If it is locked we have been moving back from during process.
			// the examinee already exsists in the database, skip it
			if (!examinee.isLocked) {
				postPair({ examinee1Id: examinee.id }, token)
					.catch(() => setErrorToast("Kunde inte lägga till paret. Kontrollera din internetuppkoppling."))
			}
		}))

		if (gradingName == "") {
			await editGradingName(gradingId, "Gradering " + gradingId + " | " + getTodaysDate())
		}

		// navigate to the previous visisted site
		if (hasPreviousState && gradingStep !== 2) {
			navigate(-1)
		} else {
			navigate("/grading")
		}
	}

	/**
	 * Effect that are used to navigate to the next step in the grading process
	 */
	useEffect(() => {
		if (redirect != false) {
			try {
				const exec = async () => {
					await Promise.all(examinees.map(examinee => {
						// check to see if the examinee is locked. If it is locked we have been moving back from during process.
						// the examinee already exsists in the database, skip it
						if (!examinee.isLocked) {
							postPair({ examinee1Id: examinee.id }, token)
								.catch(() => setErrorToast("Kunde inte lägga till paret. Kontrollera din internetuppkoppling."))
						}
					}
					))

					const [grading_data] = await Promise.all([
						getGradingProtocol(),
					])
					updateStep(grading_data)

					navigate(`/grading/${gradingId}/2`)
				}

				exec()

			} catch (error) {
				console.error("Misslyckades skicka vidare till nästa steg i gradering:", error)
			}
		}
	}, [redirect])

	/**
	 * Automatically pair creation without checkbox.
	 * This is done by calling the function createPairWithId
	 */
	useEffect(() => {
		if (automaticallyPairCreation) {
			// check if there has not been an examinee added previously
			if (Object.keys(lastAddedExaminee).length !== 0) {
				// check to see if there is a examinee checked
				if (checkedExamineeIds.length > 0) {
					createPairWithId(examinees[examinees.length - 1].id, examinees[examinees.length - 1].name, lastAddedExaminee.id, lastAddedExaminee.name)

					// remove the checkedExamineeId box if it exsists
					const tempCheckedExamineeIds = checkedExamineeIds.filter(id => (id !== examinees[examinees.length - 1].id && id !== lastAddedExaminee.id))
					setCheckedExamineeIds(tempCheckedExamineeIds)

				} else {
					createPairWithId(examinees[examinees.length - 1].id, examinees[examinees.length - 1].name, lastAddedExaminee.id, lastAddedExaminee.name)

				}
				// remove the single examinee from the examinees
				const remainingExaminees = examinees.filter(examinee => (examinee.id !== examinees[examinees.length - 1].id && examinee.id !== lastAddedExaminee.id))
				setExaminees(remainingExaminees)
				setLastAddedExaminee({})
			}
			setAutomaticallyPairCreation(false)
		}
	}, [examinees])

	if(!isAdminUser(context) && !canHandleGradings(context)){
		window.location.replace("/404")
		return null
	}

	/**
	 * Create a new pair in the database and locally,
	 * with the help of the array "checkedExamineeIds" that keeps track of the 
	 * examinees id that are checked at theire respective checkbox
	 */
	async function createPair() {

		let selectedExaminees = checkedExamineeIds.map(id => {
			const examinee = examinees.find(examinee => examinee.id === id)
			return { id: examinee.id, name: examinee.name }
		})

		// check if this examinee was the lastlyAddedExaminee, if so, remove it
		if (selectedExaminees[0].id === lastAddedExaminee.id || selectedExaminees[1].id === lastAddedExaminee.id) {
			// remove it from the lastAddedExaminee
			setLastAddedExaminee({})
		}

		const data = await postPair({ examinee1Id: selectedExaminees[0].id, examinee2Id: selectedExaminees[1].id }, token)
			.then(response => handleResponse(response))
			.catch(() => setErrorToast("Kunde inte lägga till paret. Kontrollera din internetuppkoppling."))

		selectedExaminees = selectedExaminees.map(examinee => {
			return { id: examinee.id, name: examinee.name, pairId: data.examineePairId, isLocked: false }
		})

		setPair([...pairs, selectedExaminees])
	}


	/**
	 * Create a new pair in the database and locally automatically
	 * @param {Integer} examinee_1_id 
	 * @param {String} examinee_1_name 
	 * @param {Integer} examinee_2_id 
	 * @param {String} examinee_2_name 
	 */
	async function createPairWithId(examinee1Id, examinee1Name, examinee2Id, examinee2Name) {
		const data = await postPair({ examinee1Id: examinee1Id, examinee2Id: examinee2Id }, token)
			.then(response => handleResponse(response))
			.catch(() => setErrorToast("Kunde inte lägga till paret. Kontrollera din internetuppkoppling."))

		setPair([...pairs, [
			{ id: examinee1Id, name: examinee1Name, pairId: data.examineePairId, isLocked: false },
			{ id: examinee2Id, name: examinee2Name, pairId: data.examineePairId, isLocked: false }]]
		)
	}

	/**
	 * Remove an pair from the database and also remove the pair from the local array
	 * @param {Integer} examinee1Id 
	 * @param {Integer} examinee2Id 
	 * @param {Integer} pairId 
	 */
	async function removePair(examinee1Id, examinee2Id, pairId) {
		await deletePair(pairId, token)
			.catch(() => setErrorToast("Kunde inte tabort paret. Kontrollera din internetuppkoppling."))

		const newExaminees = pairs.map(pair => {
			if (pair.length === 2) {
				if (pair[0].id === examinee1Id && pair[1].id === examinee2Id) {
					return [{ id: pair[1].id, name: pair[1].name, isLocked: pair[1].isLocked },
					{ id: pair[0].id, name: pair[0].name, isLocked: pair[0].isLocked }]
				}
			}
		}).filter(Boolean)

		const examinee = [...examinees, ...newExaminees[0]]
		setExaminees(examinee)


		const newPairs = pairs.map(pair => {
			if (pair[0].pairId !== pairId) {
				return [{ id: pair[0].id, name: pair[0].name, pairId: pair[0].pairId, isLocked: pair[0].isLocked },
				{ id: pair[1].id, name: pair[1].name, pairId: pair[1].pairId, isLocked: pair[1].isLocked }]
			}
		}).filter(Boolean)
		setPair(newPairs)
	}

	/**
	 * If the examinees checkbox have been clicked or unclicked, update the array according to the checkbox state with the examinees id.
	 * Helps to keep track of the checked examinees
	 * @param {Boolean} isChecked 
	 * @param {Integer} examineeId 
	 */
	function onCheck(isChecked, examineeId) {
		if (isChecked) {
		
			setCheckedExamineeIds([...checkedExamineeIds, examineeId])
		} else {
			setCheckedExamineeIds(checkedExamineeIds.filter((id) => id !== examineeId))
		}
	}


	function resetCheckedExamineesWithCheckbox() {
		const remainingExaminees = examinees.filter(examinee => !checkedExamineeIds.includes(examinee.id))
		setExaminees(remainingExaminees)
		setCheckedExamineeIds([])
	}

	/**
	 * Add an examinee to database and also update the local array with the corresponding data
	 * @param {Map} examinee 
	 */
	async function addExaminee(examinee) {
		const newExaminee = await postExaminee({ name: examinee, gradingId: gradingId }, token)
			.then(response => handleResponse(response))
			.catch(() => setErrorToast("Kunde inte lägga till personen. Kontrollera din internetuppkoppling."))

		// check if there has not been an examinee added previosly
		if (Object.keys(lastAddedExaminee).length === 0) {
			setLastAddedExaminee({ id: newExaminee["examineeId"], name: newExaminee["name"], isLocked: false })
		} else {
			// now there maybe will be an automatically pair created
			setAutomaticallyPairCreation(true)
		}
		// set examinee
		setExaminees([...examinees, { id: newExaminee["examineeId"], name: newExaminee["name"], isLocked: false }])

	}

	/**
	 * Remove and examinee.
	 * @param {Integer} examineeId 
	 */
	async function removeExaminee(examineeId) {
		await deleteExaminee(examineeId, token)
			.catch(() => setErrorToast("Kunde inte tabort personen. Kontrollera din internetuppkoppling."))

    if(lastAddedExaminee.id === examineeId) {
      setLastAddedExaminee({})
    }

		if (checkedExamineeIds.includes(examineeId)) {
			setCheckedExamineeIds(checkedExamineeIds.filter((id) => id !== examineeId))
		}

		setExaminees(examinees.filter((examinee) => examinee.id !== examineeId))
	}

	/**
	 * Change the name of an already exsisting examinee if it has no pair.
	 * This functions call putExaminee so it gets updated in the database aswell
	 * @param {Integer} examineeId 
	 * @param {any} name 
	 * @param {Boolean} isExamineeInPair
	 */
	async function editExaminee(examineeId, name, isExamineeInPair) {
    console.log("hej")
		if (isExamineeInPair) {
			setPair(
				pairs.map((pair) => {
					if (pair[0].id === examineeId) {
						pair[0].name = name
					} else if (pair[1].id === examineeId) {
						pair[1].name = name
					}
					return pair
				})
			)
		} else {
			setExaminees(
				examinees.map((examinee) =>
					examinee.id === examineeId ? { ...examinee, name: name } : examinee
				)
			)
		}

		await putExaminee({ name: name, examineeId: examineeId, gradingId: gradingId }, token)
			.catch(() => setErrorToast("Kunde inte updatera personen. Kontrollera din internetuppkoppling."))
	}

	async function editGradingName(Id, text) {
		setGradingName(text)


		// get the grading in the database
		let data = await getGrading(token)
			.catch(() => setErrorToast("Kunde inte hämta graderingen. Kontrollera din internetuppkoppling."))

		// update the title of the grading and delete examinees so PUT can be used
		data.title = text
		delete data.examinees

		// update the grading in the database
		await putGrading(data, token)
	}

	async function pressedContinue() {
		if (examinees.length <= 0 && pairs.length <= 0) {
			setErrorToast("Kan ej starta gradering utan deltagare")
			return
		}
		if (gradingName == "") {
			await editGradingName(gradingId, "Gradering " + gradingId + " | " + getTodaysDate())
		}
		setShowPopup(true)
	}

	/**
	* Delete an exsisting pair in the database
	* @param {Integer} pairId 
	* @param {any} token 
	* @returns The response code 
	*/
	async function deletePair(pairId, token) {
		const requestOptions = {
			method: "DELETE",
			headers: { "Content-Type": "application/json", "token": token },
		}

		return fetch(`/api/examination/pair/${pairId}`, requestOptions)
			.then(response => { return response })
			.catch(error => { alert(error.message) })
	}

	/**
	 * Add an pair to the database
	 * @param {Map} pair 
	 * @param {any} token 
	 * @returns The response code
	 */
	async function postPair(pair, token) {
		const requestOptions = {
			method: "POST",
			headers: { "Content-Type": "application/json", "token": token },
			body: JSON.stringify(pair)
		}

		return fetch("/api/examination/pair", requestOptions)
			.then(response => { return response })
			.catch(error => { alert(error.message) })
	}

	/**
	 * Delete an examinee from the database
	 * @param {Integer} examineeId 
	 * @param {any} token 
	 * @returns The response code
	 */
	async function deleteExaminee(examineeId, token) {
		const requestOptions = {
			method: "DELETE",
			headers: { "Content-Type": "application/json", "token": token },
		}

		return fetch(`/api/examination/examinee/${examineeId}`, requestOptions)
			.then(response => { return response })
			.catch(error => { alert(error.message) })
	}

	/**
	 * Add an examinee to the database
	 * @param {Map} examinee 
	 * @param {any} token 
	 * @returns The response code
	 */
	async function postExaminee(examinee, token) {
		const requestOptions = {
			method: "POST",
			headers: { "Content-Type": "application/json", "token": token },
			body: JSON.stringify(examinee)
		}

		return fetch("/api/examination/examinee", requestOptions)
			.then(response => { return response })
			.catch(error => { alert(error.message) })
	}


	/**
	   * Update an already exsisting examinee in the database
	   * @param {Map} examinee 
	   * @param {any} token 
	   * @returns The response code
	   */
	async function putExaminee(examinee, token) {
		const requestOptions = {
			method: "PUT",
			headers: { "Content-Type": "application/json", "token": token },
			body: JSON.stringify(examinee)
		}

		return fetch("/api/examination/examinee", requestOptions)
			.then(response => { return response })
			.catch(error => { alert(error.message) })
	}

	/**
	 * Get an already exsisting grading in the database
	 * @param {any} token 
	 * @returns The response code
	 */
	async function getGrading(token) {
		const requestOptions = {
			method: "GET",
			headers: { "Content-Type": "application/json", "token": token },
		}
		return fetch(`/api/examination/grading/${gradingId}`, requestOptions)
			.then(response => { return response.json() })
			.catch(error => { alert(error.message) })
	}

	/**
	 * 
	 * @param {*} token  
	 * @param {*} beltId 
	 * @returns 
	 */
	async function getBeltColor(beltId, token) {
		const requestOptions = {
			method: "GET",
			headers: { "Content-Type": "application/json", "token": token },
		}
		return fetch(`/api/belts/getBeltColor/${beltId}`, requestOptions)
			.then(response => { return response.text() })
	}

	/**
	 * Update an already exsisting grading in the database
	 * @param {Map} grading
	 * @param {any} token 
	 * @returns The response code
	 */
	async function putGrading(grading, token) {
		const requestOptions = {
			method: "PUT",
			headers: { "Content-Type": "application/json", "token": token },
			body: JSON.stringify(grading)
		}
		return fetch("/api/examination/grading", requestOptions)
			.catch(error => { alert(error.message) })
	}

	/**
	 * Get all examinees from a specific grading
	 * @param {any} token 
	 * @returns empty array if response is 404 otherwise return the json object
	 */
	async function getAllPairOfExaminees(token) {
		const requestOptions = {
			method: "GET",
			headers: { "Content-Type": "application/json", "token": token },
		}
		return fetch(`/api/examination/pair/grading/${gradingId}`, requestOptions)
			.then(response => { return response.status === HTTP_STATUS_CODES.NOT_FOUND ? [] : response.json() })
			.catch(error => { alert(error.message) })
	}

	/**
	 * To handle the response from a fetch
	 * @param {Map} response 
	 * @returns Parsed data in a map
	 */
	async function handleResponse(response) {

		if (response.status == HTTP_STATUS_CODES.NOT_ACCEPTABLE) {
			scrollToElementWithId("create-technique-input-name")
			return
		}

		if (response.status == HTTP_STATUS_CODES.UNAUTHORIZED) {
			setErrorToast("Du är inte längre inloggad och kan därför inte lägga till en person")
			return
		}

		if (response.status == HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR) {
			setErrorToast("Det har uppstått ett problem med servern, kunde inte lägga till en person")
			return
		}

		if (response.status != HTTP_STATUS_CODES.SUCCESS && response.status != HTTP_STATUS_CODES.OK) {
			setErrorToast("Det har uppstått ett oväntat problem")
			return
		}

		return await response.json()
	}

	return (
		<div style={{ width: "100%"}}>
			<div style={{ position: "relative", zIndex: "0" }}>
				<EditableInputTextField
					item={gradingName}
					id={"grading-name-text-field"}
					key={"grading-name-text-field"}
					validateInput={validateGradingName}
					onEdit={editGradingName}
					color={beltColor}
				/>
			</div>

			<div className="column">
				{pairs.map((pair, index) => {
					if (pair.length === 2) {
						return (
							<div style={{ display: "flex", width: "100%", justifyContent: "left", position: "relative", alignItems: "center" }} key={"pair-" + pair[0].pairId}>
								<div className={styles.number}>{index + 1}</div>
								<EditableListItem
									key={"first-examinee-pair-" + pair[0].id + "-pairId-" + pair[0].pairId}
									id={pair[1].id}
									item={pair[1].name}
									onEdit={(id, name) => { editExaminee(id, name, true) }}
                  canEdit={Boolean(!pair[1].isLocked)}
									onCheck={onCheck}
									validateInput={validateInput}
									showCheckbox={false}
									checked={false}
								/>
               
                
                {Boolean(!pair[0].isLocked) === true ? 
                <div>
                  <Link
                      key={"close-icon-" + toString(pair[0].id) + toString(pair[1].id) + "-pairId-" + toString(pair[0].pairId)}
                      color="var(--red-primary)"
                      className={styles.link}
                      size="24px"
                      onClick={() => removePair(pair[0].id, pair[1].id, pair[1].pairId)}
                    />
                </div>
                : 
                <div> 
                  <LockFill
                    className={styles.lock}
                    key={"lock-icon-" + toString(pair[0].id) + toString(pair[1].id) + "-pairId-" + toString(pair[0].pairId)}
                    position="static"
										color="var(--red-primary)"
                    size="24px"
                  />  
                </div>}				
                <EditableListItem
									key={"second-examinee-pair-" + pair[1].id + "-pairId-" + pair[1].pairId}
									id={pair[0].id}
									item={pair[0].name}
									onEdit={(id, name) => { editExaminee(id, name, true) }}
                  canEdit={Boolean(!pair[0].isLocked)}
									onCheck={onCheck}
									validateInput={validateInput}
									showCheckbox={false}
									checked={false}
                  showX={false}
								/>
							</div>
						)
					}
				}
				)}
				<div style={{ display: "none" }}>
					{numberOfPairs = pairs.length}
				</div>
			</div>


			<div className="column">
				{examinees.map((examinee, index) => {
					const unlockedExaminees = examinees.filter(exam => !exam.isLocked).length
					let showCheckbox = unlockedExaminees > 1 && !examinee.isLocked

					return (
						<div style={{ display: "flex", width: "100%", justifyContent: "center" }} key={"single-pair-" + examinee.id} id={"single-pair-" + examinee.id}>
							<div className={styles.numberSingle}>{numberOfPairs + index + 1}</div>
							<EditableListItem
								key={"single-examinee-" + examinee.id}
								id={examinee.id}
								item={examinee.name}
								onRemove={removeExaminee}
								onEdit={(id, name) => {editExaminee(id, name, false)}}
                canEdit={Boolean(!examinee.isLocked)}
								onCheck={onCheck}
								validateInput={validateInput}
								showCheckbox={showCheckbox}
								checked={checkedExamineeIds.includes(examinee.id)}
								numberOfCheckedExaminees={checkedExamineeIds.length}
								showTrash={Boolean(!examinee.isLocked)}
								showX={false}
								showLock={!!examinee.isLocked}
							/>

						</div>
					)
				})}
			</div>

			<AddExaminee
				name="add-examinee"
				id="add-examinee"
				key={"add-examinee-before"}
				type="text"
				placeholder="Lägg till ny deltagare"
				required={true}
				hideLength={true}
				showX={false}
				onSubmit={(value) => {
					addExaminee(value)
				}}

			/>
			{checkedExamineeIds.length === 2 && (
				<div className={styles.buttonContainer}>
					<Button
						id="create-pair-button"
						width="100%"
						outlined={true}
						onClick={() => {
							createPair()
							resetCheckedExamineesWithCheckbox()
						}}
					>
						<p>Skapa par</p>
					</Button> </div>)
			}
			<div className={styles.buttonContainer}>
				<Button
					id="back-button"
					width="100%"
					outlined={true}
					onClick={handleNavigation}
				>
					<p>Tillbaka</p>
				</Button>

				<PopupSmall id={"test-popup"} title={"Varning"} isOpen={showPopup} setIsOpen={setShowPopup} direction={startRedirection}>
					<h2>Kontrollera att alla deltagare är tillagda.</h2>
					<h2>Du kan ändra namn på skapade individer i efterhand.</h2>
					<h2>Men det går <span style={{ fontWeight: "bold", fontSize: "18px" }}>inte</span> att redigera par i efterhand.</h2>
					<br></br>
					<h2> När du är redo, fortsätt till graderingsprocessen.</h2>
				</PopupSmall>

				<Button
					id="continue-button"
					width="100%"
					outlined={false}
					onClick={() => pressedContinue()}>
					<p>Fortsätt</p>
				</Button>

			</div>
		</div>
	)
}

