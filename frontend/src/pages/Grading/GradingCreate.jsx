import { useState, useEffect, useContext } from "react"
import { Link, useLocation, useNavigate} from "react-router-dom"
import BeltButton from "../../components/Common/Button/BeltButton"
import style from "./GradingCreate.module.css"
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

	useEffect(() => {
		(async () => {
			try {
				const response = await fetch("/api/belts/all", { headers: { token } })
				if (response.status === 404) {
					return
				}
				if (!response.ok) {
					setLoading(false)
					throw new Error("Kunde inte hämta bälten")
				}
				const json = await response.json()
				setLoading(false)

				const filteredColors = json.filter(item => beltColors.includes(item.name));
        const colorMaps = {}
        filteredColors.forEach(element => {
          colorMaps[element.name] = `#${element.color}`;
        });
        setBelts(colorMaps);

        
			} catch (ex) {
				setErrorToast("Kunde inte hämta bälten")
				setLoading(false)
				console.error(ex)
			}
		})()
  }, [token])

	return (
     <div className = {style.beltButtonStyle}> 
      {loading ? <Spinner /> : ( 
        <div>
          {beltColors.map((color, index) => (
                        <BeltButton
                            key={color}
                            width={"100%"}
                            onClick={() => ""}
                            color={belts[color]}
                        >
                            <h2>{`${5 - index} KYU ${color.toUpperCase()} BÄLTE`}</h2>
                        </BeltButton>
                    ))}
        </div>
      )}
      </div>
	)
}