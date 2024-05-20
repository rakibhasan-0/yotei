import React, { useEffect, useState } from "react"
import Popup from "../../components/Common/Popup/Popup"
import style from "./GradingStatisticsPopup.module.css"
import Dropdown from "../../components/Common/List/Dropdown" // Updated import
import GradingProtocolsRowsMenu from "../../components/Grading/GradingProtocolsRowsMenu"
import GradingProtocolsRows from "../../components/Grading/GradingProtocolsRows"
import Spinner from "../../components/Common/Spinner/Spinner"

const mockGradingProtocols = [
	"5 KYU GULT BÄLTE",
	"4 KYU ORANGE BÄLTE",
]
const mockData = [
	{
		code: "5 KYU",
		name: "GULT BÄLTE",
		
		belt: [
			{
				belt_color: "f1c40f",
				belt_name: "Gult",
				is_child: false,
				length: 1
			}
		],
	
		categories: [
			{
				name: "KIHON WAZA - ATEMI WAZA",
				techniques: [
					{
						activity_id: 151,
						name: "Shotei uchi, jodan, rak stöt med främre och bakre handen",
						count: 1
					},
					{
						name: "Shotei uchi, chudan, rak stöt med främre och bakre handen",
						activity_id: 151,
						count: 1
					},
					{
						activity_id: 153,
						name: "Gedan geri, rak spark med främre och bakre benet",
						count: 1
					}
				]
			},
			{
				name: "KIHON WAZA - KANSUTSU WAZA",
				techniques: [
					{
						name: "O soto osae, utan grepp, nedläggning snett bakåt",
						activity_id: 187,
						count: 1
					}
				]
			},
			{
				name: "KIHON WAZA - NAGE WAZA",
				techniques: [
					{
						name: "Koshi otoshi, utan grepp, nedläggning snett bakåt",
						activity_id: 248,
						count: 0
					}
				]
			},
			{
				name: "JIGO WAZA",
				techniques: [
					{
						name: "Grepp i två handleder framifrån - Frigöring",
						activity_id: 158,
						count: 0
					},
					{
						name: "Grepp i två handleder bakifrån - Frigöring",
						activity_id: 159,
						count: 0
					},
					{
						name: "Grepp i håret bakifrån - Tettsui uchi, frigöring",
						activity_id: 161,
						count: 0
					},
					{
						name: "Försök till stryptag framifrån - Jodan soto uke",
						activity_id: 216,
						count: 0
					},
					{
						name: "Stryptag framifrån - Kawashi, frigöring",
						activity_id: 162,
						count: 0
					},
					{
						name: "Stryptag bakifrån - Maesabaki, kawashi, frigöring",
						activity_id: 163,
						count: 0
					},
					{
						name: "Stryptag med armen - Maesabaki, kuzure ude osae, ude henkan gatame",
						activity_id: 164,
						count: 0
					},
					{
						name: "Försök till kravattgrepp från sidan - Jodan chikai uke, kawashi, koshi otoshi, ude henkan gatame",
						activity_id: 165,
						count: 0
					},
					{
						name: "Grepp i ärmen med drag - O soto osae, ude henkan gatame",
						activity_id: 154,
						count: 0
					},
					{
						name: "Livtag under armarna framifrån - Tate hishigi, ude henkan gatame",
						activity_id: 169,
						count: 0
					}
				]
			}
		]
	}
]


export default function GradingStatisticsPopup({ id, groupID, beltID}) {
	// State for showing the popup
	const [showPopup, setShowPopup] = useState(false)
	const [protocols, setProtocols] = useState([])
	const [chosenProtocol, setchosenProtocol] = useState([])
	const [loading, setLoading] = useState(false)
	const [data, setData] = useState([])
	const [belts, setBelts] = useState([])
	console.log("Group is" + groupID)
	console.log("Belt is" + beltID)
	const gradingProtocols = mockGradingProtocols
	useEffect(() => {

		async function fetchGroupGradingProtocol() {

			try {
				setLoading(true)
				const responseFromGroupNameAPI= await fetch("/api/statistics/1/grading_protocol?beltId=3")

				if (!responseFromGroupNameAPI.ok) {
					throw new Error("Failed to fetch group data")
				}
				if(responseFromGroupNameAPI.status === 200) {
					const groups = await responseFromGroupNameAPI.json()
					console.log(groups)
					setData(groups)
					setProtocols([groups.code + " " + groups.name])
					setchosenProtocol(groups.code + " " + groups.name)
					console.log(data.categories)


				}

			}
			catch (error) {
				console.error("Fetching error:", error)
			}
			finally {
				setLoading(false)
			}
		}
		fetchGroupGradingProtocol()

	}, [])

	const togglePopup = () => {
		setShowPopup(!showPopup)
	}

	const onSelectRow = (protocol) => {
		setchosenProtocol(protocol)
	}

	return (
		<div className={style.gradingStatisticsContainer} id={id}>
			<div className={style.gradingButtonContainer}>
				{/* the button for the grading statistics */}
				<button onClick={togglePopup} id="popup-button">
					<img src="/GradingStatistics.svg" alt="Grading Statistics" />
				</button>
			</div>

			<Popup
				title={"Graderingsprotokoll"}
				setIsOpen={setShowPopup}
				isOpen={showPopup}
				id="grading-statistics-popup"
			>
				<Dropdown text={chosenProtocol} id="grading-protocols-dropdown">
					<GradingProtocolsRowsMenu protocols={protocols} onSelectRow = {onSelectRow} />
				</Dropdown>
				{loading ? <Spinner /> : <div>
					{	
						(data.belt && data.categories) &&
						<GradingProtocolsRows data={data.categories} chosenProtocol={chosenProtocol} beltColors = {[data.belt]} />
					}
				</div>} 


			</Popup>
		</div>
	)
}
