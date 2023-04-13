import React from 'react'
import Button from 'react-bootstrap/Button'
import { AccountContext } from '../../context';
import Form from 'react-bootstrap/Form';
import './AdminComponent.css';

/**
 * Component made for the admin page. Made to handle the import 
 * feature on the front-end.
 *
 *  @author Team Quattro Formaggi (Group 1)
 */

class Import extends React.Component {
    /**
     * Constructor.
     * Maps functions and defines component global variables.
     */
    constructor(props) {
      super(props);
      this.fetchData = this.fetchData.bind(this);
      this.import = this.import.bind(this);
      this.importType = null
      this.importData = null
    }
    
    /**
     * When the components are ready fetch references to them and 
     * prepare them.
     */
     componentDidMount() {
        this.fileInput = document.getElementById("fileInput")
        this.importButton = document.getElementById("importButton")
        this.statusImport = document.getElementById("status-import")
        this.importButton.disabled = true
    }

    /**
     * Defines the html for the component.
     */
     render() {
        return (
            <Form className='mb-5'>
                <h2>Import</h2>
                <Form.Group className="row">
                    <Form.Control id="fileInput"
                                  className="file-input-admin container-fluid mb-3"
                                  type="file" onChange={this.fetchData}
                                  accept="application/JSON" />
                </Form.Group>
                <Form.Group className="row">
                    <div className='admin-container container-fluid'>
                        <p id='status-import' className='status-admin' ></p>
                    </div>
                </Form.Group>
                <Form.Group className="row">
                    <Button id="importButton"
                            className="btn btn-admin btn-color container-fluid"
                            type="button"
                            onClick={this.import}>
                        Importera
                    </Button>
                </Form.Group>
            </Form>
        );
    }

    /**
     * On click method for file input.
     * Prepares the data for import to back-end by 'uploadFile'.
     * @see uploadFile
     */
    fetchData(event) {
        const reader = new FileReader()
        reader.readAsText(event.target.files[0])
        reader.onloadend = () => {
            const data = JSON.parse(reader.result)
            this.importType = null
            if (data.hasOwnProperty('exercises')) {
                this.importType = 'exercises'
            }
            else if (data.hasOwnProperty('techniques')) {
                this.importType = 'techniques'
            }
            if (this.importType != null) {
                this.changeStatus("", "#fff");
                this.importData = JSON.stringify(data[this.importType])
                this.tags = []
                const thisData = data[this.importType]
                thisData.forEach(element => {
                    if (element.tags === undefined) {
                        this.tags.push([])
                    }
                    else {
                        this.tags.push(element.tags)
                    }
                })
                this.importButton.disabled = false
            }
            else {
                this.changeStatus("Kunde inte identifiera import typ", "#f00");
                this.importButton.disabled = true
            }
        }
    }

    /**
     * On click method for 'Importera' button.
     * Manages import to back-end of data fetched in 'fetchData'.
     * @see fetchData
     */
    import() {
        const activityRequestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', token: this.context.token},
            body: this.importData
        }
        const activityPath = `/api/${this.importType}/import`
        const tagRequestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', token: this.context.token}
        }
        const tagPath = `/api/tags/import/${this.importType}`
        this.sendData(activityPath, activityRequestOptions, tagPath, tagRequestOptions);
        this.fileInput.value = null
        this.importButton.disabled = true
        this.importData = null
    }

    /**
     * Sends data to the back-end.
     * @param {String} activityPath back-end destination for activity
     * @param {JSON} activityRequestOptions options for the export request of activities
     * @param {String} tagPath part of destination for tags
     * @param {JSON} tagRequestOptions options for the export request of tags
     */
    async sendData(activityPath, activityRequestOptions, tagPath, tagRequestOptions) {
        const activityResponse = await fetch(activityPath, activityRequestOptions)
        const activityJsonResponse = await activityResponse.json()
        activityJsonResponse.message === undefined ? 
            this.responseUpdateStatus(activityResponse, JSON.stringify(activityJsonResponse)) :
            this.responseUpdateStatus(activityResponse, activityJsonResponse.message)
        if (activityResponse.ok === false && activityResponse.status !== 409 && activityResponse.status !== 422) {
            return
        }
        const thing = this.createTagBody((activityJsonResponse).data)
        tagRequestOptions.body = thing
        const tagResponse = await fetch(tagPath, tagRequestOptions)
        if (tagResponse.ok === false) {
            this.responseUpdateStatus(tagResponse, await tagResponse.text())
        }
    }

    /**
     * Create the body for the import message for tags.
     * @param {JSON} activitiesResponseData data responded by the back-end
     *                                      about which activities where
     *                                      successfully imported.
     * @returns string in JSON format with data that the back-end can
     *          handle to correctly import the tag data.
     */
    createTagBody(activitiesResponseData) {
        var tagBody = []
        for (let i = 0; i < Object.keys(activitiesResponseData).length; i++) {
            const currentTags = this.tags[i]
            const formatedTags = []
            currentTags.forEach(element => {
                formatedTags.push({
                    name: element
                })
            });
            if (this.importType == 'exercises') {
                tagBody.push({
                    exerciseId: activitiesResponseData[i],
                    tags: formatedTags
                })
            }
            else {
                tagBody.push({
                    techId: activitiesResponseData[i],
                    tags: formatedTags
                })
            }
        }
        return JSON.stringify(tagBody);
    }

    /**
     * Handles status messages if adding user
     * succeeded or failed.
     * @param {Response} response response from HTTP request.
     * @param {String} responseMessage message from response from HTTP request.
     */
    responseUpdateStatus(response, responseMessage){
        if (response.ok) {
            this.changeStatus("Importering lyckades", "#0f0")
        }
        else {
            if (response.status === 404) {
                this.changeStatus("Server hittades inte", "#f00")
            }
            else if (response.status === 409) {
                this.changeStatus(responseMessage, "#f00");
            }
            else {
                this.changeStatus(responseMessage, "#f00")
            }
        }
    }

    /**
     * Changes text and color on the status label.
     * @param {String} text text to set on the status label.
     * @param {String} color color(rgb hex) to set on the status label.
     */
    changeStatus(text, color) {
        this.statusImport.innerHTML = text
        this.statusImport.style.color = color;
    }
}

Import.contextType = AccountContext;

export default Import;