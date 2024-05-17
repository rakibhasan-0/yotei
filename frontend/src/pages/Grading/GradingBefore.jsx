/* eslint-disable indent */
import React, { useState, useEffect, useContext } from "react"
import { useNavigate, useParams, useLocation} from "react-router-dom"
import Button from "../../components/Common/Button/Button"
import styles from "./GradingBefore.module.css"
import { AccountContext } from "../../context"
import AddExaminee from "../../components/Common/AddExaminee/AddExaminee"
import EditableListItem from "../../components/Common/EditableListItem/EditableListItem"
import { X as CloseIcon } from "react-bootstrap-icons"

import { HTTP_STATUS_CODES, scrollToElementWithId } from "../../utils"
import {setError as setErrorToast } from "../../utils"

/**
 * Page to add examinees and make pairs out of the added examinees for a grading.
 * 
 * @author Team Pomegranate
 * @version 1.0
 * @since 2024-05-02
 */


export default function GradingBefore() {
	
	const location = useLocation()
  const navigate = useNavigate()
	const { gradingId } = useParams()
  
  const hasPreviousState = location.key !== "default"
	const { ColorParam } = location.state ? location.state : {}
  
	const context = useContext(AccountContext)
	const { token } = context

	const [examinees, setExaminees] = useState([])
	const [pairs, setPair] = useState([]) 
	const [checkedExamineeIds, setCheckedExamineeIds] = useState([])
  const [redirect, setRedirect] = useState(false)
  const containsSpecialChars = str => /[^\w äöåÅÄÖ-]/.test(str)

  let numberOfPairs = 0

  // this is for the automatically pair creation
  const [lastAddedExaminee, setLastAddedExaminee] = useState({})
  const [automaticallyPairCreation, setAutomaticallyPairCreation] = useState(false)


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
   * Help function to activate the useEffect function to start the navigation
   * to the next step in the grading process
   */
  function startRedirection() {
    setRedirect(true)
  }

  /**
   * Handle the navigation back to the previous visited route
   */
  function handleNavigation() {
    if (hasPreviousState) {
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
                postPair({examinee_1_id: examinee.id}, token)
                  .catch(() => setErrorToast("Kunde inte lägga till paret. Kontrollera din internetuppkoppling."))
          }))
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
    if(automaticallyPairCreation) {
      // check if there has not been an examinee added previously
      if(Object.keys(lastAddedExaminee).length !== 0) {
        // check to see if there is a examinee checked
        if(checkedExamineeIds.length > 0) {
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

		const data = await postPair({examinee_1_id: selectedExaminees[0].id, examinee_2_id: selectedExaminees[1].id}, token)
			.then(response => handleResponse(response))
			.catch(() => setErrorToast("Kunde inte lägga till paret. Kontrollera din internetuppkoppling."))


		selectedExaminees = selectedExaminees.map(examinee => {
			return {id: examinee.id, name: examinee.name, pairId: data.examinee_pair_id}
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
	async function createPairWithId(examinee_1_id, examinee_1_name, examinee_2_id, examinee_2_name) {
		const data = await postPair({examinee_1_id: examinee_1_id, examinee_2_id: examinee_2_id}, token)
			.then(response => handleResponse(response))
			.catch(() => setErrorToast("Kunde inte lägga till paret. Kontrollera din internetuppkoppling."))

		setPair([...pairs, [
      {id: examinee_1_id, name: examinee_1_name, pairId: data.examinee_pair_id}, 
      {id: examinee_2_id, name: examinee_2_name, pairId: data.examinee_pair_id}]]
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
		const newExaminee = await postExaminee({ name: examinee, grading_id: gradingId }, token)
			.then(response => handleResponse(response))
			.catch(() => setErrorToast("Kunde inte lägga till personen. Kontrollera din internetuppkoppling."))
		
    // check if there has not been an examinee added previosly
    if(Object.keys(lastAddedExaminee).length === 0) {
      setLastAddedExaminee({ id: newExaminee["examinee_id"], name: newExaminee["name"]})
    } else {
      // now there maybe will be an automatically pair created
      setAutomaticallyPairCreation(true)
    }
    // set examinee
    setExaminees([...examinees, { id: newExaminee["examinee_id"], name: newExaminee["name"] }])

	}

  /**
   * Remove and examinee.
   * @param {Integer} examineeId 
   */
	async function removeExaminee(examineeId) {
		await deleteExaminee(examineeId, token)
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
   * Change the name of an already exsisting examinee if it has no pair.
   * This functions call putExaminee so it gets updated in the database aswell
   * @param {Integer} examineeId 
   * @param {any} name 
   * @param {Boolean} isExamineeInPair
   */
	async function editExaminee(examineeId, name, isExamineeInPair) {

    if(isExamineeInPair) {
      setPair(
        pairs.map((pair) => {
          if(pair[0].id === examineeId) {
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
		
		await putExaminee({name: name, examinee_id: examineeId, grading_id: gradingId}, token)
			.catch(() => setErrorToast("Kunde inte updatera personen. Kontrollera din internetuppkoppling."))
	}

	return (
		<div>
			<div> 
				<div style={{ backgroundColor: ColorParam, borderRadius: "0.3rem", padding: "0px" }}>
					<h2>KIHON WAZA</h2>
				</div>
			</div>

			<div className="column">
				{pairs.map((pair, index) => {
						if (pair.length === 2) {
							return (
							<div style={{display: "flex", width: "100%", justifyContent: "center"}} key={pair[0].pairId}> 
                <div className={styles.number}>{index+1}</div>
								<EditableListItem
                  key={pair[0].id}
									id={pair[0].id}
									item={pair[0].name}
									onRemove={removeExamineeInPair}
									onEdit={(id, name) => {editExaminee(id, name, true)}}
									onCheck={onCheck}
                  validateInput={validateInput}
                  showCheckbox={false}
                  checked={false}
								/>
								<div style={{width: "10px"}}></div>
								<EditableListItem
                  key={pair[1].id}
									id={pair[1].id}
									item={pair[1].name}
									onRemove={removeExamineeInPair}
									onEdit={(id, name) => {editExaminee(id, name, true)}}
									onCheck={onCheck}
                  validateInput={validateInput}
                  showCheckbox={false}
                  checked={false}
								/>
								<CloseIcon
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
              <div style={{display: "flex", width: "100%", justifyContent: "center"}} key={"single-pair-" + examinee.id} id={"single-pair-" + examinee.id}>
                <div className={styles.number}>{numberOfPairs + index + 1}</div>
                <EditableListItem
                  key={examinee.id}
                  id={examinee.id}
                  item={examinee.name}
                  onRemove={removeExaminee}
                  onEdit={(id, name) => {editExaminee(id, name, false)}}
                  onCheck={onCheck}
                  validateInput={validateInput}
                  showCheckbox={true}
                  checked={false}
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
}

