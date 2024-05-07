/* eslint-disable indent */
import { useState, useEffect, useContext } from "react"
import { Link, useLocation, useNavigate, useParams} from "react-router-dom"
import Button from "../../components/Common/Button/Button"
import style from "./GradingCreate.module.css"
import styles from "./GradingBefore.module.css"
import Spinner from "../../components/Common/Spinner/Spinner"
import { AccountContext } from "../../context"
//import { Draggable } from "react-drag-reorder"
import AddExaminee from "../../components/Common/AddExaminee/AddExaminee"
import Examinee from "../../components/Common/AddExaminee/Examinee"
import { Display, Trash } from "react-bootstrap-icons"

import { HTTP_STATUS_CODES, scrollToElementWithId } from "../../utils"
import {setError as setErrorToast, setSuccess as setSuccessToast} from "../../utils"
import ConfirmPopup from "../../components/Common/ConfirmPopup/ConfirmPopup"

/**
 * The grading create page.
 * Creates a new grading.
 * 
 * @author Team Pomegranate
 * @version 1.0
 * @since 2024-05-02
 */
export default function GradingCreate({id}) {

  const { gradingId } = useParams()
	const context = useContext(AccountContext)
	const { token, userId } = context

	const [examinees, setExaminees] = useState([])
	const navigate = useNavigate()
  
  const [pairs, setPair] = useState([[]]) 
  const [checkedExamineeIds, setCheckedExamineeIds] = useState([])

  const [techniqueNameErr, setTechniqueNameErr] = useState("")


  function createPair() {
    setPair([...pairs, checkedExamineeIds])
    setCheckedExamineeIds([])
  }

  function onCheck(isChecked, examineeId) {
    if (isChecked) {
      setCheckedExamineeIds([...checkedExamineeIds, examineeId])
    } else {
      setCheckedExamineeIds(checkedExamineeIds.filter((id) => id !== examineeId))
    }
  }

  async function addExaminee(examinee) {
    const data = await postExaminee({ name: examinee, grading_id: gradingId }, token)
			.then(response => handleResponse(response, examinee))
			.catch(() => setErrorToast("Kunde inte lägga till personen. Kontrollera din internetuppkoppling."))
    
    setExaminees([...examinees, { id: data["id"], name: data["name"] }])
  }

  function removeExaminee(examineeId) {
    setCheckedExamineeIds(checkedExamineeIds.filter((id) => id !== examineeId))
    setExaminees(examinees.filter((examinee) => examinee.id !== examineeId))
  }

  function editExaminee(examineeId, name) {
    setExaminees(
      examinees.map((examinee) =>
        examinee.id === examineeId ? { ...examinee, name: name } : examinee
      )
    )
  }

	return (
		<div>
			<div> 
				<div style={{ backgroundColor: "#FFD700", borderRadius: "0.3rem", padding: "0px" }}>
					<h2>KIHON WAZA</h2>
				</div>
			</div>


      <div className="column">
        {pairs.map(([p1, p2], index) => {
          {
            return (
              <div style={{display: "flex", width: "100%", justifyContent: "center"}}> 
                <Examinee
                  pairNumber={index}
                  key={p1}
                  id={p1}
                  item={"då"}
                  onRemove={removeExaminee}
                  onEdit={editExaminee}
                  onCheck={onCheck}
                />
                <div style={{width: "10px"}}></div>
                <Examinee
                  pairNumber={index}
                  key={p2}
                  id={p2}
                  item={"hej"}
                  onRemove={removeExaminee}
                  onEdit={editExaminee}
                  onCheck={onCheck}
                />
                <Trash
                  size="64px"
                  color="var(--red-primary)"
                  className={styles.trashcan}
                  onClick={() => setConfirmationOpen(true)}
                />
              </div>
            );}
        })}
      </div>


			<div className="column">
        {examinees.map((innerExaminee, index) => {
          // Check if the examinee's id is in any pair
          const isInPair = pairs.some(pair => pair.includes(innerExaminee.id))

          // Render the Examinee component only if it's not in any pair
          if (!isInPair) {
            return (
              <Examinee
                pairNumber={index}
                key={innerExaminee.id}
                id={innerExaminee.id}
                item={innerExaminee.name}
                onRemove={removeExaminee}
                onEdit={editExaminee}
                onCheck={onCheck}
                showCheckbox={true}
              />
            )
          }
          // Return null if the examinee is already in a pair
          return null
        })}
      </div>


      <AddExaminee
      name="add-examinee"
      id="add-examinee"
      type="text"
      placeholder="Lägg till ny deltagare"
      required={true}
      hideLength={true}
      onSubmit={(value) => {
        setTechniqueNameErr(null)
        addExaminee(value)}}

      />
      {checkedExamineeIds.length === 2 && ( 
      <div className={styles.buttonContainer}>
				<Button
					width="100%"
					outlined={true}
					onClick={createPair}
				>
					<p>Skapa par</p>
				</Button> </div>)  
      }
			<div className={styles.buttonContainer}>
				<Button
					width="100%"
					outlined={true}
					onClick={() => {
						navigate("/grading/create")
					}}
				>
					<p>Tillbaka</p>
				</Button>
				<Button
					width="100%"
					onClick={() => {
						//addExerciseAndTags()
						navigate("/grading/GradingAfter")
					}}
				>
					<p>Forsätt</p>
				</Button>
			</div>
		</div>
	)
}


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

async function handleResponse(response, name) {

		if (response.status == HTTP_STATUS_CODES.NOT_ACCEPTABLE) {
			setTechniqueNameErr("En person måste ha ett namn")
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

		setSuccessToast(name + " är tillagd")

		return await response.json()
	}