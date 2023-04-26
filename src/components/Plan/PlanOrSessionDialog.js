import React, {useState} from "react"
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"
import HomePageLogoButton from "../Home/HomePageLogoButton"
import RoundButton from "../../components/Common/RoundButton/RoundButton"
import { Plus } from "react-bootstrap-icons"

const PlanOrSessionDialog = () => {
	const handleShow = () => setShow(true)
	const handleClose = () => setShow(false)

	const [show, setShow] = useState(false)

	return (
		<div>
			<Modal show={show} onHide={handleClose} dialogClassName="newPlanOrSessionModal" className="modal-dialog">
				<Modal.Header>
					<Modal.Title className="center"><p> Välj vad du vill skapa</p></Modal.Title>
					<Button onClick={handleClose} style={{ color: "gray", borderColor: "#FFFFFF", backgroundColor: "#FFFFFF" }}>
						<i className="bi bi-x-lg"/>
					</Button>
				</Modal.Header>
				<Modal.Body>
                    
					<HomePageLogoButton buttonName="Planering" linkTo="../plan/create"/>
					<HomePageLogoButton buttonName="Tillfälle" linkTo="../session/create"/>
				</Modal.Body>
				<Modal.Footer></Modal.Footer>
			</Modal>
			<RoundButton onClick={handleShow}>
				<Plus />
			</RoundButton>
		</div>
	)
}

export default PlanOrSessionDialog