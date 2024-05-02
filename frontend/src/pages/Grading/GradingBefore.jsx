import { useState, useEffect, useContext } from "react"
import { Link, useLocation, useNavigate} from "react-router-dom"
import Button from "../../components/Common/Button/Button"
import style from "./GradingCreate.module.css"
import styles from "./GradingBefore.module.css"
import Spinner from "../../components/Common/Spinner/Spinner"
import { AccountContext } from "../../context"

/**
 * The grading create page.
 * Creates a new grading.
 * 
 * @author Team Pomegranate
 * @version 1.0
 * @since 2024-05-02
 */
export default function GradingCreate() {

	const [beltColors] = useState(["Gult", "Orange", "Grönt", "Blått", "Brunt"])
  const [belts, setBelts] = useState({}) 
  const [loading, setLoading] = useState(true)
  const context = useContext(AccountContext)
  const { token, userId } = context

	return (
    <div>
      <div className = {style.beltButtonStyle}> 
        <div style={{ backgroundColor: "#FFD700", borderRadius: "0.3rem", padding: "0px" }}>
          <h1>Kihon waza</h1>
        </div>
      </div>

      

      <div className={styles.buttonContainer}>
        <Button
          width="100%"
          outlined={true}
          onClick={() => {
            setUndoMediaChanges(true) 
            navigate(-1)
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