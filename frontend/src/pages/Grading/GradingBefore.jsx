/* eslint-disable indent */
import React, { useState, useEffect, useContext } from "react"
import { useNavigate, useParams, useLocation} from "react-router-dom"
import Button from "../../components/Common/Button/Button"
import styles from "./GradingBefore.module.css"
import { AccountContext } from "../../context"
import AddExaminee from "../../components/Common/AddExaminee/AddExaminee"
import Examinee from "../../components/Common/AddExaminee/Examinee"
import { Trash } from "react-bootstrap-icons"

import { HTTP_STATUS_CODES, scrollToElementWithId } from "../../utils"
import {setError as setErrorToast, setSuccess as setSuccessToast} from "../../utils"

/**
 * The grading create page.
 * Creates a new grading.
 * 
 * @author Team Pomegranate
 * @version 1.0
 * @since 2024-05-02
 */

export default function GradingBefore({id}) {
	
	const location = useLocation()
  const state = location.state
  const hasPreviousState = location.key !== "default"

	const { gradingId } = useParams()
	const context = useContext(AccountContext)
	const { token, userId } = context

	const [examinees, setExaminees] = useState([])
	const navigate = useNavigate()

	const [pairs, setPair] = useState([]) 
	const [checkedExamineeIds, setCheckedExamineeIds] = useState([])
  const [redirect, setRedirect] = useState(false)

  let numberOfPairs = 0

  function startRedirection() {
    setRedirect(true)
  }

  function handleNavigation() {
    if (hasPreviousState) {
      navigate(-1)
    } else {
      navigate("/grading")
    }
  }

  useEffect(() => {
    if (redirect != false) {
      try {
        const exec = async () => {
          await Promise.all(examinees.map(examinee => {
                postPair({examinee_1_id: examinee.id}, token)
                  .catch(() => setErrorToast("Kunde inte lägga till paret. Kontrollera din internetuppkoppling."))
          }))
          navigate(`/grading/${gradingId}/2`)
        };

        exec();
        
      } catch (error) {
        console.error("Misslyckades skicka vidare till nästa steg i gradering:", error)
      }
    }
  }, [redirect])

	async function createPair() {
			
		let selectedExaminees = checkedExamineeIds.map(id => {
				const examinee = examinees.find(examinee => examinee.id === id)
				return { id: examinee.id, name: examinee.name }
		})

		const data = await postPair({examinee_1_id: selectedExaminees[0].id, examinee_2_id: selectedExaminees[1].id}, token)
			.then(response => handleResponse(response))
			.catch(() => setErrorToast("Kunde inte lägga till paret. Kontrollera din internetuppkoppling."))


		selectedExaminees = selectedExaminees.map(examinee => {
			return {id: examinee.id, name: examinee.name, pairId: data.examinee_pair_id}
		})

		const remainingExaminees = examinees.filter(examinee => !checkedExamineeIds.includes(examinee.id))
		setExaminees(remainingExaminees)
		setPair([...pairs, selectedExaminees])
		setCheckedExamineeIds([])

	}

	async function removePair(examinee1Id, examinee2Id, pairId) {
		const data = await deletePair(pairId, token)
			.catch(() => setErrorToast("Kunde inte tabort paret. Kontrollera din internetuppkoppling."))

		const newExaminees = pairs.map(pair => {
			if(pair.length === 2) {
				if (pair[0].id === examinee1Id && pair[1].id === examinee2Id) {
					return [{ id: pair[0].id, name: pair[0].name },
									{ id: pair[1].id, name: pair[1].name }]
				}
			}
		}).filter(Boolean)

		const examinee = [...examinees, ...newExaminees[0]]
		setExaminees(examinee)


		const newPairs = pairs.map(pair => {
			if(pair[0].pairId !== pairId) {
				return [{id: pair[0].id, name: pair[0].name, pairId: pair[0].pairId},
								{id: pair[1].id, name: pair[1].name, pairId: pair[1].pairId}]
			}
		}).filter(Boolean)
		setPair(newPairs)
	}

	function onCheck(isChecked, examineeId) {
		if (isChecked) {
			setCheckedExamineeIds([...checkedExamineeIds, examineeId])
		} else {
			setCheckedExamineeIds(checkedExamineeIds.filter((id) => id !== examineeId))
		}
	}

  /**
   * 
   * @param {*} examinee 
   */
	async function addExaminee(examinee) {
		const data = await postExaminee({ name: examinee, grading_id: gradingId }, token)
			.then(response => handleResponse(response))
			.catch(() => setErrorToast("Kunde inte lägga till personen. Kontrollera din internetuppkoppling."))
		
		setExaminees([...examinees, { id: data["examinee_id"], name: data["name"] }])
	}

  /**
   * Remove and examinee.
   * @param {Integer} examineeId 
   */
	async function removeExaminee(examineeId) {
		const data = await deleteExaminee(examineeId, token)
			.catch(() => setErrorToast("Kunde inte tabort personen. Kontrollera din internetuppkoppling."))
		
    if(checkedExamineeIds.includes(examineeId)) {
      setCheckedExamineeIds(checkedExamineeIds.filter((id) => id !== examineeId))
    }

		setExaminees(examinees.filter((examinee) => examinee.id !== examineeId))
	}

  /**
   * Remove an examinee pair. This functions removes it from the database and also locally in the array.
   * @param {Integer} examineeId 
   */
	async function removeExamineeInPair(examineeId) {

		let pairId

    // gets the pair id. this can be done by checking both examinee in the same pair
		pairs.map(pair => {
			if(pair[0].id === examineeId || pair[1].id === examineeId) {
				pairId = pair[0].pairId
		}})

    // gets the pair that will be modified
		let modifyPair = pairs.find(pair => {
			if (pair[0].pairId === pairId) {
				return pair[0].id === examineeId ? {id: pair[1].id, name: pair[1].name} : {id: pair[0].id, name: pair[0].name}
			}
		})

    // saves the remaining examinee from the deleted pair
		modifyPair = modifyPair.map(examinee => {
			if (examinee.id !== examineeId) {
				return examinee
			}
		}).filter(Boolean)

		await deletePair(pairId, token)
			.catch(() => setErrorToast("Kunde inte tabort paret. Kontrollera din internetuppkoppling."))


		await deleteExaminee(examineeId, token)
			.catch(() => setErrorToast("Kunde inte tabort personen. Kontrollera din internetuppkoppling."))
		
    // create a new array with the remaining pairs
		const newPairs = pairs.map(pair => {
			if(pair[0].id !== examineeId && pair[1].id !== examineeId) {
				return [{id: pair[0].id, name: pair[0].name, pairId: pair[0].pairId},
								{id: pair[1].id, name: pair[1].name, pairId: pair[1].pairId}]
			}
		}).filter(Boolean)

		setPair(newPairs)
		setExaminees([...examinees, modifyPair[0]])

	}
  
  /**
   * Change the name of an already exsisting examinee.
   * This functions call putExaminee so it gets updated in the database aswell
   * @param {Integer} examineeId 
   * @param {any} name 
   */
	async function editExaminee(examineeId, name) {
		setExaminees(
			examinees.map((examinee) =>
				examinee.id === examineeId ? { ...examinee, name: name } : examinee
			)
		)
		
		const data = await putExaminee({name: name, examinee_id: examineeId, grading_id: gradingId}, token)
			.catch(() => setErrorToast("Kunde inte updatera personen. Kontrollera din internetuppkoppling."))
	}

	return (
		<div>
			<div> 
				<div style={{ backgroundColor: "yellow", borderRadius: "0.3rem", padding: "0px" }}>
					<h2>KIHON WAZA</h2>
				</div>
			</div>

			<div className="column">
				{pairs.map((pair, index) => {
						if (pair.length === 2) {
							return (
							<div style={{display: "flex", width: "100%", justifyContent: "center"}} key={pair[0].pairId}> 
                <div className={styles.number}>{index+1}</div>
								<Examinee
                  key={pair[0].id}
									pairNumber={index}
									id={pair[0].id}
									item={pair[0].name}
									onRemove={removeExamineeInPair}
									onEdit={editExaminee}
									onCheck={onCheck}
								/>
								<div style={{width: "10px"}}></div>
								<Examinee
                  key={pair[1].id}
									pairNumber={index}
									id={pair[1].id}
									item={pair[1].name}
									onRemove={removeExamineeInPair}
									onEdit={editExaminee}
									onCheck={onCheck}
								/>
								<Trash
                  key={toString(pair[0].id) + toString(pair[1].id)}
									size="64px"
									color="var(--red-primary)"
									className={styles.trashcan}
									onClick={() => removePair(pair[0].id, pair[1].id, pair[1].pairId)}
								/>
							</div>
						)}
						}
					)}
          <div style={{display: "none"}}>
            {numberOfPairs = pairs.length}
          </div>
			</div>
				

			<div className="column">
				{examinees.map((examinee, index) => {
						return (
              <div style={{display: "flex", width: "100%", justifyContent: "center"}} key={"single-pair-" + toString(examinee.id)} id={"single-pair-" + toString(examinee.id)}>
                <div className={styles.number}>{numberOfPairs + index + 1}</div>
                <Examinee
                  key={examinee.id}
                  pairNumber={index}
                  id={examinee.id}
                  item={examinee.name}
                  onRemove={removeExaminee}
                  onEdit={editExaminee}
                  onCheck={onCheck}
                  showCheckbox={true}
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
			onSubmit={(value) => {
				addExaminee(value)}}

			/>
			{checkedExamineeIds.length === 2 && ( 
			<div className={styles.buttonContainer}>
				<Button
          id="create-pair-button"
					width="100%"
					outlined={true}
					onClick={createPair}
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
				<Button
          id="continue-button"
					width="100%"
					onClick={startRedirection}
				>
					<p>Forsätt</p>
				</Button>
			</div>
		</div>
	)
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