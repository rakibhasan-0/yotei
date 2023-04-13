import React from 'react'
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";


/**
 * This class is to be used as an alert window prompting the user with options.
 * The parent that uses this component needs to have
 * 'handleClose', 'handleShow' and the the callbackFunction.
 * See example in exerciseForm.js.
 *
 * @author Grupp 6 (Calskrove) (2022-05-31)
 */
class AlertWindow extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            title: this.props.title,
            body: this.props.body,
            yesText: this.props.yesText,
            noText: this.props.noText
        }
    }

    /**
     * This function will return the confirm button if the 'yesText' is not empty,
     * otherwise the window will only have one button.
     */
    yesButtonFunc(){
        if (this.state.yesText!==""){
            return (
                <Button
                    type="button"
                    style={{color: "#FFFFFF", borderColor: "#FFFFFF", backgroundColor: "#BE3B41"}}
                    onClick={() => this.props.callback()}>
                    {this.state.yesText}
                </Button>
            )
        }
        return
    }

    /**
     * Renders an alert window with custom text. Requires a callback function and a handleCLose function.
     *
     * @returns
     */
    render() {
        return(
            <Modal show={this.props.show} onHide={() => this.props.hideFunc()} dialogClassName="deleteModal">
                <Modal.Header>
                    <Modal.Title>{this.state.title}</Modal.Title>
                    <Button type="button" onClick={() => this.props.hideFunc()}
                            style={{color: "gray", borderColor: "#FFFFFF", backgroundColor: "#FFFFFF"}}>
                        <i className="bi bi-x-lg"></i>
                    </Button>
                </Modal.Header>

                <Modal.Body>{this.state.body}</Modal.Body>
                <Modal.Footer>
                    {this.yesButtonFunc()}
                    <Button type="button" style={{color: "#FFFFFF", borderColor: "#FFFFFF", backgroundColor: "#BE3B41"}}
                            onClick={() => this.props.hideFunc()}>
                        {this.state.noText}</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}
export default AlertWindow