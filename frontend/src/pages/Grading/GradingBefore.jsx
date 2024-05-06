import { useState, useEffect, useContext } from "react"
import { Link, useLocation, useNavigate} from "react-router-dom"
import Button from "../../components/Common/Button/Button"
import style from "./GradingCreate.module.css"
import styles from "./GradingBefore.module.css"
import Spinner from "../../components/Common/Spinner/Spinner"
import { AccountContext } from "../../context"
import { Draggable } from "react-drag-reorder"
import AddExaminee from "../../components/Common/AddExaminee/AddExaminee"
import Examinee from "../../components/Common/AddExaminee/Examinee"


/**
 * The grading create page.
 * Creates a new grading.
 * 
 * @author Team Pomegranate
 * @version 1.0
 * @since 2024-05-02
 */
export default function GradingCreate() {

	const context = useContext(AccountContext)
	const { token, userId } = context

	const [examinees, setExaminees] = useState([])
	const navigate = useNavigate()

  function addExaminee(examinee) {
    const examineeId = examinees.length + 1
    setExaminees([...examinees, { id: examineeId, name: examinee }]);
    console.log(examinees)
  }

  function removeExaminee(examineeId) {
    setExaminees(examinees.filter((examinee) => examinee.id !== examineeId));
  }

  function editExaminee(examineeId, name) {
    setExaminees(
      examinees.map((examinee) =>
        examinee.id === examineeId ? { ...examinee, name: name } : examinee
      )
    );
  }

	return (
		<div>
			<div className = {style.beltButtonStyle}> 
				<div style={{ backgroundColor: "#FFD700", borderRadius: "0.3rem", padding: "0px" }}>
					<h2>KIHON WAZA</h2>
				</div>
			</div>

			<div className="column">
        {examinees.map((innerExaminee, innerIdx) => (
          <Examinee
            key={innerExaminee.id}
            id={innerExaminee.id}
            item={innerExaminee.name}
            onRemove={removeExaminee}
            onEdit={editExaminee}
          />
        ))}
      </div>

      <AddExaminee
      name="add-examinee"
      id="add-examinee"
      type="text"
      placeholder="Lägg till ny deltagare"
      required={true}
      hideLength={true}
      onSubmit={(value) => addExaminee(value)}

      />

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
						addExerciseAndTags()
					}}
				>
					<p>Forsätt</p>
				</Button>
			</div>
		</div>
	)
}