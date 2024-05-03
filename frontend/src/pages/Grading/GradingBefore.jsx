import { useState, useEffect, useContext } from "react"
import { Link, useLocation, useNavigate} from "react-router-dom"
import Button from "../../components/Common/Button/Button"
import style from "./GradingCreate.module.css"
import styles from "./GradingBefore.module.css"
import Spinner from "../../components/Common/Spinner/Spinner"
import { AccountContext } from "../../context"
import { Draggable } from "react-drag-reorder";

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


  // För att hålla koll på examinee-element och deras ordning
  const [examinee, setExaminee] = useState([
    ["hi"],
    ["hello"],
    ["cool"],
    ["how are you"]
  ]);

  const handleDrag = (startIndex, endIndex) => {
    let data = [...examinee];

    // Get the dragged and landed
    let dragged = data[startIndex];
    let landed = data[endIndex];

    // If both dragged and landed have only one element
    if (dragged.length === 1 && landed.length === 1) {
      // Move the dragged element to the landed array
      landed.push(dragged[0]);
      dragged.pop();

      // Remove the dragged element from its original position
      data[startIndex] = dragged;
      data[endIndex] = landed;

    }

    // Remove empty arrays from the data array
    data = data.filter(item => item.length > 0);

    // Update the state with the modified data array
    setExaminee(data);
  };

    useEffect(() => {
    console.log(examinee); // Log examinee after it has been updated
  }, [examinee]); // Run this effect whenever examinee changes

	return (
    <div>
      <div className = {style.beltButtonStyle}> 
        <div style={{ backgroundColor: "#FFD700", borderRadius: "0.3rem", padding: "0px" }}>
          <h2>KIHON WAZA</h2>
        </div>
      </div>

      <div className="column">
        <Draggable onPosChange={handleDrag}>
          {examinee.map((innerExaminee, innerIdx) => {
            return (
              <div key={innerIdx} className="flexItem">
                {innerExaminee}
              </div>
            );
          })}
        </Draggable>
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