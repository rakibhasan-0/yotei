import React, {useContext, useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from "../Common/Button/Button";
import {AccountContext} from "../../context";

/**
 * The Delete dialog that pops up when pressing the Deletebutton on a Sessions dropdown
 * @author Squad 1-Phoenix (25/4-2023)
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
                </Modal.Header>
                <Modal.Body>Är du säker på att du vill ta bort tillfället?</Modal.Body>
                <Modal.Footer>
                    <Button
                        onClick={handleDelete}>
                        Ta bort tillfälle
                    </Button>
                    <Button
                        onClick={handleClose}>
                        Avbryt
                    </Button>
                </Modal.Footer>
            </Modal>
            <i class="bi bi-trash3-fill editSesIcon " onClick={handleShow}></i>
        </div>
        
    )
}

export default DeleteSessionDialog;