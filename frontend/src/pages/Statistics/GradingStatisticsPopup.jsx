import React, { useState } from "react"
import Popup from "../../components/Common/Popup/Popup"
import style from "./GradingStatisticsPopup.module.css"
import Dropdown from "../../components/Common/List/Dropdown" // Updated import
import GradingProtocolsRowsMenu from "../../components/Grading/GradingProtocolsRowsMenu"
import GradingProtocolsRows from "../../components/Grading/GradingProtocolsRows"

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
				belt_color: "83530C",
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
   ];
   


export default function GradingStatisticsPopup({ id, gradingProtocols = mockGradingProtocols , data}) {
	// State for showing the popup
	const [showPopup, setShowPopup] = useState(false)
	const [chosenProtocol, setchosenProtocol] = useState(gradingProtocols[0])

	const togglePopup = () => {
		setShowPopup(!showPopup)
	}

	const onSelectRow = (protocol) => {
		setchosenProtocol(protocol)
	}

	data = mockData

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
					<GradingProtocolsRowsMenu protocols={gradingProtocols} onSelectRow = {onSelectRow} />
				</Dropdown>

				<GradingProtocolsRows data={data[0].categories} chosenProtocol={chosenProtocol} beltColors = {data[0].belt} >

				</GradingProtocolsRows>

			</Popup>
		</div>
	)
}
