
import RoundButton from "../../components/Common/RoundButton/RoundButton"
import { Plus } from "react-bootstrap-icons"
import styles from "./GradingIndex.module.css"
import InfiniteScrollComponent from "../../components/Common/List/InfiniteScrollComponent"
import BeltButton from "../../components/Common/Button/BeltButton"



export default function GradingIndex() {


    const [currentGradings, setCurrentGradings] = useState([])
    const [finishedGradings, setFinishedGradings] = useState([])


    return (
		<center>
			<title>Planering</title>
			<h1>Pågående graderingar</h1>
            <div className={styles["gradingBox"]}>
                
            </div>

            <h1>Avslutade graderingar</h1>
            <div className={styles["gradingBox"]}>
                
            </div>

            <RoundButton linkTo={"/grading/create"}>
				<Plus />
			</RoundButton>
		</center>
	)	
}