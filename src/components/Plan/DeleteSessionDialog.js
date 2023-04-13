import React, {useContext, useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import {AccountContext} from "../../context";

/**
 * The Delete dialog that pops up when pressing the Deletebutton on a Sessions dropdown
 * @author Group 4(Calzone) and Group 3(Hawaii)
 */

const DeleteSessionDialog = ({ session, onDelete }) => {

    const { token } = useContext(AccountContext)

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleDelete = () => {
        const requestOptions = {
            method: "DELETE",
            headers: { 'Content-type': 'application/json', 'token': token },
        };
        fetch('/api/session/delete?id=' + session.id, requestOptions)
            .then(() => console.log)
        onDelete(session.id)
        setShow(false)
    }
    const [show, setShow] = useState(false);

    return (
        <div>
            <Modal show={show} onHide={handleClose} dialogClassName="deletePlanModal">
                <Modal.Header >
                    <Modal.Title>Ta bort tillfälle</Modal.Title>
                    <Button onClick={handleClose} style={{ color: "gray", borderColor: "#FFFFFF", backgroundColor: "#FFFFFF" }}>
                        <i class="bi bi-x-lg"></i>
                    </Button>
                </Modal.Header>
                <Modal.Body>Är du säker på att du vill ta bort tillfället?</Modal.Body>
                <Modal.Footer>
                    <Button style={{ color: "#FFFFFF", borderColor: "#FFFFFF", backgroundColor: "#BE3B41" }} onClick={handleDelete}>
                        Ta bort tillfälle</Button>
                    <Button style={{ color: "#FFFFFF", borderColor: "#FFFFFF", backgroundColor: "#BE3B41" }} onClick={handleClose}>
                        Avbryt</Button>
                </Modal.Footer>
            </Modal>
            <i class="bi bi-trash3-fill editSesIcon " onClick={handleShow}></i>
        </div>
        
    )
}

export default DeleteSessionDialog;