import React, {useState} from "react"
import RoundButton from "../../components/Common/RoundButton/RoundButton"
import { Plus } from "react-bootstrap-icons"
import PopupAdd from "../../components/Plan/PopupAdd"

const PlanOrSessionDialog = () => {
	const handleShow = () => setShow(true)
	const handleClose = () => setShow(false)

	const [show, setShow] = useState(false)

	return (
		<div>
			<PopupAdd show={show} onHide={handleClose} isOpen={show} setIsOpen={setShow}></PopupAdd>
			<RoundButton onClick={handleShow}>
				<Plus />
			</RoundButton>
		</div>
	)
}

export default PlanOrSessionDialog